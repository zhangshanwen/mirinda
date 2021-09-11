<template>
    <div>
        <div class="contain">
            <el-button type="primary" @click="loadData()">{{$t('i18n.search')}}</el-button>
            <el-button type="primary" v-if="new_btn_show" @click="clickNewData()">{{$t('i18n.new')}}</el-button>
            <el-divider></el-divider>
            <el-table
                    v-loading="loading"
                    :data="table_data"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column :label="$t('field.id')"
                                 property="id"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('field.username')"
                                 property="username"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('field.role')"
                                 align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="roleType(scope.row.role.name)">{{ scope.row.role.name === '' ?
                            $t('i18n.nothing') : scope.row.role.name}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('field.last_login_time')"
                                 property="last_login_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('field.updated_time')"
                                 property="updated_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('field.created_time')"
                                 property="created_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('i18n.role')"
                                 align="center" v-if="change_role_btn_show">
                    <template slot-scope="scope">
                        <el-button type="text" @click="clickChangeRole(scope.row)">{{$t('i18n.change')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('i18n.permission')"
                                 align="center" v-if="change_permission_btn_show">
                    <template slot-scope="scope">
                        <el-button type="text" @click=clickPermission(scope.row)>{{$t('i18n.change')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('i18n.operate')"
                                 align="center" v-if="rest_password_btn_show|| edit_btn_show || del_btn_show">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="rest_password_btn_show" @click="clickResetPassword(scope.row.id)">
                            {{$t('i18n.reset_password')}}
                        </el-button>
                        <el-button type="text" v-if="edit_btn_show" @click=clickEditData(scope.row)>
                            {{$t('i18n.edit')}}
                        </el-button>
                        <el-button type="text" v-if="del_btn_show" @click="clickDeleteData(scope.row.id)">
                            {{$t('i18n.delete')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='pagination.total > 0'
                                :page-sizes="pagination.page_size_array"
                                :page-size="pagination.page_size"
                                :layout="pagination.layout"
                                :total="pagination.total"
                                :current-page='pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog
                :title="is_edit? $t('i18n.edit'):$t('i18n.new')"
                :visible.sync="save_visible"
                width="30%"
                center>
            <el-form :model="form" :rules="rules">
                <el-form-item :label="$t('field.id')" v-if="is_edit">
                    <el-input disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('field.username')" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item v-if="!is_edit" :label="$t('field.password')" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>

            </el-form>

            <el-button @click="save_visible = false">{{$t('i18n.cancel')}}</el-button>
            <el-button v-if="is_edit" type="primary" :disabled="is_edit_disable" @click="editData()">
                {{$t('i18n.confirm')}}
            </el-button>
            <el-button v-else type="primary" :disabled="is_new_disable" @click="newData()">{{$t('i18n.confirm')}}
            </el-button>
        </el-dialog>
        <el-dialog :title="$t('i18n.delete')" :visible.sync="del_visible" width="20%">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="del_visible = false">{{$t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="deleteOne()">{{$t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('i18n.reset_password')" :visible.sync="reset_password_visible" width="20%">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reset_password_visible = false">{{$t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="resetPassword()">{{$t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('i18n.change_role')" :visible.sync="change_role_visible" width="20%">
            <div class="role_name">
                <el-tag effect="dark" :type="roleType(form.role_name)">{{ form.role_name === '' ?
                    $t('i18n.nothing') : form.role_name}}
                </el-tag>
            </div>
            <div class="role_options">
                <el-select ref="role_options" v-model="form.role_id" :loading="role_loading" @change="roleChange">
                    <el-option
                            v-for="item in role_options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="change_role_visible = false">{{$t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="saveRole()">{{$t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-drawer
                :title="$t('i18n.change_permission')"
                :visible.sync="change_permission_visible"
                direction="rtl"
                size="60%"
        >
            <role-permission :role_permissions="role_permissions"></role-permission>
        </el-drawer>
    </div>


</template>

<script>
    import { getAdmins, createAdmin, editAdmin, deleteAdmin, resetAdminPassword, changeRole } from '../../api/admin';
    import Formatter from '../public/Formatter';
    import { getRoles } from '../../api/role';
    import { getRolePermissions } from '../../api/rolePermission';
    import RolePermission from './RolePermission';

    export default {
        extends: Formatter,
        name: 'Admin',
        components: { RolePermission },
        data() {
            return {
                pagination: {
                    total: 0,
                    page_index: 1,
                    page_size: 20,
                    page_size_array: [10, 20, 50, 100, 300, 1000],
                    layout: 'total, sizes, prev, pager, next, jumper',
                    sort: 0,
                    order: 'id'

                },
                loading: false,
                save_visible: false,
                del_visible: false,
                reset_password_visible: false,
                change_role_visible: false,
                is_edit: false,
                role_loading: false,
                form: {
                    id: '',
                    username: '',
                    password: '',
                    role_name: '',
                    role_id: 0
                },
                table_data: [],
                rules: {
                    username: [{ required: true, message: this.$t('i18n.pls_input_username'), trigger: 'blur' }],
                    password: [{ required: true, message: this.$t('i18n.pls_input_password'), trigger: 'blur' }]
                },
                role_options: [],
                role_options_pagination: {
                    total: 0,
                    page_index: 1,
                    page_size: 20,
                    sort: 0,
                    order: 'id'
                },
                role_permissions: [],
                change_permission_visible: false
            };
        },
        methods: {
            async loadData() {
                this.loading = true;
                getAdmins(this.pagination).then(res => {
                        this.table_data = res.data.list;
                        this.pagination.total = res.data.pagination.total;
                    }
                ).catch(() => {
                }).finally(() => {
                    this.loading = false;
                });

            },
            clickNewData() {
                this.form = {
                    username: '',
                    password: '',
                    role_name: ''

                };
                this.save_visible = true;
                this.is_edit = false;
            },
            clickEditData(row) {
                this.form = {
                    id: row.id,
                    username: row.username,
                    row: row,
                    role_name: ''
                };
                this.save_visible = true;
                this.is_edit = true;
            },
            clickDeleteData(operate_id) {
                this.form = {
                    id: operate_id
                };
                this.del_visible = true;
            },
            clickResetPassword(operate_id) {
                this.form = {
                    id: operate_id
                };
                this.reset_password_visible = true;
            },
            clickChangeRole(row) {
                if (this.role_options.length === 0) {
                    this.initRoleOption();
                }
                this.form = {
                    id: row.id,
                    role_name: row.role.name,
                    role_id: row.role.id
                };
                this.change_role_visible = true;

            },
            clickPermission(row) {
                getRolePermissions(row.id).then(res => {
                    this.role_permissions = res.data.list;
                    this.change_permission_visible = true;

                }).catch(() => {

                });

            },
            newData() {
                createAdmin(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            editData() {
                editAdmin(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            deleteOne() {
                deleteAdmin(this.form).then((res) => {
                        this.del_visible = false;
                        this.loadData();
                    }
                );
            },
            resetPassword() {
                resetAdminPassword(this.form.id).then((res) => {
                        this.reset_password_visible = false;
                        this.$confirm(this.$t('i18n.password_reset_success') + ':' + res.data.password, this.$t('i18n.prompt'), {
                            type: 'warning',
                            beforeClose: (action, instance, done) => {
                                done();
                                this.loadData();
                            }
                        }).catch(() => {
                        });
                    }
                );
            },
            saveRole() {
                changeRole(this.form).then(res => {
                    this.loadData();
                }).catch(() => {

                }).finally(() => {
                    this.change_role_visible = false;
                });
            },
            roleChange(value) {
                this.$nextTick(() => {
                    this.form.role_name = this.$refs['role_options'].selectedLabel;
                });
            },
            // 每页多少条切换
            async handleSizeChange(page_size) {
                this.pagination.page_size = page_size;
                await this.loadData();
            },
            // 上下分页
            async handleCurrentChange(page) {
                this.pagination.page_index = page;
                await this.loadData();
            },
            roleType(name) {
                const remainder = name.length % 5;
                switch (remainder) {
                    case 1:
                        return 'success';
                    case 2:
                        return 'info';
                    case 3:
                        return 'danger';
                    case 4:
                        return 'warning';
                    default:
                        return '';
                }
            },
            loadRoles() {
                getRoles(this.role_options_pagination).then(res => {
                    if (res.data.list.length > 0) {
                        this.role_options_pagination.total = res.data.pagination.total;
                        this.role_options_pagination.page_index += 1;
                        this.role_options = this.role_options.concat(res.data.list);
                    }

                }).catch(() => {
                });
            },
            initRoleOption() {
                this.role_options_pagination = {
                    total: 0,
                    page_index: 1,
                    page_size: 20,
                    sort: 0,
                    order: 'id'
                };
                this.role_options = [];
                this.loadRoles();
            }
        },

        created() {
            this.loadData();
        },
        computed: {
            is_new_disable() {
                return this.form.username === '' || this.form.password === '';
            },
            is_edit_disable() {
                return this.form.username === '';
            },
            new_btn_show() {
                return this.$root.hasPermission('30_1_1631276859399');
            },
            edit_btn_show() {
                return this.$root.hasPermission('30_2_1631276890248');
            },
            del_btn_show() {
                return this.$root.hasPermission('30_3_1631276905329');
            },
            change_role_btn_show() {
                return this.$root.hasPermission('30_4_1631276938272');
            },
            change_permission_btn_show() {
                return this.$root.hasPermission('30_5_1631276967393');
            },
            rest_password_btn_show() {
                return this.$root.hasPermission('30_6_1631277265508');
            }


        },
        bind(el, binding) {
            const role_options = el.querySelector('.role_options');
            role_options.addEventListener('scroll', function() {
                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                if (condition) {
                    binding.value();
                }
            });

        }
    };
</script>

<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }

    .role_name {
        margin-bottom: 20px;
    }

    .role_options {
        margin-top: 20px;
    }

</style>



