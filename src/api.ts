import axios from 'axios';

// 请求地址
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;


interface KDataParams {
    code?: string;
    codes?: string[];
    start: string;
    end: string;
}

interface KDataRes {
    [code: string]: {
        date: string;
        close: number;
    }
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
