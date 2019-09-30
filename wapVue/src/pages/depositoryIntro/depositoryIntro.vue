<template>
    <div class="depositoryIntro">
        <a href="javascript:;" class="font_close" @click="closeIntro()"></a>
        <div class="img_box"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/top_new_20181129.jpg" width="100%"></div>
        <div class="titles title_1"></div>
        <div class="contents">银行资金存管是指银行对平台的出借人与借款人开立和使用的资金存管账户进行管理和监督，依照出借人与借款人向平台发出的指令，对两者资金进行存管、划付、核算和监督，平台作为纯粹的信息中介参与到交易之中，全程不触碰资金，所有资金流动均在银行体系内进行，从而真正做到了平台与用户资金完全隔离，有效杜绝了平台支配和挪用用户资金的风险。</div>
        <div class="img_box"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/pic_1.jpg" width="100%"></div>
        <div class="titles title_2"></div>
        <div class="contents">新网银行成立于2016年6月，注册资本为30亿元,由新希望集团、小米、红旗连锁等股东发起设立。同时，新网银行也是截至目前国家批设的三家互联网银行之一，其余两家分别是腾讯微众银行和阿里网商银行。新网银行成立后，异军突起，营业不足两年便通过互联网拥有了超过1500万用户，累计放款超过900亿元。</div>
        <div class="img"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/pic_2.jpg" width="100%"></div>
        <div class="blank2rem"></div>
        <div class="titles title_3"></div>
        <div class="link_box">
        	<a href="/depositoryGuide/guideActivate1.html"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/link_1.jpg" width="100%" /></a>
        	<a href="/depositoryGuide/guideRecharge1.html"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/link_2.jpg" width="100%" /></a>
        	<a href="/depositoryGuide/guideWithdraw1.html"><img src="//static.facebank.cn/static/wapFront/depository/img/1minute/link_3.jpg" width="100%" /></a>
        </div>
        <div class="titles title_4"></div>
        <div class="ask_box">
        	<dl class="quest">
        		<dt></dt>
        		<dd>在开通（或激活）银行存管账户的过程中，最需要注意什么？</dd>
        	</dl>
        	<dl class="answer">
        		<dt></dt>
        		<dd>需要设置交易密码，请您务必牢记。</dd>
        	</dl>
        	<dl class="quest">
        		<dt></dt>
        		<dd>如果无法开通（或激活）银行存管账户怎么办？</dd>
        	</dl>
        	<dl class="answer">
        		<dt></dt>
        		<dd>请检查您的银行卡号和该银行卡的预留手机号是否正确，请确认该银行卡是否有挂失、注销、升降级或超出卡有效期等情况。如果排除以上原因后依旧无法开通（或激活），请联系笑脸存管服务专线：4008-900-766寻求帮助。</dd>
        	</dl>
        	<dl class="quest">
        		<dt></dt>
        		<dd>银行存管上线后，都支持绑定哪些银行卡？</dd>
        	</dl>
        	<dl class="answer">
        		<dt></dt>
        		<dd>目前支持以下银行：工商银行、农业银行、中国银行、建设银行、招商银行、兴业银行、民生银行、浦发银行、广发银行、北京银行、中信银行、华夏银行中国邮储、上海银行、光大银行、平安银行、交通银行、广州银行、杭州银行、宁波银行、江苏银行、恒丰银行、浙商银行、贵州银行、其他农商行。</dd>
        	</dl>
            <router-link class="view_more" :to="{ name: 'depositoryQa'}">查看更多 &gt;</router-link>
        </div>
        <a href="javascript:;" class="btn_tpls" v-if="!isLogin" @click="utils.toLogin('/depositoryIntro')">立即登录</a>

        <a href="javascript:;" class="btn_tpls" @click="toDepository('open')" v-if="isLogin && isOpen && !isOpened">{{typeFont}}银行存管账户</a>
        <a href="javascript:;" class="btn_tpls" @click="toDepository('active')" v-if="isLogin && !isOpen && !isOpened">{{typeFont}}银行存管账户</a>

        <needActive ref="needActive"></needActive>
        <tosat ref="tosat"></tosat>
    </div>
</template>
<style src="./depositoryIntro.css"></style>
<script>
//import {utils} from 'tools';

export default {
    name: 'depositoryIntro',
    data(){
        return{
            isLogin : false,
            isOpen : false,
            isOpened : false,
            userInfo : '',
            typeFont : ''
        }
    },
    created:function () {
        this.userInfo = this.utils.getUserInfo();
        this.isLogin = this.userInfo.isLogin;

        if(this.userInfo.info.accountState == '150' || this.userInfo.info.accountState == '160'){
            this.typeFont = '激活';
        }else{
            this.typeFont = '开通';
        }
        var _this = this;
        if(this.isLogin){
            if(this.userInfo.info.accountState*1 == 200){
                this.isOpened = true;
            }else if(this.userInfo.info.accountState*1 == 150){//四要素
                this.isOpen = false;
            }else if(this.userInfo.info.accountState*1 == 160 || this.userInfo.info.accountState*1 == 100){//二要素
                this.isOpen = true;
            }
        }
    },
    mounted : function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },
    methods : {
        closeIntro(){
            this.utils.closeWebView('/home');
        },
        checkAuthentication(){
            var _this = this;
            if(this.userInfo.info.hasIdValify == '0'){
                this.$refs.tosat.tosatShow({
                    msg : '请先完成实名',
                    time : 2
                }, function(){
                    _this.utils.newWebView('/authentication')
                })
                return false;
            }
            return true;
        },
        toDepository(type){
            if(!this.checkAuthentication()) return;
            this.$router.push({
                path : (type == 'open' ? '/depositoryOpen' : '/bindBankCard')
            })
        }
    },
    watch:{
        '$route':function(to,from){
　　　　　　　document.body.scrollTop = 0;
             document.documentElement.scrollTop = 0;
        }
    }
}
</script>
