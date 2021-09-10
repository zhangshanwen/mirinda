import request from '../utils/request';

export function getRoutes() {
    return request({
        method: 'get',
        url: `/v1/routes`
    });
}

