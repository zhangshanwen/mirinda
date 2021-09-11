import request from '../utils/request';


export function getAdmins(form) {
    return request.get(`/v1/admins`, {
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order
        }
    });
}

export function createAdmin(form) {
    return request.post(`/v1/admins`, {
        username: form.username,
        password: form.password
    });
}

export function editAdmin(form) {
    return request.put(`/v1/admins/${form.id}`, { username: form.username });
}

export function deleteAdmin(operate_id) {
    return request.delete(`/v1/user/${operate_id}`);
}


export function resetAdminPassword(operate_id) {
    return request.get(`/v1/admins/password/reset/${operate_id}`);
}

export function changePassword(password) {
    return request.put(`/v1/admins/password/change`, {
        password: password

    });
}

export function changeRole(form) {
    return request.put(`/v1/admins/roles/change/${form.id}`, {
        role_id: form.role_id
    });


}

