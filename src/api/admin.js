import request from '../utils/request';


export function getAdmins(form) {
    return request({
        method: 'get',
        url: `/v1/admins`,
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order
        }
    });
}

export function createAdmin(form) {
    return request({
        method: 'post',
        url: `/v1/admins`,
        data: {
            username: form.username,
            password: form.password
        }
    });
}

export function editAdmin(form) {
    return request({
        method: 'put',
        url: `/v1/admins/${form.id}`,
        data: {
            username: form.username
        }
    });
}

export function deleteAdmin(operate_id) {
    return request({
        method: 'delete',
        url: `/v1/user/${operate_id}`
    });
}


export function resetAdminPassword(operate_id) {
    return request({
        method: 'get',
        url: `/v1/admins/password/reset/${operate_id}`
    });
}

export function changePassword(password) {
    return request({
        method: 'put',
        url: `/v1/admins/password/change`,
        data: {
            password: password
        }
    });
}
