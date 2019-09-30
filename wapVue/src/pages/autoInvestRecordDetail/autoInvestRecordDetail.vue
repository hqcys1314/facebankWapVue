<template>
  <div class="investRecordDetail">
       <div class="switch_tab">
           <ul>
               <li v-on:click="listTab(1)" v-bind:class="{current : tabIndex_1}"
               class="sensors-btn" sensors-name="智能出借_直投详情_出借信息">出借信息</li>
               <li v-on:click="listTab(2)" v-show="hasInterest" v-bind:class="{current : tabIndex_2}"
               class="sensors-btn" sensors-name="智能出借_直投详情_债权明细">债权明细</li>
           </ul>
      </div>
        <div v-show="tabIndex_1">
            <!--出借动态，转让已完成时订单状态不展示-->
            <div class="item_box" v-if="detailData.newestReport&&detailData.orderState!='6'">
              <div class="title title2" style="display:none;" @click="toDynamic($route.query.orderId)"><span class="icon_right_arrow"></span>出借动态</div>
              <div class="item_dl style3" style="border-top:0;">
                  <div class="item_title"><span>{{detailData.newestReport.businessTimeDesc}}</span>{{detailData.newestReport.subTitle}}</div>
                  <orderDynamicDetail :rankData.sync="detailData.ranking" :items="detailData.newestReport"></orderDynamicDetail>
              </div>
            </div>
          <!--我的出借-->
          <div class="item_box">
            <div class="title">我的出借</div>
            <div class="item_dl style2">
              <dl>
                <dt>出借日期</dt>
                <dd>{{detailData.createTime}}</dd>
              </dl>
              <dl v-if="!hasInterest">
                  <dt>成功出借金额</dt>
                  <dd>
                      --元
                      <small>*您出借{{detailData.amount}}元，最终成功出借金额以放款起息时实际形成的债权为准</small>
                  </dd>
              </dl>
              <dl v-else>
                  <dt>成功出借金额</dt>
                  <dd>
                      {{detailData.startInterestPrincialAmount}}元

                      <div v-if="0 < detailData.unStartInterestAmount*1 && detailData.unStartInterestAmount*1 < detailData.amount*1">
                          <small>*您出借{{detailData.amount}}元，最终成功出借金额以放款起息时实际形成的债权为准</small>
                          <small v-if="detailData.failCreditAmount*1 > 0">*某些借款标的放款失败导致流标退款，未成交金额({{detailData.failCreditAmount}}元)已退回至您的账户中</small>
                          <small v-if="detailData.unStartInterestAmount*1 > 0">*当前{{detailData.unStartInterestAmount}}元尚未放款起息，请耐心等待</small>
                      </div>
                      <small v-else-if="detailData.startInterestPrincialAmount === detailData.amount">*您出借{{detailData.amount}}元，当前全部金额均成功出借</small>
                      <small v-else-if="detailData.unStartInterestAmount*1 == 0 && detailData.failCreditAmount*1 > 0">*您出借{{detailData.amount}}元，某些借款标的放款失败导致流标退款，未成交金额({{detailData.failCreditAmount}}元)已退回至您的账户中</small>
                  </dd>
              </dl>
              <dl v-if="detailData.orderState=='6'">
                <dt>债转折让金额</dt>
                <dd>
                  {{detailData.discountFee}}元
                  <small>*您折让{{detailData.discountFee}}元给受让人，实际还款本金不再包括该部分资金<br>
                    *债权转让折让金额=转让本金*折让率<br>
                    <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:detailData.orderState}}">
                      查看债权转让详情
                    </router-link>
                  </small>
                </dd>
              </dl>
              <dl>
                <dt>{{detailData.orderState*1 == 2 || detailData.orderState*1 == 4 || detailData.orderState*1 == 6 ? '已获回报' : '预期回报'}}</dt>
                <dd>
                    {{detailData.investTotalProfit}}元<span v-cloak v-if="hasInterest && mainReward.length > 0" class="gift" @click="showShouyiLayer">{{mainReward.length}}个奖励</span>
                    <small>*预期回报按放款起息时成功出借金额计算（日后可能会因为某些标的提前还款导致预期回报有波动）。

                    </small>
                  <small v-if="detailData.orderState=='5'"> *因您已对本订单发起债权转让，转让成功后未产生的利息将不再产生，未产生的加息奖励将作废
                  </small>

                  <small v-if="detailData.orderState=='6'">*因本订单已债权转让成功，未产生的利息将不再产生，未产生的加息奖励将作废</small>
                </dd>
              </dl>
              <dl v-if="isOldSys == 0 && otherRewardTotal > 0">
                  <dt>额外返现奖励</dt>
                  <dd>
                      <span><strong>{{otherRewardTotal|currency}}</strong>元</span>
                      <small>*额外返现奖励将直接返现至笑脸账户余额</small>
                      <small v-for="item in otherReward">*{{item.title}}: {{item.rewardAmount}} {{item.status*1 == 1 || item.rewardType == '111' ? '已到账' : '订单结清时到账'}}</small>
                      <!-- <small v-if="profitData!=''">*返现卡返现：{{profitData.amount}}元（{{profitData.status*1 != 1 ? ('订单结清时到账') : '已到账'}} ）</small>
                      <small v-if="detailData.firstAddCash&&detailData.firstAddCash*1>0">*首购返现：{{detailData.firstAddCash}}元（已到账）</small> -->
                  </dd>
              </dl>

              <dl>
                  <dt v-if="detailData.assetType=='70'">标的期限</dt>
                  <dt v-else>已投债权期限</dt>
                  <dd>{{isOldSys == 1 ? detailData.orderDeadLine : (detailData.termCount + ' ' + termUnit[detailData.termUnit])}}</dd>
              </dl>
              <dl>
                      <dt>借款合同约定年化利率</dt>
                      <dd>{{detailData.rate}}
                          <small v-if="detailData.repaymentType == 1">*在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报 </small>
                      <small v-if="detailData.repaymentType == 3">*年化利率不代表实际利息。在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借</small>
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
            <!--三种状态-->
            <!--正常-->
            <div class="claimIn" v-if="detailData.enableTransfer=='1'">*截至今日，预计最后一期出借资金撤出时间为{{detailData.repaymentRemainDays}}天后<router-link :to="{ path: '/claimsOutDetail',query: {orderId : orderId}}">债转退出</router-link>
            </div>

          </div>
          <!--已发起-->
          <div class="claimFq" v-if="detailData.orderState=='5'||detailData.orderState=='6'">在债权转让成功之前，待还本金、待还利息和待还奖励将按照还款计划还款至您的账户余额。
          </div>
          <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:detailData.orderState}}" class="claimFqDetail" v-if="detailData.orderState=='5'">
              <span class="span2">转让中
              </span>
                <span class="span1">债权转让状态
              </span>
                <i class="iconfont icon-ic_rightarrow"></i>
          </router-link>
          <!--已完成-->
          <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:detailData.orderState}}" class="claimFqDetail"  v-if="detailData.orderState=='6'">
              <span class="span2">转让已完成
              </span>
            <span class="span1">债权转让状态
              </span>
            <i class="iconfont icon-ic_rightarrow"></i>

          </router-link>
          <services showItem="online, feedback" :rid="orderId" :sourceType="orderType == 'autoBidding' ? 'automatic-bidding-order' : 'intelligent-recommendation-order'"></services>
        </div>
        <div v-show="tabIndex_2" class="airList" ref="airList">
              <ul class="list-type-1">
                <li v-for="(item, index) in creditListData" v-on:click="gotoPage(item)"
                class="sensors-btn" sensors-name="智能出借_查看债权详情">
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
        <div class="wapMc" v-show="wapMcStatus" style="display:block">
        </div>

        <div class="layer_style" v-show="shouyiStatus" v-cloak>
            <div class="layer_content" style="text-align:left;line-height:1.5rem;padding:.5rem 1rem;margin:0">
                <div class="layer_profit_list">
                    <dl v-for="t in mainReward">
                        <dt><p>{{t.title}}</p><span>{{t.content}}</span></dt>
                        <dd>{{utils.currency(t.rewardAmount)}}<span>元</span></dd>
                    </dl>
                </div>
            </div>
            <div class="layer_btn one">
                <a href="javascript:;" @click="hideShouyiLayer()">知道了</a>
            </div>
        </div>
  </div>
