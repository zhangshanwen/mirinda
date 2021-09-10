import { jsonencode, jsondecode } from './base64';

const permissions = 'permissions';

export function has_permission(key) {
    const permissions = get_permissions();
    if (!window.permission_cache) {
        window.permission_cache = {};
        for (let i = 0; i < permissions.length; i++) {
            const items = permissions[i];
            items.forEach((data) => {
                window.permission_cache[data.url_key] = data;
            });
        }
    }
    return !!window.permission_cache[key];
}

export function set_permissions(data) {
    localStorage.setItem(permissions, jsonencode(data));
}

export function get_permissions() {
    return jsondecode(localStorage.getItem(permissions));
}


