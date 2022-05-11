'use strict';

// libcurl 7.83.0

/**
* @typedef {Object} Curlopt
* @prop {string} [ABSTRACT_UNIX_SOCKET]
* @prop {number|bigint} [ACCEPTTIMEOUT_MS]
* @prop {string} [ACCEPT_ENCODING]
* @prop {number|bigint} [ADDRESS_SCOPE]
* @prop {string} [ALTSVC]
* @prop {number|bigint} [ALTSVC_CTRL]
* @prop {number|bigint} [APPEND]
* @prop {number|bigint} [AUTOREFERER]
* @prop {string} [AWS_SIGV4]
* @prop {number|bigint} [BUFFERSIZE]
* @prop {string} [CAINFO]
* @prop {ArrayBuffer} [CAINFO_BLOB]
* @prop {string} [CAPATH]
* @prop {number|bigint} [CERTINFO]
* @prop {number|bigint} [CONNECTTIMEOUT]
* @prop {number|bigint} [CONNECTTIMEOUT_MS]
* @prop {number|bigint} [CONNECT_ONLY]
* @prop {string[]} [CONNECT_TO]
* @prop {string} [COOKIE]
* @prop {string} [COOKIEFILE]
* @prop {string} [COOKIEJAR]
* @prop {string} [COOKIELIST]
* @prop {number|bigint} [COOKIESESSION]
* @prop {number|bigint} [CRLF]
* @prop {string} [CRLFILE]
* @prop {string} [CUSTOMREQUEST]
* @prop {string} [DEFAULT_PROTOCOL]
* @prop {number|bigint} [DIRLISTONLY]
* @prop {number|bigint} [DISALLOW_USERNAME_IN_URL]
* @prop {number|bigint} [DNS_CACHE_TIMEOUT]
* @prop {string} [DNS_INTERFACE]
* @prop {string} [DNS_LOCAL_IP4]
* @prop {string} [DNS_LOCAL_IP6]
* @prop {string} [DNS_SERVERS]
* @prop {number|bigint} [DNS_SHUFFLE_ADDRESSES]
* @prop {number|bigint} [DNS_USE_GLOBAL_CACHE]
* @prop {number|bigint} [DOH_SSL_VERIFYHOST]
* @prop {number|bigint} [DOH_SSL_VERIFYPEER]
* @prop {number|bigint} [DOH_SSL_VERIFYSTATUS]
* @prop {string} [DOH_URL]
* @prop {string} [EGDSOCKET]
* @prop {string} [ENCODING]
* @prop {number|bigint} [EXPECT_100_TIMEOUT_MS]
* @prop {number|bigint} [FAILONERROR]
* @prop {number|bigint} [FILETIME]
* @prop {number|bigint} [FOLLOWLOCATION]
* @prop {number|bigint} [FORBID_REUSE]
* @prop {number|bigint} [FRESH_CONNECT]
* @prop {number|bigint} [FTPAPPEND]
* @prop {number|bigint} [FTPLISTONLY]
* @prop {string} [FTPPORT]
* @prop {number|bigint} [FTPSSLAUTH]
* @prop {string} [FTP_ACCOUNT]
* @prop {string} [FTP_ALTERNATIVE_TO_USER]
* @prop {number|bigint} [FTP_CREATE_MISSING_DIRS]
* @prop {number|bigint} [FTP_FILEMETHOD]
* @prop {number|bigint} [FTP_RESPONSE_TIMEOUT]
* @prop {number|bigint} [FTP_SKIP_PASV_IP]
* @prop {number|bigint} [FTP_SSL]
* @prop {number|bigint} [FTP_SSL_CCC]
* @prop {number|bigint} [FTP_USE_EPRT]
* @prop {number|bigint} [FTP_USE_EPSV]
* @prop {number|bigint} [FTP_USE_PRET]
* @prop {number|bigint} [GSSAPI_DELEGATION]
* @prop {number|bigint} [HAPPY_EYEBALLS_TIMEOUT_MS]
* @prop {number|bigint} [HAPROXYPROTOCOL]
* @prop {number|bigint} [HEADER]
* @prop {number|bigint} [HEADEROPT]
* @prop {string} [HSTS]
* @prop {number|bigint} [HSTS_CTRL]
* @prop {number|bigint} [HTTP09_ALLOWED]
* @prop {string[]} [HTTP200ALIASES]
* @prop {number|bigint} [HTTPAUTH]
* @prop {number|bigint} [HTTPGET]
* @prop {string[]} [HTTPHEADER]
* @prop {number|bigint} [HTTPPROXYTUNNEL]
* @prop {number|bigint} [HTTP_CONTENT_DECODING]
* @prop {number|bigint} [HTTP_TRANSFER_DECODING]
* @prop {number|bigint} [HTTP_VERSION]
* @prop {number|bigint} [IGNORE_CONTENT_LENGTH]
* @prop {number|bigint} [INFILESIZE]
* @prop {number|bigint} [INFILESIZE_LARGE]
* @prop {string} [INTERFACE]
* @prop {number|bigint} [IPRESOLVE]
* @prop {string} [ISSUERCERT]
* @prop {ArrayBuffer} [ISSUERCERT_BLOB]
* @prop {number|bigint} [KEEP_SENDING_ON_ERROR]
* @prop {string} [KEYPASSWD]
* @prop {string} [KRB4LEVEL]
* @prop {string} [KRBLEVEL]
* @prop {number|bigint} [LOCALPORT]
* @prop {number|bigint} [LOCALPORTRANGE]
* @prop {string} [LOGIN_OPTIONS]
* @prop {number|bigint} [LOW_SPEED_LIMIT]
* @prop {number|bigint} [LOW_SPEED_TIME]
* @prop {string} [MAIL_AUTH]
* @prop {string} [MAIL_FROM]
* @prop {string[]} [MAIL_RCPT]
* @prop {number|bigint} [MAIL_RCPT_ALLLOWFAILS]
* @prop {number|bigint} [MAXAGE_CONN]
* @prop {number|bigint} [MAXCONNECTS]
* @prop {number|bigint} [MAXFILESIZE]
* @prop {number|bigint} [MAXFILESIZE_LARGE]
* @prop {number|bigint} [MAXLIFETIME_CONN]
* @prop {number|bigint} [MAXREDIRS]
* @prop {number|bigint} [MAX_RECV_SPEED_LARGE]
* @prop {number|bigint} [MAX_SEND_SPEED_LARGE]
* @prop {number|bigint} [MIME_OPTIONS]
* @prop {number|bigint} [NETRC]
* @prop {string} [NETRC_FILE]
* @prop {number|bigint} [NEW_DIRECTORY_PERMS]
* @prop {number|bigint} [NEW_FILE_PERMS]
* @prop {number|bigint} [NOBODY]
* @prop {number|bigint} [NOPROGRESS]
* @prop {string} [NOPROXY]
* @prop {number|bigint} [NOSIGNAL]
* @prop {string} [PASSWORD]
* @prop {number|bigint} [PATH_AS_IS]
* @prop {string} [PINNEDPUBLICKEY]
* @prop {number|bigint} [PIPEWAIT]
* @prop {number|bigint} [PORT]
* @prop {number|bigint} [POST]
* @prop {number|bigint} [POST301]
* @prop {number|bigint} [POSTFIELDSIZE]
* @prop {number|bigint} [POSTFIELDSIZE_LARGE]
* @prop {string[]} [POSTQUOTE]
* @prop {number|bigint} [POSTREDIR]
* @prop {string[]} [PREQUOTE]
* @prop {string} [PRE_PROXY]
* @prop {number|bigint} [PROTOCOLS]
* @prop {string} [PROXY]
* @prop {number|bigint} [PROXYAUTH]
* @prop {string[]} [PROXYHEADER]
* @prop {string} [PROXYPASSWORD]
* @prop {number|bigint} [PROXYPORT]
* @prop {number|bigint} [PROXYTYPE]
* @prop {string} [PROXYUSERNAME]
* @prop {string} [PROXYUSERPWD]
* @prop {string} [PROXY_CAINFO]
* @prop {ArrayBuffer} [PROXY_CAINFO_BLOB]
* @prop {string} [PROXY_CAPATH]
* @prop {string} [PROXY_CRLFILE]
* @prop {string} [PROXY_ISSUERCERT]
* @prop {ArrayBuffer} [PROXY_ISSUERCERT_BLOB]
* @prop {string} [PROXY_KEYPASSWD]
* @prop {string} [PROXY_PINNEDPUBLICKEY]
* @prop {string} [PROXY_SERVICE_NAME]
* @prop {string} [PROXY_SSLCERT]
* @prop {string} [PROXY_SSLCERTTYPE]
* @prop {ArrayBuffer} [PROXY_SSLCERT_BLOB]
* @prop {string} [PROXY_SSLKEY]
* @prop {string} [PROXY_SSLKEYTYPE]
* @prop {ArrayBuffer} [PROXY_SSLKEY_BLOB]
* @prop {number|bigint} [PROXY_SSLVERSION]
* @prop {string} [PROXY_SSL_CIPHER_LIST]
* @prop {number|bigint} [PROXY_SSL_OPTIONS]
* @prop {number|bigint} [PROXY_SSL_VERIFYHOST]
* @prop {number|bigint} [PROXY_SSL_VERIFYPEER]
* @prop {string} [PROXY_TLS13_CIPHERS]
* @prop {string} [PROXY_TLSAUTH_PASSWORD]
* @prop {string} [PROXY_TLSAUTH_TYPE]
* @prop {string} [PROXY_TLSAUTH_USERNAME]
* @prop {number|bigint} [PROXY_TRANSFER_MODE]
* @prop {number|bigint} [PUT]
* @prop {string[]} [QUOTE]
* @prop {string} [RANDOM_FILE]
* @prop {string} [RANGE]
* @prop {number|bigint} [REDIR_PROTOCOLS]
* @prop {string} [REFERER]
* @prop {string} [REQUEST_TARGET]
* @prop {string[]} [RESOLVE]
* @prop {number|bigint} [RESUME_FROM]
* @prop {number|bigint} [RESUME_FROM_LARGE]
* @prop {string[]} [RTSPHEADER]
* @prop {number|bigint} [RTSP_CLIENT_CSEQ]
* @prop {number|bigint} [RTSP_REQUEST]
* @prop {number|bigint} [RTSP_SERVER_CSEQ]
* @prop {string} [RTSP_SESSION_ID]
* @prop {string} [RTSP_STREAM_URI]
* @prop {string} [RTSP_TRANSPORT]
* @prop {string} [SASL_AUTHZID]
* @prop {number|bigint} [SASL_IR]
* @prop {number|bigint} [SERVER_RESPONSE_TIMEOUT]
* @prop {string} [SERVICE_NAME]
* @prop {number|bigint} [SOCKS5_AUTH]
* @prop {number|bigint} [SOCKS5_GSSAPI_NEC]
* @prop {string} [SOCKS5_GSSAPI_SERVICE]
* @prop {number|bigint} [SSH_AUTH_TYPES]
* @prop {number|bigint} [SSH_COMPRESSION]
* @prop {string} [SSH_HOST_PUBLIC_KEY_MD5]
* @prop {string} [SSH_HOST_PUBLIC_KEY_SHA256]
* @prop {string} [SSH_KNOWNHOSTS]
* @prop {string} [SSH_PRIVATE_KEYFILE]
* @prop {string} [SSH_PUBLIC_KEYFILE]
* @prop {string} [SSLCERT]
* @prop {string} [SSLCERTPASSWD]
* @prop {string} [SSLCERTTYPE]
* @prop {ArrayBuffer} [SSLCERT_BLOB]
* @prop {string} [SSLENGINE]
* @prop {number|bigint} [SSLENGINE_DEFAULT]
* @prop {string} [SSLKEY]
* @prop {string} [SSLKEYPASSWD]
* @prop {string} [SSLKEYTYPE]
* @prop {ArrayBuffer} [SSLKEY_BLOB]
* @prop {number|bigint} [SSLVERSION]
* @prop {string} [SSL_CIPHER_LIST]
* @prop {string} [SSL_EC_CURVES]
* @prop {number|bigint} [SSL_ENABLE_ALPN]
* @prop {number|bigint} [SSL_ENABLE_NPN]
* @prop {number|bigint} [SSL_FALSESTART]
* @prop {number|bigint} [SSL_OPTIONS]
* @prop {number|bigint} [SSL_SESSIONID_CACHE]
* @prop {number|bigint} [SSL_VERIFYHOST]
* @prop {number|bigint} [SSL_VERIFYPEER]
* @prop {number|bigint} [SSL_VERIFYSTATUS]
* @prop {number|bigint} [STREAM_WEIGHT]
* @prop {number|bigint} [SUPPRESS_CONNECT_HEADERS]
* @prop {number|bigint} [TCP_FASTOPEN]
* @prop {number|bigint} [TCP_KEEPALIVE]
* @prop {number|bigint} [TCP_KEEPIDLE]
* @prop {number|bigint} [TCP_KEEPINTVL]
* @prop {number|bigint} [TCP_NODELAY]
* @prop {string[]} [TELNETOPTIONS]
* @prop {number|bigint} [TFTP_BLKSIZE]
* @prop {number|bigint} [TFTP_NO_OPTIONS]
* @prop {number|bigint} [TIMECONDITION]
* @prop {number|bigint} [TIMEOUT]
* @prop {number|bigint} [TIMEOUT_MS]
* @prop {number|bigint} [TIMEVALUE]
* @prop {number|bigint} [TIMEVALUE_LARGE]
* @prop {string} [TLS13_CIPHERS]
* @prop {string} [TLSAUTH_PASSWORD]
* @prop {string} [TLSAUTH_TYPE]
* @prop {string} [TLSAUTH_USERNAME]
* @prop {number|bigint} [TRANSFERTEXT]
* @prop {number|bigint} [TRANSFER_ENCODING]
* @prop {string} [UNIX_SOCKET_PATH]
* @prop {number|bigint} [UNRESTRICTED_AUTH]
* @prop {number|bigint} [UPKEEP_INTERVAL_MS]
* @prop {number|bigint} [UPLOAD]
* @prop {number|bigint} [UPLOAD_BUFFERSIZE]
* @prop {string} [URL]
* @prop {string} [USERAGENT]
* @prop {string} [USERNAME]
* @prop {string} [USERPWD]
* @prop {number|bigint} [USE_SSL]
* @prop {number|bigint} [VERBOSE]
* @prop {number|bigint} [WILDCARDMATCH]
* @prop {string} [XOAUTH2_BEARER]
*/

