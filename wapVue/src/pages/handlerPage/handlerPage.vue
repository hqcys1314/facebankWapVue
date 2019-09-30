<template>
    <div id="resule" class="white_background">
        <div class="error_img changeSuccess">
            <img src="//static.facebank.cn/static/wapFront/depository/img/shenhe.png" />
        </div>
        <div class="error_font">{{tips[type]}}</div>
        <div class="error_small" v-if="stips[type] != ''">{{stips[type]}}</div>
        <div class="blank88"></div>
        <a href="javascript:;" class="btn_tpls" @click="toAccount">返回我的账户</a>
        <div class="desc" v-if="type == 'changeBank'">
            提示<br>
            1、审核结果将以短信告知，请注意查收<br>
            2、审核通过后，您就可以使用新的银行卡了<br>
        </div>
    </div>
</template>
<style src="assets/css/resule.css"></style>
<script>
export default {
    name: 'handlerPage',
    data () {
        return {
            type : '',
            chargeAmount : 0,
            tips : {
                open : '开通存管账户处理中',
                active : '激活存管账户处理中',
                changeBank : '更换申请处理中',
                recharge : '充值处理中',
                mobile : '更换银行预留手机号处理中',
                resetPW : '重置存管交易密码处理中',
                withdraw : '提现申请处理中',
            },
            stips : {
                open : '',
                active : '',
                changeBank : '我们会在1个工作日内审核完成',
                recharge : '预计５分钟内完成充值，请及时关注笑脸账户余额变动',
                mobile : '',
                resetPW : '',
                withdraw : '预计5分钟内可提交提现申请',
            }
        }
    },
    created:function () {
        this.type = this.$route.query.type;
    },
    methods: {
        toAccount(){
            this.utils.toAccount();
        }
    },
    watch:{
        type(val){
            document.title=this.tips[val].replace('处理中', '');
        }
    }
}
</script>
