//转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
exports.TranspondRules = {
    //目标服务器的ip和端口，域名也可，但注意不要被host了
    targetServer: {
        //dev
        //   'host': '10.1.1.14',
        //   'port': '25449',


        //testA
        //'host': '10.1.1.17',
        //'port': '25424',

        //testB
        'host': '10.1.1.37',
        'port': '25424',


        //testC
        // 'host': '10.1.1.36',
        // 'port': '25424',

        //灰度
        //'host': '10.168.1.21',
        //'port': '12028',

        //'host': 'cic.facebank.cn',

        // 'host': '10.1.1.14',
        // 'port': '25449',
    },
    //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
    regExpPath: {

    },
    'ajaxOnly': false,  // 是否只转发application/json请求
    'hackHeaders': true,  // 是否修改headers中的host,referer
    'attachHeaders': {
        'host': 'm.facebank.cn'
    }
};
