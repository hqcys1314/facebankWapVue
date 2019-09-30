<template>
    <li>
        <router-link :to="{ path: '/autoInvestRecordDetail', query: {orderId : listItem.orderId, creditId : listItem.creditId, isOldSys : listItem.isOldSys} }">
        <div class="content">
            <div class="title">
                {{listItem.productName}}
                <span :class="stateClass">{{stateText[listItem.orderState]}}</span>
            </div>
            <div class="item_type">{{repaymentTypeFont[listItem.repaymentType]}}</div>
            <div class="items">
                <p><span>{{listItem.startInterestPrincialAmount}}</span>成功出借(元)</p>
                <p><span>{{listItem.hasRepayTotalAmount || '0.00'}}</span>已收本金(元)</p>
                <p><span>{{listItem.hasRepayProfit || '0.00'}}</span>已收回报(元)</p>
            </div>
        </div>
        </router-link>
        <div class="tips_area">当前回款因银行原因，正在享受在途贴息，2018-09-18 <span class="icon icon_tips" @click="showDetailLayer(listItem)"></span></div>
    </li>
</template>

<script>
export default {
  name: 'autoInvestRecordLi',
  data(){
    return {
        showThisTips : true,
        showThisDesc : false,
        tipsClass : 'arrow open',

        stateText : ['系统出借中', '计息中', '已结清'],
        stateClass : '',
        repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
    }
  },
  props: ['listItem'],
  created :function(){
    this.stateClass = 'status status_' + this.listItem.orderState
  },
  methods:{
    changeTipsShowHide : function(){
       this.showThisTips = !this.showThisTips;
       this.showThisDesc = !this.showThisTips;
    },
    showDetailLayer : function(items){
        this.$parent.showDetailLayer(items)
    }

  }
}

</script>