/** @enum {string} */
module.exports.curlopt = {
	ABSTRACT_UNIX_SOCKET: 'ABSTRACT_UNIX_SOCKET',
	ACCEPTTIMEOUT_MS: 'ACCEPTTIMEOUT_MS',
	ACCEPT_ENCODING: 'ACCEPT_ENCODING',
	ADDRESS_SCOPE: 'ADDRESS_SCOPE',
	ALTSVC: 'ALTSVC',
	ALTSVC_CTRL: 'ALTSVC_CTRL',
	APPEND: 'APPEND',
	AUTOREFERER: 'AUTOREFERER',
	AWS_SIGV4: 'AWS_SIGV4',
	BUFFERSIZE: 'BUFFERSIZE',
	CAINFO: 'CAINFO',
	CAINFO_BLOB: 'CAINFO_BLOB',
	CAPATH: 'CAPATH',
	CERTINFO: 'CERTINFO',
	CHUNK_BGN_FUNCTION: 'CHUNK_BGN_FUNCTION',
	CHUNK_DATA: 'CHUNK_DATA',
	CHUNK_END_FUNCTION: 'CHUNK_END_FUNCTION',
	CLOSESOCKETDATA: 'CLOSESOCKETDATA',
	CLOSESOCKETFUNCTION: 'CLOSESOCKETFUNCTION',
	CONNECTTIMEOUT: 'CONNECTTIMEOUT',
	CONNECTTIMEOUT_MS: 'CONNECTTIMEOUT_MS',
	CONNECT_ONLY: 'CONNECT_ONLY',
	CONNECT_TO: 'CONNECT_TO',
	CONV_FROM_NETWORK_FUNCTION: 'CONV_FROM_NETWORK_FUNCTION',
	CONV_FROM_UTF8_FUNCTION: 'CONV_FROM_UTF8_FUNCTION',
	CONV_TO_NETWORK_FUNCTION: 'CONV_TO_NETWORK_FUNCTION',
	COOKIE: 'COOKIE',
	COOKIEFILE: 'COOKIEFILE',
	COOKIEJAR: 'COOKIEJAR',
	COOKIELIST: 'COOKIELIST',
	COOKIESESSION: 'COOKIESESSION',
	COPYPOSTFIELDS: 'COPYPOSTFIELDS',
	CRLF: 'CRLF',
	CRLFILE: 'CRLFILE',
	CURLU: 'CURLU',
	CUSTOMREQUEST: 'CUSTOMREQUEST',
	DEBUGDATA: 'DEBUGDATA',
	DEBUGFUNCTION: 'DEBUGFUNCTION',
	DEFAULT_PROTOCOL: 'DEFAULT_PROTOCOL',
	DIRLISTONLY: 'DIRLISTONLY',
	DISALLOW_USERNAME_IN_URL: 'DISALLOW_USERNAME_IN_URL',
	DNS_CACHE_TIMEOUT: 'DNS_CACHE_TIMEOUT',
	DNS_INTERFACE: 'DNS_INTERFACE',
	DNS_LOCAL_IP4: 'DNS_LOCAL_IP4',
	DNS_LOCAL_IP6: 'DNS_LOCAL_IP6',
	DNS_SERVERS: 'DNS_SERVERS',
	DNS_SHUFFLE_ADDRESSES: 'DNS_SHUFFLE_ADDRESSES',
	DNS_USE_GLOBAL_CACHE: 'DNS_USE_GLOBAL_CACHE',
	DOH_SSL_VERIFYHOST: 'DOH_SSL_VERIFYHOST',
	DOH_SSL_VERIFYPEER: 'DOH_SSL_VERIFYPEER',
	DOH_SSL_VERIFYSTATUS: 'DOH_SSL_VERIFYSTATUS',
	DOH_URL: 'DOH_URL',
	EGDSOCKET: 'EGDSOCKET',
	ENCODING: 'ENCODING',
	ERRORBUFFER: 'ERRORBUFFER',
	EXPECT_100_TIMEOUT_MS: 'EXPECT_100_TIMEOUT_MS',
	FAILONERROR: 'FAILONERROR',
	FILE: 'FILE',
	FILETIME: 'FILETIME',
	FNMATCH_DATA: 'FNMATCH_DATA',
	FNMATCH_FUNCTION: 'FNMATCH_FUNCTION',
	FOLLOWLOCATION: 'FOLLOWLOCATION',
	FORBID_REUSE: 'FORBID_REUSE',
	FRESH_CONNECT: 'FRESH_CONNECT',
	FTPAPPEND: 'FTPAPPEND',
	FTPLISTONLY: 'FTPLISTONLY',
	FTPPORT: 'FTPPORT',
	FTPSSLAUTH: 'FTPSSLAUTH',
	FTP_ACCOUNT: 'FTP_ACCOUNT',
	FTP_ALTERNATIVE_TO_USER: 'FTP_ALTERNATIVE_TO_USER',
	FTP_CREATE_MISSING_DIRS: 'FTP_CREATE_MISSING_DIRS',
	FTP_FILEMETHOD: 'FTP_FILEMETHOD',
	FTP_RESPONSE_TIMEOUT: 'FTP_RESPONSE_TIMEOUT',
	FTP_SKIP_PASV_IP: 'FTP_SKIP_PASV_IP',
	FTP_SSL: 'FTP_SSL',
	FTP_SSL_CCC: 'FTP_SSL_CCC',
	FTP_USE_EPRT: 'FTP_USE_EPRT',
	FTP_USE_EPSV: 'FTP_USE_EPSV',
	FTP_USE_PRET: 'FTP_USE_PRET',
	GSSAPI_DELEGATION: 'GSSAPI_DELEGATION',
	HAPPY_EYEBALLS_TIMEOUT_MS: 'HAPPY_EYEBALLS_TIMEOUT_MS',
	HAPROXYPROTOCOL: 'HAPROXYPROTOCOL',
	HEADER: 'HEADER',
	HEADERDATA: 'HEADERDATA',
	HEADERFUNCTION: 'HEADERFUNCTION',
	HEADEROPT: 'HEADEROPT',
	HSTS: 'HSTS',
	HSTSREADDATA: 'HSTSREADDATA',
	HSTSREADFUNCTION: 'HSTSREADFUNCTION',
	HSTSWRITEDATA: 'HSTSWRITEDATA',
	HSTSWRITEFUNCTION: 'HSTSWRITEFUNCTION',
	HSTS_CTRL: 'HSTS_CTRL',
	HTTP09_ALLOWED: 'HTTP09_ALLOWED',
	HTTP200ALIASES: 'HTTP200ALIASES',
	HTTPAUTH: 'HTTPAUTH',
	HTTPGET: 'HTTPGET',
	HTTPHEADER: 'HTTPHEADER',
	HTTPPOST: 'HTTPPOST',
	HTTPPROXYTUNNEL: 'HTTPPROXYTUNNEL',
	HTTP_CONTENT_DECODING: 'HTTP_CONTENT_DECODING',
	HTTP_TRANSFER_DECODING: 'HTTP_TRANSFER_DECODING',
	HTTP_VERSION: 'HTTP_VERSION',
	IGNORE_CONTENT_LENGTH: 'IGNORE_CONTENT_LENGTH',
	INFILE: 'INFILE',
	INFILESIZE: 'INFILESIZE',
	INFILESIZE_LARGE: 'INFILESIZE_LARGE',
	INTERFACE: 'INTERFACE',
	INTERLEAVEDATA: 'INTERLEAVEDATA',
	INTERLEAVEFUNCTION: 'INTERLEAVEFUNCTION',
	IOCTLDATA: 'IOCTLDATA',
	IOCTLFUNCTION: 'IOCTLFUNCTION',
	IPRESOLVE: 'IPRESOLVE',
	ISSUERCERT: 'ISSUERCERT',
	ISSUERCERT_BLOB: 'ISSUERCERT_BLOB',
	KEEP_SENDING_ON_ERROR: 'KEEP_SENDING_ON_ERROR',
	KEYPASSWD: 'KEYPASSWD',
	KRB4LEVEL: 'KRB4LEVEL',
	KRBLEVEL: 'KRBLEVEL',
	LOCALPORT: 'LOCALPORT',
	LOCALPORTRANGE: 'LOCALPORTRANGE',
	LOGIN_OPTIONS: 'LOGIN_OPTIONS',
	LOW_SPEED_LIMIT: 'LOW_SPEED_LIMIT',
	LOW_SPEED_TIME: 'LOW_SPEED_TIME',
	MAIL_AUTH: 'MAIL_AUTH',
	MAIL_FROM: 'MAIL_FROM',
	MAIL_RCPT: 'MAIL_RCPT',
	MAIL_RCPT_ALLLOWFAILS: 'MAIL_RCPT_ALLLOWFAILS',
	MAXAGE_CONN: 'MAXAGE_CONN',
	MAXCONNECTS: 'MAXCONNECTS',
	MAXFILESIZE: 'MAXFILESIZE',
	MAXFILESIZE_LARGE: 'MAXFILESIZE_LARGE',
	MAXLIFETIME_CONN: 'MAXLIFETIME_CONN',
	MAXREDIRS: 'MAXREDIRS',
	MAX_RECV_SPEED_LARGE: 'MAX_RECV_SPEED_LARGE',
	MAX_SEND_SPEED_LARGE: 'MAX_SEND_SPEED_LARGE',
	MIMEPOST: 'MIMEPOST',
	MIME_OPTIONS: 'MIME_OPTIONS',
	NETRC: 'NETRC',
	NETRC_FILE: 'NETRC_FILE',
	NEW_DIRECTORY_PERMS: 'NEW_DIRECTORY_PERMS',
	NEW_FILE_PERMS: 'NEW_FILE_PERMS',
	NOBODY: 'NOBODY',
	NOPROGRESS: 'NOPROGRESS',
	NOPROXY: 'NOPROXY',
	NOSIGNAL: 'NOSIGNAL',
	OPENSOCKETDATA: 'OPENSOCKETDATA',
	OPENSOCKETFUNCTION: 'OPENSOCKETFUNCTION',
	PASSWORD: 'PASSWORD',
	PATH_AS_IS: 'PATH_AS_IS',
	PINNEDPUBLICKEY: 'PINNEDPUBLICKEY',
	PIPEWAIT: 'PIPEWAIT',
	PORT: 'PORT',
	POST: 'POST',
	POST301: 'POST301',
	POSTFIELDS: 'POSTFIELDS',
	POSTFIELDSIZE: 'POSTFIELDSIZE',
	POSTFIELDSIZE_LARGE: 'POSTFIELDSIZE_LARGE',
	POSTQUOTE: 'POSTQUOTE',
	POSTREDIR: 'POSTREDIR',
	PREQUOTE: 'PREQUOTE',
	PREREQDATA: 'PREREQDATA',
	PREREQFUNCTION: 'PREREQFUNCTION',
	PRE_PROXY: 'PRE_PROXY',
	PRIVATE: 'PRIVATE',
	PROGRESSDATA: 'PROGRESSDATA',
	PROGRESSFUNCTION: 'PROGRESSFUNCTION',
	PROTOCOLS: 'PROTOCOLS',
	PROXY: 'PROXY',
	PROXYAUTH: 'PROXYAUTH',
	PROXYHEADER: 'PROXYHEADER',
	PROXYPASSWORD: 'PROXYPASSWORD',
	PROXYPORT: 'PROXYPORT',
	PROXYTYPE: 'PROXYTYPE',
	PROXYUSERNAME: 'PROXYUSERNAME',
	PROXYUSERPWD: 'PROXYUSERPWD',
	PROXY_CAINFO: 'PROXY_CAINFO',
	PROXY_CAINFO_BLOB: 'PROXY_CAINFO_BLOB',
	PROXY_CAPATH: 'PROXY_CAPATH',
	PROXY_CRLFILE: 'PROXY_CRLFILE',
	PROXY_ISSUERCERT: 'PROXY_ISSUERCERT',
	PROXY_ISSUERCERT_BLOB: 'PROXY_ISSUERCERT_BLOB',
	PROXY_KEYPASSWD: 'PROXY_KEYPASSWD',
	PROXY_PINNEDPUBLICKEY: 'PROXY_PINNEDPUBLICKEY',
	PROXY_SERVICE_NAME: 'PROXY_SERVICE_NAME',
	PROXY_SSLCERT: 'PROXY_SSLCERT',
	PROXY_SSLCERTTYPE: 'PROXY_SSLCERTTYPE',
	PROXY_SSLCERT_BLOB: 'PROXY_SSLCERT_BLOB',
	PROXY_SSLKEY: 'PROXY_SSLKEY',
	PROXY_SSLKEYTYPE: 'PROXY_SSLKEYTYPE',
	PROXY_SSLKEY_BLOB: 'PROXY_SSLKEY_BLOB',
	PROXY_SSLVERSION: 'PROXY_SSLVERSION',
	PROXY_SSL_CIPHER_LIST: 'PROXY_SSL_CIPHER_LIST',
	PROXY_SSL_OPTIONS: 'PROXY_SSL_OPTIONS',
	PROXY_SSL_VERIFYHOST: 'PROXY_SSL_VERIFYHOST',
	PROXY_SSL_VERIFYPEER: 'PROXY_SSL_VERIFYPEER',
	PROXY_TLS13_CIPHERS: 'PROXY_TLS13_CIPHERS',
	PROXY_TLSAUTH_PASSWORD: 'PROXY_TLSAUTH_PASSWORD',
	PROXY_TLSAUTH_TYPE: 'PROXY_TLSAUTH_TYPE',
	PROXY_TLSAUTH_USERNAME: 'PROXY_TLSAUTH_USERNAME',
	PROXY_TRANSFER_MODE: 'PROXY_TRANSFER_MODE',
	PUT: 'PUT',
	QUOTE: 'QUOTE',
	RANDOM_FILE: 'RANDOM_FILE',
	RANGE: 'RANGE',
	READDATA: 'READDATA',
	READFUNCTION: 'READFUNCTION',
	REDIR_PROTOCOLS: 'REDIR_PROTOCOLS',
	REFERER: 'REFERER',
	REQUEST_TARGET: 'REQUEST_TARGET',
	RESOLVE: 'RESOLVE',
	RESOLVER_START_DATA: 'RESOLVER_START_DATA',
	RESOLVER_START_FUNCTION: 'RESOLVER_START_FUNCTION',
	RESUME_FROM: 'RESUME_FROM',
	RESUME_FROM_LARGE: 'RESUME_FROM_LARGE',
	RTSPHEADER: 'RTSPHEADER',
	RTSP_CLIENT_CSEQ: 'RTSP_CLIENT_CSEQ',
	RTSP_REQUEST: 'RTSP_REQUEST',
	RTSP_SERVER_CSEQ: 'RTSP_SERVER_CSEQ',
	RTSP_SESSION_ID: 'RTSP_SESSION_ID',
	RTSP_STREAM_URI: 'RTSP_STREAM_URI',
	RTSP_TRANSPORT: 'RTSP_TRANSPORT',
	SASL_AUTHZID: 'SASL_AUTHZID',
	SASL_IR: 'SASL_IR',
	SEEKDATA: 'SEEKDATA',
	SEEKFUNCTION: 'SEEKFUNCTION',
	SERVER_RESPONSE_TIMEOUT: 'SERVER_RESPONSE_TIMEOUT',
	SERVICE_NAME: 'SERVICE_NAME',
	SHARE: 'SHARE',
	SOCKOPTDATA: 'SOCKOPTDATA',
	SOCKOPTFUNCTION: 'SOCKOPTFUNCTION',
	SOCKS5_AUTH: 'SOCKS5_AUTH',
	SOCKS5_GSSAPI_NEC: 'SOCKS5_GSSAPI_NEC',
	SOCKS5_GSSAPI_SERVICE: 'SOCKS5_GSSAPI_SERVICE',
	SSH_AUTH_TYPES: 'SSH_AUTH_TYPES',
	SSH_COMPRESSION: 'SSH_COMPRESSION',
	SSH_HOST_PUBLIC_KEY_MD5: 'SSH_HOST_PUBLIC_KEY_MD5',
	SSH_HOST_PUBLIC_KEY_SHA256: 'SSH_HOST_PUBLIC_KEY_SHA256',
	SSH_KEYDATA: 'SSH_KEYDATA',
	SSH_KEYFUNCTION: 'SSH_KEYFUNCTION',
	SSH_KNOWNHOSTS: 'SSH_KNOWNHOSTS',
	SSH_PRIVATE_KEYFILE: 'SSH_PRIVATE_KEYFILE',
	SSH_PUBLIC_KEYFILE: 'SSH_PUBLIC_KEYFILE',
	SSLCERT: 'SSLCERT',
	SSLCERTPASSWD: 'SSLCERTPASSWD',
	SSLCERTTYPE: 'SSLCERTTYPE',
	SSLCERT_BLOB: 'SSLCERT_BLOB',
	SSLENGINE: 'SSLENGINE',
	SSLENGINE_DEFAULT: 'SSLENGINE_DEFAULT',
	SSLKEY: 'SSLKEY',
	SSLKEYPASSWD: 'SSLKEYPASSWD',
	SSLKEYTYPE: 'SSLKEYTYPE',
	SSLKEY_BLOB: 'SSLKEY_BLOB',
	SSLVERSION: 'SSLVERSION',
	SSL_CIPHER_LIST: 'SSL_CIPHER_LIST',
	SSL_CTX_DATA: 'SSL_CTX_DATA',
	SSL_CTX_FUNCTION: 'SSL_CTX_FUNCTION',
	SSL_EC_CURVES: 'SSL_EC_CURVES',
	SSL_ENABLE_ALPN: 'SSL_ENABLE_ALPN',
	SSL_ENABLE_NPN: 'SSL_ENABLE_NPN',
	SSL_FALSESTART: 'SSL_FALSESTART',
	SSL_OPTIONS: 'SSL_OPTIONS',
	SSL_SESSIONID_CACHE: 'SSL_SESSIONID_CACHE',
	SSL_VERIFYHOST: 'SSL_VERIFYHOST',
	SSL_VERIFYPEER: 'SSL_VERIFYPEER',
	SSL_VERIFYSTATUS: 'SSL_VERIFYSTATUS',
	STDERR: 'STDERR',
	STREAM_DEPENDS: 'STREAM_DEPENDS',
	STREAM_DEPENDS_E: 'STREAM_DEPENDS_E',
	STREAM_WEIGHT: 'STREAM_WEIGHT',
	SUPPRESS_CONNECT_HEADERS: 'SUPPRESS_CONNECT_HEADERS',
	TCP_FASTOPEN: 'TCP_FASTOPEN',
	TCP_KEEPALIVE: 'TCP_KEEPALIVE',
	TCP_KEEPIDLE: 'TCP_KEEPIDLE',
	TCP_KEEPINTVL: 'TCP_KEEPINTVL',
	TCP_NODELAY: 'TCP_NODELAY',
	TELNETOPTIONS: 'TELNETOPTIONS',
	TFTP_BLKSIZE: 'TFTP_BLKSIZE',
	TFTP_NO_OPTIONS: 'TFTP_NO_OPTIONS',
	TIMECONDITION: 'TIMECONDITION',
	TIMEOUT: 'TIMEOUT',
	TIMEOUT_MS: 'TIMEOUT_MS',
	TIMEVALUE: 'TIMEVALUE',
	TIMEVALUE_LARGE: 'TIMEVALUE_LARGE',
	TLS13_CIPHERS: 'TLS13_CIPHERS',
	TLSAUTH_PASSWORD: 'TLSAUTH_PASSWORD',
	TLSAUTH_TYPE: 'TLSAUTH_TYPE',
	TLSAUTH_USERNAME: 'TLSAUTH_USERNAME',
	TRAILERDATA: 'TRAILERDATA',
	TRAILERFUNCTION: 'TRAILERFUNCTION',
	TRANSFERTEXT: 'TRANSFERTEXT',
	TRANSFER_ENCODING: 'TRANSFER_ENCODING',
	UNIX_SOCKET_PATH: 'UNIX_SOCKET_PATH',
	UNRESTRICTED_AUTH: 'UNRESTRICTED_AUTH',
	UPKEEP_INTERVAL_MS: 'UPKEEP_INTERVAL_MS',
	UPLOAD: 'UPLOAD',
	UPLOAD_BUFFERSIZE: 'UPLOAD_BUFFERSIZE',
	URL: 'URL',
	USERAGENT: 'USERAGENT',
	USERNAME: 'USERNAME',
	USERPWD: 'USERPWD',
	USE_SSL: 'USE_SSL',
	VERBOSE: 'VERBOSE',
	WILDCARDMATCH: 'WILDCARDMATCH',
	WRITEDATA: 'WRITEDATA',
	WRITEFUNCTION: 'WRITEFUNCTION',
	WRITEHEADER: 'WRITEHEADER',
	XFERINFODATA: 'XFERINFODATA',
	XFERINFOFUNCTION: 'XFERINFOFUNCTION',
	XOAUTH2_BEARER: 'XOAUTH2_BEARER',
};