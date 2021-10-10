import { CandlestickChart, CandlestickChartConfig } from "../stock/Stock";

export function getCandleStickOption(configs: CandlestickChartConfig[]) {
    const dates: string[] = []; // 日期
    const data: number[][] = []; // k线数据
    configs.forEach(config => {
        dates.push(config.date);
        data.push([config.open, config.close, config.low, config.high])
    });
    return {
        /**日期列表 */
        dates,
        /**k线数据 */
        data,
    }
}

export function getCandleStickOption2(candles: CandlestickChart[]) {
    return getCandleStickOption(candles.map(item => item.config));
}