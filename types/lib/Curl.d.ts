export type Curlopt = import("./curlopt.js").Curlopt;
export type Curlinfo = import("./curlinfo.js").Curlinfo;
export type curlinfo = typeof import("./curlinfo.js").curlinfo;
declare const Curl_base: any;
/** @typedef {import("./curlopt.js").Curlopt} Curlopt */
/** @typedef {import("./curlinfo.js").Curlinfo } Curlinfo */
/** @typedef {typeof import("./curlinfo.js").curlinfo } curlinfo */
/** Class representing Curl handle **/
export class Curl extends Curl_base {
    [x: string]: any;
    static get constants(): typeof constants;
    /**
     * Create instance of Curl handle with default easy options
     * @param {Curlopt} defaults - Default Curl easy options https://curl.haxx.se/libcurl/c/easy_setopt_options.html
     */
    constructor(defaults?: Curlopt);
    defaults: {
        ABSTRACT_UNIX_SOCKET?: string | undefined;
        ACCEPTTIMEOUT_MS?: number | bigint | undefined;
        ACCEPT_ENCODING?: string | undefined;
        ADDRESS_SCOPE?: number | bigint | undefined;
        ALTSVC?: string | undefined;
        ALTSVC_CTRL?: number | bigint | undefined;
        APPEND?: number | bigint | undefined;
        AUTOREFERER?: number | bigint | undefined;
        AWS_SIGV4?: string | undefined;
        BUFFERSIZE?: number | bigint | undefined;
        CAINFO?: string | undefined;
        CAINFO_BLOB?: Uint8Array | undefined;
        CAPATH?: string | undefined;
        CERTINFO?: number | bigint | undefined;
        CONNECTTIMEOUT?: number | bigint | undefined;
        CONNECTTIMEOUT_MS?: number | bigint | undefined;
        CONNECT_ONLY?: number | bigint | undefined;
        CONNECT_TO?: string[] | undefined;
        COOKIE?: string | undefined;
        COOKIEFILE?: string | undefined;
        COOKIEJAR?: string | undefined;
        COOKIELIST?: string | undefined;
        COOKIESESSION?: number | bigint | undefined;
        COPYPOSTFIELDS?: string | Uint8Array | undefined;
        CRLF?: number | bigint | undefined;
        CRLFILE?: string | undefined;
        CUSTOMREQUEST?: string | undefined;
        DEFAULT_PROTOCOL?: string | undefined;
        DIRLISTONLY?: number | bigint | undefined;
        DISALLOW_USERNAME_IN_URL?: number | bigint | undefined;
        DNS_CACHE_TIMEOUT?: number | bigint | undefined;
        DNS_INTERFACE?: string | undefined;
        DNS_LOCAL_IP4?: string | undefined;
        DNS_LOCAL_IP6?: string | undefined;
        DNS_SERVERS?: string | undefined;
        DNS_SHUFFLE_ADDRESSES?: number | bigint | undefined;
        DNS_USE_GLOBAL_CACHE?: number | bigint | undefined;
        DOH_SSL_VERIFYHOST?: number | bigint | undefined;
        DOH_SSL_VERIFYPEER?: number | bigint | undefined;
        DOH_SSL_VERIFYSTATUS?: number | bigint | undefined;
        DOH_URL?: string | undefined;
        EGDSOCKET?: string | undefined;
        ENCODING?: string | undefined;
        EXPECT_100_TIMEOUT_MS?: number | bigint | undefined;
        FAILONERROR?: number | bigint | undefined;
        FILETIME?: number | bigint | undefined;
        FOLLOWLOCATION?: number | bigint | undefined;
        FORBID_REUSE?: number | bigint | undefined;
        FRESH_CONNECT?: number | bigint | undefined;
        FTPAPPEND?: number | bigint | undefined;
        FTPLISTONLY?: number | bigint | undefined;
        FTPPORT?: string | undefined;
        FTPSSLAUTH?: number | bigint | undefined;
        FTP_ACCOUNT?: string | undefined;
        FTP_ALTERNATIVE_TO_USER?: string | undefined;
        FTP_CREATE_MISSING_DIRS?: number | bigint | undefined;
        FTP_FILEMETHOD?: number | bigint | undefined;
        FTP_RESPONSE_TIMEOUT?: number | bigint | undefined;
        FTP_SKIP_PASV_IP?: number | bigint | undefined;
        FTP_SSL?: number | bigint | undefined;
        FTP_SSL_CCC?: number | bigint | undefined;
        FTP_USE_EPRT?: number | bigint | undefined;
        FTP_USE_EPSV?: number | bigint | undefined;
        FTP_USE_PRET?: number | bigint | undefined;
        GSSAPI_DELEGATION?: number | bigint | undefined;
        HAPPY_EYEBALLS_TIMEOUT_MS?: number | bigint | undefined;
        HAPROXYPROTOCOL?: number | bigint | undefined;
        HEADER?: number | bigint | undefined;
        HEADEROPT?: number | bigint | undefined;
        HSTS?: string | undefined;
        HSTS_CTRL?: number | bigint | undefined;
        HTTP09_ALLOWED?: number | bigint | undefined;
        HTTP200ALIASES?: string[] | undefined;
        HTTPAUTH?: number | bigint | undefined;
        HTTPGET?: number | bigint | undefined;
        HTTPHEADER?: string[] | undefined;
        HTTPPROXYTUNNEL?: number | bigint | undefined;
        HTTP_CONTENT_DECODING?: number | bigint | undefined;
        HTTP_TRANSFER_DECODING?: number | bigint | undefined;
        HTTP_VERSION?: number | bigint | undefined;
        IGNORE_CONTENT_LENGTH?: number | bigint | undefined;
        INFILESIZE?: number | bigint | undefined;
        INFILESIZE_LARGE?: number | bigint | undefined;
        INTERFACE?: string | undefined;
        IPRESOLVE?: number | bigint | undefined;
        ISSUERCERT?: string | undefined;
        ISSUERCERT_BLOB?: Uint8Array | undefined;
        KEEP_SENDING_ON_ERROR?: number | bigint | undefined;
        KEYPASSWD?: string | undefined;
        KRB4LEVEL?: string | undefined;
        KRBLEVEL?: string | undefined;
        LOCALPORT?: number | bigint | undefined;
        LOCALPORTRANGE?: number | bigint | undefined;
        LOGIN_OPTIONS?: string | undefined;
        LOW_SPEED_LIMIT?: number | bigint | undefined;
        LOW_SPEED_TIME?: number | bigint | undefined;
        MAIL_AUTH?: string | undefined;
        MAIL_FROM?: string | undefined;
        MAIL_RCPT?: string[] | undefined;
        MAIL_RCPT_ALLLOWFAILS?: number | bigint | undefined;
        MAXAGE_CONN?: number | bigint | undefined;
        MAXCONNECTS?: number | bigint | undefined;
        MAXFILESIZE?: number | bigint | undefined;
        MAXFILESIZE_LARGE?: number | bigint | undefined;
        MAXLIFETIME_CONN?: number | bigint | undefined;
        MAXREDIRS?: number | bigint | undefined;
        MAX_RECV_SPEED_LARGE?: number | bigint | undefined;
        MAX_SEND_SPEED_LARGE?: number | bigint | undefined;
        MIME_OPTIONS?: number | bigint | undefined;
        NETRC?: number | bigint | undefined;
        NETRC_FILE?: string | undefined;
        NEW_DIRECTORY_PERMS?: number | bigint | undefined;
        NEW_FILE_PERMS?: number | bigint | undefined;
        NOBODY?: number | bigint | undefined;
        NOPROGRESS?: number | bigint | undefined;
        NOPROXY?: string | undefined;
        NOSIGNAL?: number | bigint | undefined;
        PASSWORD?: string | undefined;
        PATH_AS_IS?: number | bigint | undefined;
        PINNEDPUBLICKEY?: string | undefined;
        PIPEWAIT?: number | bigint | undefined;
        PORT?: number | bigint | undefined;
        POST?: number | bigint | undefined;
        POST301?: number | bigint | undefined;
        POSTFIELDS?: string | Uint8Array | undefined;
        POSTFIELDSIZE?: number | bigint | undefined;
        POSTFIELDSIZE_LARGE?: number | bigint | undefined;
        POSTQUOTE?: string[] | undefined;
        POSTREDIR?: number | bigint | undefined;
        PREQUOTE?: string[] | undefined;
        PRE_PROXY?: string | undefined;
        PROTOCOLS?: number | bigint | undefined;
        PROXY?: string | undefined;
        PROXYAUTH?: number | bigint | undefined;
        PROXYHEADER?: string[] | undefined;
        PROXYPASSWORD?: string | undefined;
        PROXYPORT?: number | bigint | undefined;
        PROXYTYPE?: number | bigint | undefined;
        PROXYUSERNAME?: string | undefined;
        PROXYUSERPWD?: string | undefined;
        PROXY_CAINFO?: string | undefined;
        PROXY_CAINFO_BLOB?: Uint8Array | undefined;
        PROXY_CAPATH?: string | undefined;
        PROXY_CRLFILE?: string | undefined;
        PROXY_ISSUERCERT?: string | undefined;
        PROXY_ISSUERCERT_BLOB?: Uint8Array | undefined;
        PROXY_KEYPASSWD?: string | undefined;
        PROXY_PINNEDPUBLICKEY?: string | undefined;
        PROXY_SERVICE_NAME?: string | undefined;
        PROXY_SSLCERT?: string | undefined;
        PROXY_SSLCERTTYPE?: string | undefined;
        PROXY_SSLCERT_BLOB?: Uint8Array | undefined;
        PROXY_SSLKEY?: string | undefined;
        PROXY_SSLKEYTYPE?: string | undefined;
        PROXY_SSLKEY_BLOB?: Uint8Array | undefined;
        PROXY_SSLVERSION?: number | bigint | undefined;
        PROXY_SSL_CIPHER_LIST?: string | undefined;
        PROXY_SSL_OPTIONS?: number | bigint | undefined;
        PROXY_SSL_VERIFYHOST?: number | bigint | undefined;
        PROXY_SSL_VERIFYPEER?: number | bigint | undefined;
        PROXY_TLS13_CIPHERS?: string | undefined;
        PROXY_TLSAUTH_PASSWORD?: string | undefined;
        PROXY_TLSAUTH_TYPE?: string | undefined;
        PROXY_TLSAUTH_USERNAME?: string | undefined;
        PROXY_TRANSFER_MODE?: number | bigint | undefined;
        PUT?: number | bigint | undefined;
        QUOTE?: string[] | undefined;
        RANDOM_FILE?: string | undefined;
        RANGE?: string | undefined;
        REDIR_PROTOCOLS?: number | bigint | undefined;
        REFERER?: string | undefined;
        REQUEST_TARGET?: string | undefined;
        RESOLVE?: string[] | undefined;
        RESUME_FROM?: number | bigint | undefined;
        RESUME_FROM_LARGE?: number | bigint | undefined;
        RTSPHEADER?: string[] | undefined;
        RTSP_CLIENT_CSEQ?: number | bigint | undefined;
        RTSP_REQUEST?: number | bigint | undefined;
        RTSP_SERVER_CSEQ?: number | bigint | undefined;
        RTSP_SESSION_ID?: string | undefined;
        RTSP_STREAM_URI?: string | undefined;
        RTSP_TRANSPORT?: string | undefined;
        SASL_AUTHZID?: string | undefined;
        SASL_IR?: number | bigint | undefined;
        SERVER_RESPONSE_TIMEOUT?: number | bigint | undefined;
        SERVICE_NAME?: string | undefined;
        SOCKS5_AUTH?: number | bigint | undefined;
        SOCKS5_GSSAPI_NEC?: number | bigint | undefined;
        SOCKS5_GSSAPI_SERVICE?: string | undefined;
        SSH_AUTH_TYPES?: number | bigint | undefined;
        SSH_COMPRESSION?: number | bigint | undefined;
        SSH_HOST_PUBLIC_KEY_MD5?: string | undefined;
        SSH_HOST_PUBLIC_KEY_SHA256?: string | undefined;
        SSH_KNOWNHOSTS?: string | undefined;
        SSH_PRIVATE_KEYFILE?: string | undefined;
        SSH_PUBLIC_KEYFILE?: string | undefined;
        SSLCERT?: string | undefined;
        SSLCERTPASSWD?: string | undefined;
        SSLCERTTYPE?: string | undefined;
        SSLCERT_BLOB?: Uint8Array | undefined;
        SSLENGINE?: string | undefined;
        SSLENGINE_DEFAULT?: number | bigint | undefined;
        SSLKEY?: string | undefined;
        SSLKEYPASSWD?: string | undefined;
        SSLKEYTYPE?: string | undefined;
        SSLKEY_BLOB?: Uint8Array | undefined;
        SSLVERSION?: number | bigint | undefined;
        SSL_CIPHER_LIST?: string | undefined;
        SSL_EC_CURVES?: string | undefined;
        SSL_ENABLE_ALPN?: number | bigint | undefined;
        SSL_ENABLE_NPN?: number | bigint | undefined;
        SSL_FALSESTART?: number | bigint | undefined;
        SSL_OPTIONS?: number | bigint | undefined;
        SSL_SESSIONID_CACHE?: number | bigint | undefined;
        SSL_VERIFYHOST?: number | bigint | undefined;
        SSL_VERIFYPEER?: number | bigint | undefined;
        SSL_VERIFYSTATUS?: number | bigint | undefined;
        STREAM_WEIGHT?: number | bigint | undefined;
        SUPPRESS_CONNECT_HEADERS?: number | bigint | undefined;
        TCP_FASTOPEN?: number | bigint | undefined;
        TCP_KEEPALIVE?: number | bigint | undefined;
        TCP_KEEPIDLE?: number | bigint | undefined;
        TCP_KEEPINTVL?: number | bigint | undefined;
        TCP_NODELAY?: number | bigint | undefined;
        TELNETOPTIONS?: string[] | undefined;
        TFTP_BLKSIZE?: number | bigint | undefined;
        TFTP_NO_OPTIONS?: number | bigint | undefined;
        TIMECONDITION?: number | bigint | undefined;
        TIMEOUT?: number | bigint | undefined;
        TIMEOUT_MS?: number | bigint | undefined;
        TIMEVALUE?: number | bigint | undefined;
        TIMEVALUE_LARGE?: number | bigint | undefined;
        TLS13_CIPHERS?: string | undefined;
        TLSAUTH_PASSWORD?: string | undefined;
        TLSAUTH_TYPE?: string | undefined;
        TLSAUTH_USERNAME?: string | undefined;
        TRANSFERTEXT?: number | bigint | undefined;
        TRANSFER_ENCODING?: number | bigint | undefined;
        UNIX_SOCKET_PATH?: string | undefined;
        UNRESTRICTED_AUTH?: number | bigint | undefined;
        UPKEEP_INTERVAL_MS?: number | bigint | undefined;
        UPLOAD?: number | bigint | undefined;
        UPLOAD_BUFFERSIZE?: number | bigint | undefined;
        URL?: string | undefined;
        USERAGENT?: string | undefined;
        USERNAME?: string | undefined;
        USERPWD?: string | undefined;
        USE_SSL?: number | bigint | undefined;
        VERBOSE?: number | bigint | undefined;
        WILDCARDMATCH?: number | bigint | undefined;
        XOAUTH2_BEARER?: string | undefined;
    };
    queue: Promise<void>;
    /**
     * @param {{ signal?: AbortSignal }} [opts]
     * @returns {Promise<() => void>}
     */
    lock({ signal }?: {
        signal?: AbortSignal | undefined;
    } | undefined): Promise<() => void>;
    resetDefaults(): void;
    /**
     * Extract information from a curl handle
     * https://curl.haxx.se/libcurl/c/easy_getinfo_options.html
     * @param  {Curlinfo|curlinfo} key - Option key without prefix CURLINFO
     * @return {number|string|string[]}
     */
    getInfo(key: Curlinfo | curlinfo): number | string | string[];
    /**
     * Curl easy options
     * https://curl.haxx.se/libcurl/c/easy_setopt_options.html
     * @param {Curlopt} options - Option key without prefix CURLOPT_ or object of key-value
     * @return {Curl} This
     */
    setOpt(options: Curlopt): Curl;
    /**
     * Reset option to default
     * @param {Curlopt} [options] - Pass options to setOpt
     * @return {Curl} This
     */
    reset(options?: import("./curlopt.js").Curlopt | undefined): Curl;
    /**
     * These mechanisms usually send some traffic on existing connections in order to keep them alive
    * @return {void}
    */
    upkeep(): void;
    /**
     * Perform request
     * @param {{
     *  method?: 'GET' | string,
     * 	body?: Iterable<Uint8Array>|AsyncIterable<Uint8Array>|string|Uint8Array,
     *  signal?: AbortSignal,
     * } & Curlopt } [opts]
     * @return { Promise<Response>}  Response that is called as soon as the header is received
     */
    perform({ body, signal, ...options }?: ({
        method?: string | undefined;
        body?: string | Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array> | undefined;
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
    /**
     * @param {string|URL} url
     * @param {{
     *    signal?: AbortSignal;
     * } & Curlopt } [opts]
     */
    get(url: string | URL, { signal, ...options }?: ({
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
    /**
     * @param {string|URL} url
     * @param {{
     *    signal?: AbortSignal;
     * } & Curlopt } [opts]
     */
    head(url: string | URL, { signal, ...options }?: ({
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
    /**
     * @param {string|URL} url
     * @param {{
     *    signal?: AbortSignal;
     * } & Curlopt } [opts]
     */
    delete(url: string | URL, { signal, ...options }?: ({
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
    /**
     * @param {string|URL} url
     * @param {{
     *    body?: Iterable<any> | AsyncIterable<any>;
     *    signal?: AbortSignal;
     * } & Curlopt } [opts]
     */
    post(url: string | URL, { body, signal, ...options }?: ({
        body?: Iterable<any> | AsyncIterable<any> | undefined;
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
    /**
     * @param {string|URL} url
     * @param {{
     *    body?: Iterable<any>|AsyncIterable<any>;
     *    signal?: AbortSignal;
     * } & Curlopt } [opts]
     */
    put(url: string | URL, { body, signal, ...options }?: ({
        body?: Iterable<any> | AsyncIterable<any> | undefined;
        signal?: AbortSignal | undefined;
    } & import("./curlopt.js").Curlopt) | undefined): Promise<Response>;
}
import constants = require("./constants");
export {};
