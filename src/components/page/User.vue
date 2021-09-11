<template>
    <div>
        <div class="contain">
            <el-button type="primary" @click="loadData()">{{$t('i18n.search')}}</el-button>
            <el-button type="primary" @click="clickNewData()">{{$t('i18n.new')}}</el-button>
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
                <el-table-column :label="$t('i18n.operate')"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="clickResetPassword(scope.row.id)">{{$t('i18n.reset_password')}}
                        </el-button>
                        <el-button type="text" @click=clickEditData(scope.row)>{{$t('i18n.edit')}}</el-button>
                        <el-button type="text" @click="clickDeleteData(scope.row.id)">{{$t('i18n.delete')}}</el-button>
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
            <el-button v-if="is_edit" type="primary" :disabled="is_edit_disable" @click="editData()">{{$t('i18n.confirm')}}
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

    </div>


</template>

<script>
    import { getUsers, createUser, editUser, deleteUser, resetUserPassword } from '../../api/user';
    import Formatter from '../public/Formatter';

    export default {
        extends: Formatter,
        name: 'User',
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
                is_edit: false,
                form: {
                    id: '',
                    username: '',
                    password: ''
                },
                table_data: [],
                rules: {
                    username: [{ required: true, message: this.$t('i18n.pls_input_username'), trigger: 'blur' }],
                    password: [{ required: true, message: this.$t('i18n.pls_input_password'), trigger: 'blur' }]
                }
            };
        },
        methods: {
            async loadData() {
                this.loading = true;
                getUsers(this.pagination).then(res => {
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
                    password: ''
                };
                this.save_visible = true;
                this.is_edit = false;
            },
            clickEditData(row) {
                this.form = {
                    id: row.id,
                    username: row.username,
                    row: row
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
            newData() {
                createUser(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            editData() {
                editUser(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            deleteOne() {
                deleteUser(this.form).then((res) => {
                        this.del_visible = false;
                        this.loadData();
                    }
                );
            },
            resetPassword() {
                resetUserPassword(this.form).then((res) => {
                        this.reset_password_visible = false;
                        this.loadData();
                    }
                );
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


</style>



