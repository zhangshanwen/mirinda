import request from '../utils/request';


export function login(username, password) {
    return request.post(`/v1/admins/login`, {
        username: username,
        password: password
    });
}
