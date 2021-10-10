import axios from 'axios';
import { CandlestickChartConfig } from './stock/Stock'

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

/**获取个股k线 */
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
