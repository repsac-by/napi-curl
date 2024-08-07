#include <napi.h>
#include "napi-libcurl.hpp"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
	return Curl::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
