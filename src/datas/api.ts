import axios from 'axios';
import { CandlestickChartConfig } from '../stock/Stock'
import { StockMeta, StockSimpleMeta } from './localData';

// 请求地址
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;


interface KDataParams {
    code?: string;
    codes?: string[];
    start: string;
    end: string;
}
export interface KDataRes {
    [code: string]: CandlestickChartConfig[],
}

/**
 * 查询k线数据(支持多股查询)
*/
export function get_k_data_json(params: KDataParams) {
    return new Promise<KDataRes>((resolve, reject) => {
        axios.post('/get_k_data_json', Object.assign({}, params)).then((res: any) => {
            const data: KDataRes = {};
            for(let code in res.data) {
                data[code] = JSON.parse(res.data[code]);
            }
            resolve(data);
        }, err => {
            reject(err);
        });
    });
}

/**
 * 获取指定日期json格式的所有股票元数据
 * @param date 日期
 */
export function get_all_stock_json(date: string) {
    return new Promise<StockSimpleMeta[]>((resolve, reject) => {
        axios.get(`/get_all_stock_json/${date}`).then((res: any) => {
            resolve(res.data);
        }, err => {
            reject(err);
        });
    });
}

/**
 * 查询证券元信息
 * @param code 股票代码
 */
export function get_meta_info(code: string) {
    return new Promise<StockMeta[]>((resolve, reject) => {
        axios.get(`/get_all_stock_json/${code}`).then((res: any) => {
            resolve(res.data);
        }, err => {
            reject(err);
        });
    });
}