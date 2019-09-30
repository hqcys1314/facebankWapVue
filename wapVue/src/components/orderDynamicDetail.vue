<template>
    <div>
        <div v-if="item.bizType*1 == 0">
            <ul>
                <li>出借产品：{{item.body.productName}}</li>
                <li>出借期限：{{item.body.term}}</li>
                <li>年化利率：{{item.body.rate}}%</li>
                <li>出借金额：{{item.body.investAmount}}元</li>
                <li v-if="item.body.backAmount*1 > 0">返现卡：　{{item.body.backAmount}}元</li>
                <li v-if="item.body.firstPayAmount*1 > 0">首购返现：{{item.body.firstPayAmount}}元</li>
                <li v-if="item.body.backRedAmount">红包返现：{{item.body.backRedAmount}}元</li>
            </ul>
        </div>
        <div v-if="item.bizType*1 == 1">
            <ul>
                <li>成功出借：{{item.body.successAmount}}元</li>
                <li v-if="item.body.rollAmount*1 > 0">流标金额：{{item.body.rollAmount}}元</li>
            </ul>
            <div class="tips_area" v-if="item.body.rollAmount*1>0">{{item.body.rollAmount}}元流标资金已存入<span>账户余额</span></div>
        </div>
        <div v-if="item.bizType*1 == 2">
            <ul>
                <li>已回本金：{{item.body.realPrincipal}}元</li>
                <!-- <li>其他：{{item.body.otherAmount}}元</li> -->
                <li>已回利息：{{item.body.realInterest}}元</li>
                <li v-if="!item.body.preRepaymentFlag">本期还款进度：{{item.body.repaymentScheduleCount}}</li>
            </ul>
            <div class="tips_area" v-if="item.body.preRepayAmount*1 > 0">
                其中{{item.body.preRepayAmount}}元为标的<span>提前结清</span>，实收利息比预期利息减少了{{item.body.preRepayCancelInterest}}元，提前结清金额将不再统计在后续还款中。
            </div>
            <!-- <div class="tips_area" v-else-if="item.body.preRepayAmount*1 > 0">其中{{item.body.preRepayAmount}}元为债权人<span>提前结清</span>借款，已存入<span>账户余额</span>，请查收!</div> -->
        </div>
        <div v-if="item.bizType*1 == 3">
            <ul>
                因银行结算原因，有{{item.body.overDulTotal}}元待还本息正在处理中，预计在{{item.body.overPlanDate}}之前到账,请留意!
            </ul>
            <div class="tips_area" v-if="item.body.tips">{{item.body.tips}}</div>
        </div>
        <div v-if="item.bizType*1 == 4">
            <ul>
                <li>应收本金：{{item.body.planPrincipal}}元</li>
                <li>已收本金：{{item.body.realPrincipal}}元</li>
                <li>应收利息：{{item.body.planInterest}}元</li>
                <li>已收利息：{{item.body.realInterest}}元</li>
                <li v-if="item.body.overDulAmout*1 > 0">在途贴息：{{item.body.overDulAmout}}元({{item.body.overDulDays}}天)</li>
                <li v-if="item.body.redPackageAmount*1 > 0">红包加息：{{item.body.redPackageAmount}}元</li>
                <li v-if="item.body.vipAmount * 1 > 0">会员加息：{{item.body.vipAmount}}元</li>
            </ul>
            <div class="tips_area" v-if="item.body.preRepayAmount*1 > 0">
                其中{{item.body.preRepayAmount}}元为标的<span>提前结清</span>，实收利息比预期利息减少了{{item.body.preRepayCancelInterest}}元,提前结清金额将不再统计在后续还款中。
            </div>
        </div>
        <div v-if="item.bizType*1 == 5">
            <ul class="line">本次出借本金{{item.body.planPrincipal}}元，共赚取了{{item.body.totalInterest}}元回报，<br>你已打败全国{{rank}}%理财君！继续加油！～</ul>
            <ul>
                <li>应收本金：{{item.body.planPrincipal}}元</li>
                <li>已收本金：{{item.body.realPrincipal}}元</li>
                <li>应收利息：{{item.body.planInterest}}元</li>
                <li>已收利息：{{item.body.realInterest}}元</li>
                <li v-if="item.body.overDulAmout*1 > 0">在途贴息：{{item.body.overDulAmout}}元({{item.body.overDulDays}}天)</li>
                <li v-if="item.body.vipAmount * 1 > 0">会员加息：{{item.body.vipAmount}}元</li>
                <li v-if="item.body.backAmount*1 > 0">返现卡：　{{item.body.backAmount}}元</li>
                <li v-if="item.body.firstPayAmount*1 > 0">首购返现：{{item.body.firstPayAmount}}元</li>
                <li v-if="item.body.redPackageAmount*1 > 0">红包加息：{{item.body.redPackageAmount}}元</li>
                <li v-if="item.body.backRedAmount*1 > 0">红包返现：{{item.body.backRedAmount}}元</li>
            </ul>
            <div class="tips_area other" v-if="item.body.preRepayAmount*1 > 0">
                其中{{item.body.preRepayAmount}}元为标的提前结清，资金实际生息时间比计划减少，实收利息比预期利息减少了{{item.body.preRepayCancelInterest}}元!
        </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'orderDynamicDetail',
    data(){
        return {
            item : '',
            rank : 0,
        }
    },
    props: ['items', 'rankData'],
    created :function(){
        this.item = this.items;
        this.rank = this.rankData;
    },
    methods:{

    },
    watch : {
        rankData(val){
            this.rank = val;
        }
    }
}

</script>