</template>

<style src="assets/wapFront/common/css/investRecordDetail.css"></style>
<style>
  .claimIn{
    color: #848999;line-height: 1.25rem;padding: 0.5rem 0; font-size: 0.75rem;
     border-top: 1px #dfe3eb solid;
  }
  .claimIn a{margin-left: 0.5rem;color: #F0484E;font-size: 0.75rem}
  .claimFq{color: #848999;line-height: 1.25rem;padding: 0.5rem 1rem; font-size: 0.75rem;background: #FEF5E8;
    border-top: 1px #dfe3eb solid;color: #F48A12;margin-top: -0.46875rem;margin-bottom: 0.625rem;
  }
  .claimFqDetail{overflow: hidden;display:block;position: relative;border-bottom: 1px #dfe3eb solid;background-color: #ffffff;padding-left: 1rem;}
  .claimFqDetail:last-child{border-bottom: 0;}
  .claimFqDetail .span1 {
    color: #2B313D;
    font-size: 1rem;
    line-height: 3.25rem;
    margin-right: 0.5rem;

  }
  .claimFqDetail .span2 {
    float: right;  line-height: 3.25rem;  margin-right: 2rem;color: #848999;font-size: 1rem;
  }
  .claimFqDetail i{font-style:normal;font-weight:normal;color: #CED2D8;position: absolute;right: 0.6rem;top: 1.1rem;}
</style>
<script>
import * as constants from './autoInvestRecordDetailConstants';
import {utils,globalVariable} from'tools';
import orderDynamicDetail from '@/components/orderDynamicDetail';

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

            shouyiStatus: false,
            wapMcStatus: false,

            //是否已起息
            hasInterest: false,
            stateClass: 'state_',
            orderState: ['系统出借中', '计息中', '已结清','','','债权转让中','债权转让已完成'],
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
        }
    },
    created: function() {
        this.orderId = this.$route.query.orderId;
        this.isOldSys = this.$route.query.isOldSys;
        this.orderType = this.$route.query.orderType;
    },
    mounted : function(){

        this.getOrderDetail();
        if(this.isOldSys*1 == 0){
            this.getOrderProfit();
        }
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
        showShouyiLayer: function() {
            this.shouyiStatus = true;
            this.wapMcStatus = true;
        },
        hideShouyiLayer: function() {
            this.shouyiStatus = false;
            this.wapMcStatus = false;
        },
        getOrderDetail: function() {
            var _this = this;
            $.ajax({
                url: utils.AJAXDOMAINNAME+ (_this.isOldSys*1 == 1 ? '/wap/order/oldOrderDetail' : '/wap/order/intelligenceOrderDetail'),
                data: '{"orderId":"' + _this.orderId + '"}',
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
        getOrderProfit: function() {
            /*var _this = this;

            $.ajax({
                url: utils.AJAXDOMAINNAME+'/wap/getOrderCashBack ',
                data: '{"orderId":"' + _this.orderId + '"}',
                async : false,
                success: function(res) {
                    if (res.code == 1) {
                        _this.profitData = res.data ? res.data : '';
                    }
                }
            })*/
        },
        getCreditList: function() {
            this.isLoading=true;
            this.reloadDataStatus=false;
            this.isDisable=false;
            var _this = this;
            var api = utils.AJAXDOMAINNAME + (_this.isOldSys*1 == 1 ? '/wap/order/oldCreditList' : '/wap/order/creditList');
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
                path : this.isOldSys*1 == 1 ? '/directRecordDebtDetailOld' : '/directRecordDebtDetail',
                query : {
                    creditId : item.creditId,
                    loanId : item.loanId,
                    orderId : this.orderId,
                    isOldSys : this.isOldSys,
                    investContract : item.investContract,
                    bizStatus : item.bizStatus,
                    amount : item.amount,
                }
            })
        }
    },
    components: {orderDynamicDetail}
}
</script>
