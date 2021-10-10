import { getPriceIndexs } from "../analyze/trending-analyze";
import { CandlestickChart, CandlestickChartConfig } from "../stock/Stock";

/**获取k线数据 */
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

/**获取价格指数数据 */
export function getPriceIndexOptions(configs: CandlestickChartConfig[]) {
    const dates: string[] = []; // 日期
    const prices: number[] = []; // 价格指数
    configs.forEach(config => {
        dates.push(config.date);
        prices.push(config.close);
    });
    return {
        /**日期列表 */
        dates,
        /**价格指数列表 */
        data: getPriceIndexs(prices),
    }
}