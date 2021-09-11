import request from '../utils/request';


export function getRolePermissions(roleId) {
    return request.get(`/v1/roles/permissions/${roleId}`);
}

export function editRolePermissions(roleId, permission_ids) {
    return request.put(`/v1/roles/permissions/${roleId}`, {
            permission_ids: Array.from(permission_ids)
        }
    );
}

