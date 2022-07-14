#include <string>
#include <curl/curl.h>
#include <curl/options.h>

const char* jstypes(const curl_easyoption *opt) {
	switch (opt->type)
	{
		case CURLOT_LONG:     /* long (a range of values) */
		case CURLOT_VALUES:   /*      (a defined set or bitmask) */
		case CURLOT_OFF_T:    /* curl_off_t (a range of values) */
			return "number | bigint";
		case CURLOT_OBJECT:   /* pointer (void *) */
			if (opt->id == CURLOPT_COPYPOSTFIELDS || opt->id == CURLOPT_POSTFIELDS)
				return "Uint8Array | string";
			return NULL;
		case CURLOT_STRING:   /*         (char * to zero terminated buffer) */
			return "string";
		case CURLOT_SLIST:    /*         (struct curl_slist *) */
			return "string[]";
		// case CURLOT_CBPTR:    /*         (void * passed as-is to a callback) */
		// 	return "CBPTR";
		case CURLOT_BLOB:     /* blob (struct curl_blob *) */
			return "Uint8Array";
		// case CURLOT_FUNCTION: /* function pointer */
		// 	return "FUNCTION";

		default:
			return NULL;
	}

}

int main(int argc, char *argv[])
{
	const struct curl_easyoption *opt;
	curl_version_info_data *info = curl_version_info(CURLVERSION_NOW);

	printf("'use strict';\n\n");
	printf("// libcurl %s\n\n", info->version);
	printf(
		"/**\n"
		"* @typedef {Object} Curlopt\n"
	);

	opt = curl_easy_option_next(NULL);
	while (opt)
	{
		const char * jstype = jstypes(opt);
		if (jstype)
			printf("* @prop {%s} [%s]\n", jstype, opt->name);
		opt = curl_easy_option_next(opt);
	}

	printf("*/\n\n");

	printf(
		"/** @enum {string} */\n"
		"module.exports.curlopt = {\n"
	);

	opt = curl_easy_option_next(NULL);
	while (opt)
	{
		printf("\t%s: '%s',\n", opt->name, opt->name);
		opt = curl_easy_option_next(opt);
	}

	printf("};\n");
	return 0;
}
