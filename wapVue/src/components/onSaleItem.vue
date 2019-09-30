<template>
<li class="sensors-btn list-type-i" @click="toDetailPage(item.loanId)">
    <div class="box" :class="{'isOver' : item.bizStatus && item.bizStatus*1==200}">
        <div class="info">
            <p>编号：{{item.loanId}}</p>
            <!-- <em class="type" v-if="item.bizStatus*1 == 300">转</em> -->
            <em class="type" v-if="item.creditTransferFlag*1 == 1 || item.loanTransferFlag*1 == 1">债</em>
            <!-- <em class="type" v-else-if="item.bizStatus*1 == 200">结</em> -->

            <span v-if="item.bizStatus && item.bizStatus*1==200">已结束</span>
            <span v-if="item.bizStatus && item.bizStatus*1==300">已转让</span>
        </div>
        <ul class="ul-con">
            <li class="li1"><span><em :class="{'company' : item.borrowerType == 'enterprise'}">{{item.borrowerName || '&nbsp;'}}</em></span>借款人/企业</li>
            <li class="li2" v-if="itemType == 'matched'"><span>{{utils.currency(item.matchAmount || '0.00')}}</span>匹配金额(元)</li>
            <li class="li2" v-else-if="item.bizStatus && item.bizStatus*1==300"><span>{{utils.currency(item.amount || '0.00')}}</span>转出金额(元)</li>
            <li class="li2" v-else-if="itemType == 'credit'"><span>{{utils.currency(item.amount || '0.00')}}</span>出借金额(元)</li>
            <li class="li2" v-else><span>{{utils.currency(item.amount || '0.00')}}</span>借款金额(元)</li>

            <!-- <li class="li3" v-if="item.creditTransferFlag*1 == 1"><span>{{item.remainTime}}</span>剩余期限</li> -->
            <li class="li3" v-if="item.creditTransferFlag*1 == 1 || item.loanTransferFlag*1 == 1"><span>{{item.remainTime}}</span>剩余期限</li>
            <li class="li3" v-else><span>{{item.remainTime}}</span>借款期限<!--(<font v-if="item.termUnit=='1'">天</font><font v-if="item.termUnit=='3'">月</font>)--></li>

        </ul>
        <!-- <div class="ul-bot" :class="{'show' : itemType == 'matched'}">
            <span class="span1" v-if="itemType == 'credit'">借款用途<font>{{item.channelProduct}}</font></span>
            <span class="span1" v-else-if="itemType == 'matched'">标的金额(元)<font>{{utils.currency(item.amount || '0.00')}}</font></span>
            <span class="span1" v-else>借款用途<font>{{item.borrowerUseName}}</font></span>
            <span class="span2">{{item.productType && repaymentTypeFont[item.productType]}}</span>
        </div> -->
    </div>
</li>
</template>
<script>
export default {
    name: 'onSaleItem',
    props: ['item', 'targetPage', 'itemType', 'matchId'],
    data(){
        return {
            repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
        }
    },
    created:function(){
    },
    methods:{
        toDetailPage: function(loanId) {
            var _this = this;
            if(this.targetPage){

                setTimeout(function(){
                    window.location.href = _this.targetPage + "?loanId=" + loanId;
                },100)
            }
        },
    }
}
</script>
<style scoped>
li.list-type-i{display:block;padding-left:.9375rem;padding-right:1rem;padding:0;margin-bottom:0.625rem;background:#FFFFFF;margin-left:0;border-bottom: 1px #e8e8e8 solid;}
li.list-type-i .box{margin-left:.9375rem;}
li.list-type-i .info{ display:block;;height:auto;overflow:hidden;line-height:3.1875rem;margin-bottom:1.25rem;font-size:.875rem;border-bottom:1px solid #e8e8e8;color:#2b313d;padding-right:.9375rem;}
li.list-type-i .info p{float:left; white-space:nowrap;}
li.list-type-i .info span{float:right; white-space: nowrap;box-shadow:0 0 0 1px #BCC2CC;border-radius:1.125rem;padding:0 0.5625rem;line-height:1.125rem;margin-top:1.03125rem;font-size:.75rem;color:#848999;}
li.list-type-i .info .type{width:.875rem;height:.63rem;float:left;border-radius:.875rem;border:1px solid #2B313D;color:#2B313D;font-size:.625rem;line-height:.63rem;padding:.1225rem 0;overflow:hidden;margin-left:.375rem;margin-top:1.15625rem; text-align:center; font-style:normal;}
li.more{margin: 2rem 0;text-align: center;color: #848999;font-size: 0.85rem;height: 2rem;line-height: 2rem;}
li.list-type-i .ul-con{overflow: hidden;padding-bottom: 1.25rem;}
li.list-type-i .ul-con .li1{width: 33%;}
li.list-type-i .ul-con .li2{width: 44%;}
li.list-type-i .ul-con .li3{width: 23%;position: relative;}
li.list-type-i .ul-con .li3 .jt{position: absolute;width: 0.5rem;right: 0;}
li.list-type-i .ul-con .li1 span em{display:inline-block;background:no-repeat right center/auto 1.0625rem;font-style: normal;padding-right:1.5625rem;}
li.list-type-i .ul-con .li1 span em.company{background-image:url(~assets/images/icon_borrower_type_company.png);}
li.list-type-i .ul-con li{color:#848999;float: left;font-size: 0.75rem;}
li.list-type-i .ul-con li span{color: #2b313d;margin-bottom: 0.2rem;font-weight: bold;display: block;font-size:1rem;}
li.list-type-i .ul-bot{color:#848999;font-size: 0.75rem;height: 2.5rem;line-height: 2.5rem;border-top: 1px #e8e8e8 solid;display:none;}
li.list-type-i .ul-bot.show{display:block;}
li.list-type-i .ul-bot .span1{}
li.list-type-i .ul-bot .span1 font{margin-left: 0.5rem;}
li.list-type-i .ul-bot .span2{float: right;padding-right:.9375rem;}

/* li.list-type-i .isOver .info{color:#848999;}
li.list-type-i .isOver .ul-con li span{color:#848999;}
li.list-type-i .isOver .type{border-color:#848999;color:#848999;} */

</style>
