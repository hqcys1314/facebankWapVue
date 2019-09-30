<template>
  <div class="investRecordDetail">
    <div class="switch_tab">
      <ul>
        <li v-on:click="listTab(1)" v-bind:class="{current : tabIndex_1}"
            class="sensors-btn" sensors-name="智能出借_详情_出借信息">出借信息</li>
        <li v-on:click="listTab(2)" v-show="hasInterest" v-bind:class="{current : tabIndex_2}"
            class="sensors-btn" sensors-name="债权转让_详情_债权明细">债权明细</li>
      </ul>
    </div>
    <div v-show="tabIndex_1">

      <!--我的出借-->
      <div class="item_box">
        <div class="title">我的出借</div>
        <div class="item_dl style2">
          <dl>
            <dt>出借日期:</dt>
            <dd>{{detailData.createTime}}</dd>
          </dl>
          <dl>
            <dt>成功出借金额:</dt>
            <dd>
              {{detailData.investAmount}}元
              <small>*您实际出借{{detailData.investAmount}}元</small>
              <small>*出借金额=债权价值-债权价值*折让率
              </small>

            </dd>
          </dl>
          <dl>
            <dt>受让时债权价值:
            </dt>
            <dd>
              {{detailData.amount}}元
              <small>*您实际获得{{detailData.amount}}元的债权</small>
              <small>*将以{{detailData.amount}}元作为本金生成还款计划
              </small>

            </dd>
          </dl>
          <dl>
            <dt>出让人折让率:
            </dt>
            <dd>
              {{detailData.oriOrderDiscountRate}}%
              <small style="color: #F0484E;"  v-on:click="discountRate()">*什么是折让率?</small>


            </dd>
          </dl>
          <dl>
            <dt>{{detailData.orderState*1 == 2 || detailData.orderState*1 == 4 ? '已获回报' : '预期回报'}}</dt>
            <dd>
              {{detailData.investTotalProfit}}元
              <small>*预期回报=利息+债权价值*折让率</small>
              <small>*日后可能会因为某些标的提前还款导致预期回报有波动</small>
            </dd>
          </dl>

          <dl>
            <dt>原始标的期限</dt>
            <dd>{{isOldSys == 1 ? detailData.orderDeadLine : (detailData.termCount + ' ' + termUnit[detailData.termUnit])}}</dd>
          </dl>
          <dl>
            <dt>受让时剩余天数</dt>
            <dd>{{detailData.oriOrderRemainDays}}天</dd>
          </dl>
          <dl>
            <dt>借款合同约定年化利率</dt>
            <dd>{{detailData.rate}}%
              <small v-if="detailData.repaymentType == 1">*在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报 </small>
              <small v-if="detailData.repaymentType == 3">*约定年化利率不代表实际利息。在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借</small>
            </dd>
          </dl>
          <dl>
            <dt>还款方式</dt>
            <dd>{{repaymentTypeFont[detailData.repaymentType]}}</dd>
          </dl>
          <dl>
            <dt>项目状态</dt>
            <dd v-bind:class="stateClass">{{orderState[detailData.orderState]}}</dd>
          </dl>
          <dl>
            <dt>出借人服务协议</dt>
            <dd><a :href="'https://cic.facebank.cn/wap/contract/investorServiceOrderContract?orderId='+orderId">查看</a></dd>
          </dl>
        </div>
      </div>
      <!--还款进度-->
      <div class="item_box">
        <div class="title">还款进度</div>
        <div class="progress_box">
          <div class="progress_bar">
            <div class="line"></div>
            <div class="bar" v-bind:style="progressPP">
              <div class="line"></div><div class="dian"></div>
            </div>
            <div class="text"><span>待还本息：{{detailData.waitToCollectPrincipalAndProfit || '0.00'}}元</span>已还本息：{{detailData.hasRepayTotalAmount || '0.00'}}元</div>
          </div>
          <div class="progress_bar">
            <div class="line"></div>
            <div class="bar" v-bind:style="progressPrincipal">
              <div class="line"></div><div class="dian"></div>
            </div>
            <div class="text"><span>待还本金：{{detailData.waitToCollectPrincipal || '0.00'}}元</span>已还本金：{{detailData.hasRepayPrincipal || '0.00'}}元</div>
          </div>
          <div class="progress_bar">
            <div class="line"></div>
            <div class="bar" v-bind:style="progressProfit">
              <div class="line"></div><div class="dian"></div>
            </div>
            <div class="text"><span>待还利息：{{detailData.waitToCollectProfit || '0.00'}}元</span>已还利息：{{detailData.hasRepayProfit || '0.00'}}元</div>
          </div>
        </div>


      </div>

      <services showItem="online, feedback" :rid="orderId" :sourceType="orderType == 'autoBidding' ? 'automatic-bidding-order' : 'intelligent-recommendation-order'"></services>
    </div>
    <div v-show="tabIndex_2" class="airList" ref="airList">
      <ul class="list-type-1">
        <li v-for="(item, index) in creditListData" v-on:click="gotoPage(item)"
            class="sensors-btn" sensors-name="债权转让_查看债权详情">
          <div class="info">编号：{{item.creditId}}</div>
          <div class="user_info">
            <p>{{item.borrowerName}}<small>借款人</small></p>
            <p>{{item.amount || '0.00'}}<small>借款金额(元)</small></p>
            <p>{{item.bizStatus*1 == 100 ? '还款中' : '已还清'}}<small>标的状态</small></p>
          </div>
        </li>
      </ul>
      <loadingMoreData :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getCreditList"></loadingMoreData>
    </div>

    <discountRateTk  :dicountShow="dicountShowV" v-on:closeDiscount="closeDiscount()"></discountRateTk>

  </div>
