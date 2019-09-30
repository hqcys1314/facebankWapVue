<template>
    <div id="formPage" v-cloak class="whiteBack">
        <div class="absolute_content">
            <h2>银行限额列表</h2>
            <h3>温馨提示：<br/>建议选择支付限额较大的银行且已开通网银业务</h3>
            <div class="bank_list bank_list2" :style="!showBtn ? 'margin-bottom:0rem' : ''">
                <ul class="list">
                    <li v-for="(item, index) in bankList">
                        <img :src="'//static.facebank.cn/static/wapFront/common/images/bankIconNew/'+ (bankTrans(item.bankCode).imgName ? bankTrans(item.bankCode).imgName : 'default') +'.png'" />
                        <div class="info">
                            <h2><span>每笔{{item.bankMaxLimitForOnce | formatAmount}}，每日{{item.bankMaxLimitForDay | formatAmount}}</span>{{item.bankName}}</h2>
                            <div class="remark" v-if="item.note">{{item.note}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn_area type2" v-if="showBtn">
            <a href="javascript:;" class="btn_submit" @click="changeBankCard">更换银行卡</a>
        </div>
        <needActive ref="needActive"></needActive>
    </div>
</template>
<style src="assets/css/formPage.css"></style>
<script>
import {bankTrans} from 'tools';
export default {
    name: 'cardList',
    data(){
        return{
            userBaseInfoResult:"",

            bankList : [],
            bankTrans : {},
            showLayer : false,
            layerMask : false,

            informationLayerContent : '',
            showLayerStatus : false,

            showBtn : false,

        }
    },
    filters :{
        formatAmount(val){
            if(!val) return 0;
            val = Number(val)
            if(val / 10000 >= 1){
                return parseInt((val/10000)*100)/100 + '万';
                //return val / 10000 + '万'
            }else if(val / 10000 < 1){
                return val + ''
            }
        }
    },
    created:function () {
        var _this = this;
        this.bankTrans = bankTrans.bankTrans;
        this.showBtn = this.$route.query.f=="recharge" || this.$route.query.showBtn*1 != 0;
        $.ajax({
            url : this.utils.AJAXDOMAINNAME+ '/wap/getBankList',
            success : function(rs){
                if (rs.code*1 == 1) {
                    _this.bankList = rs.data.bankList;
                }else{
                    _this.informationLayerContent = rs.message;
                    _this.showLayerStatus = true;
                }
            }
        })
    },
    methods:{
        changeBankCard(){
            if(this.$route.query.f=="recharge" || this.$route.query.showBtn*1 == 0){
                if(!this.$refs.needActive.checkDepositoryStatus()) return false;
                setTimeout(()=>{
                    this.$router.push({
                        name : 'userBankInfo'
                    })
                },320)
            }else{
                window.history.go(-1)
            }
        }
    }
}
</script>
