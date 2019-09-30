<template>
    <div class="whiteBack" style="text-align:center;">
        <div class="loading_box">
            <div class="animation" ref="loadingAnimation"></div>
            <div class="font">{{type == 'recharge' ? '交易处理中…' : '拼命加载中…'}}</div>
        </div>
        <tipLayer ref="tipLayer"></tipLayer>
    </div>
</template>
<style scoped src="./scLoading.css">
</style>
<script>
export default {
    name: 'scLoading',
    data () {
        return {
            userBankInfo : '',
            type : '',
            userInfo : {},
            query : '',
            requestNo : ''
        }
    },
    created:function () {
        var _this = this;
        var query = this.$route.query;
        this.type = query.type;
        this.requestNo = query.requestNo;
        //this.query = decodeURIComponent(window.location.search());
        switch(this.type){
            case 'open':{
                _this.getUserInfo();
                break;
            }
            case 'active':{
                _this.getUserInfo();
                break;
            }
            case 'changeBank':{
                _this.getModifyBankResule();
                break;
            }
            case 'modifyMobile':{
                _this.getModifyMobileResule();
                break;
            }
            case 'resetPW':{
                _this.getModifyPWResule();
                break;
            }
            case 'withdraw':{
                _this.getWithdrawResule();
                break;
            }
            case 'recharge':{
                _this.getRechargeResule();
                break;
            }
        }
    },
    mounted : function(){
        lottie.loadAnimation({
            container: this.$refs.loadingAnimation, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/static/js/loading.json' // the path to the animation json
        });
    },
    methods: {
        handlerFail(textStatus, sourcePage){
            var _this = this;
            _this.$router.replace({
                name : 'failPage',
                query : {
                    type : (textStatus == 'timeout' ? 'timeout' : 'noNet'),
                    sourcePage : sourcePage,
                }
            })
        },
        //开通激活 轮询
        getUserInfo(){
            var _this = this,
                requestCount = 0,
                userAjax = null;;
            var timer = setInterval(function(){
                if(userAjax != null) userAjax.abort();
                requestCount++;
                if(requestCount > 5){
                    window.clearInterval(timer);

                    _this.$router.replace({
                        name : 'failPage',
                        query : {
                            type : _this.type,
                            sourcePage : _this.type
                        }
                    })
                }else{
                    userAjax = $.ajax({
                        url : _this.utils.AJAXDOMAINNAME+"/wap/getAccountState",
                        error : function(XMLHttpRequest, textStatus){
                            if(requestCount == 5){

                                window.clearInterval(timer);
                                _this.handlerFail(textStatus, _this.type)
                            }
                        },
                        success : function(res){
                            if(res.code==1 && res.data*1 != 200 && requestCount == 5){
                                window.clearInterval(timer);

                                _this.$router.replace({
                                    name : 'failPage',
                                    query : {
                                        type : _this.type,
                                        sourcePage : _this.type
                                    }
                                })
                            }if(res.code==1 && res.data*1 == 200){
                                window.clearInterval(timer);

                                _this.$router.replace({
                                    name : 'successPage',
                                    query : {
                                        type : _this.type
                                    }
                                })
                            }else if(res.code != 1 && requestCount == 5){
                                window.clearInterval(timer);

                                _this.$router.replace({
                                    name : 'handlerPage',
                                    query : {
                                        type : _this.type
                                    },
                                    params : {
                                        errorStips : res.message
                                    }
                                })
                            }
                        }
                    })
                }
            },2000)
        },
        //修改银行卡 轮询
        getModifyBankResule(){
            var _this = this,
                requestCount = 0,
                ajax = null;

            var timer = setInterval(()=>{
                if(ajax != null) ajax.abort();
                requestCount++;
                ajax = $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+"/wap/changeBindBankResult",
                    data : JSON.stringify({
                        requestNo : _this.requestNo
                    }),
                    error : function(XMLHttpRequest, textStatus){
                        if(requestCount == 5){
                            window.clearInterval(timer);
                            _this.handlerFail(textStatus, _this.type)
                        }
                    },
                    success : function(res){
                        if(res.code*1==1){
                            if(res.data.result == '0' && requestCount == 5){
                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'handlerPage',
                                    query : {
                                        type : 'changeBank'
                                    }
                                })
                            }else if(res.data.result == '1'){
                                window.clearInterval(timer);
                                var accountBalanceIs0 = false;
                                $.ajax({
                                    url : _this.utils.AJAXDOMAINNAME+"/wap/getAccountBalance",
                                    async : false,
                                    error : function(){
                                        _this.changeBankHandler();
                                    },
                                    success : function(res){
                                        if(res.code*1==1){
                                           if(res.data.accountBalance*1 == 0){
                                               _this.$router.replace({
                                                   name : 'changeSuccess',
                                                   query : {
                                                       type : 'changeBankSuc'
                                                   }
                                               })
                                               accountBalanceIs0 = true;
                                               return false;
                                           }else{
                                               _this.changeBankHandler();
                                           }
                                       }else{
                                           _this.changeBankHandler();
                                       }
                                    }
                                })

                            }else if(res.data.result == '2'){
                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'failPage',
                                    query : {
                                        type : 'changeBank',
                                        sourcePage : 'changeBank'
                                    },
                                    params : {
                                        errorStips : res.data.failMsg
                                    }
                                })
                            }

                        }
                    }
                })
            },2000)
        },
        changeBankHandler(){
            this.$router.replace({
                name : 'changeSuccess',
                query : {
                    type : 'changeBank'
                }
            })
        },
        //修改手机号 轮询
        getModifyMobileResule(){
            var _this = this,
                requestCount = 0,
                ajax = null;
            var timer = setInterval(()=>{
                if(ajax != null) ajax.abort();
                requestCount++;
                ajax = $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+"/wap/changeBindBankPhoneResult",
                    data : JSON.stringify({
                        requestNo : _this.requestNo
                    }),
                    error : function(XMLHttpRequest, textStatus){
                        if(requestCount == 5){
                            window.clearInterval(timer);
                            _this.handlerFail(textStatus, _this.type)
                        }
                    },
                    success : function(res){
                        if(res.code==1){
                            if(res.data.result == '0' && requestCount == 5){
                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'handlerPage',
                                    query : {
                                        type : 'mobile'
                                    }
                                })
                            }else if(res.data.result == '1'){
                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'changeSuccess',
                                    query : {
                                        type : 'mobile'
                                    }
                                })
                            }else if(res.data.result == '2'){
                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'failPage',
                                    query : {
                                        type : 'mobile',
                                        sourcePage : 'mobile'
                                    },
                                    params : {
                                        errorStips : res.data.failMsg
                                    }
                                })
                            }

                        }
                    }
                })

            },2000)
        },
        //修改支付密码 轮询
        getModifyPWResule(){
            var _this = this;
            var timer = setTimeout(()=>{
                window.clearTimeout(timer);
                _this.$router.replace({
                    name : 'changeSuccess',
                    query : {
                        type : 'resetPW'
                    }
                })

            },2000)
        },
        //充值结果 轮询
        getRechargeResule(){
            var _this = this,
                requestCount = 0,
                ajax = null;
            /*ajax = $.ajax({
                url : _this.utils.AJAXDOMAINNAME+"/wap/depositoryRechargeResult",
                data : JSON.stringify({
                    requestNo : _this.requestNo
                }),
                success : function(res){
                    if(res.code==1){
                        _this.$router.replace({
                            name : 'rechargeHandler',
                            query : res.data
                        })
                    }else{
                        _this.$refs.tipLayer.showLayer(2,res.message)
                    }
                }
            })*/

            var timer = setInterval(()=>{
                if(ajax != null) ajax.abort();
                requestCount++;
                ajax = $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+"/wap/depositoryRechargeResult",
                    data : JSON.stringify({
                        requestNo : _this.requestNo
                    }),
                    error : function(XMLHttpRequest, textStatus){

                        window.clearInterval(timer);
                        _this.$router.replace({
                            name : 'handlerPage',
                            query : {
                                type : 'recharge',
                                requestNo : _this.requestNo
                            }
                        })
                    },
                    success : function(res){
                        if(res.code==1){
                            if(res.data.result*1 == 0 && requestCount == 3){//处理中

                                window.clearInterval(timer);
                                res.data['requestNo'] = _this.requestNo;
                                _this.$router.replace({
                                    name : 'rechargeHandler',
                                    query : res.data
                                })
                            }else if(res.data.result*1 == 1){//成功

                                window.clearInterval(timer);
                                _this.$router.replace({
                                    name : 'changeSuccess',
                                    query : {
                                        type : 'recharge',
                                        chargeAmount : res.data.amount,
                                        requestNo : _this.requestNo
                                    }
                                })
                            }else if(res.data.result*1 == 2){//失败
                                window.clearInterval(timer);

                                _this.$router.replace({
                                    name : 'failPage',
                                    query : {
                                        type : 'recharge',
                                        sourcePage : 'recharge',
                                        requestNo : _this.requestNo
                                    },
                                    params : {
                                        errorStips : res.data.failMsg
                                    }
                                })
                            }
                        }
                    }
                })

            },5000)

        },
        //提现结果 轮询
        getWithdrawResule(){
            var _this = this,
                requestCount = 0,
                ajax = null;

            $.ajax({
                url : _this.utils.AJAXDOMAINNAME+"/wap/getWithdrawOrder",
                data : JSON.stringify({
                    requestNo : _this.requestNo
                }),
                error : function(){

                    setTimeout(()=>{
                        this.$router.replace({
                            name : 'handlerPage',
                            query : {
                                type : 'withdraw',
                                requestNo : _this.requestNo
                            }
                        })
                    },2000)
                },
                success : function(res){
                    if(res.code==1){

                        res.data['requestNo'] = _this.requestNo;
                        setTimeout(()=>{
                            _this.$router.replace({
                                name : 'withdrawSuc',
                                query : res.data
                            })
                        },2000)
                    }else{

                        /*this.$router.replace({
                            name : 'handlerPage',
                            query : {
                                type : 'withdraw'
                            }
                        })*/
                        _this.$refs.tipLayer.showLayer(2,res.message)

                    }
                }
            })
        }
    }
}
</script>
