<template>
    <div class="contain">
        <template>
            <div>
                <el-button type="success" v-if="new_btn_show" class="new"
                           @click="addPermission()">{{$t('i18n.new')}}
                </el-button>
            </div>
        </template>

        <el-card v-for="(group,index) in all_permission" :key="index"
                 shadow="hover">
            <div slot="header">
                <b class="group_name">{{group.name}}</b>
                <div style="float: right;">
                    <el-link
                            :underline="false"
                            v-if="new_btn_show"
                            @click="addPermission(group)"
                            type="success"
                            icon="el-icon-plus"
                    >{{$t('i18n.add')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            v-if="edit_btn_show"
                            type="text"
                            icon="el-icon-edit"
                            @click="editPermission(group)"
                    >{{$t('i18n.edit')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            v-if="del_btn_show"
                            type="text"
                            icon="el-icon-delete"
                            style="color:#F56C6C"
                            @click="disablePermission(group)"
                    >{{$t('i18n.delete')}}
                    </el-link>
                </div>
            </div>
            <el-card v-for="item in group.children" class="permission_item" :key="item.id"
                     shadow="hover">
                <template #header>
                    <b class="nav_name">{{item.name}}</b>
                    <div style="float: right;">
                        <el-link
                                :underline="false"
                                v-if="new_btn_show"
                                @click="addPermission(item)"
                                type="success"
                                icon="el-icon-plus"
                        >{{$t('i18n.add')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                v-if="edit_btn_show"
                                type="text"
                                icon="el-icon-edit"
                                @click="editPermission(item)"
                        >{{$t('i18n.edit')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                v-if="del_btn_show"
                                type="text"
                                icon="el-icon-delete"
                                style="color:#F56C6C"
                                @click="disablePermission(item)"
                        >{{$t('i18n.delete')}}
                        </el-link>
                    </div>
                </template>
                <div class="sub_permission_list" v-if="item.children.length">
                    <el-tag
                            class="sub_permission"
                            v-for="sub_item in item.children"
                            :key="sub_item.id"
                            :closable="del_btn_show"
                            @click="edit_btn_show?editPermission(sub_item):null"
                            @close="disablePermission(sub_item)"
                    >{{sub_item.name}}
                    </el-tag>
                </div>
                <p
                        v-else
                        class="no_data"
                >{{$t('i18n.no_data')}}</p>
            </el-card>

        </el-card>

        <el-dialog
                :title="setting_permission_title"
                :visible.sync="is_show_setting_permission_dialog"
                :close-on-click-modal="false"
        >
            <el-form
                    ref="post_permission_form"
                    :model="permission"
                    :rules="post_permission_rules"
                    label-width="120px"
            >
                <el-form-item :label="$t('field.name')" prop="name">
                    <el-input v-model="permission.name" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('field.key')" prop="key">
                    <el-input v-model="permission.key" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('field.icon')" prop="icon">
                    <el-select v-model="permission.icon"
                               collapse-tags filterable :placeholder="$t('i18n.pls_choose')">
                        <el-option
                                v-for="item in el_icon_options"
                                :key="item.value"
                                :value="item.value">
                            <i :class="item.value"></i>
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;
                    <i :class="permission.icon"></i>
                </el-form-item>
                <el-form-item label="路由" prop="route">
                    <el-select v-model="permission.route_ids" multiple
                               collapse-tags filterable :placeholder="$t('i18n.pls_choose')">
                        <el-option
                                v-for="item in all_route_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer class="dialog-footer">
                <el-button @click="is_show_setting_permission_dialog = false">{{$t('i18n.cancel')}}</el-button>

                <el-button type="primary" @click="saveData" :loading="submit_loading">{{$t('i18n.confirm')}}</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<script>
    import { createPermission, delPermissions, editPermissions, getPermissions } from '../../api/permission';
    import { getRoutes } from '../../api/route';
    import elIcons from '../../api/icon';

    export default {
        name: 'Permission',
        data() {
            return {
                all_route_options: [],
                is_show_permission_details_dialog: false,
                submit_loading: false,
                is_show_setting_permission_dialog: false,
                all_permission: [],
                post_permission_data: [],
                el_icon_options: elIcons,
                permission: {
                    id: null,
                    name: '',
                    icon: '',
                    route_ids: [],
                    key: '',
                    parent_id: 0
                },
                post_permission_rules: {
                    name: [
                        { required: true, message: this.$t('i18n.pls_input_permission_name'), trigger: 'blur' },
                        { min: 0, max: 20, message: this.$t('i18n.char_length_limit_20'), trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            async loadData() {
                getPermissions().then(res => {
                    this.all_permission = res.data.list;
                });
            },
            getRoutes() {
                getRoutes().then((res) => {
                    this.all_route_options = [];
                    res.data.list.forEach((item) => {
                        this.all_route_options.push({
                            label: `[${item.method}]${item.path}`,
                            value: item.id
                        });
                    });
                });
            },
            addPermission(data) {
                if (data) {
                    this.permission.parent_id = data.id;
                    this.permission.id = null;
                    this.permission.route_ids = [];
                    this.permission.key = `${data.id}_${data.children.length + 1}_${+new Date()}`;
                } else {
                    this.permission.parent_id = 0;
                    this.permission.id = null;
                    this.permission.route_ids = [];
                    this.permission.key = `${0}_${0}_${+new Date()}`;
                }
                this.is_show_setting_permission_dialog = true;
            },
            editPermission(data) {
                if (data) {
                    this.permission.parent_id = data.parent_id;
                    this.permission.id = data.id;
                    this.permission.key = data.key;
                    this.permission.icon = data.icon;
                    this.permission.route_ids = data.routes.map(route => route.id);
                    this.permission.name = data.name;
                }
                this.is_show_setting_permission_dialog = true;

            },
            async saveData() {
                this.submit_loading = true;
                this.$refs['post_permission_form'].validate(valid => {
                    if (valid) {
                        if (this.permission.id) {
                            editPermissions(this.permission).then(res => {
                                this.is_show_setting_permission_dialog = false;
                                this.$message.success(this.$t('i18n.success'));
                                this.loadData();
                            }).catch(() => {
                            });
                        } else {
                            createPermission(this.permission).then(res => {
                                this.is_show_setting_permission_dialog = false;
                                this.$message.success(this.$t('i18n.success'));
                                this.loadData();
                            }).catch(() => {
                            });
                        }

                    }
                });
                this.submit_loading = false;
            },
            disablePermission(data) {
                this.$confirm(data.parent_id ? this.$t('i18n.confirm_delete_btn_permission') :
                    this.$t('i18n.confirm_delete_page_permission'), this.$t('i18n.prompt'), {
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            delPermissions(data).then(res => {
                                this.$message.success(this.$t('i18n.delete_success'));
                                this.loadData();
                            }).catch(() => {
                            });
                        }
                        done();
                    }
                }).catch(() => {
                });
            }
        },
        created() {
            this.loadData();
            this.getRoutes();
        },
        computed: {
            setting_permission_title() {
                if (this.post_permission_data && this.post_permission_data.id) {
                    return this.$t('i18n.edit_permission');
                }
                return this.$t('i18n.add_permission');
            },
            new_btn_show() {
                return this.$root.hasPermission('22_1_1631171034438');
            },
            edit_btn_show() {
                return this.$root.hasPermission('22_3_1631263050215');
            },
            del_btn_show() {
                return this.$root.hasPermission('22_2_1631189149693');

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

    .new {
        margin-bottom: 20px;
    }

    .no_data {
        text-align: center;
        line-height: 100px;
        color: #999;
        font-size: 16px;
    }
</style>



