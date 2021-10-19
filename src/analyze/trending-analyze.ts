import { CandlestickChartConfig } from "../stock/Stock";

/**
 * 获取价格指数
 */
export function getPriceIndex(basePrice: number, nowPrice: number, fixed: number = 2): number {
    return +(100 * (nowPrice / basePrice)).toFixed(fixed);
}

/**
 * 获取价格指数列表
 */
export function getPriceIndexes(prices: number[], basePrice: number = NaN, fixed: number = 2) {
    if(isNaN(basePrice)) {
        basePrice = prices[0];
    }
    const indexes: number[] = [];
    prices.forEach(price => {
        indexes.push(getPriceIndex(basePrice, price, fixed));
    });
    return indexes;
}

/**
 * 获取价格指数列表
 */
 export function getPriceIndexesByConfig(config: CandlestickChartConfig[], basePrice: number = NaN, fixed: number = 2, fn?: (p: number) => void) {
    if(isNaN(basePrice)) {
        basePrice = config[0].close;
    }
    const indexes: number[] = [];
    config.forEach(item => {
        const p = getPriceIndex(basePrice, item.close, fixed);
        indexes.push(p);
        fn && fn.call(null, p);
    });
    return indexes;
}