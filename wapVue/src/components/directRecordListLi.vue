<template>
  <li @click="goRecordDetail(listItem)" class="sensors-btn"
  sensors-name="直投列表_查看直投项目详情">
      <div class="box">
          <div class="name">
              <span v-cloak :class="stateClass">{{stateText[listItem.orderState]}}</span>
              {{listItem.productName}}
          </div>
          <div class="info"></div>
          <div class="money_info">
              <p>{{listItem.successAmount}}<small>成功出借(元)</small></p>
              <p>{{listItem.hasRepayTotalAmount || '0.00'}}<small>已还金额(元)</small></p>
              <p v-if="listItem.orderState*1 < 2">{{listItem.waitToCollectPrincipalAndProfit || '0.00'}}<small>待收本息(元)</small></p>
          </div>
      </div>
      <div class="tips tips2">
          <i>您于 {{listItem.investDate}} 出借 {{listItem.investAmount}}元</i>
          <em>{{listItem.repayType}}</em>
      </div>
      <div class="tips sensors-btn" v-show="!listItem.failCreditAmount" v-on:click="changeTipsShowHide"
  sensors-name="直投列表_查看直投项目说明-退款">
          <span v-bind:class="tipsClass"></span>
              <div class="title" v-show="showThisTips">流标退款(元）: {{listItem.failCreditAmount}}</div>
               <div class="desc" v-show="showThisDesc">流标退款(元）: {{listItem.failCreditAmount}}<small>部分借款标的放款失败，({{listItem.failCreditAmount}}元)已退回至您的账户中</small></div>
      </div>
    </li>
</template>
<style scoped>
.directRecordList .data_list li{margin-bottom:.1875rem;background:#FFFFFF;}
.directRecordList .data_list li .box{padding:.75rem .9375rem 1rem;}
.directRecordList .data_list li .name{ display:block;height:auto;overflow:hidden;line-height:1.875rem;font-size:1.0625rem; vertical-align:middle}
.directRecordList .data_list li .name span.type{ display:inline-block;padding:0 .3125rem;line-height:.9375rem; background:#A2AEC8;border-radius:3px;color:#FFFFFF;margin-left:1.5rem;font-size:0.65625rem;}
.directRecordList .data_list li .name span.type2{ display:inline-block;padding:0 .3125rem;line-height:.9375rem; background:none;color:#A2AEC8;margin-left:1.5rem;font-size:0.65625rem;}
.directRecordList .data_list li .name span.state{float:right; white-space:nowrap;font-size:.9375rem;}
.directRecordList .data_list li .name span.state_0{color:#2970FF}
.directRecordList .data_list li .name span.state_1{color:#F86E39}
.directRecordList .data_list li .name span.state_2{color:#717171}
.directRecordList .data_list li .info{ display:block;font-size:.9375rem;line-height:1.8;color:#A2A5AB;margin-bottom:.6875rem;}

.directRecordList .data_list li .money_info{ display:block;height:auto;overflow:hidden;}
.directRecordList .data_list li .money_info p{width:33.3%;float:left; display:block; text-align:center;line-heigth:1.5;font-size:1.0625rem}
.directRecordList .data_list li .money_info p small{font-size:.6875rem; display:block;padding-top:0.46875rem;}
.directRecordList .data_list li .money_info p:nth-child(1){ text-align:left;}
.directRecordList .data_list li .money_info p:nth-child(3){ text-align:right;}
.directRecordList .data_list ul#directRecordList_2 li .money_info p:nth-child(2){float:right; text-align:right;}

.directRecordList .data_list li .tips{ display:block;border-top:1px solid #EAE9E9;border-bottom:1px solid #EAE9E9; background:#F8F9FB;padding:0 .9375rem; position:relative;}
.directRecordList .data_list li .tips.tips2{border-bottom:0;background:none;height:auto;overflow:hidden;font-size:.75rem;line-height:2rem;white-space: nowrap;white-space: nowrap;color:#848999;}
.directRecordList .data_list li .tips.tips2:after{top:-100rem;}
.directRecordList .data_list li .tips:after{width:.9375rem;height:.9375rem;border-top:1px solid #EAE9E9;border-right:1px solid #EAE9E9;border-bottom:0; background:#F8F9FB; -webkit-transform:rotate(-45deg); transform:rotate(-45deg); content:" "; position:absolute;left:2rem;top:-.5rem;}
.directRecordList .data_list li .tips .title{ display:block;line-height:2rem;font-size:.75rem;color:#1f1f1f;}

.directRecordList .data_list li .tips .arrow{width:.3125rem;height:.3125rem;border-top:1px solid #F86D37;border-right:1px solid #F86D37;border-bottom:0; background:#F8F9FB;  content:" "; position:absolute;}
.directRecordList .data_list li .tips .arrow.close{right:.75rem;top:.7rem;-webkit-transform:rotate(135deg); transform:rotate(135deg);}
.directRecordList .data_list li .tips .arrow.open{right:.75rem;top:.85rem;-webkit-transform:rotate(-45deg); transform:rotate(-45deg);}
.directRecordList .data_list li .tips .desc{padding:.75rem 0;line-height:1.5; display:block}
.directRecordList .data_list li .tips .desc small{ display:block;color:#484d51}
.directRecordList .data_list li .tips em{float:right;font-style:normal;}
.directRecordList .data_list li .tips i{float:left;font-style:normal;}
</style>
<script>
export default {
  name: 'directRecordListLi',
  data(){
    return {
      showThisTips : true,
	  	showThisDesc : false,
	  	tipsClass : 'arrow open',

	  	stateText : ['系统出借中', '起息中', '已结清'],
	  	stateClass : '',
    }
  },
  props: ['listItem'],
  created :function(){
    this.stateClass = 'state state_' + this.listItem.orderState
  },
  methods:{
    changeTipsShowHide : function(){
        this.showThisTips = !this.showThisTips;
        this.showThisDesc = !this.showThisTips;
    },
    goRecordDetail : function(item){
	   	window.location.href='/directRecordDetail?orderId=' + item.orderId
  	},
  }
}

</script>
