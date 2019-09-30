//全局变量
//跳转域名配置
const DOMAINNAME='https://m.facebank.cn';
//##SET##请求服务端域名配置
const AJAXDOMAINNAME=window.location.href.indexOf('localhost') > -1 ? '' : 'https://cic.facebank.cn';
//const AJAXDOMAINNAME='https://cic.facebank.cn';
//##SET##测试域名url配置test dev
const URLSET='test';

export default {
   DOMAINNAME,
   AJAXDOMAINNAME,
   URLSET,
};
