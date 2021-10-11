<template>
    <el-form
      ref="ref_form"
      :model="formModel"
      :rules="formRules"
      label-width="120px"
    >
    <el-form-item label="Stock Code" prop="code">
      <el-input v-model="formModel.code"></el-input>
    </el-form-item>

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

    <el-form-item label="Ratio Range">
      <el-col :span="11">
        <el-input-number
          prop="ratio_min"
          v-model="formModel.ratio_min"
          controls-position="right"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="1"
        />       
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-input-number
          prop="ratio_max"
          v-model="formModel.ratio_max"
          controls-position="right"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="1"
        /> 
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
  <el-table
    :data="tableData"
    stripe
    :default-sort="{ prop: 'ratio', order: 'ascending' }"
    height="400px"
    style="width: 100%">
    <el-table-column prop="code" label="Code" />
    <el-table-column prop="code_name" label="Code Name" />
    <el-table-column prop="min" label="Min" sortable />
    <el-table-column prop="max" label="Max" sortable />
    <el-table-column prop="ave" label="Ave" sortable />
    <el-table-column prop="ratio" label="Ratio" sortable />
  </el-table>

</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { get_k_data_json, KDataRes } from '../datas/api'
import { ref, reactive } from 'vue'
import EChart from './EChart.vue'
import { dateFormat } from '../utils/utils'
import { getAll_StockObj } from '../datas/localData';
/**表单模型 */
interface FormModel {
  /**个股代码 */
  code: string;
  /**参考指数代码 */
  referCode: string;
  /**日期范围 */
  dateRange: Date[];
  /**最小比例 */
  ratio_min: number;
  /**最大比例 */
  ratio_max: number;
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
    const ref_form = ref();
    /**表单模型 */
    const beforeDate = new Date();
    const nowDate = new Date();
    beforeDate.setFullYear(nowDate.getFullYear() - 2);
    const formModel: FormModel = reactive({
      code: 'sz.000510',
      referCode: 'sh.000001',
      dateRange: [beforeDate, nowDate],
      ratio_min: 0,
      ratio_max: 0.5,
    });
    /**表单规则 */
    const formRules: FormRule<FormModel> = {
      code: [
        {
          required: true,
          message: 'Please input stock Code!',
          trigger: 'blur',
        },
        {
          min: 9,
          max: 9,
          message: 'Length should be 9',
          trigger: 'blur',
        },
      ],
      referCode: [
        {
          required: true,
          message: 'Please input reference inde Code!',
          trigger: 'blur',
        },
        {
          min: 9,
          max: 9,
          message: 'Length should be 9',
          trigger: 'blur',
        },
      ],
      dateRange: [
        {
          required: true,
          message: 'Please Pick Date range!',
          trigger: 'blur',
        }
      ],
      ratio_min: [
        {
          required: true,
          message: 'Ratio Pick Date range!',
          trigger: 'blur',
        }
      ],
      ratio_max: [
        {
          required: true,
          message: 'Ratio Pick Date range!',
          trigger: 'blur',
        }
      ],
    }

    /**重置表单 */
    const resetForm = () => {
      ref_form.value.resetFields();
    };
    const allStockObj = getAll_StockObj(10);
    /**表单提交 */
    const submitForm = async () => {
      // 消息检测
      const form = ref_form.value;
      const valid: boolean = await form.validate();
      if(!valid) {
        ElMessage.error('Submit datas Error!');
        return;
      }
      // 发起请求
      const datas: FormModel = form.model;
      const format = 'yyyy-MM-dd';
      const postDate = {
          codes: Object.keys(allStockObj),
          start: dateFormat(format, datas.dateRange[0]),
          end: dateFormat(format, datas.dateRange[1]),
      };
      const res = await get_k_data_json(postDate);
      // 更新图例
      updateView(res, datas);
    }

    interface TableItem {
      code: string;
      code_name: string;
      min: number;
      max: number;
      ave: number;
      ratio: number;
    };
    /**表格数据 */
    const tableData = reactive<TableItem[]>([]);

    /**
     * 更新图例
    */
    function updateView(res: KDataRes, form: FormModel) {
       updateTableView(res, form);
       // 表格信息 股票代码 股票名称 时间范围 最小值 最大值 均值 当前所处区间
        
       // 区间范围统计图，均分为5份，统计每个区间的股票个数
    }

    function fixNum(n: number, p = 2) {
      return +n.toFixed(p);
    }

    /**更新表格 */
    function updateTableView(res: KDataRes, form: FormModel) {
      let index = 1;
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
        // 区间范围过滤
        if(!(ratio >= form.ratio_min || ratio <= form.ratio_max)) {
          continue;
        }
        tableData.push({
          code: last.code,
          code_name: allStockObj[last.code].code_name,
          min: fixNum(min),
          max: fixNum(max),
          ave: fixNum(ave),
          ratio: fixNum(ratio),
        });
      }
    }

    return {
      formModel,
      formRules,
      ref_form,
      resetForm,
      submitForm,
      tableData,
    } 
  }
}
</script>