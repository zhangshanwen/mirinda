import request from '../utils/request';


export function getUsers(form) {
    return request.get(`/v1/users`, {
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order
        }
    });
}

export function createUser(form) {
    return request.post(`/v1/users`, {
        username: form.username,
        password: form.password
    });
}

export function editUser(form) {
    return request.put(`/v1/users/${form.id}`, {
        username: form.username
    });
}

export function deleteUser(operate_id) {
    return request.delete(`/v1/user/${operate_id}`);
}


export function resetUserPassword(operate_id) {
    return request.get(`/v1/user/password/reset/${operate_id}`);
}

