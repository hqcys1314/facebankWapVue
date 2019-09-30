<template>
  <div class="calContent">
    <div class="calContentTip" v-if="showCct">点击日历上任意一天，查看当日还款情况
    </div>
    <div v-else>
        <div class="calContentMain" v-if="paybackList&&((paybackList.repaymentItemList!='' && paybackList.repaymentItemList!= null && paybackList.repaymentItemList.length> 0)||(paybackList.repaymentPreItemList!='' && paybackList.repaymentPreItemList!= null && paybackList.repaymentPreItemList.length> 0)||(paybackList.transferOutOrderList!='' && paybackList.transferOutOrderList!= null && paybackList.transferOutOrderList.length> 0))">
           <!-- 提前还款 -->
           <div class="repayAdvance" v-if="paybackList.advanceRepayAmount*1>0">
                 <div class="repayMoney">
                    <p class="p1">提前还款金额(元)</p>
                    <p class="p2"><span class="span1">{{paybackList.advanceRepayAmount| currency}}</span></p>
                    <span class="spanIcon"><img src="~assets/wapFront/myAccount/img/Group.png" alt="">
                    </span>
                 </div>
                 <div class="repayDetail" >
                    <ul>
                      <li v-for="(item,index) in paybackList.repaymentPreItemList" v-if="item.repayState=='3'||item.repayState=='4'">
                        <a href="javascript:;" @click="goDetail(item,false)">
                        <!--<router-link :to="{ path: '/repaymentCalendaTransDetail', query: {orderId:item.orderId,searchYear:searchYear,searchMonth:searchMonth,searchDay:searchDay} }">-->
                           <p class="p1">
                               <span class="span1">{{item.repayAmount| currency }}</span>
                               <span class="span2" v-if="item.repayState==3">部分债权提前还款<i class="iconfont icon-ic_rightarrow"></i></span>
                               <span class="span2" v-if="item.repayState==4">提前还款<i class="iconfont icon-ic_rightarrow"></i></span>

                           </p>
                           <p class="p2">
                              <span class="span1">{{item.orderName}} </span>
                           </p>
                         <!--</router-link>-->
                        </a>
                      </li>
                    </ul>
                 </div>
           </div>
            <!--债权转让-->
          <div class="repayAdvance" v-if="paybackList.transferOutOrderList">
            <div class="repayMoney">
              <p class="p1">债权转让获得金额(元)</p>
              <p class="p2"><span class="span1">{{paybackList.transferAmount| currency}}</span></p>
              <span class="spanIcon"><img src="~assets/wapFront/myAccount/img/group2.png" alt="">
                    </span>
            </div>
            <div class="repayDetail" >
              <ul>
                <li v-for="(item,index) in paybackList.transferOutOrderList">
                  <a href="javascript:;" @click="goDetailTrans(item)">
                    <p class="p1">
                      <span class="span1">{{item.repayAmount| currency }}</span>
                      <span class="span2">债权转让完成<i class="iconfont icon-ic_rightarrow"></i></span>

                    </p>
                    <p class="p2">
                      <span class="span1">{{item.orderName}} </span>
                    </p>
                    <!--</router-link>-->
                  </a>
                </li>
              </ul>
            </div>
          </div>

         <!-- 正常还款 -->
           <div class="repayNormal" v-if="paybackList.repaymentItemList">
               <!--//0,待还款;1,还款中;2, 已还款 3;无还款-->
               <!-- 是否代偿isNextDay==true  1代偿-->
               <div class="repayTip" v-if="stateMoney=='2' && isNextDay">
                   部分债权还款，会由于银行结算时间原因，在下一个工作日到账，实际到账时间可能跨天。
               </div>
              <div class="repayMoney" v-if="stateMoney != '0'">
                 <p class="p1">已还金额(元) / 当日应还金额(元)</p>
                 <p class="p2"><span class="span1">{{paybackList.infectRepayAmount| currency}}</span>  /  {{paybackList.shouldRepayAmount| currency}}</p>
              </div>
              <div class="repayMoney" v-if="stateMoney == '0'">
                 <p class="p1">当日应还金额(元)</p>
                 <p class="p2"><span class="span1">{{paybackList.shouldRepayAmount| currency}}</span></p>
              </div>
              <div class="calTips" v-if="(stateMoney == '1'&&!isNextDay)&&isShowCalTips">
                  <a href="javascript:;" class="close" @click="()=>{this.isShowCalTips=false}">&nbsp;</a>
                  <h6 v-if="countTime > 0">小提示：</h6>
                  <p v-if="countTime > 0" class="time"><small>回款资金预计在</small><span>{{tian}}</span><i class="day">天</i><span>{{shi}}</span><i class="mh">:</i><span>{{fen}}</span><small> 内可全部到账</small></p>
                  <h6>{{paybackList.question}}</h6>
                  <div v-html="answer"></div>
              </div>

              <div class="repayDetailTitle">还款明细
              </div>
              <div class="repayDetail">
                 <ul>
                   <li v-for="(item,index) in paybackList.repaymentItemList" v-if="item.repayState=='0'||item.repayState=='1'||item.repayState=='2'">
                     <a href="javascript:;" @click="goDetail(item,true)">
                     <!--<router-link :to="{ path: '/repaymentCalendaTransDetail', query: {orderId:item.orderId,searchYear:searchYear,searchMonth:searchMonth,searchDay:searchDay} }">-->
                        <p class="p1">
                            <!--item.autoInvest 不等于０就是自动投标-->
                            <span class="span1">{{item.repayAmount| currency }}元
                                <em class="autoInvest" v-if="item.autoInvest && item.autoInvest*1 != 0">自动投标</em>
                                <em class="timeDeposit" v-if="item.assetType*1 == 100">月月笑</em>
                            </span>
                            <span class="span2" v-if="item.repayState=='0'">待还款<i class="iconfont icon-ic_rightarrow"></i></span>
                            <span class="span2" v-if="item.repayState=='1'">还款中<i class="iconfont icon-ic_rightarrow"></i></span>
                            <span class="span2" v-if="item.repayState=='2'">已还款<i class="iconfont icon-ic_rightarrow"></i></span>
                        </p>
                        <p class="p2">
                           <span class="span1">{{item.orderName}}</span>
                        </p>
                      <!--</router-link>-->
                     </a>
                   </li>
                 </ul>
              </div>
          </div>
      </div>
      <div class="calContentTip" v-else>当日无还款
      </div>
    </div>
    <feedbackEntrance v-if="paybackList&&((paybackList.repaymentItemList!='' && paybackList.repaymentItemList!= null && paybackList.repaymentItemList.length> 0)||(paybackList.repaymentPreItemList!='' && paybackList.repaymentPreItemList!= null && paybackList.repaymentPreItemList.length> 0))" sourceType="payment-calendar" type="1"></feedbackEntrance>
  </div>
