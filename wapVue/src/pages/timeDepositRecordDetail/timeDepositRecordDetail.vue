<template>
  <div class="timeDepositRecordDetail" ref="detailPage">
      <div id="pageContent">
          <div class="detailTips">到期后自动转让退出，资金实际到账以债权实际转让成功为准</div>

          <div class="overBox" v-if="orderDetail.orderState*1 == 2">
              <div class="bg"></div>
              <div class="top_box">
                  <div class="order_name">{{orderDetail.orderName}}</div>
                  <div class="bar"></div>
                  <div class="order_info">
                      <div class="cont">
                          <div class="desc" v-if="isMoreRate">超预期完成，实际总回报(元)</div>
                          <div class="desc" v-else>符合预期，实际总回报(元)</div>
                          <div class="money">
                              {{utils.currency(orderDetail.realTotalProfit)}}
                              <i v-if="isMoreRate"></i>
                          </div>
                          <div class="upTips" v-if="isMoreRate">比预期总回报{{utils.currency(orderDetail.investTotalProfit)}}元多赚了<span>{{utils.currency(orderDetail.moreoverInterest)}}</span>元，赞一个！</div>
                          <div class="isOver"></div>
                          <ul>
                              <li>
                                  <p>{{utils.currency(orderDetail.amount)}}</p>
                                  <span>出借金额(元)</span>
                              </li>
                              <li>
                                  <p>{{orderDetail.termCount}}</p>
                                  <span>产品期限({{orderDetail.termUnit*1 == 1 ? '天' : orderDetail.termUnit*1 == 3 ? '月' : ''}})</span>
                              </li>
                              <li>
                                  <p>{{isMoreRate ? orderDetail.rate : orderDetail.realRate}}%
                                      <em v-if="isMoreRate">+{{orderDetail.moreoverInterestRate}}%</em>
                                      <i v-if="isMoreRate" class="iconfont icon-inf_huaban" @click="showInterestDescLayer2">&nbsp;</i>
                                  </p>
                                  <span>实际年化回报率</span>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
          <div class="stitle" v-if="orderDetail.orderState*1 == 2">实际回报明细</div>

          <div class="top" v-if="orderDetail.orderState*1 != 2">
              <div class="matchInfo">
                  <p class="p1"><span>{{orderState[orderDetail.orderState]}}</span>{{orderDetail.orderName}}</p>
                  <div class="info">
                      <p>
                          <span>{{utils.currency(orderDetail.amount)}}</span>出借金额(元)
                      </p>
                      <p>
                          <span>{{orderDetail.rate}}<i>%</i></span>期待年化回报率<i class="iconfont icon-inf_huaban" @click="showInterestDescLayer">&nbsp;</i>
                      </p>
                  </div>
              </div>
          </div>
          <div class="matchInfoList">
              <dl>
                  <dt>应收利息<!--<i class="iconfont icon-inf_huaban">&nbsp;</i>--></dt>
                  <dd>{{orderDetail.basicInterest}}<span>元</span></dd>
              </dl>
              <dl v-for="t in orderDetail.rewardList">
                  <dt><p>{{t.title}}</p><span>{{t.content}}</span></dt>
                  <!--status;//发放状态 0未发放  1已发放-->
                  <dd :class="{'sended' : t.status*1 == 1}">{{t.rewardAmount}}<span>元</span></dd>
              </dl>
              <div class="profit_count" v-if="orderDetail.orderState*1 != 2"><span>{{utils.currency(orderDetail.investTotalProfit)}}<i>元</i></span>预期总回报</div>
          </div>

          <div class="pro_box" v-if="orderDetail.orderState*1 == 5">
              <div class="title"><p>剩余债权</p><em>转让中</em><p class="right">{{orderDetail.remainCreditCount}}<span>个</span></p></div>
              <div class="desc">历史同期约3个工作日内将全部退出完成</div>
          </div>

          <div class="pro_box" v-if="orderDetail.orderState*1 == 1">
              <div class="title">距锁定期结束剩余 {{orderDetail.remainDays}}</div>
              <div class="pro_bar_box">
                  <div class="line">
                      <div class="font" :style="'left:' + (orderDetail.unlockSchedule ? orderDetail.unlockSchedule*1 : 0) + '%'">{{orderDetail.unlockSchedule || 0}}%</div>
                      <div class="sline" :style="'width:'+ (orderDetail.unlockSchedule ? orderDetail.unlockSchedule*1 : 0)+'%'"></div>
                  </div>
                  <div class="date">
                      <span class="left">{{orderDetail.startInterestDate}}</span>
                      <span class="right">{{orderDetail.endInterestDate}}</span>
                  </div>
              </div>
          </div>
          <div class="menu_item">
              <router-link class="item" :to="{ path: '/orderTransactionRecord', query : {orderId : orderId}}">
                  <p>
                      <span>交易明细</span>
                      <i class="iconfont icon-ic_rightarrow"></i>
                      <em class="import" v-if="orderDetail.orderJournalPoints*1 == 1"></em>
                  </p>
              </router-link>
              <router-link class="item" :to="{ path: '/timeDepositRecordDebtList', query : {orderId : orderId}}">
                  <p>
                      <span>债权明细</span>
                      <i class="iconfont icon-ic_rightarrow"></i>
                  </p>
              </router-link>
          </div>
          <div class="xieyi_list">
              <a :href="it" v-for="(it, key) in investContract">{{key}}</a>
          </div>

          <services showItem="online, feedback" :rid="orderId" sourceType="closed-period-order"></services>

          <!-- <div class="amdList" v-if="creditListData.length > 0">
                <div class="list_title">债权明细</div>
          		<ul class="list-type">
                    <onSaleItem v-for="(item, index) in creditListData" :key="index" :item="item" itemType="credit" @click.native="gotoPage(item)" v-if="index < 3"></onSaleItem>

          		</ul>
          </div>
          <div class="matchCount" v-if="creditListCount*1 > 3" @click="toCreditList()">
              <span class=""><i class="iconfont icon-ic_rightarrow"></i></span>
              <a class="viewMore" href="javascript:;">
                  查看更多债权明细 {{creditListCount}}个
              </a>
          </div> -->
          <div class="blank"></div>
          <footerButtonToLoanList v-if="orderDetail.orderState*1 == 2" text="再去出借一笔吧"></footerButtonToLoanList>
          <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
      </div>
      <!--统一提示层-->
      <tipLayer ref="tipLayer"></tipLayer>
  </div>
