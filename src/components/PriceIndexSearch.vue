<template>
    <el-form
        ref="ref_form"
        :model="formModel"
        :rules="formRules"
        label-width="120px"
    >
    <el-form-item label="Date Range" prop="date_range">
        <el-col :span="10">
        <el-date-picker
            v-model="formModel.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            style="width: 100%"
            ></el-date-picker>
        </el-col>
    </el-form-item>

    <el-form-item label="DiffPrince Range" prop="diff_range">
        <el-col :span="10">
        <el-input-number v-model="formModel.diffMin" :step="10" />
        </el-col>
        <el-col :span="10">
        <el-input-number v-model="formModel.diffMax" :step="10" />
        </el-col>
    </el-form-item>

    <el-form-item label="Search Range" prop="search_range">
        <el-col :span="10">
        <el-input-number v-model="formModel.stratIndex" :step="100" />
        </el-col>
        <el-col :span="10">
        <el-input-number v-model="formModel.endIndex" :step="100" />
        </el-col>
    </el-form-item>

    <el-form-item>
        <el-button
        type="primary"
        @click="submitForm"
        >Apply</el-button
        >
    <el-button
        @click="resetForm"
    >Reset</el-button>
    </el-form-item>
    </el-form>

  <el-table
    :data="tableData"
    @row-dblclick="tableDBClick"
    :lazy="true"
    :default-sort="{ prop: 'ratio', order: 'ascending' }"
    stripe
    height="350px"
    style="width: 100%">
    <el-table-column prop="code" label="Code" />
    <el-table-column prop="stock_name" label="Stock Name" />
    <el-table-column prop="min" label="Min" sortable />
    <el-table-column prop="max" label="Max" sortable />
    <el-table-column prop="ave" label="Ave" sortable />
  </el-table>
</template>

