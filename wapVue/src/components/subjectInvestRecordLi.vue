<template>
    <li class="subject_li sensors-btn"
     sensors-name="散标列表_查看散标项目项目">
        <div class="box" @click="toDetailPage(listItem)">
            <div class="name">
                <span v-cloak :class="stateClass">{{stateText[listItem.orderState]}}</span>
                {{listItem.productName}}
            </div>
            <div class="money_info">
                <p>{{listItem.amount}}<small>成功出借(元)</small></p>
                <p>{{listItem.hasRepayTotalAmount || '0.00'}}<small>已还金额(元)</small></p>
                <p v-if="listItem.orderState*1 < 2">{{listItem.waitToCollectPrincipalAndProfit || '0.00'}}<small>待收本息(元)</small></p>
            </div>
        </div>
        <div class="tips">
            <i>您于 {{listItem.createTime}} 出借 {{listItem.investAmount}}元</i>
            <em>{{repaymentTypeFont[listItem.repaymentType]}}</em>
        </div>
        <div class="tips sensors-btn" v-if="listItem.failCreditAmount * 1 > 0" v-on:click="changeTipsShowHide"
         sensors-name="智能列表_散标项目说明-退款">
            <span :class="tipsClass"></span>
            <div class="title" v-show="showThisTips">流标退款(元）: {{listItem.failCreditAmount}}</div>
            <div class="desc" v-show="showThisDesc">流标退款(元）: {{listItem.failCreditAmount}}<small>借款标的放款失败，({{listItem.failCreditAmount}}元)已退回至您的账户中</small></div>
        </div>
    </li>
</template>
<script>
export default {
    name: 'subjectInvestRecordLi',
    data() {
        return {
            showThisTips: true,
            showThisDesc: false,
            tipsClass: 'arrow open',

            stateText: ['系统出借中', '计息中', '已结清', '流标', '提前还款'],
            stateClass: '',

            repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
        }
    },
    props: ['listItem'],
    created: function() {
        this.stateClass = 'state state_' + this.listItem.orderState
    },
    methods: {
        changeTipsShowHide: function() {
            this.showThisTips = !this.showThisTips;
            this.showThisDesc = !this.showThisTips;
        },
        toDetailPage(items){
            if(items.failCreditAmount * 1 == 0){
                this.$router.push({
                    path : '/subjectInvestRecordDetail',
                    query: {
                        orderId : items.orderId,
                        isOldSys : items.isOldSys
                    }
                })
            }
        }
    }
}

</script>
<style scoped>
li.subject_li{margin-bottom:.1875rem;background:#FFFFFF;}
li.subject_li .box{padding:.75rem .9375rem 1rem;}
li.subject_li .name{ display:block;height:auto;overflow:hidden;line-height:1.875rem;font-size:1.0625rem; vertical-align:middle}
li.subject_li .name span.type{ display:inline-block;padding:0 .3125rem;line-height:.9375rem; background:#A2AEC8;border-radius:3px;color:#FFFFFF;margin-left:1.5rem;font-size:0.65625rem;}
li.subject_li .name span.type2{ display:inline-block;padding:0 .3125rem;line-height:.9375rem; background:none;color:#A2AEC8;margin-left:1.5rem;font-size:0.65625rem;}
li.subject_li .name span.state{float:right; white-space:nowrap;font-size:.9375rem;}
li.subject_li .name span.state_0{color:#2970FF}
li.subject_li .name span.state_1{color:#F86E39}
li.subject_li .name span.state_2{color:#717171}
li.subject_li .info{ display:block;font-size:.9375rem;line-height:1.8;color:#A2A5AB;margin-bottom:.6875rem;}

li.subject_li .money_info{ display:block;height:auto;overflow:hidden;}
li.subject_li .money_info p{width:33.3%;float:left; display:block; text-align:center;line-heigth:1.5;font-size:1.0625rem}
li.subject_li .money_info p small{font-size:.6875rem; display:block;padding-top:0.46875rem;}
li.subject_li .money_info p:nth-child(1){ text-align:left;}
li.subject_li .money_info p:nth-child(3){ text-align:right;}
#subjectRecordList_2 li.subject_li .money_info p:nth-child(2){float:right; text-align:right;}

li.subject_li .tips{ display:block;border-top:1px solid #EAE9E9;border-bottom:1px solid #EAE9E9; background:#F8F9FB;padding:0 .9375rem; position:relative;}
li.subject_li .tips:after{width:.9375rem;height:.9375rem;border-top:1px solid #EAE9E9;border-right:1px solid #EAE9E9;border-bottom:0; background:#F8F9FB; -webkit-transform:rotate(-45deg); transform:rotate(-45deg); content:" "; position:absolute;left:2rem;top:-.5rem;}
li.subject_li .tips .title{ display:block;line-height:2rem;font-size:.75rem;color:#1f1f1f;}

li.subject_li .tips .arrow{width:.3125rem;height:.3125rem;border-top:1px solid #F86D37;border-right:1px solid #F86D37;border-bottom:0; background:#F8F9FB;  content:" "; position:absolute;}
li.subject_li .tips .arrow.close{right:.75rem;top:.7rem;-webkit-transform:rotate(135deg); transform:rotate(135deg);}
li.subject_li .tips .arrow.open{right:.75rem;top:.85rem;-webkit-transform:rotate(-45deg); transform:rotate(-45deg);}
li.subject_li .tips .desc{padding:.75rem 0;line-height:1.5; display:block}
li.subject_li .tips .desc small{ display:block;color:#484d51}
li.subject_li .tips{background:none;height:auto;overflow:hidden;font-size:.75rem;line-height:2rem;white-space: nowrap;white-space: nowrap;color:#848999;}
li.subject_li .tips:after{ display:none;}
li.subject_li .tips em{float:right;font-style:normal;}
li.subject_li .tips i{float:left;font-style:normal;}
</style>