</template>

<!-- <style src="assets/wapFront/common/css/investRecordDetail.css"></style> -->
<style src="./timeDepositRecordDetail.css"></style>

<script>
import * as constants from './timeDepositRecordDetailConstants';
import onSaleItem from '@/components/onSaleItem';

import progressCircle from '@/components/progressCircle';

import {utils} from 'tools';
export default {
    name:    constants.NAME,
    components:{onSaleItem, progressCircle},
    data() {
        return {
            orderId: '',
            creditId: '',
            loanId: '',

            fullScreenLoadingShow : true,

            orderDetail : '',
            //creditListData : [],
            creditListCount: 0,

            pageNum : 1,

            //是否已起息
            hasInterest: false,
            stateClass: 'state_',
            orderState: ['系统出借中', '持有中', '已结清', '流标', '提前还款', '退出中'],

            termUnit: ['', '天', '周', '月', '年'],

            //repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],

            //还款进度
            progressPP: '0%',


            profitData : '',

            isLoading:true,
            reloadDataStatus:false,
            isDisable:true,
            enLong:false,

            investContract : {},
            isMoreRate : false,
        }
    },
    created: function() {
        var _this = this;
        this.orderId = this.$route.query.orderId;
    },
    mounted : function(){
        var _this = this;
        this.getOrderDetail();
        document.title=constants.TITLE;

    },
    methods: {
        toCreditList(){
            this.$router.push({
                name : 'timeDepositRecordDebtList',
                query : {
                    orderId : this.orderId
                }
            })
        },
        substrings(val){
            if(!val) return;
            var lastVal = this.len(val) > 8 ? (val.substring(0,8) + '...') : val.substring(0,8)
            return lastVal;
        },
        len : function(s){
            if(!s) return '';
            var l = 0;
            var a = s.split("");
            for (var i=0;i<a.length;i++) {
                if (a[i].charCodeAt(0)<299){
                    l++;
                }else{
                    l+=2;
                }
            };
            return Math.ceil(l/2);
        },
        showInterestDescLayer(){
            this.$refs.tipLayer.showByParame({
                title : '期待年化回报率',
                content : '期待年化回报率不代表您的实际回报率，出借人的实际收益取决于锁定期内是否及时成功匹配借款人以及借款人是否按期足额偿还借款本息等情况。您在加入月月笑产品之前应主动了解该产品信息，理解并接受自身的交易行为可能存在不能够按期收回出借资金本息的风险，笑脸金融平台不对您在“月月笑”产品下本息的收回作出任何承诺、保证。',
                textAlign : 'left',
                btnText : '知道了'
            })
        },
        showInterestDescLayer2(){
            this.$refs.tipLayer.showByParame({
                title : '实际年化回报利率',
                content : '实际年化回报利率 =  ( 实际基础回报 + 会员/红包 加息奖励 + 卡券返现奖励 + 首购返现奖励 )  /  [ 出借本金 x  (锁定天数/365) ] ',
                textAlign : 'left',
                btnText : '知道了'
            })
        },
        gotoPage:function(item){
            this.$router.push({
                path : '/directRecordDebtDetail',
                query : {
                    creditId : item.creditId,
                    loanId : item.loanId,
                    orderId : this.orderId,
                    investContract : item.investContract,
                    bizStatus : item.bizStatus,
                    amount : item.amount,
                    proType : 'deposit'
                }
            })
        },
        getOrderDetail: function() {
            var _this = this;

            $.ajax({
                url: utils.AJAXDOMAINNAME+'/wap/order/sdqOrderDetail',
                data: '{"orderId":"' + _this.orderId + '"}',
                success: function(res) {
                    _this.fullScreenLoadingShow = false;
                    if (res.code == 1) {
                         _this.orderDetail = res.data;
                         _this.isMoreRate = _this.orderDetail.moreoverInterestRate*1 > 0 && _this.orderDetail.moreoverInterest*1 > 0;
                         _this.investContract = JSON.parse(res.data.investContract)
                    }
                }
            })
        },

    }
}
</script>
