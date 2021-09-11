import { jsonencode, jsondecode } from './base64';

const permissions = 'permissions';
const MenusKey = 'PERMISSIONS_MENUS';

export function has_permission(key) {
    const permissions = get_permissions();
    if (!window.permission_cache) {
        window.permission_cache = {};
        for (let i = 0; i < permissions.length; i++) {
            const items = permissions[i];
            window.permission_cache[items] = items;
        }
    }
    return !!window.permission_cache[key];
}

export function setPermissions(data) {
    localStorage.setItem(permissions, jsonencode(data));
}

export function get_permissions() {
    return jsondecode(localStorage.getItem(permissions));
}


export function savePermissionMenus(data) {
    localStorage.setItem(MenusKey, JSON.stringify(data));
}

export function getPermissionMenus() {
    return JSON.parse(localStorage.getItem(MenusKey));
}
