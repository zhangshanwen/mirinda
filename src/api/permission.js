import request from '../utils/request';


export function createPermission(form) {
    return request({
        method: 'post',
        url: `/v1/permissions`,
        data: {
            name: form.name,
            parent_id: form.parent_id,
            icon: form.icon,
            key: form.key,
            route_ids: form.route_ids

        }
    });
}

export function getPermissions() {
    return request({
        method: 'get',
        url: `/v1/permissions`
    });
}

export function delPermissions(form) {
    return request({
        method: 'delete',
        url: `/v1/permissions/${form.id}`
    });
}

export function editPermissions(form) {
    return request({
        method: 'put',
        url: `/v1/permissions/${form.id}`,
        data: {
            name: form.name,
            parent_id: form.parent_id,
            icon: form.icon,
            key: form.key,
            route_ids: form.route_ids
        }
    });
}
