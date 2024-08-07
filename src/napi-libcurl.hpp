#ifndef ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_
#define ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_

#include <napi.h>
#include <curl/curl.h>
#include <uv.h>
#include <string>
#include <vector>
#include <map>

#if defined(DEBUG)
#  define DBG_LOG(fmt, ...) \
     do { fprintf(stderr, "DEBUG: " fmt "\n", ##__VA_ARGS__); } while (0)
#else
#  define DBG_LOG(fmt, ...) (void(0))
#endif

struct poll_ctx_t {
	uv_poll_t handle;
	curl_socket_t sock;
	void* userp;
	int events = 0;
};

static inline std::string rtrim(const std::string &str) {
	const auto &chars = std::string("\n\r\t\v\f ");
	return std::string(str.data(), str.find_last_not_of(chars) + 1);
}

class Curl: public Napi::ObjectWrap<Curl> {
	public:
		static Napi::Object Init(Napi::Env env, Napi::Object exports);
		Curl(const Napi::CallbackInfo& info);
		~Curl();

	private:
		static Napi::FunctionReference constructor;

		static int start_timeout(CURLM* multi, long timeout_ms, void* userp);
		static int handle_socket(CURL* easy, curl_socket_t sockfd, int action, void* userp, void *socketp);
		static void curl_poll_cb(uv_poll_t* req, int status, int events);
		static void check_multi_info();
		static void on_timeout(uv_timer_t* req);
		static poll_ctx_t* create_poll_context(const curl_socket_t& sockfd, CURL* easy);
		static void destroy_poll_context(uv_poll_t* handle);
		static void poll_close_cb(uv_handle_t* handle);
		static size_t header_callback(char* ptr, size_t size, size_t nmemb, void* userdata);
		static size_t read_callback(char *buffer, size_t size, size_t nitems, void *userdata);
		static size_t data_callback(char* ptr, size_t size, size_t nmemb, void* userdata);
		static int    progress_callback(void *userdata, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow);

		CURL* easy;
		char errorbuffer[CURL_ERROR_SIZE] = { 0 };

		poll_ctx_t* poll_ctx = nullptr;

		std::vector<std::string> headers;

		Napi::FunctionReference onError;
		Napi::FunctionReference onRead;
		Napi::FunctionReference onHeaders;
		Napi::FunctionReference onData;
		Napi::FunctionReference onEnd;
		Napi::FunctionReference onClose;

		std::map<CURLoption, struct curl_slist*> slists;

		Napi::Value reset(const Napi::CallbackInfo& info);
		Napi::Value setOpt(const Napi::CallbackInfo& info);
		Napi::Value getInfo(const Napi::CallbackInfo& info);
		static void dummy(const Napi::CallbackInfo& info);
		void perform(const Napi::CallbackInfo& info);
		void cancel(const Napi::CallbackInfo& info);
		void pause(const Napi::CallbackInfo& info);
		void resume(const Napi::CallbackInfo& info);
		void upkeep(const Napi::CallbackInfo &info);
		void readStop(const Napi::CallbackInfo& info);
		void readStart(const Napi::CallbackInfo& info);
		void onErrorSetter(const Napi::CallbackInfo& info, const Napi::Value& value);
		void onReadSetter(const Napi::CallbackInfo& info, const Napi::Value& value);
		void onHeadersSetter(const Napi::CallbackInfo &info, const Napi::Value &value);
		void onDataSetter(const Napi::CallbackInfo& info, const Napi::Value& value);
		void onEndSetter(const Napi::CallbackInfo &info, const Napi::Value &value);
		void onCloseSetter(const Napi::CallbackInfo &info, const Napi::Value &value);

		int cancelTransfer = 0;
		void on_end();
		void on_close();
		void on_error(CURLcode code);
		size_t on_header(char *ptr, size_t size, size_t nmemb);
		size_t on_read(char *buffer, size_t size, size_t nitems);
		size_t on_data(char *ptr, size_t size, size_t nmemb);

		void clean();
		void cleanEvents();
};

#endif  // ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_
