### 后台管理系统

- 规范
    - 1.命名 
        - 变量以及i18nkey 采用蛇形命名)(下划线分隔 例如:post_user)
        - 方法使用驼峰(首字母小写,例如:editUser)
        - js文件使用驼峰(首字母小写,例如:getDate)
        - vue使用驼峰(首字母大写写,例如:User)
```
cp .env.example .env.production
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
