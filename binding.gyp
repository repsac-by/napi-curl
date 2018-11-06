{
	"targets": [
		{
			"target_name": "curl_client",
			"sources": [
				"src/addon.cc",
				"src/napi-libcurl.cc"
			],
			"include_dirs": [
				"<!@(node -p \"require('node-addon-api').include\")"
			],
			"dependencies": [
				"<!@(node -p \"require('node-addon-api').gyp\")"
			],
			"libraries": [
				'<!@(pkg-config libcurl --libs)'
			],
			"actions": [
				# {
				# 	"action_name": "maps",
				# 	"inputs": [	"/usr/include/curl/curl.h" ],
				# 	"outputs": [ "src/napi-libcurl-maps.hpp" ],
				# 	"action": [
				# 		"./generate-curl-maps"
				# 	]
				# }
			],
			"cflags!": [ "-fno-exceptions" ],
			"cflags_cc!": [ "-fno-exceptions" ]
		}
	]
}
