import request from '../utils/request';

export function getRoutes() {
    return request.get(`/v1/routes`);
}

const key2Path = {
    '1_0_21313131231': '/permission',
    '1_1_1631110079332': '/route',
    '28_1_1631260060784': '/user',
    '28_2_1631260069872': '/admin',
    '28_3_1631260121599': '/role'

};

export default key2Path;
