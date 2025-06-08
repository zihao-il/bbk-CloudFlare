import request from "../utils/request.ts";

export const get_version = function (data: { v: string, b?: string }) {
    return request({
        url: '/api/get_version',
        method: 'post',
        data: data
    })
}
export const search_version = function (data: string) {
    return request({
        url: `/api/search_version`,
        method: 'get',
        params: data,

    })
}
