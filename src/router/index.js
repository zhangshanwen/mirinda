import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router);


export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/users'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: 'home' },
            children: [
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/User'),
                    meta: { title: 'user' }
                },
                {
                    path: '/admin',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Admin'),
                    meta: { title: 'admin' }
                },
                {
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Permission'),
                    meta: { title: 'permission' }
                },
                {
                    path: '/route',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Route'),
                    meta: { title: 'route' }
                },
                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Role'),
                    meta: { title: 'role' }
                },
                {
                    path: '/role/permission/:id',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/RolePermission'),
                    meta: { title: 'role_permission' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login'),
            meta: { title: 'login' }
        },
        { path: '*', redirect: '/404' }

    ]
});
