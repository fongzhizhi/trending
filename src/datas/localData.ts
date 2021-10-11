import all_stock from './all_stock.json'

export enum StockTradeStatus {
    /**上市 */
    IPO = '1',
    /**退市 */
    OUT = '0',
}

export enum StockType {
    /**股票 */
    STOCK = '1',
    /**指数 */
    INDEX = '2',
    /**其他 */
    OTHER = '3',
}

/**股票元数据简单版 */
export interface StockSimpleMeta {
    /**股票代码 */
    code: string;
    /**股票状态 */
    tradeStatus: StockTradeStatus;
    /**股票名称 */
    code_name: string;
};

/**股票元数据完整版 */
export interface StockMeta {
    /**股票代码 */
    code: string;
    /**股票名称 */
    code_name: string;
    /**股票状态 */
    status: StockTradeStatus;
    /**股票类型 */
    type: StockType,
    /**上市日期 */
    ipoDate: string;
    /**退市日期 */
    outDate: string;
};

/**
 * 遍历所有股票合集
 * @param call 处理函数
 */
 export function iterateAllStock(call: (item: StockSimpleMeta) => boolean) {
    for(let item of all_stock) {
        if(!call.call(null, item as StockSimpleMeta)) {
            return;
        }
    }
}

let all_stockObj: {
    [code: string]: StockSimpleMeta;
} | null = {};
/**
 * 获取股票集合
 */
export function getAll_StockObj(max: number = Infinity, filterOut = true) {
    if(all_stockObj && (max === Infinity || Object.keys(all_stockObj).length === max)) {
        return all_stockObj;
    }
    all_stockObj = {};
    let i = 0;
    iterateAllStock((item) => {
        if(filterOut && item.tradeStatus === StockTradeStatus.OUT) {
            return true;
        }
        all_stockObj && (all_stockObj[item.code] = item);
        return ++i < max;
    });
    return all_stockObj;
}

/**
 * 获取所有上市股
 * @param max 获取的最大股票数量
 */
export function getAllIpoStockCodes(max: number = Infinity) {
    const list: string[]  = [];
    iterateAllStock((item) => {
        item.tradeStatus == StockTradeStatus.IPO && list.push(item.code);
        return list.length < max;
    });
    return list;
}