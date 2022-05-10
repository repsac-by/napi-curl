#include <cassert>
#include <string>
#include <stdexcept>
#include "napi-libcurl.hpp"
#include "napi-libcurl-maps.hpp"

#if defined(DEBUG)
#  define DBG_LOG(fmt, ...) \
     do { fprintf(stderr, "DEBUG: " fmt "\n", ##__VA_ARGS__); } while (0)
#else
#  define DBG_LOG(fmt, ...) (void(0))
#endif
#define LOG(fmt, ...) \
     do { fprintf(stderr, "LOG: " fmt "\n", ##__VA_ARGS__); } while (0)

CURLM* multi;
uv_loop_t* uv_loop;
uv_timer_t timeout;

Curl::Curl(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Curl>(info) {
	Napi::Env env = info.Env();
	Napi::HandleScope scope(env);

	if ( ! info.IsConstructCall() )
		throw Napi::Error::New(env,  "create instance with new");

	easy = curl_easy_init();

	if ( ! easy )
		throw Napi::Error::New(env,  "curl_easy_init");

	reset(info);
}

Curl::~Curl() {
	// fprintf(stderr, "Curl::~Curl");
	DBG_LOG("Curl::~Curl");
	clean();
	curl_easy_cleanup(easy);
}

Napi::Value Curl::create_error(CURLcode code) {
	DBG_LOG("Curl::create_error %d", code);

	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	napi_status status;
	napi_value error;

	status = napi_create_error(env, Napi::String::New(env, mapCURLcode.at(code)), Napi::String::New(env, errorbuffer), &error);
	if ( napi_ok != status )
		throw std::runtime_error(errorbuffer);

	return Napi::Value(env, error);
}

std::string& rtrim(std::string& str) {
	const std::string& chars = "\n\r\t\v\f ";
	str.erase(str.find_last_not_of(chars) + 1);
	return str;
}

size_t Curl::on_header(char *ptr, size_t size, size_t nmemb) {
	DBG_LOG("Curl::on_headers");

	size_t len = size * nmemb;

	std::string line(ptr, len);

	if ( rtrim(line).length() > 0 )
		headers.push_back(line);
	else {
		DBG_LOG("	onHeader");
		Napi::Env env = Env();
		Napi::HandleScope scope(env);

		auto array = Napi::Array::New(env);

		for ( const auto& line: headers )
			array.Set(array.Length(), line);

		onHeader.MakeCallback(env.Global(), { array });

		headers.clear();
	}

	return len;
}

size_t Curl::on_read(char *buffer, size_t size, size_t nitems) {
	DBG_LOG("Curl::read_callback");
	DBG_LOG("    size: %zu", size);
	DBG_LOG("    nitems: %zu", nitems);

	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	size_t len = size * nitems;

	auto ret = onRead.MakeCallback(env.Global(), {
		Napi::Number::New(env, len)
	});

	if (ret.IsNull())
		return 0;

	if (ret.IsArrayBuffer()) {
		auto in = ret.As<Napi::ArrayBuffer>();

		DBG_LOG("    read bytes: %zu", in.ByteLength());

		if (0 == in.ByteLength())
			return CURL_READFUNC_PAUSE;

		memcpy(buffer, in.Data(), in.ByteLength());
		return in.ByteLength();
	}

	throw Napi::TypeError::New(env, "onRead: must retrun ArrayBuffer on null");
}

size_t Curl::on_data(char* ptr, size_t size, size_t nmemb) {
	DBG_LOG("Curl::on_data");
	DBG_LOG("    size: %zu", size);
	DBG_LOG("    nmemb: %zu", nmemb);

	size_t len = size * nmemb;

	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	onData.MakeCallback(env.Global(), {
		Napi::ArrayBuffer::New(env, ptr, len)
	});

	return len;
}

void Curl::cancel(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::cancel");
	cancelTransfer = 1;
	Curl::check_multi_info();
}

void Curl::pause(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::pause");
	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	CURLcode res = curl_easy_pause(easy, CURLPAUSE_ALL);

	if (CURLE_OK != res)
		throw Napi::TypeError::New(env, "Curl#pause: " + mapCURLcode.at(res));
}

void Curl::resume(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::resume");
	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	CURLcode res = curl_easy_pause(easy, CURLPAUSE_CONT);

	if (CURLE_OK != res)
		throw Napi::TypeError::New(env, "Curl#resume: " + mapCURLcode.at(res));
}

void Curl::upkeep(const Napi::CallbackInfo &info) {
	DBG_LOG("Curl::upkeep");
	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	CURLcode res = curl_easy_upkeep(easy);

	if (CURLE_OK != res)
		throw Napi::TypeError::New(env, "Curl#upkeep: " + mapCURLcode.at(res));
}

void Curl::readStop(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::readStop");

	if ( poll_ctx && (poll_ctx->events & UV_READABLE))
		uv_poll_stop(&poll_ctx->handle);
}

void Curl::readStart(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::readStart");

	if ( poll_ctx )
		uv_poll_start(&poll_ctx->handle, poll_ctx->events, Curl::curl_poll_cb);
}

void Curl::onErrorSetter(const Napi::CallbackInfo& info, const Napi::Value& value) {
	DBG_LOG("Curl::onErrorSetter");
	onError = Napi::Persistent(value.As<Napi::Function>());
}

void Curl::onHeaderSetter(const Napi::CallbackInfo &info, const Napi::Value &value) {
	DBG_LOG("Curl::onHeaderSetter");
	onHeader = Napi::Persistent(value.As<Napi::Function>());
}

void Curl::onDataSetter(const Napi::CallbackInfo& info, const Napi::Value& value) {
	DBG_LOG("Curl::onDataSetter");
	onData = Napi::Persistent(value.As<Napi::Function>());
}

void Curl::onReadSetter(const Napi::CallbackInfo& info, const Napi::Value& value) {
	DBG_LOG("Curl::onReadSetter");
	onRead = Napi::Persistent(value.As<Napi::Function>());
}

void Curl::onEndSetter(const Napi::CallbackInfo &info, const Napi::Value &value) {
	DBG_LOG("Curl::onEndSetter");
	onEnd = Napi::Persistent(value.As<Napi::Function>());
}

void Curl::on_end() {
	DBG_LOG("Curl::on_end");
	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	Napi::FunctionReference cb = Napi::Persistent(onEnd.Value());

	cleanEvents();

	cb.MakeCallback(env.Global(), {});
}

void Curl::on_error(CURLcode code) {
	DBG_LOG("Curl::on_error");
	Napi::Env env = Env();
	Napi::HandleScope scope(env);

	Napi::FunctionReference cb = Napi::Persistent(onError.Value());

	cleanEvents();

	cb.MakeCallback(env.Global(), { create_error(code) });
}

Napi::Object Curl::Init(Napi::Env env, Napi::Object exports) {

	Napi::Function func = DefineClass(env, "Curl", {
		InstanceMethod("reset",     &Curl::reset),
		InstanceMethod("setOpt",    &Curl::setOpt),
		InstanceMethod("getInfo",   &Curl::getInfo),
		InstanceMethod("perform",   &Curl::perform),
		InstanceMethod("cancel",    &Curl::cancel),
		InstanceMethod("pause",     &Curl::pause),
		InstanceMethod("resume",    &Curl::resume),
		InstanceMethod("upkeep",    &Curl::upkeep),
		InstanceMethod("readStop",  &Curl::readStop),
		InstanceMethod("readStart", &Curl::readStart),
		InstanceAccessor("onError", nullptr, &Curl::onErrorSetter),
		InstanceAccessor("onRead",  nullptr, &Curl::onReadSetter),
		InstanceAccessor("onHeader", nullptr, &Curl::onHeaderSetter),
		InstanceAccessor("onData",  nullptr, &Curl::onDataSetter),
		InstanceAccessor("onEnd",   nullptr, &Curl::onEndSetter),
	});

	Napi::FunctionReference *constructor = new Napi::FunctionReference();
	*constructor = Napi::Persistent(func);

	exports.Set("Curl", func);

	env.SetInstanceData<Napi::FunctionReference>(constructor);

	napi_status status;
	status = napi_get_uv_event_loop(env, &uv_loop);
	assert(status == napi_ok);

	uv_timer_init(uv_loop, &timeout);

	curl_global_init(CURL_GLOBAL_DEFAULT);
	multi = curl_multi_init();
	curl_multi_setopt(multi, CURLMOPT_PIPELINING, CURLPIPE_NOTHING);
	curl_multi_setopt(multi, CURLMOPT_SOCKETFUNCTION, Curl::handle_socket);
	curl_multi_setopt(multi, CURLMOPT_TIMERFUNCTION,  Curl::start_timeout);

	return exports;
}

void Curl::dummy(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::HandleScope scope(env);

	throw Napi::Error::New(env, "Need callback function");
}

Napi::Value Curl::getInfo(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::HandleScope scope(env);

	const std::string& arg = info[0].As<Napi::String>();
	const auto& it = mapCURLinfo.find(arg);

	if ( it == mapCURLinfo.end() )
		throw Napi::TypeError::New(env, "Curl#getInfo not found key: " + arg);

	CURLINFO key = it->second;

	switch (CURLINFO_TYPEMASK & key) {
		case CURLINFO_LONG: {
			long v;
			CURLcode res = curl_easy_getinfo(easy, key, &v);

			if (CURLE_OK != res)
				throw Napi::TypeError::New(env, "Curl#pause: " + mapCURLcode.at(res));

			if (CURLINFO_HTTP_VERSION == key) switch (v) {
				case CURL_HTTP_VERSION_1_0: return Napi::String::New(env, "1.0");
				case CURL_HTTP_VERSION_1_1: return Napi::String::New(env, "1.1");
				case CURL_HTTP_VERSION_2_0: return Napi::String::New(env, "2.0");
				default: return Napi::String::New(env, "");
			}

			return Napi::Number::New(env, v);
		}
		case CURLINFO_DOUBLE: {
			double v;
			CURLcode res = curl_easy_getinfo(easy, key, &v);

			if (CURLE_OK != res)
				throw Napi::TypeError::New(env, "Curl#getInfo: " + mapCURLcode.at(res));

			return Napi::Number::New(env, v);
		}
		case CURLINFO_OFF_T: {
			curl_off_t v;
			CURLcode res = curl_easy_getinfo(easy, key, &v);

			if (CURLE_OK != res)
				throw Napi::TypeError::New(env, "Curl#getInfo: " + mapCURLcode.at(res));

			return Napi::Number::New(env, v);
		}
		case CURLINFO_STRING: {
			char* v = nullptr;
			CURLcode res = curl_easy_getinfo(easy, key, &v);

			if (CURLE_OK != res)
				throw Napi::TypeError::New(env, "Curl#getInfo: " + mapCURLcode.at(res));

			return Napi::String::New(env, v);
		}
		case CURLINFO_SLIST: {
			struct curl_slist* slist = nullptr;
			CURLcode res = curl_easy_getinfo(easy, key, &slist);

			if (CURLE_OK != res)
				throw Napi::TypeError::New(env, "Curl#getInfo: " + mapCURLcode.at(res));

			const auto &array = Napi::Array::New(env);

			struct curl_slist *each = slist;
			uint32_t i = 0;
			while ( each ) {
				array[i++] = Napi::String::New(env, each->data);
  				each = each->next;
			}
			curl_slist_free_all(slist);
			return array;
		}
	}

	return info.This();
}

Napi::Value Curl::setOpt(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	Napi::HandleScope scope(env);

	if ( 2 < info.Length() )
		throw Napi::TypeError::New(env, "Curl#setOpt 2 args expected");

	const std::string& opt_key = info[0].As<Napi::String>();
	const Napi::Value& val = info[1];

	const struct curl_easyoption *opt = curl_easy_option_by_name(opt_key.c_str());
	if (!opt)
		throw Napi::TypeError::New(env, "Curl#setOpt unknown option: " + opt_key);

	CURLcode   res = CURLE_UNKNOWN_OPTION;

	switch ( val.Type() ) {
		case napi_null:
			if (CURLOT_SLIST != opt->type
				&& CURLOT_LONG != opt->type
				&& CURLOT_OFF_T != opt->type
				&& CURLOT_STRING != opt->type
			) throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected null");

			res = curl_easy_setopt(easy, opt->id, NULL);
			break;

		case napi_string:
			if (CURLOT_STRING != opt->type &&
				CURLOPT_COPYPOSTFIELDS != opt->id
			) throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected type string");

			res = curl_easy_setopt(easy, opt->id, val.As<Napi::String>().Utf8Value().c_str());
			break;

		case napi_boolean:
			if (CURLOT_LONG != opt->type)
				throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected type boolean");

			res = curl_easy_setopt(easy, opt->id, val.As<Napi::Boolean>().Value());
			break;

		case napi_number:
			if (CURLOT_LONG != opt->type && CURLOT_OFF_T != opt->type)
				throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected type number");

			res = curl_easy_setopt(easy, opt->id, val.As<Napi::Number>().Int64Value());
			break;

		case napi_bigint:
			if (CURLOT_LONG != opt->type && CURLOT_OFF_T != opt->type)
				throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected type bigint");

			bool lossless;
			res = curl_easy_setopt(easy, opt->id, val.As<Napi::BigInt>().Int64Value(&lossless));
			break;

		case napi_object:
			if (val.IsArrayBuffer() && CURLOT_BLOB == opt->type) {
				struct curl_blob blob;
				blob.data = val.As<Napi::ArrayBuffer>().Data();
				blob.len = val.As<Napi::ArrayBuffer>().ByteLength();
				blob.flags = CURL_BLOB_COPY;

				res = curl_easy_setopt(easy, opt->id, &blob);
			}
			else if (val.IsArray() && CURLOT_SLIST == opt->type) {
				const auto &a = val.As<Napi::Array>();
				struct curl_slist *slist = nullptr;

				for (uint32_t i = 0, len = a.Length(); i < len; ++i)
					slist = curl_slist_append(slist, a[i].As<Napi::String>().Utf8Value().c_str());

				if (slist)	{
					res = curl_easy_setopt(easy, opt->id, slist);

					const auto &it = slists.find(opt->id);
					if (slists.end() != it)
						curl_slist_free_all(it->second);

					slists[opt->id] = slist;
				}
			}
			else {
				throw Napi::TypeError::New(env, "Curl#setOpt " + opt_key + " unexpected type");
			}
			break;
		default:
			throw Napi::TypeError::New(env, "Curl#setOpt parametr restricted type");
		}

	if ( CURLE_OK != res )
		throw Napi::TypeError::New(env, "Curl#setOpt: " + mapCURLcode.at(res));

	return info.This();
}

void Curl::perform(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::perform");
	Napi::Env env = info.Env();
	Napi::HandleScope scope(env);

	cancelTransfer = 0;
	CURLMcode res = curl_multi_add_handle(multi, easy);

	if ( CURLM_OK != res )
		throw Napi::Error::New(env, curl_multi_strerror(res));
}

void Curl::clean() {
	DBG_LOG("Curl::clean");
	for ( const auto& slist: slists )
		curl_slist_free_all(slist.second);

	slists.clear();
	headers.clear();

	cleanEvents();
}

void Curl::cleanEvents() {
	DBG_LOG("Curl::cleanEvents");
	onRead.Reset();
	onHeader.Reset();
	onError.Reset();
	onData.Reset();
	onEnd.Reset();
}

Napi::Value Curl::reset(const Napi::CallbackInfo& info) {
	DBG_LOG("Curl::reset");

	curl_easy_reset(easy);

	this->clean();

	curl_easy_setopt(easy, CURLOPT_PRIVATE,    this);
	curl_easy_setopt(easy, CURLOPT_HEADERDATA, this);
	curl_easy_setopt(easy, CURLOPT_WRITEDATA,  this);
	curl_easy_setopt(easy, CURLOPT_READDATA,  this);
	curl_easy_setopt(easy, CURLOPT_XFERINFODATA,  this);

	curl_easy_setopt(easy, CURLOPT_ERRORBUFFER, errorbuffer);

	curl_easy_setopt(easy, CURLOPT_HEADERFUNCTION, Curl::header_callback);
	curl_easy_setopt(easy, CURLOPT_READFUNCTION,  Curl::read_callback);
	curl_easy_setopt(easy, CURLOPT_WRITEFUNCTION,  Curl::data_callback);
	curl_easy_setopt(easy, CURLOPT_XFERINFOFUNCTION, Curl::progress_callback);

	curl_easy_setopt(easy, CURLOPT_SUPPRESS_CONNECT_HEADERS, 1);
	curl_easy_setopt(easy, CURLOPT_NOPROGRESS, 0);

	return info.This();
}

void Curl::on_timeout(uv_timer_t *req) {
	DBG_LOG("Curl::on_timeout");

	int running_handles;
	curl_multi_socket_action(multi, CURL_SOCKET_TIMEOUT, 0, &running_handles);
	Curl::check_multi_info();
}

int Curl::start_timeout(CURLM *multi, long timeout_ms, void *userp) {
	DBG_LOG("Curl::start_timeout");
	DBG_LOG("    timeout_ms: %li", timeout_ms);

	if (timeout_ms < 0)
		uv_timer_stop(&timeout);
	else {
		if (timeout_ms == 0)
			timeout_ms = 1; /* 0 means directly call socket_action, but we'll do it in a bit */
		uv_timer_start(&timeout, Curl::on_timeout, timeout_ms, 0);
	}
	return 0;
}

size_t Curl::header_callback(char *ptr, size_t size, size_t nmemb, void *userdata) {
	return static_cast<Curl*>(userdata)->on_header(ptr, size, nmemb);
}

size_t Curl::read_callback(char *buffer, size_t size, size_t nitems, void *userdata) {
	return static_cast<Curl*>(userdata)->on_read(buffer, size, nitems);
};

size_t Curl::data_callback(char *ptr, size_t size, size_t nmemb, void *userdata) {
	return static_cast<Curl*>(userdata)->on_data(ptr, size, nmemb);
}

int Curl::progress_callback(void *userdata, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow) {
	return static_cast<Curl*>(userdata)->cancelTransfer;
}

poll_ctx_t* Curl::create_poll_context(const curl_socket_t& sockfd, CURL* easy) {
	DBG_LOG("create_multi_context");

	Curl* self;
	curl_easy_getinfo(easy, CURLINFO_PRIVATE, &self);

	auto ctx = new poll_ctx_t;

	uv_poll_init_socket(uv_loop, &ctx->handle, sockfd);

	DBG_LOG("   handle %p", &ctx->handle);

	ctx->handle.data = ctx;
	ctx->sock = sockfd;
	ctx->userp = self;

	self->poll_ctx = ctx;

	return ctx;
}

void Curl::poll_close_cb(uv_handle_t* handle) {
	DBG_LOG("Curl::poll_close_cb");

	auto ctx = static_cast<poll_ctx_t*>(handle->data);
	auto self = static_cast<Curl*>(ctx->userp);

	self->poll_ctx = nullptr;

	delete ctx;
}

void Curl::destroy_poll_context(uv_poll_t* handle) {
	DBG_LOG("Curl::destroy_poll_context");

	uv_close(reinterpret_cast<uv_handle_t*>(handle), Curl::poll_close_cb);
}

void Curl::curl_poll_cb(uv_poll_t* req, int status, int events) {
	DBG_LOG("Curl::curl_poll_cb");
	DBG_LOG("    status: %i", status);
	DBG_LOG("    events: %i", events);

	auto ctx = static_cast<poll_ctx_t*>(req->data);

	int running_handles;
	int flags = 0;

	if (status < 0)
		flags = CURL_CSELECT_ERR;
	if (events & UV_READABLE)
		flags |= CURL_CSELECT_IN;
	if (events & UV_WRITABLE)
		flags |= CURL_CSELECT_OUT;

	CURLMcode code = curl_multi_socket_action(multi, ctx->sock, flags, &running_handles);
	if (code != CURLM_OK)
		throw std::runtime_error(curl_multi_strerror(code));

	Curl::check_multi_info();
}

int Curl::handle_socket(CURL* easy, curl_socket_t sockfd, int action, void *userp, void *socketp) {
	DBG_LOG("Curl::handle_socket");
	DBG_LOG("    action: %i", action);

	int events = 0;
	poll_ctx_t* ctx;

	switch ( action ) {
		case CURL_POLL_IN:
		case CURL_POLL_OUT:
		case CURL_POLL_INOUT:
			DBG_LOG("    CURL_POLL_INOUT");

			if (action != CURL_POLL_IN)
				events |= UV_WRITABLE;
			if (action != CURL_POLL_OUT)
				events |= UV_READABLE;

			if ( socketp )
				ctx = static_cast<poll_ctx_t*>(socketp);
			else {
				ctx = create_poll_context(sockfd, easy);
				curl_multi_assign(multi, sockfd, ctx);
			}

			ctx->events = events;

			uv_poll_start(&ctx->handle, events, Curl::curl_poll_cb);
			break;

		case CURL_POLL_REMOVE:
			DBG_LOG("    CURL_POLL_REMOVE");

			if ( socketp ) {
				ctx = static_cast<poll_ctx_t*>(socketp);
				uv_poll_stop(&ctx->handle);
				destroy_poll_context(&ctx->handle);
				curl_multi_assign(multi, sockfd, NULL);
			}
			break;
		default:
			DBG_LOG("    DEFAULT");
	}

	return 0;
}

void Curl::check_multi_info() {
	DBG_LOG("Curl::check_multi_info");

	int pending;
	CURLMsg *message;

	while ( (message = curl_multi_info_read(multi, &pending)) ) {
		DBG_LOG("  Read message");
		CURLcode code;
		CURL *easy;

		if (CURLMSG_DONE == message->msg) {
			DBG_LOG("    DONE");
			easy = message->easy_handle;
			code = message->data.result;

			Curl *self;
			curl_easy_getinfo(easy, CURLINFO_PRIVATE, &self);

			curl_multi_remove_handle(multi, easy);
			/* Do not use message data after calling curl_multi_remove_handle() */

			curl_easy_setopt(easy, CURLOPT_HTTPGET, 1);

			if (CURLE_OK == code) {
				self->on_end();
			}
			else {
				self->on_error(code);
			}
		}
	}
}
