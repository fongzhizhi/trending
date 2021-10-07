/**
 * 获取价格指数
 */
export function getPriceIndex(basePrice: number, nowPrice: number, fixed: number = 2): number {
    return +(100 * (nowPrice / basePrice)).toFixed(fixed);
}

/**
 * 获取价格指数列表
 */
export function getPriceIndexs(prices: number[], basePrice: number = NaN, fixed: number = 2) {
    if(isNaN(basePrice)) {
        basePrice = prices[0];
    }
    const indexs: number[] = [];
    prices.forEach(price => {
        indexs.push(getPriceIndex(basePrice, price, fixed));
    });
    return indexs;
}