<script lang="ts">
    import { ElMessage, ElLoading } from 'element-plus';
    import { Frequency, get_k_data_json, KDataRes } from '../datas/api'
    import { ref, reactive, nextTick } from 'vue'
    import EChart from './EChart.vue'
    import { dateFormat, getReferCode } from '../utils/utils'
    import { getAll_StockObj, StockMeta, StockType } from '../datas/localData';
    import { useRouter } from 'vue-router';
    import { RouterName } from '../router';
    import { getPriceIndexesByConfig } from '../analyze/trending-analyze';
    /**表单模型 */
    interface FormModel {
        /**日期范围 */
        dateRange: Date[];
        /**差价最小值 */
        diffMin: number,
        /**差价最大值 */
        diffMax: number,
        /**查询起点 */
        stratIndex: number,
        /**查询终点 */
        endIndex: number,
    };
    /**表单规则 */
    type FormRule<T> = {
        [P in keyof T]?: any[];
    };

    export default {
        components: {
            EChart
        },
        setup() {
            const router = useRouter();
            const ref_form = ref();
            const ref_ratio_pie = ref();
            /**表单模型 */
            const beforeDate = new Date();
            const nowDate = new Date();
            beforeDate.setFullYear(nowDate.getFullYear() - 5);
            const stratIndex = 200;
            const formModel: FormModel = reactive({
                dateRange: [beforeDate, nowDate],
                diffMin: -30,
                diffMax: 10000,
                stratIndex,
                endIndex: stratIndex + 100,
            });
            /**表单规则 */
            const formRules: FormRule<FormModel> = {
                dateRange: [{
                    required: true,
                    message: 'Please Pick Date range!',
                    trigger: 'blur',
                }]
            };
            let allStockObj: {
                [code: string]: StockMeta;
            } = {};

            /**重置表单 */
            const resetForm = () => {
                ref_form.value.resetFields();
            };
            /**表单提交 */
            const submitForm = async () => {
                // 消息检测
                const form = ref_form.value;
                const valid: boolean = await form.validate();
                if(!valid) {
                    ElMessage.error('Submit datas Error!');
                    return;
                }
                // loading
                const loading = ElLoading.service({
                    text: 'uploading in 0% ...',
                });
                // 发起请求
                const model: FormModel = form.model;
                const format = 'yyyy-MM-dd';
                // 数据太多了，批次查询
                allStockObj = getAll_StockObj(model.stratIndex, model.endIndex, (stock) => {
                    return stock.type != StockType.STOCK;
                });
                const allCodes = Object.keys(allStockObj);
                const queryStep = 5;
                const allRes: KDataRes = {};
                const total = allCodes.length;
                const start = dateFormat(format, model.dateRange[0]);
                const end = dateFormat(format, model.dateRange[1]);
                for(let i = 0; i < total; i+= queryStep) {
                    loading.setText(`uploading in ${(i / total * 100).toFixed(2)}% ...`);
                    const res = await get_k_data_json({
                        codes: allCodes.slice(i, i + queryStep),
                        start,
                        end,
                        frequency: Frequency.Day,
                    });
                    await nextTick();
                    Object.assign(allRes, res);
                }
                // 参考指数
                const referDatas = await get_k_data_json({
                    codes: [getReferCode('sh.'), getReferCode('sz.')],
                    start,
                    end,
                    frequency: Frequency.Day,
                });
                // 更新图例
                updateView(allRes, referDatas, model);
                loading.setText(`uploading in 100% ...`)
                loading.close();
            }

            interface TableItem {
                code: string;
                stock_name: string;
                min: number;
                max: number;
                ave: number;
            };
            /**表格数据 */
            const tableData = reactive<TableItem[]>([]);

            function tableDBClick(row: TableItem) {
                const model: FormModel = ref_form.value.model;
                const format = 'yyyy-MM-dd';
                router.push({
                    name: RouterName.PriceIndex,
                    params: {
                        code: row.code,
                        refer_code: getReferCode(row.code),
                        start: dateFormat(format, model.dateRange[0]),
                        end: dateFormat(format, model.dateRange[1])
                    },
                });
            }

            /**
            * 更新图例
            */
            function updateView(res: KDataRes, referDatas: KDataRes, model: FormModel) {
                // 表格详情
                updateTableView(res, referDatas, model);
            }

            function fixNum(n: number, p = 2) {
                return +n.toFixed(p);
            }

            /**更新表格 */
            function updateTableView(res: KDataRes, referDatas: KDataRes, model: FormModel) {
                const referPriceIndexesMap: {[code: string]: number[]} = {};
                for(let code in res) {
                    const item = res[code];
                    if(item.length == 0) {
                        continue;
                    }
                    const last = item[item.length - 1];

                    let min = Infinity, max = -Infinity, ave = 0;
                    const stockPriceIndexes = getPriceIndexesByConfig(item);
                    let referPriceIndexes = referPriceIndexesMap[last.code];
                    if(!referPriceIndexes) {
                        const referData = referDatas[getReferCode(last.code)];
                        referPriceIndexes = getPriceIndexesByConfig(referData);
                        referPriceIndexesMap[last.code] = referPriceIndexes;
                    }
                    stockPriceIndexes.forEach((p, index) => {
                        const diff_price = p - referPriceIndexes[index];
                        min = Math.min(min, diff_price);
                        max = Math.max(max, diff_price);
                        ave += diff_price;
                    });
                    ave /= item.length;

                    // 过滤
                    if(min < model.diffMin || max > model.diffMax) {
                        continue;
                    }

                    const stock = allStockObj[last.code];
                    const row: TableItem = {
                        code: last.code,
                        stock_name: stock.code_name,
                        min: fixNum(min),
                        max: fixNum(max),
                        ave: fixNum(ave),
                    };
                    tableData.push(row);
                }
            }

            return {
                formModel,
                formRules,
                ref_form,
                ref_ratio_pie,
                tableData,
                tableDBClick,
                resetForm,
                submitForm,
            } 
        }
    }
</script>