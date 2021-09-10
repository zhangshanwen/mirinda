import request from '../utils/request';


export function login(username, password) {
    return request({
        method: 'post',
        url: `/v1/admins/login`,
        data: {
            username: username,
            password: password
        }
    });
}

export function logout() {
    return request({
        method: 'post',
        url: `/v1/admins/logout`
    });
}
