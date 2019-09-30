<template>
  <div class="autoInvestMatchDebtOnSale" v-cloak >
      <div class="amdList" v-if="isShowAmdlist"  ref="amdList">
      		<ul class="list-type">
      		  <li v-for="(item, index) in resuleData"
            class="sensors-btn list-type-i" sensors-name="智能出借_查看债权详情"
            v-on:click="bidDetail(item.loanId)">
      		  	<div class="box">
      				<div class="info">编号：{{item.loanId}}</div>
              <ul class="ul-con" :style="'border-bottom:'+(item.productType ? '1' : '0')+'px;'">
                 <li class="li1"><span>{{item.amount || '0.00'}}</span>标的金额(元)</li>
                 <li class="li2"><span>{{item.rate || '0'}}%</span>借款合同约定年化利率</li>
                 <li class="li3"><span>{{item.termCount}}</span>期限(<font v-if="item.termUnit=='1'">天
                 </font><font v-if="item.termUnit=='3'">月</font>)
                 </li>
              </ul>
              <div class="ul-bot" :style="'display:'+(item.productType ? 'block' : 'none')+';'">
                     <!-- <span class="span1">借款用途<font>{{item.borrowerUseName}}</font></span> -->
                     <span class="span2">{{item.productType && repaymentTypeFont[item.productType]}}</span>
              </div>

      		    </div>
      		  </li>
      		</ul>
          <loadingMoreData :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getresuleData"></loadingMoreData>
      </div>
      <empty text="当前无在售标的" v-else></empty>

  </div>
</template>

<style src="./autoInvestMatchDebtOnSale.css"></style>
<style scoped>
/*空列表*/
.meptyList{line-height:2;display:block;background:url(https://static.facebank.cn/static/wapFront/autoInvest/img/noBid.jpg) no-repeat center top/100% auto;padding-top:19rem; text-align:center;background-color: #FFFFFF;}
.meptyList strong{font-size:1.375rem;}
</style>
<script>
import * as constants from './autoInvestMatchDebtOnSaleConstants';
import {utils,globalVariable} from'tools';
export default {
    name:constants.NAME,
    data() {
        return {
            resuleData: [],
            repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
            orderId: '',
            pageNum: 1,
            isLoading:true,
            reloadDataStatus:false,
            isShowAmdlist:true,
            isDisable:true,
            enLong:false,
            lastLoanId:0,
        }
    },
    created: function() {
          this.getresuleData();
    },
    mounted(){
        var _this = this;
      this.$refs.amdList.addEventListener('scroll', ()=>{
          var domHeight=_this.$refs.amdList.getElementsByTagName('ul')[0].clientHeight;
          var scrollTop=_this.$refs.amdList.scrollTop;
          var seeHeight=_this.$refs.amdList.clientHeight;
          if(domHeight-scrollTop<seeHeight*1+200){
              if(!_this.isDisable) return;
              _this.getresuleData();
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
                url : utils.AJAXDOMAINNAME+ '/wap/autoInvest/onSaleLoanList',
                data: '{"lastLoanId":"' + _this.lastLoanId + '"}',
                complete:function(){
                  _this.isLoading=false;
                  if(_this.resuleData.length>=20){
                    _this.enLong=true;
                  }
                },
                success: function(res) {
                    _this.isDisable=true;
                    if (res.code == 1) {
                        _this.resuleData.push.apply(_this.resuleData, res.data.loanList);
                        if (res.data.loanList.length > 0 && res.data.loanList.length == 20) {
                            _this.pageNum++;
                            _this.lastLoanId =  res.data.loanList[res.data.loanList.length-1].loanId
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
                       utils.toLogin('/autoInvestMatchDebtOnSale');
                    }else{
                        _this.isDisable=false;
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
