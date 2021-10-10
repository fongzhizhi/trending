<template>
    <!--蜡烛图-->
    <div
        :id="id"
        :style="{width: width, height: height}"
    ></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { getCurrentInstance, onMounted } from 'vue'
/**初始化表格 */
const initChart = (id: string) => {
  const chart = document.getElementById(id);
  if(!chart) {
      return;
  }
  return echarts.init(chart);
};

/**导出 */
export default {
    props: {
        id: {
          type: String,
          default: 'echart_candle',
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '400px',
        },
        chart_option: {
            type: String,
            default: '',
        }
    },
    setup(props: any) {
        let $chart: echarts.ECharts | undefined = undefined;
        /**更新options */
        const updateOptions = (ops?: string | Object) => {
            const ctx = !ops ? getCurrentInstance() : null;
            ops = ops || ctx?.props?.chart_option as string;
            ops && $chart?.setOption(typeof ops === 'string' ? JSON.parse(ops) : ops);
        };
        onMounted(() => {
            $chart = initChart(props.id);
            updateOptions();
        });
        return {
            updateOptions,
        }
    },
}
</script>