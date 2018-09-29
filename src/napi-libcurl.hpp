#ifndef ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_
#define ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_

#include <napi.h>
#include <curl/curl.h>
#include <uv.h>
#include <string>
#include <vector>
#include <map>

struct poll_ctx_t {
	uv_poll_t handle;
	curl_socket_t sock;
	void* userp;
	int events = 0;
};

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

		CURL* easy;
		char errorbuffer[CURL_ERROR_SIZE] = { 0 };

		poll_ctx_t* poll_ctx = nullptr;

		std::vector<std::string> header;

		Napi::FunctionReference onError;
		Napi::FunctionReference onRead;
		Napi::FunctionReference onHeader;
		Napi::FunctionReference onData;
		Napi::FunctionReference onEnd;

		std::map<CURLoption, struct curl_slist*> slists;

		Napi::Value create_error(CURLcode code);

		Napi::Value reset(const Napi::CallbackInfo& info);
		Napi::Value setOpt(const Napi::CallbackInfo& info);
		Napi::Value getInfo(const Napi::CallbackInfo& info);
		static void dummy(const Napi::CallbackInfo& info);
		void perform(const Napi::CallbackInfo& info);
		void pause(const Napi::CallbackInfo& info);
		void resume(const Napi::CallbackInfo& info);
		void readStop(const Napi::CallbackInfo& info);
		void readStart(const Napi::CallbackInfo& info);
		void onErrorSetter(const Napi::CallbackInfo& info, const Napi::Value& value);
		void onReadSetter(const Napi::CallbackInfo& info, const Napi::Value& value);
		void onDataSetter(const Napi::CallbackInfo& info, const Napi::Value& value);

		void on_end();
		void on_error(CURLcode code);
		bool snd = false;
		size_t on_header(char *ptr, size_t size, size_t nmemb);
		size_t on_read(char *buffer, size_t size, size_t nitems);
		size_t on_data(char *ptr, size_t size, size_t nmemb);

		void clean();
};

#endif  // ADDON_NAPI_6_OBJECT_WRAP_LIBCURL_H_
