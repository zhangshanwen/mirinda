import request from '../utils/request';


export function getUsers(form) {
    return request({
        method: 'get',
        url: `/v1/users`,
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order
        }
    });
}

export function createUser(form) {
    return request({
        method: 'post',
        url: `/v1/users`,
        data: {
            username: form.username,
            password: form.password
        }
    });
}

export function editUser(form) {
    return request({
        method: 'put',
        url: `/v1/users/${form.id}`,
        data: {
            username: form.username
        }
    });
}

export function deleteUser(operate_id) {
    return request({
        method: 'delete',
        url: `/v1/user/${operate_id}`
    });
}


export function resetUserPassword(operate_id) {
    return request({
        method: 'get',
        url: `/v1/user/password/reset/${operate_id}`
    });
}

export function changePassword(password) {
    return request({
        method: 'put',
        url: `/v1/user/password`,
        data: {
            password: password
        }
    });
}
