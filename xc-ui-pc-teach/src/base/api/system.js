import http from './public'

let sysConfig = require('@/../config/sysConfig');
let apiUrl = sysConfig.xcApiUrlPre;
/*数据字典*/
export const sys_Dictionary = (dType) => {
  return http.requestQuickGet(apiUrl + '/sys/dictionary/' + dType);
};
/*获取jwt令牌*/
export const getjwt = () => {
  return http.requestQuickGet('/openapi/auth/userjwt')
};
