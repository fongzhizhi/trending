<template>
    <h2>PriceRange</h2>
    <p>Input</p>
    <pre>
    1.股票代码
    2.时间范围(eg.1年)
    3.过滤条件
        ?排除st股票
        ?设置价格区间范围，默认0-100%
    </pre>
    <p>Output</p>
    <pre>
    1.表格信息
        + 股票代码 股票名称 时间范围 最小值 最大值 均值 当前所处区间
        + 可排序
    2.统计图
        + 区间范围统计图，均分为5份，统计每个区间的股票个数
    </pre>
    <hr>
    <el-form
    ref="ref_candle_form"
    :model="formModel"
    :rules="formRules"
    label-width="120px"
  >
    <el-form-item label="Stock Code" prop="code">
      <el-input v-model="formModel.code"></el-input>
    </el-form-item>

    <el-form-item label="Refer Code" prop="referCode">
      <el-input v-model="formModel.referCode"></el-input>
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
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { get_k_data_json } from '../datas/api'
import { ref, Ref, reactive } from 'vue'
import { getCandleStickOption, getPriceIndexOptions } from '../echarts/utils'
import { CandlestickChartConfig } from '../stock/Stock'
import EChart from './EChart.vue'
import { dateFormat } from '../utils/utils'
/**表单模型 */
interface FormModel {
  /**个股代码 */
  code: string;
  /**参考指数代码 */
  referCode: string;
  /**日期范围 */
  dateRange: Date[];
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
    const ref_candle_form = ref();
    /**表单模型 */
    const beforeDate = new Date();
    const nowDate = new Date();
    beforeDate.setDate(nowDate.getDate() - 30);
    const formModel: FormModel = reactive({
      code: 'sz.000510',
      referCode: 'sh.000001',
      dateRange: [beforeDate, nowDate],
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
    }

    /**重置表单 */
    const resetForm = () => {
      ref_candle_form.value.resetFields();
    };
    /**表单提交 */
    const submitForm = async () => {
      // 消息检测
      const form = ref_candle_form.value;
      const valid: boolean = await form.validate();
      if(!valid) {
        ElMessage.error('Submit datas Error!');
        return;
      }
      // 发起请求
      const datas: FormModel = form.model;
      const format = 'yyyy-MM-dd';
      const postDate = {
          codes: [datas.code, datas.referCode],
          start: dateFormat(format, datas.dateRange[0]),
          end: dateFormat(format, datas.dateRange[1]),
      };
      const res = await get_k_data_json(postDate);
      // 更新图例
      
    }

    return {
      formModel,
      formRules,
      ref_candle_form,
      resetForm,
      submitForm,
    } 
  }
}
</script>