</template>

<style src="assets/wapFront/common/css/investRecordDetail.css"></style>
<style lang="less" src="./claimsTranRecordDetail.less"></style>
<script>
  import * as constants from './claimsTranRecordDetailConstants';
  import {utils,globalVariable} from'tools';
  import discountRateTk from '@/components/discountRateTk';

  export default {
    name: constants.NAME,
    data() {
      return {
        tabIndex_1: true,
        tabIndex_2: false,

        orderId: '',
        creditId : '',
        loanId : '',
        //当前出借信息
        //当前出借信息数据
        detailData: '',
        //债权列表
        //债权列表页码
        pageNum: 1,
        //债权列表数据
        creditListData: [],
        showLoadMore: false,


        //是否已起息
        hasInterest: false,
        stateClass: 'state_',
        orderState: ['系统出借中', '计息中', '已结清'],
        repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
        termUnit : ['天','天','周','个月', '年'],

        //还款进度
        progressProfit: '0%',
        progressPrincipal: '0%',
        progressPP: '0%',

        profitData : '',

        isLoading:true,
        reloadDataStatus:false,
        isDisable:true,
        enLong:false,

        otherReward : [],
        otherRewardTotal : 0,
        mainReward : [],
        orderType : '',
        dicountShowV:false,
      }
    },
    created: function() {
      this.orderId = this.$route.query.orderId;
      this.isOldSys = this.$route.query.isOldSys;
      this.orderType = this.$route.query.orderType;
    },
    mounted : function(){
      this.getOrderDetail();

      this.$refs.airList.addEventListener('scroll', ()=>{
        var domHeight=this.$refs.airList.getElementsByTagName('ul')[0].clientHeight;
        var scrollTop=this.$refs.airList.scrollTop;
        var seeHeight=this.$refs.airList.clientHeight;
        if(domHeight-scrollTop<seeHeight*1+200){

          if(!this.isDisable) return;

          this.getCreditList();

        }
      })
    },
    methods: {
      //tab键切换
      listTab: function(num) {
        if (num == 1) {
          this.tabIndex_1 = true;
          this.tabIndex_2 = false;
        } else {
          this.tabIndex_1 = false;
          this.tabIndex_2 = true;
        }
      },
      toDynamic : function(orderId){

        this.$router.push({
          path : '/orderDynamic',
          query : {
            orderId : orderId,
            orderType : this.$route.query.orderType
          }
        })
      },
      discountRate(){
        this.dicountShowV=true;
      },
      closeDiscount(){
        this.dicountShowV=false;
      },
      getOrderDetail: function() {
        var _this = this;
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/order/transferOrderDetail?orderId='+this.orderId,
          type:'get',
          success: function(res) {
            if (res.code == 1) {
              _this.detailData = res.data;
              var detailData = _this.detailData;
              _this.creditId = res.data.creditId;
              _this.loanId = res.data.loanId;
              _this.hasInterest = detailData.orderState != '0';
              _this.stateClass = 'state_' + detailData.orderState;
              var pp = parseFloat(detailData.hasRepayTotalAmount || 0, 10),
                wantPp = parseFloat(detailData.waitToCollectPrincipalAndProfit || 0, 10),
                profit = parseFloat(detailData.hasRepayProfit || 0, 10),
                wantProfit = parseFloat(detailData.waitToCollectProfit || 0, 10),
                principal = parseFloat(detailData.hasRepayPrincipal || 0, 10),
                wantPrincipal = parseFloat(detailData.waitToCollectPrincipal || 0, 10);

              _this.progressPP = 'width:' + (pp + wantPp > 0 ? parseInt((pp / (pp + wantPp)).toFixed(2) * 100) : 0) + '%';
              _this.progressProfit = 'width:' + (profit + wantProfit > 0 ? parseInt((profit / (profit + wantProfit)).toFixed(2) * 100) : 0) + '%';
              _this.progressPrincipal = 'width:' + (principal + wantPrincipal > 0 ? parseInt((principal / (principal + wantPrincipal)).toFixed(2) * 100) : 0) + '%';


              var rewardList = res.data.rewardList;
              if(rewardList && rewardList.length > 0){
                _this.otherReward = rewardList.filter(function(item){
                  return item.rewardType*1 == 111 || item.rewardType*1 == 112;
                })
                for(var i=0; i<_this.otherReward.length; i++){
                  _this.otherRewardTotal = _this.otherRewardTotal + _this.otherReward[i].rewardAmount*1
                }
                _this.mainReward = rewardList.filter(function(item){
                  return item.rewardType*1 != 111 && item.rewardType*1 != 112;
                })
              }

              if(_this.hasInterest) _this.getCreditList();
            }
          }
        })
      },

      getCreditList: function() {
        this.isLoading=true;
        this.reloadDataStatus=false;
        this.isDisable=false;
        var _this = this;
        var api = utils.AJAXDOMAINNAME + '/wap/order/creditList';
        $.ajax({
          url: api,
          data: '{"pageNum":' + _this.pageNum + ',"orderId":"' + _this.orderId + '"}',
          complete:function(){
            _this.isLoading=false;
            if(_this.creditListData.length>=10){
              _this.enLong=true;
            }
          },
          success: function(res) {
            _this.isDisable=true;
            if (res.code == 1) {
              _this.creditListData.push.apply(_this.creditListData, res.data.creditList)
              if (res.data.creditList.length > 0 && res.data.creditList.length == 10) {
                _this.pageNum++;
              }else{
                _this.isDisable=false;
              }
              _this.reloadDataStatus=false;
            }else{
              _this.reloadDataStatus=true;
            }
          },
          error:function(){
            _this.reloadDataStatus=true;
          }
        })
      },
      gotoPage: function(item) {
        this.$router.push({
          path : '/directRecordDebtDetail',
          query : {
            creditId : item.creditId,
            loanId : item.loanId,
            orderId : this.orderId,
            isOldSys : '0',
            investContract : item.investContract,
            bizStatus : item.bizStatus,
            amount : item.amount,
            ctrFlag:'claimTrans',
            nextLoanTransferId:item.nextLoanTransferId,
          }
        })
      }
    },
    components: {discountRateTk}
  }
</script>
