<template>
  <el-form
    ref="formModel"
    :model="formModel"
    :rules="formRules"
    label-width="120px"
    class="demo-formModel"
  >
    <el-form-item label="Stock Code" prop="code">
      <el-input v-model="formModel.code"></el-input>
    </el-form-item>

    <el-form-item label="Refer Code" prop="referCode">
      <el-input v-model="formModel.referCode"></el-input>
    </el-form-item>

    <el-form-item label="Date (start-end)" required>
      <el-col :span="11">
        <el-form-item prop="startDate">
          <el-date-picker
            v-model="formModel.startDate"
            type="date"
            placeholder="Pick a start date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="endDate">
          <el-date-picker
            v-model="formModel.endDate"
            placeholder="Pick a end date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('formModel')"
        >Apply</el-button
      >
      <el-button @click="resetForm('formModel')">Reset</el-button>
    </el-form-item>
  </el-form>

  <hr>
  <div id="chart"></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { get_k_data_json } from '../api'
import { getPriceIndex } from '../analyze/trending-analyze'
/**表单模型 */
interface FormModel {
  /**个股代码 */
  code: string;
  /**参考指数代码 */
  referCode: string;
  /**其实日期 */
  startDate: string;
  /**结束日期 */
  endDate: string;
};
const formModel: FormModel = {
  code: 'sh.600000',
  referCode: 'sh.000300',
  startDate: '2021-1-1',
  endDate: '2021-1-10',
};
/**表单规则 */
type FormRule<T> = {
    [P in keyof T]: any[];
};
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
  startDate: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a start date',
      trigger: 'change',
    },
  ],
  endDate: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a end date',
      trigger: 'change',
    },
  ],
}
// 初始化表格
const initChart = () => {
  const chart = document.getElementById('chart');
  if(!chart) {
      return;
  }
  return echarts.init(chart);
};

export default {
  data() {
    return {
      formModel,
      formRules,
      echart: undefined,
    }
  },
  methods: {
    async submitForm(formName: string) {
      const THIS: any = this;
      const form = THIS.$refs[formName];
      const valid: boolean = await form.validate();
      if(valid) {
        const datas: FormModel = form.model;
        const res = await get_k_data_json({
            codes: [datas.code, datas.referCode],
            start: datas.startDate,
            end: datas.endDate,
        });
        
        
      } else {
        ElMessage.error('Submit datas Error!')
      };
    },
    resetForm(formName: string) {
      const THIS: any = this;
      THIS.$refs[formName].resetFields();
    },
  },
  mounted() {
      this.$data.echart = initChart() as any;
  }
}
</script>

<style scoped>
    #chart {
        width: 100%;
        height: 400px;
    }
</style>