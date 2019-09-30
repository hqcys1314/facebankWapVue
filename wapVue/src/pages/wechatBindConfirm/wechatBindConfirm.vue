<template>
    <div id="resule" class="white_background">
        <div class="error_img"><img src="https://static.facebank.cn/static/wapFront/common/images/logo.png" /></div>
        <div class="error_font">笑脸金融</div>
        <div class="tips">申请获取你微信绑定的手机号码：<span>{{userInfo.mobile}}</span></div>
        <a href="javascript:;" class="btn_tpls" @click="bindWeChat()">确定绑定</a>
        <a href="javascript:;" class="cancleBtn" @click="cancleBind">取消</a>
        <smileLoading  :showSmileLoading.sync="loadingLayerStatus"></smileLoading>
        <tosat ref="tosat"></tosat>
    </div>
</template>
<style src="assets/css/resule.css"></style>
<style scoped="scoped">
#resule .error_img{height:3.5rem;padding:3rem 0 .75rem;}
#resule .error_font{font-size:1.125rem;line-height:1.5rem;padding-bottom:2rem;margin:0 1rem;border-bottom:1px solid #DFE3EB;}
#resule .tips{margin: 0 2.25rem;padding:1.25rem 0 1.78125rem;font-size:.875rem;line-height:1.5rem;color:#2B313D;font-weight:600;}
#resule .tips span{display:block;color:#848999;font-weight:normal;}
#resule .cancleBtn{width:50%;margin:0 auto;line-height:1.5rem; text-align:center;color:#848999;display: block;font-size:.875rem;}
</style>
<script>
export default {
    name: 'wechatBindConfirm',
    data () {
        return {
            userInfo : '',
            loadingLayerStatus : false,
        }
    },
    created:function () {
        this.userInfo = this.utils.getUserInfo().info;
        var _this = this;
        this.utils.setCookie('wechatOpenId', this.$route.query.weChatOpenId)
        this.utils.setCookieAll('wechatOpenId', this.$route.query.weChatOpenId)
    },
    methods: {
        cancleBind(){
            window.history.go(-1);
        },
        bindWeChat() {
            var _this = this;
            var wechatOpenId = this.utils.getCookie('wechatOpenId');
            var url = "https://weixin"+ this.utils.URLSET +".facebank.cn/index.php/Home/WebGetOpndId?authType=2&cburl=https%3a%2f%2fm.facebank.cn%2finformation";
            var url2 = "https://weixin"+ this.utils.URLSET +".facebank.cn/index.php/Home/WebGetOpndId?authType=2&cburl=https%3a%2f%2fm.facebank.cn%2fwechatBindConfirm";
            if(wechatOpenId != null && wechatOpenId != undefined && wechatOpenId != ''){
                _this.loadingLayerStatus = true;
                $.ajax({
                    url: this.utils.AJAXDOMAINNAME+"/wap/wechatUserBind",
                    data: JSON.stringify({
                        wechatOpenId: this.utils.getCookie('wechatOpenId')
                    }),
                    error:function(XMLHttpRequest, textStatus){
                        _this.loadingLayerStatus = false;
                        if(textStatus == 'error'){
                            _this.utils.toastFuc('网络请求错误，请稍候重试');
                        }else if(textStatus == 'timeout'){
                            _this.utils.toastFuc('网络请求超时，请稍候重试');
                        }
                    },
                    success: (res) => {
                        _this.loadingLayerStatus = false;
                        if(res.code*1 == 1){
                            _this.isBindWx = true;
                            if(res.data && res.data.nickname){
                                _this.utils.setCookie('_WeChatNickName',escape(res.data.nickname));
                                _this.utils.setCookieAll('_WeChatNickName',escape(res.data.nickname));
                                _this.utils.setCookie('_WeChatHeadImgLink',res.data.headimgurl);
                            }
                            setTimeout(function(){
                                window.location.href="/information"
                            },2000)
                        }else if(res.code*1 == -903){
                            _this.utils.setCookieAll('wechatOpenId', '', -1);
                            _this.utils.setCookie('wechatOpenId', '', -1);
                            _this.utils.setCookieAll('_WeChatNickName','',-1);
                            _this.utils.setCookie('_WeChatNickName','',-1);
                            _this.utils.setCookie('_WeChatHeadImgLink','',-1);
                            // _this.$refs.tosat.tosatShow({
                            //     msg : res.message,
                            //     time : 2
                            // }, function(){
                            //     window.location.href=url2;
                            //     window.event.returnValue=false;
                            // })
                            window.location.href=url2;
                            window.event.returnValue=false;
                            return;
                        }
                        _this.$refs.tosat.tosatShow({
                            msg : res.message,
                            time : 2
                        })
                    }
                })
            }else{
                window.location.href=url;
                window.event.returnValue=false;
            }
        },
    }
}
</script>
