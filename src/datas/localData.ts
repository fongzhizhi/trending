import all_stock from './all_stock_meta.json'


const all_stock_loacl: {
    [code: string]: StockMeta
} = all_stock as any;

export enum StockTradeStatus {
    /**上市 */
    IPO = '1',
    /**退市 */
    OUT = '0',
}

export enum StockType {
    /**股票 */
    STOCK = 1,
    /**指数 */
    INDEX = 2,
    /**其他 */
    OTHER = 3,
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

export function toUsualStockType(type: StockType) {
    switch(type) {
        case StockType.INDEX:
            return '指数';
        case StockType.STOCK:
            return '股票';
        default:
            return '其他';
    }
}



export function getAll_StockObj(): {
    [code: string]: StockMeta
} {
    return all_stock_loacl;
}

/**
 * 获取股票元信息
 */
export function getStockMeta(code: string) {
    return all_stock_loacl[code];
}