</template>
<script>
import {utils,globalVariable} from'tools'
export default {
  name:'calContent',
  props: ['isCctShow','pLeft','searchYear','paybackList','searchMonth','searchDay',
  'stateMoney','isNextDay','isNowDay','desc', 'remainTime', 'isToday'],
  data() {
    return {
      showCct : true,
      showTips : true,
      timer : null,
      countTime : 0,
      isTodays : false,
      tian : 0,
      fen : 0,
      shi : 0,
      answer : '',
      isShowCalTips:true,
    };
  },
  created() {

  },
  updated(){
      if(this.paybackList && this.paybackList.answer.indexOf('@@@') > -1){
          var answer = this.paybackList.answer.split('@@@')
          this.answer = '<p>'+ answer[0] +'</p><p>'+ answer[1] +'</p>'
      }else{
          //console.log(this.paybackList.answer)
          this.answer = '<p>'+ this.paybackList.answer +'</p>';
      }
  },
  methods:{
    goDetail:function (item,isNormal) {
      utils.setCookie('CacheCalendarDate',this.searchYear + '/' + this.searchMonth + '/' + this.searchDay);
      if(item.assetType*1 == 100){
          this.$router.push(
            {
              path: '/timeDepositRecordDetail',
              query: {orderId:item.orderId}
            }
          );
      }else{
          this.$router.push(
            {
              path: '/repaymentCalendarDetail',
              query: {orderId:item.orderId,searchYear:this.searchYear,searchMonth:this.searchMonth,searchDay:this.searchDay,isNormal:isNormal}
            }
          );
      }
    },
    goDetailTrans:function (item) {
        this.$router.push(
          {
            path: '/repaymentCalendaTransDetail',
            query: {orderId:item.orderId,searchYear:this.searchYear,searchMonth:this.searchMonth,searchDay:this.searchDay,transTotal:item.repayAmount}
          }
        );
    },
    countTimer(){
        var _this = this;
        _this.timer = setInterval(function(){
            _this.countTime--;
            if(_this.countTime <= 0){
                window.clearInterval(_this.timer)
            }else{
                var tian = parseInt(_this.countTime/(60*60*24)),
                    shi = parseInt(_this.countTime/60/60) % 24,
                    fen = parseInt(_this.countTime%(60*60)/60);
                    _this.tian = tian > 9 ? tian : '0'+tian;
                    _this.shi = shi > 9 ? shi : '0'+shi;
                    _this.fen = fen > 9 ? fen : '0'+fen;
            }
        },1000)
    }
  },
  watch : {
    isCctShow: function(val){
      this.showCct = val;
   },
   isToday:function(val){
       this.isTodays = val;
   },
   searchDay:function(val){
     this.showCct = this.isCctShow;
     this.isShowCalTips=true;
   },
   remainTime:function(val){
       window.clearInterval(this.timer)
       //console.log('remainTime', val)
       //console.log('searchDay', this.searchDay)
       //if(val*1>0 && this.stateMoney=='1' && (this.isTodays || this.isNextDay)){
       if(val*1>0){
           this.countTime = val;
           this.countTimer();
       }else{
         this.countTime = 0;
       }

   }
  }

}
</script>
<style src="./calContent.less" lang="less"></style>
