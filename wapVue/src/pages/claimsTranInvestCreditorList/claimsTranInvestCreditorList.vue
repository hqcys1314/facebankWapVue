<template>
  <div class="claimsTranInvestCreditorList" v-cloak >
    <div class="amdList" v-if="isShowAmdlist"  ref="amdList">
      <ul class="list-type-1">
        <li v-for="(item, index) in resuleData" v-on:click="bidDetail(orderId,item.creditId,item.amount,item.bizStatus,item.loanId)"
            class="sensors-btn" sensors-name="债权列表_查看债权详情">
          <div class="info">编号：{{item.creditId}}</div>
          <div class="user_info">
            <p>{{item.borrowerName}}<small>借款人</small></p>
            <p>{{item.amount || '0.00'}}<small>借款金额(元)</small></p>
            <p>{{item.bizStatus*1 == 100 ? '还款中' : '已还清'}}<small>标的状态</small></p>
          </div>
        </li>
      </ul>
      <loadingMoreData :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getresuleData"></loadingMoreData>
    </div>
    <empty text="当前无在售标的" v-else></empty>

  </div>
</template>

<style lang="less" src="./claimsTranInvestCreditorList.less"></style>
<style scoped>
  /*空列表*/
  .meptyList{line-height:2;display:block;background:url(https://static.facebank.cn/static/wapFront/autoInvest/img/noBid.jpg) no-repeat center top/100% auto;padding-top:19rem; text-align:center;background-color: #FFFFFF;}
  .meptyList strong{font-size:1.375rem;}
</style>
<script>
  import * as constants from './claimsTranInvestCreditorListConstants';
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
        enLong:true,
        lastLoanId:0,
      }
    },
    created: function() {
      this.orderId=this.$route.query.orderId;

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
      bidDetail: function(orderId,creditId,amount,bizStatus,loanId) {
        window.location.href = "/directRecordDebtDetail?orderId=" + orderId+"&creditId="+creditId+"&claimsTranType=1&amount="+amount+"&bizStatus="+bizStatus+"&loanId="+loanId;
      },
      getresuleData: function() {
        this.isLoading=true;
        this.reloadDataStatus=false;
        this.isDisable=false;
        var _this = this;
        $.ajax({
          url : utils.AJAXDOMAINNAME+ '/wap/product/orderTransferProductCredits?orderId='+this.orderId+'&pageNum='+this.pageNum,
          type:'GET',
          complete(){
            _this.isLoading=false;
          },
          success: function(res) {
            _this.isDisable=true;
            if (res.code == 1) {
              _this.resuleData.push.apply(_this.resuleData, res.data.creditList);
              if (res.data.creditList.length > 0 && res.data.creditList.length == 20) {
                _this.pageNum++;
                _this.lastLoanId =  res.data.creditList[res.data.creditList.length-1].loanId
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
              utils.toLogin('/claimsTranInvestCreditorList');
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
