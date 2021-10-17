<template>
    <el-form
      ref="ref_form"
      :model="formModel"
      :rules="formRules"
      label-width="120px"
    >
    <el-form-item label="Date Range" prop="dateRange">
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

    <el-form-item label="Frequency Type" prop="frequency">
      <el-col
        v-for="(item, i) in frequencyOptions"
        :key="i"
        :span="10">
        <el-radio
          v-model="formModel.frequency"
          :label="item"
          border
        >{{ item }}</el-radio>
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

  <hr>
  <EChart
    id="echart_ratio_pie"
    ref="ref_ratio_pie"
    height="300px"
  ></EChart>

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
    <el-table-column
      prop="stock_type"
      label="Stock Type"
      :filters="typeFilters"
      :filter-method="typeFilterHandle"
    />
    <el-table-column prop="min" label="Min" sortable />
    <el-table-column prop="max" label="Max" sortable />
    <el-table-column prop="ave" label="Ave" sortable />
    <el-table-column
      prop="ratio"
      label="Ratio"
      sortable
      :filters="ratioFilters"
      :filter-method="ratioFilterHandle"
    />
  </el-table>

</template>

<script lang="ts">
import { ElMessage, ElLoading } from 'element-plus';
import { Frequency, get_k_data_json, KDataRes } from '../datas/api'
import { ref, reactive, nextTick } from 'vue'
import EChart from './EChart.vue'
import { dateFormat } from '../utils/utils'
import { getAll_StockObj, StockType, toUsualStockType } from '../datas/localData';
import { useRouter } from 'vue-router';
/**表单模型 */
interface FormModel {
  /**日期范围 */
  dateRange: Date[];
  /**k线类型 */
  frequency: Frequency;
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
    beforeDate.setFullYear(nowDate.getFullYear() - 3);
    const formModel: FormModel = reactive({
      dateRange: [beforeDate, nowDate],
      frequency: Frequency.Mouth,
    });
    /**表单规则 */
    const formRules: FormRule<FormModel> = {
      dateRange: [
        {
          required: true,
          message: 'Please Pick Date range!',
          trigger: 'blur',
        }
      ]
    }
    const frequencyOptions = [Frequency.Day, Frequency.Week, Frequency.Mouth];

    /**重置表单 */
    const resetForm = () => {
      ref_form.value.resetFields();
    };
    const allStockObj = getAll_StockObj();
    /**表单提交 */
    const submitForm = async () => {
      // 消息检测
      const form = ref_form.value;
      const valid: boolean = await form.validate();
      if(!valid) {
        ElMessage.error('Submit datas Error!');
        return;
      }
      const timerName = 'query';
      console.time(timerName);
      // loading
      const loading = ElLoading.service({
        text: 'uploading in 0% ...',
      });
      // 发起请求
      const datas: FormModel = form.model;
      const format = 'yyyy-MM-dd';
      // 数据太多了，批次查询
      const allCodes = Object.keys(allStockObj);
      const queryStep = 10;
      const allRes: KDataRes = {};
      const total = allCodes.length;
      for(let i = 0; i < total; i+= queryStep) {
        loading.setText(`uploading in ${(i / total * 100).toFixed(2)}% ...`);
        const res = await get_k_data_json({
            codes: allCodes.slice(i, i + queryStep),
            start: dateFormat(format, datas.dateRange[0]),
            end: dateFormat(format, datas.dateRange[1]),
            frequency: datas.frequency,
        });
        await nextTick();
        Object.assign(allRes, res);
      }
      // 更新图例
      updateView(allRes);
      loading.setText(`uploading in 100% ...`)
      loading.close();
      console.timeEnd(timerName);
    }

