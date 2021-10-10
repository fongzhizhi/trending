class Stock {
    /**股票代码 */
    private readonly code: string = '';
}


/**
 * k线参数
 */
export interface CandlestickChartConfig {
    /**所属股票代码 */
    code: string;
    /**日期 */
    date: string;
    /**开盘价 */
    open: number;
    /**收盘价 */
    close: number;
    /**最高价 */
    high: number;
    /**最低价 */
    low: number;
    /**前收盘价 */
    preclose?: number;
    /**成交量 */
    volume?: number;
    /**复权状态(1：后复权， 2：前复权，3：不复权） */
    adjustflag: 1 | 2 | 3;
    /**成交额 */
    amount?: number;
    /**换手率 */
    turn?: number;
    /*是否正常交易状态 */
    tradestatus?: boolean;
    /**涨跌幅（百分比） */
    pctChg?: number;
    /**滚动市盈率 */
    peTTM?: number;
    /**市净率 */
    pbMRQ?: number;
    /**滚动市销率 */
    psTTM?: number;
    /**滚动市现率 */
    pcfNcfTTM?: number;
    /**是否ST股 */
    isST?: boolean;
}
/**
 * 蜡烛图 | k线
 */
export class CandlestickChart {
    readonly config: CandlestickChartConfig;

    constructor(config: CandlestickChartConfig) {
        this.config = config;
    }
}