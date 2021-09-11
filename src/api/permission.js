import request from '../utils/request';


export function createPermission(form) {
    return request.post(`/v1/permissions`, {
        name: form.name,
        parent_id: form.parent_id,
        icon: form.icon,
        key: form.key,
        route_ids: form.route_ids

    });
}

export function getPermissions() {
    return request.get(`/v1/permissions`);
}

export function delPermissions(form) {
    return request.delete(`/v1/permissions/${form.id}`);
}

export function editPermissions(form) {
    return request.put(`/v1/permissions/${form.id}`, {
        name: form.name,
        parent_id: form.parent_id,
        icon: form.icon,
        key: form.key,
        route_ids: form.route_ids
    });
}
