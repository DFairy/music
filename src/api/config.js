export const commonParams = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    format: 'jsonp',
    notice: 0
}

export const options = {
    param: 'jsonpCallback',
    prefix: 'jp'
}

const debug = process.env.NODE_ENV !== 'production'
export const baseUrl = debug ? 'http://172.19.10.178:4000' : 'http://172.19.10.178:4000'

export const ERR_OK = 0