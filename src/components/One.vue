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
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
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
  code: '11111',
  referCode: '22222',
  startDate: '2020-11-11',
  endDate: '2020-11-11',
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
      min: 5,
      max: 5,
      message: 'Length should be 5',
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
      min: 5,
      max: 5,
      message: 'Length should be 5',
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

export default {
  data() {
    return {
      formModel,
      formRules,
    }
  },
  methods: {
    async submitForm(formName: string) {
      const THIS: any = this;
      const form = THIS.$refs[formName];
      const valid: boolean = await form.validate();
      if(valid) {
        const datas: FormModel = form.model;
        ElMessage.success(datas.startDate);
      } else {
        ElMessage.error('Submit datas Error!')
      };
    },
    resetForm(formName: string) {
      const THIS: any = this;
      THIS.$refs[formName].resetFields();
    },
  },
}
</script>