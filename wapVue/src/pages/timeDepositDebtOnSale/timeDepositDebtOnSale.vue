<template>
  <div class="autoInvestMatchDebtOnSale" v-cloak >
      <div class="amdList" v-if="isShowAmdlist"  ref="amdList">
            <div class="tips">为保护借款人信息，仅展示部分散标的信息，加入月月笑以后，可在订单中查看相关记录</div>
      		<ul class="list-type">
                <onSaleItem v-for="(item, index) in resuleData" :item="item" :key="index" targetPage="/directInvestProjectDetailShow"></onSaleItem>
      		  <!-- <li v-for="(item, index) in resuleData"
            class="sensors-btn list-type-i" sensors-name="智能出借_查看债权详情"
            v-on:click="bidDetail(item.loanId)">
      		  	<div class="box">
      				<div class="info">编号：{{item.loanId}}</div>
              <ul class="ul-con">
                 <li class="li1"><span>{{item.amount || '0.00'}}</span>标的金额(元)</li>
                 <li class="li2"><span>{{item.rate || '0'}}%</span>借款合同约定年化利率</li>
                 <li class="li3"><span>{{item.termCount}}</span>期限(<font v-if="item.termUnit=='1'">天
                 </font><font v-if="item.termUnit=='3'">月</font>)
                 </li>
              </ul>
              <div class="ul-bot">
                     <span class="span1">借款用途<font>{{item.borrowerUseName}}</font></span>
                     <span class="span2">{{item.productType && repaymentTypeFont[item.productType]}}</span>
              </div>
      		    </div>
      		  </li> -->
      		</ul>
          <loadingMoreData :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getresuleData"></loadingMoreData>
      </div>
      <empty text="当前无在售标的" v-else></empty>
  </div>
</template>

<style src="./timeDepositDebtOnSale.css"></style>
<style scoped>
/*空列表*/
.meptyList{line-height:2;display:block;background:url(https://static.facebank.cn/static/wapFront/autoInvest/img/noBid.jpg) no-repeat center top/100% auto;padding-top:19rem; text-align:center;background-color: #FFFFFF;}
.meptyList strong{font-size:1.375rem;}
</style>
<script>
import * as constants from './timeDepositDebtOnSaleConstants';
import onSaleItem from '@/components/onSaleItem';
import {utils,globalVariable} from'tools';
export default {
    name:constants.NAME,
    data() {
        return {
            resuleData: [],
            //repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
            orderId: '',
            pageNum: 1,
            isLoading:true,
            reloadDataStatus:false,
            isShowAmdlist:true,
            isDisable:true,
            enLong:false,
            lastLoanId : 0,
            loanTransferFlag : 0,
            isLastCount : 0,
        }
    },
    components:{onSaleItem},
    created: function() {

    },
    mounted(){
        this.getresuleData();
      this.$refs.amdList.addEventListener('scroll', ()=>{
          var domHeight=this.$refs.amdList.getElementsByTagName('ul')[0].clientHeight;
          var scrollTop=this.$refs.amdList.scrollTop;
          var seeHeight=this.$refs.amdList.clientHeight;
          if(domHeight-scrollTop<seeHeight*1+100){
              if(!this.isDisable) return;

              this.getresuleData();

          }
      })

    },
    methods: {
        bidDetail: function(loanId) {
            window.location.href = "/directInvestProjectDetailShow?loanId=" + loanId;
        },
        getresuleData: function() {
          this.isLoading=true;
          this.reloadDataStatus=false;
          this.isDisable=false;
            var _this = this;
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/product/getSDQLoanList',
                data: '{"lastLoanId":"' + _this.lastLoanId + '", "loanType" : "'+_this.loanTransferFlag+'"}',
                complete:function(){
                  _this.isLoading=false;
                  if(_this.resuleData.length>=10){
                    _this.enLong=true;
                  }
                },
                success: function(res) {
                    _this.isDisable=true;
                    if (res.code == 1) {
                        _this.resuleData.push.apply(_this.resuleData, res.data.loanList);
                        if (res.data.loanList.length > 0 && res.data.loanList.length == 10) {
                            var lastIndex = res.data.loanList.length-1;
                            //_this.lastLoanId =  res.data.loanList[res.data.loanList.length-1].loanId;
                            _this.loanTransferFlag = res.data.loanList[lastIndex].loanTransferFlag;
                            _this.lastLoanId = _this.loanTransferFlag*1 == 1 ? res.data.loanList[lastIndex].loanTransferId : res.data.loanList[lastIndex].loanId;
                        }else{
                            _this.isDisable=false;
                        }
                        _this.reloadDataStatus=false;
                        if(_this.resuleData.length>0){
                          _this.isShowAmdlist=true;
                        }else{
                          _this.isShowAmdlist=false;
                        }
                    }else if (res.code=='-853') {
                       utils.toLogin('/timeDepositDebtOnSale');
                    }else{
                        _this.reloadDataStatus=true;
                        if(_this.resuleData.length==0){
                          _this.isShowAmdlist=false;
                        }
                    }
                },
                error:function(){
                    _this.reloadDataStatus=true;
                    if(_this.resuleData.length==0){
                      _this.isShowAmdlist=false;
                    }
                }
            })
        },
    },
}
</script>
