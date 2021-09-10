import request from '../utils/request';


export function getRolePermissions(roleId) {
    return request({
        method: 'get',
        url: `/v1/roles/permissions/${roleId}`
    });
}

export function editRolePermissions(roleId, permission_ids) {
    return request({
        method: 'put',
        url: `/v1/roles/permissions/${roleId}`,
        data: {
            permission_ids: Array.from(permission_ids)
        }
    });
}

