<template>
    <div>
        <div class="contain">
            <el-button type="primary" @click="loadData()">{{$t('i18n.refresh')}}</el-button>
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
                <el-table-column :label="$t('field.path')"
                                 property="path"
                                 align="center">
                </el-table-column>

                <el-table-column :label="$t('field.method')"
                                 property="method"
                                 align="center">
                </el-table-column>
                <el-table-column :label="$t('field.created_time')"
                                 property="created_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>


</template>

<script>
    import { getRoutes } from '../../api/route';
    import Formatter from '../public/Formatter';

    export default {
        extends: Formatter,
        name: 'Route',
        data() {
            return {
                loading: false,
                table_data: []
            };
        },
        methods: {
            async loadData() {
                this.loading = true;
                getRoutes().then((res) => {
                        this.table_data = res.data.list;
                    }
                ).finally(() => {
                    this.loading = false;
                });
            }
        },
        created() {
            this.loadData();
        },
        computed: {}
    };
</script>

<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }


</style>



