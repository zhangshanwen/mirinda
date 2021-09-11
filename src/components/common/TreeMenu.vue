<template>
    <div>
        <template v-for="(item, index) in menus">
            <el-submenu v-if="item.children && item.children.length" :index="item.index" :key="item.id">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                </template>
                <tree-menu :menus="item.children"></tree-menu>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.id">
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'treeMenu',
        props: ['menus'],
        computed: {}
    };
</script>

<style scoped>

</style>
