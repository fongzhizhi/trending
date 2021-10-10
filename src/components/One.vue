<template>
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

  <hr>
  <!-- k线图 -->
  <EChart
    id="echart_candle_target"
    ref="ref_candle_target"
  ></EChart>
  <EChart
    id="echart_candle_ref"
    ref="ref_candle_ref"
  ></EChart>
  <!-- 价格指数合并图 -->
  <EChart
    id="echart_price_meger"
    ref="ref_price_meger"
  ></EChart>
  <!-- 价格指数差价图 -->
  <EChart
    id="echart_price_diff"
    ref="ref_price_diff"
  ></EChart>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { get_k_data_json } from '../api'
import { ref, Ref, reactive } from 'vue'
import { getCandleStickOption } from '../echarts/utils'
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
      code: 'sh.600000',
      referCode: 'sh.000300',
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
    // echarts相关
    const ref_candle_target = ref();
    const ref_candle_ref = ref();
    const ref_price_meger = ref();
    const ref_price_diff = ref();

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
      updateView(res[datas.code], res[datas.referCode]);
    }

    /**
     * 更新图例
     * @param targetData 目标股票k线数据
     * @param refData 参考股票k线数据
    */
    function updateView(targetData: CandlestickChartConfig[], refData: CandlestickChartConfig[]) {
      // k线
      updateCanldeView(ref_candle_target, targetData);
      updateCanldeView(ref_candle_ref, refData);
      // 价格指数合并

      // 价格指数差价
    }

    /**获取echats的k线options */
    function getEchartsCandleOptions(op: {
      xAxisData: any,
      seriesData: any,
      }) {
      return {
        xAxis: {
          data: op.xAxisData,
        },
        yAxis: {
          type: 'value',
          scale: true,
        },
        series: [{
          type: 'candlestick',
          data: op.seriesData,
        }],
      }
    }

    /**更新k线图 */
    function updateCanldeView(r: Ref, data: CandlestickChartConfig[]) {
      const d = getCandleStickOption(data);
      const p = getEchartsCandleOptions({
        xAxisData: d.dates,
        seriesData: d.data,
      });
      r.value.updateOptions(p);
    }

    return {
      formModel,
      formRules,
      ref_candle_form,
      ref_candle_target,
      ref_candle_ref,
      ref_price_meger,
      ref_price_diff,
      resetForm,
      submitForm,
    } 
  }
}
</script>