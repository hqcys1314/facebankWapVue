<template>
    <div id="resule" class="white_background">
        <div class="error_img success"><img src="//static.facebank.cn/static/wapFront/depository/img/activeSuc.png" /></div>
        <div class="error_font">恭喜您，成功{{type == 'open' ? '开通' : '激活'}}银行存管账户</div>
        <div class="error_small">您的资金已完全存管于新网银行</div>
        <div class="blank88"></div>
        <router-link v-if="type != 'active'" class="btn_tpls" :to="{ name: 'myWelfare' }">查看我的福利</router-link>
        <a href="javascript:;" v-if="type == 'open'" class="btn_tpls2" @click="toAccount">返回我的账户</a>
        <a href="javascript:;" v-if="type != 'open'" class="btn_tpls" @click="toAccount">返回我的账户</a>
    </div>
</template>
<style src="assets/css/resule.css"></style>
<script>
export default {
    name: 'successPage',
    data () {
        return {
            type : ''
        }
    },
    created:function () {
        this.type = this.$route.query.type;
    },
    methods: {
        toAccount(){
            this.utils.toAccount();
        }
    }
}
</script>
