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
				{
					"action_name": "maps",
					"inputs": [	"/usr/include/curl/curl.h" ],
					"outputs": [ "src/napi-libcurl-maps.hpp" ],
					"action": [
						"sh", "-c", "util/generate-curl-maps ><@(_outputs)"
					]
				},
				{
					"action_name": "curlinfo",
					"inputs": [	"/usr/include/curl/curl.h" ],
					"outputs": [ "lib/curlinfo.js" ],
					"action": [
						"sh", "-c", "util/generate-curlinfo ><@(_outputs)"
					]
				},
				{
					"action_name": "curlopts",
					"inputs": [	"/usr/include/curl/curl.h" ],
					"outputs": [ "lib/curlopt.js" ],
					"action": [
						"sh", "-c", "g++ -lcurl util/curl_easy_options.cc -outil/curl_easy_options && util/curl_easy_options ><@(_outputs)"
					]
				}
			],
			"cflags!": [ "-fno-exceptions" ],
			"cflags_cc!": [ "-fno-exceptions" ]
		}
	]
}
