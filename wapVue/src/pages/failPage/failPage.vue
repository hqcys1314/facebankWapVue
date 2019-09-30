<template>
    <div id="resule" class="white_background">
        <div class="error_img fail" :class="errorType"><img :src="img[errorType]" /></div>
        <div class="error_font">{{parameFont != '' ? parameFont : errorFont[errorType]}}</div>
        <div class="error_small">{{errorTips[errorType] ? errorTips[errorType] : errorMessage}}</div>
        <div class="blank88"></div>
        <a href="javascript:;" class="btn_tpls" @click="retry">重试</a>
        <a href="javascript:;" class="btn_tpls2" @click="toAccount">返回我的账户</a>

        <contactUs></contactUs>
    </div>
</template>
<style src="assets/css/resule.css">
</style>
<script>
export default {
    name: 'fail',
    data () {
        return {
            errorType : 'fail',
            errorStype : '',
            parameFont : '',
            sourcePage : '',
            errorFont : {
                'open' : '很抱歉，银行存管账户开通失败',
                'active' : '很抱歉，银行存管账户激活失败',
                'noNet' : '网络错误',
                'timeout' : '网络超时',
                'recharge' : '充值失败',
                'withdraw' : '提现失败',
                'mobile' : '更换银行预留手机号失败',
                'changeBank' : '更换银行卡失败',
                'resetPW' : '重置存管交易密码失败',
            },
            title : {
                'open' : '开通存管',
                'active' : '激活存管',
                'noNet' : '网络错误',
                'timeout' : '网络超时',
                'recharge' : '充值失败',
                'withdraw' : '提现失败',
                'mobile' : '更换手机号',
                'changeBank' : '更换银行卡',
                'resetPW' : '重置交易密码',
            },
            errorTips : {
                //'open' : '系统出现异常，请重试',
                //'active' : '系统出现异常，请重试',
                'noNet' : '网络请求错误，请稍候重试',
                'timeout' : '请检查你的网络',
                //'mobile' : '系统出现异常，请重试',
                //'changeBank' : '系统出现异常，请重试',
                //'resetPW' : '系统出现异常，请重试',
            },
            errorMessage : '',
            retryPage : {

            },
            btn : '',
            img : {
                'open' : "//static.facebank.cn/static/wapFront/depository/img/lose.png",
                'active' : "//static.facebank.cn/static/wapFront/depository/img/lose.png",
                'noNet' : "//static.facebank.cn/static/wapFront/depository/img/noNet.png",
                'timeout' : "//static.facebank.cn/static/wapFront/depository/img/noNet.png",
                'recharge' : "//static.facebank.cn/static/wapFront/depository/img/lose.png",
                'withdraw' : '//static.facebank.cn/static/wapFront/depository/img/lose.png',
                'mobile' : '//static.facebank.cn/static/wapFront/depository/img/lose.png',
                'changeBank' : '//static.facebank.cn/static/wapFront/depository/img/lose.png',
                'resetPW' : '//static.facebank.cn/static/wapFront/depository/img/lose.png',
            },

        }
    },
    created:function () {
        this.errorType = this.$route.query.type;
        this.errorStype = this.$route.query.stype;
        this.sourcePage = this.$route.query.sourcePage;
        if(this.$route.params.errorStips){
            this.errorMessage = this.$route.params.errorStips
        }
    },
    methods: {
        retry(){
            var pageName;
            switch(this.sourcePage){
                case 'open' :{}
                case 'active' : {
                    this.utils.activeType(function(re){
                        if(re == 'isFour'){
                            pageName = 'bindBankCard';
                        }else if(re == 'isTwo'){
                            pageName = 'depositoryOpen';
                        }
                    })
                    break;
                }
                case 'recharge' : {
                    pageName = 'rechargeUI';
                    break;
                }
                case 'withdraw' : {
                    pageName = 'withdraw';
                    break;
                }
                case 'mobile' : {}
                case 'changeBank' : {}
                case 'resetPW' : {
                    pageName = 'depository';
                    break;
                }

            }
            this.$router.replace({
                name : pageName
            })
        },
        toAccount(){
            this.utils.toAccount();
        }
    },
    watch:{
        type(val){
            document.title=this.title[val];
        }
    }
}
</script>