    interface TableItem {
      code: string;
      stock_name: string;
      stock_type: string;
      min: number;
      max: number;
      ave: number;
      ratio: number;
    };
    /**表格数据 */
    const tableData = reactive<TableItem[]>([]);
    const typeFilters = reactive([
      {text: toUsualStockType(StockType.INDEX), value: toUsualStockType(StockType.INDEX)},
      {text: toUsualStockType(StockType.STOCK), value: toUsualStockType(StockType.STOCK)},
      {text: toUsualStockType(StockType.OTHER), value: toUsualStockType(StockType.OTHER)},
    ]);
    const typeFilterHandle = (value: string, row: TableItem) => {
      return row.stock_type === value;
    };
    const ratioFilters = (() => {
      const arr: {text: string, value: any}[] = [];
      const step = 20;
      for(let start = 0; start < 100; start += step) {
        const end = Math.min(start + step, 100);
        arr.push({
          text: `[${start}%, ${end}%]`,
          value: `${start/100}, ${end/100}`,
        });
      };
      return arr;
    })();
    const ratioFilterHandle = (value: string, row: TableItem) => {
      const arr = value.split(',');
      const start = parseFloat(arr[0]);
      const end = parseFloat(arr[1]);
      return start <= row.ratio && row.ratio <= end;
    };

    function tableDBClick(row: TableItem) {
      
      const model: FormModel = ref_form.value.model;
      const format = 'yyyy-MM-dd';
      router.push({
        name: 'one',
        params: {
          code: row.code,
          refer_code: row.code.startsWith('sh.') ? 'sh.000001' : 'sz.399106',
          start: dateFormat(format, model.dateRange[0]),
          end: dateFormat(format, model.dateRange[1])
        },
      });
    }

    /**
     * 更新图例
    */
    function updateView(res: KDataRes) {
       const ratioMap: {[k: string]: {value: number, name: string}} = {};
       // 表格详情
       updateTableView(res, ratioMap);
       // 区间范围统计图，均分为5份，统计每个区间的股票个数
       updatePieView(Object.values(ratioMap));
    }

    function fixNum(n: number, p = 2) {
      return +n.toFixed(p);
    }

    /**更新表格 */
    function updateTableView(res: KDataRes, ratioMap: {[k: string]: {value: number, name: string}}) {
      ratioFilters.forEach(item => {
        ratioMap[item.value] = {
          name: item.text,
          value: 0,
        };  
      });
      const stockTypeMap: {[k: string]: number} = {};
      typeFilters.forEach(item => {
        stockTypeMap[item.text] = 0;
      });
      for(let code in res) {
        const item = res[code];
        if(item.length == 0) {
          continue;
        }
        let min = Infinity, max = 0, ave = 0;
        item.forEach(i => {
          const price = i.close;
          min = Math.min(min, price);
          max = Math.max(max, price);
          ave += price;
        });
        ave /= item.length;
        const last = item[item.length - 1];
        const ratio = (max - min === 0) ? 0 : (last.close - min) / (max - min);
        const stock = allStockObj[last.code];
        const stock_type = toUsualStockType(stock.type);
        const row = {
          code: last.code,
          stock_name: stock.code_name,
          stock_type,
          min: fixNum(min),
          max: fixNum(max),
          ave: fixNum(ave),
          ratio: fixNum(ratio),
        };
        stockTypeMap[stock_type]++;
        for(let item of ratioFilters) {
          if(ratioFilterHandle(item.value, row)) {
            ratioMap[item.value].value ++;
            break;
          }
        } 
        tableData.push(row);
      }

      typeFilters.forEach(item => {
        item.text = `${item.text}[${stockTypeMap[item.text]}]`
      });
    }

    function updatePieView(data: any[]) {
      ref_ratio_pie.value.updateOptions({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: 'Stock Ratio From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data
            }
          ]
        });
    }

    return {
      formModel,
      formRules,
      ref_form,
      ref_ratio_pie,
      tableData,
      tableDBClick,
      typeFilters,
      typeFilterHandle,
      ratioFilters,
      ratioFilterHandle,
      frequencyOptions,
      resetForm,
      submitForm,
    } 
  }
}
</script>