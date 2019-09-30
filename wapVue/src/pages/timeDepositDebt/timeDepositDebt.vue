<template>
  <div class="autoInvestMatchDebt">
    <ul class="list-type">
        <onSaleItem v-for="(item, index) in matchDebtList" itemType="matched" :item="item" :key="index" :matchId="matchId" targetPage="/directInvestProjectDetailShow"></onSaleItem>
      <!-- <li v-for="(item, index) in matchDebtList"
     class="sensors-btn list-type-i" sensors-name="智能出借_查看债权详情"
     v-on:click="bidDetail(item.loanId)" >
        <div class="box">
               <div class="info">编号：{{item.loanId}}</div>
                <ul class="ul-con">
                   <li class="li1"><span>{{item.matchAmount || '0.00'}}</span>匹配金额(元)</li>
                   <li class="li2"><span>{{item.rate || '0'}}%</span>借款合同约定年化利率</li>
                   <li class="li3"><span>{{item.termCount}}</span>期限(<font v-if="item.termUnit=='1'">天
                   </font><font v-if="item.termUnit=='3'">月</font>)
                   </li>
                </ul>
                <div class="ul-bot">
                       <span class="span1">标的金额(元)<font>{{item.amount || '0.00'}}</font></span>
                       <span class="span2">{{item.productType && repaymentTypeFont[item.productType]}}</span>
                </div>

          </div>
      </li> -->
    </ul>
    <!--统一提示层-->
    <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
  </div>
</template>

<style src="./timeDepositDebt.css" scoped></style>

<script>
  import * as constants from './timeDepositDebtConstants';
  import informationLayer from '@/components/informationLayer';
  import onSaleItem from '@/components/onSaleItem';
  import {utils,globalVariable} from'tools'

  export default {
    name: constants.NAME,
    components:{informationLayer, onSaleItem},
    data() {
      return {
    		matchDebtList : [],
    		repaymentTypeFont : ['','先息后本','一次性还本付息','等额本息','等本等息','等额本息'],
    		orderId : '',
    		matchId : '',
    		showLoadMore : false,
    		pageNum : 1,
            showLayerStatus : false,
            informationLayerContent : '',
      }
    },
    created:function () {
        this.matchId = this.$route.query.matchId;
        this.getmatchDebtList();
    },
    methods: {
      bidDetail:function(loanId){

          setTimeout(function(){
              window.location.href="/directInvestProjectDetailShow?loanId="+loanId;
          },100)

  	  },
  	  getmatchDebtList: function(){
  		  var _this = this;
  		  $.ajax({
  				url : utils.AJAXDOMAINNAME+'/wap/product/getSDQMatchLoanList',
  				data : '{"oid":"'+ _this.matchId +'","pageSize":"10","pageNum":"'+ _this.pageNum +'"}',
  				success : function(res){
  					if(res.code==1){
  						var list = res.data.loanList
  	  				    for(var item in list){
  	  					    if(list.hasOwnProperty(item)){
  	  						    _this.matchDebtList.push(list[item])
  	  					    }
  	  				    }
  						_this.pageNum++;
  					}else{
                        _this.informationLayerContent = res.message;
                        _this.showLayerStatus = true;
                    }
  				}
  		  })
      }
    },
  }
</script>
