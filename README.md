### 后台管理系统

- 规范
    - 1.命名 
        - 变量以及i18nkey 采用蛇形命名)(下划线分隔 例如:post_user)
        - 方法使用驼峰(首字母小写,例如:editUser)
        - js文件使用驼峰(首字母小写,例如:getDate)
        - vue使用驼峰(首字母大写写,例如:User)
```
正式环境运行
cp .env.example .env.production
本地运行
cp .env.example .env.development

运行:
npm install 
npm run serve
打包:
npm run build
```
```
目录树
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
├── src
│   ├── App.vue
│   ├── api                     
│   ├── assets
│   │   ├── css
│   │   ├── img
│   ├── components
│   │   ├── common
│   │   │   ├── Bread.vue
│   │   │   ├── Header.vue
│   │   │   ├── Home.vue
│   │   │   ├── Sidebar.vue     // 侧边栏菜单
│   │   │   ├── Tags.vue
│   │   │   ├── TreeMenu.vue
│   │   │   ├── bus.js
│   │   │   ├── directives.js
│   │   │   └── i18n           // 中英文
│   │   └── page               // 页面
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   └── utils
│       └── request.js
└── vue.config.js

```
- 权限页面
    - 设计
        - 三层设计,上层为侧边栏目录为两层接口，最下层为按钮级
        - 权限采用唯一key 标识, 统一通过has_permission 方法获取是否有权限
