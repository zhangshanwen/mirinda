<template>
    <div class="contain">
        <el-button class="save_button" type="primary" @click="clickSaveData" :disabled="save_disable">
            {{$t('i18n.save')}}
        </el-button>
        <el-card v-for="(group,index) in role_permissions" :key="index"
                 shadow="hover">
            <div slot="header">
                <el-checkbox v-model="group.is_checked" @change="permissionChange(group)"><b class="group_name">{{group.name}}</b>
                </el-checkbox>

            </div>
            <el-card v-for="item in group.children" class="permission_item" :key="item.id"
                     shadow="hover">
                <template #header>
                    <el-checkbox v-model="item.is_checked" @change="permissionChange(item)"><b class="nav_name">{{item.name}}</b>
                    </el-checkbox>
                </template>
                <div class="sub_permission_list" v-if="item.children.length">
                    <el-tag
                            class="sub_permission"
                            v-for="sub_item in item.children"
                            :key="sub_item.id"
                    >
                        <el-checkbox v-model="sub_item.is_checked" @change="permissionChange(sub_item)">
                            {{sub_item.name}}
                        </el-checkbox>
                    </el-tag>
                </div>
                <p
                        v-else
                        class="no_data"
                >{{$t('i18n.no_data')}}</p>
            </el-card>

        </el-card>
    </div>
</template>

<script>
    import { editRolePermissions, getRolePermissions } from '../../api/rolePermission';
    import lodash from 'lodash';

    export default {
        name: 'RolePermission',
        props: ['role_permissions'],
        data() {
            return {
                permission_ids: new Set(),
                old_permission_ids: new Set(),
                permission_obj: {},
                permission_array: [],
                save_disable: true
            };
        },
        methods: {
            loadData() {
                this.setPermissionIds(this.role_permissions);
                this.old_permission_ids = lodash.clone(this.permission_ids);
            },

            clickSaveData() {
                this.$confirm(this.$t('i18n.confirm_save_permission'), this.$t('i18n.prompt'), {
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            editRolePermissions(this.role_id, this.permission_ids).then(res => {
                                this.$message.success(this.$t('i18n.save_success'));
                                this.save_disable = true;
                                this.loadData();
                            }).catch(() => {
                            });
                        }
                        done();
                    }
                }).catch(() => {
                });
            },

            setPermissionIds(children) {
                children.forEach(item => {
                    this.permission_obj[item.id] = item;
                    this.permission_array.push(item);
                    if (item.is_checked) {
                        this.permission_ids.add(item.id);
                    }
                    this.setPermissionIds(item.children);
                });
            },

            checkedParents(item, is_checked) {
                if (item.parent_id === 0) {
                    return;
                }
                if (is_checked) {
                    this.permission_ids.add(item.parent_id);
                } else {
                    this.permission_ids.delete(item.parent_id);
                }
                this.permission_obj[item.parent_id].is_checked = is_checked;
                this.checkedParents(this.permission_obj[item.parent_id], is_checked);
            },
            checkedChildren(item, is_checked) {
                item.children.forEach((sub_item) => {
                    sub_item.is_checked = is_checked;
                    if (is_checked) {
                        this.permission_ids.add(sub_item.id);
                    } else {
                        this.permission_ids.delete(sub_item.id);
                    }
                    this.checkedChildren(sub_item, is_checked);
                });
            },
            checkedBrother(item, is_checked) {
                const every_same = this.permission_array.filter(brother => brother.parent_id === item.parent_id).map(item => item.is_checked).every(function(value, index, ar) {
                    return value === is_checked;
                });
                if (every_same) {
                    if (item.parent_id === 0) {
                        return;
                    }
                    if (is_checked) {
                        this.permission_ids.add(item.parent_id);
                    } else {
                        this.permission_ids.delete(item.parent_id);
                    }
                    this.permission_obj[item.parent_id].is_checked = is_checked;
                    this.checkedBrother(this.permission_obj[item.parent_id], is_checked);
                }
            },
            permissionChange(item) {
                if (item.is_checked) {
                    this.permission_ids.add(item.id);
                    // 如果当前元素被勾选，其子元素全部被勾选，其父元素被勾选依此往上
                    this.checkedParents(item, true);
                    this.checkedChildren(item, true);
                } else {
                    this.permission_ids.delete(item.id);
                    // 如果当前元素被取消，其子元素全部取消,
                    this.checkedChildren(item, false);
                    ////如果兄弟全军覆没，父节点也取消，依此往上
                    // this.checkedBrother(item, false);

                }
                this.setSaveDisable();
                this.$forceUpdate();
            },
            setSaveDisable() {
                let difference1 = new Set([...this.permission_ids].filter(x => !this.old_permission_ids.has(x)));
                let difference2 = new Set([...this.old_permission_ids].filter(x => !this.permission_ids.has(x)));
                this.save_disable = (difference1.size === 0) && (difference2.size === 0);
            }
        },
        watch: {
            role_permissions() {
                this.loadData();

            }
        }
    };
</script>

<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }

    .save_button {
        margin-bottom: 20px;
    }

    .permission_item {
        display: inline-block;
        width: 393px;
        height: 210px;
        margin: 0 20px 20px 0;
    }

    .nav_name {
        font-size: 14px;
        color: deepskyblue;

    }

    .group_name {
        font-size: 20px;
        color: orangered;
    }

    .sub_permission_list {
        height: 120px;
        overflow: auto;
    }

    .sub_permission {
        margin: 0 10px 10px 0;
        cursor: pointer;
    }


    .no_data {
        text-align: center;
        line-height: 100px;
        color: #999;
        font-size: 16px;
    }

</style>




