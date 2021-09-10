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
                <el-table-column :label="$t('field.name')"
                                 property="name"
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
                        <el-button type="text" @click=clickEditData(scope.row)>{{$t('i18n.edit')}}</el-button>
                        <el-button type="text" @click=clickPermission(scope.row)>{{$t('i18n.permission')}}</el-button>
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
                :title="isEdit? $t('i18n.edit'):$t('i18n.new')"
                :visible.sync="save_visible"
                width="30%"
                center>
            <el-form :model="form" :rules="rules">
                <el-form-item :label="$t('field.id')" v-if="isEdit">
                    <el-input disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('field.name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

            </el-form>

            <el-button @click="save_visible = false">{{$t('i18n.cancel')}}</el-button>
            <el-button v-if="isEdit" type="primary" :disabled="isEditDisable" @click="editData()">{{$t('i18n.confirm')}}
            </el-button>
            <el-button v-else type="primary" :disabled="isNewDisable" @click="newData()">{{$t('i18n.confirm')}}
            </el-button>
        </el-dialog>
        <el-dialog :title="$t('i18n.delete')" :visible.sync="delVisible" width="20%">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="delVisible = false">{{$t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="deleteOne()">{{$t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>

    </div>


</template>

<script>
    import { getRoles, createRole, editRole, deleteRole } from '../../api/role';
    import Formatter from '../public/Formatter';

    export default {
        extends: Formatter,
        name: 'Role',
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
                delVisible: false,
                reset_password_visible: false,
                isEdit: false,
                form: {
                    id: '',
                    username: '',
                    password: ''
                },
                table_data: [],
                rules: {
                    name: [{ required: true, message: this.$t('i18n.pls_input_name'), trigger: 'blur' }]
                }
            };
        },
        methods: {
            async loadData() {
                this.loading = true;
                getRoles(this.pagination).then(
                    (res) => {
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
                    name: ''
                };
                this.save_visible = true;
                this.isEdit = false;
            },
            clickEditData(row) {
                this.form = {
                    id: row.id,
                    name: row.name,
                    row: row
                };
                this.save_visible = true;
                this.isEdit = true;
            },
            clickDeleteData(operate_id) {
                this.form = {
                    id: operate_id
                };
                this.delVisible = true;
            },
            clickPermission(row) {
                this.$router.push(`role/permission/${row.id}`);
            },
            newData() {
                createRole(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            editData() {
                editRole(this.form).then((res) => {
                        this.save_visible = false;
                        this.loadData();
                    }
                );
            },
            deleteOne() {
                deleteRole(this.form).then((res) => {
                        this.delVisible = false;
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
            isNewDisable() {
                return this.form.name === '';
            },
            isEditDisable() {
                return this.form.name === '';
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



