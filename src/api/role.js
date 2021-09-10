import request from '../utils/request';


export function getRoles(form) {
    return request({
        method: 'get',
        url: `/v1/roles`,
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order
        }
    });
}

export function createRole(form) {
    return request({
        method: 'post',
        url: `/v1/roles`,
        data: {
            name: form.name
        }
    });
}

export function editRole(form) {
    return request({
        method: 'put',
        url: `/v1/roles/${form.id}`,
        data: {
            name: form.name
        }
    });
}

export function deleteRole(form) {
    return request({
        method: 'delete',
        url: `/v1/roles/${form.id}`
    });
}


