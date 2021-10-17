<template>
    <div
        :id="id"
        :style="{width: width, height: height}"
        v-show="show"
    ></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
/**导出 */
export default {
    props: {
        id: {
          type: String,
          default: 'echart_id',
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
        let show = ref(false);

        /**初始化表格 */
        const initChart = (id: string) => {
            if($chart || !show.value) {
                return;
            }
            const chart = document.getElementById(id);
            if(!chart) {
                return;
            }
            $chart = echarts.init(chart);
        };
        /**更新表格 */
        const updateOptions = async (ops?: string | Object) => {
            const ctx = !ops ? getCurrentInstance() : null;
            ops = ops || ctx?.props?.chart_option as string;
            if(ops) {
                if(!show.value) {
                    show.value = true;
                    await nextTick();
                }
                initChart(props.id);
                $chart?.setOption(typeof ops === 'string' ? JSON.parse(ops) : ops);
            }
        };
        onMounted(() => {
            updateOptions();
            window.addEventListener('resize', () => {
                $chart?.resize();
            });
        });

        return {
            updateOptions,
            show,
        }
    },
}
</script>