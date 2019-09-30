<template>
  <div class="claimsOutOrderStatus" id="claimsOutOrderStatus">
    <div class="bgColor">
      <div class="title">债权转让状态<span class="span1" v-if="orderState=='5'">转让中</span><span class="span2" v-if="orderState=='6'">已完成</span></div>
      <div class="smallTitle"  v-if="orderState=='5'"><span>假设今天转让成功</span></div>
      <div class="smallTitle"  v-if="orderState=='6'"><span>该订单已于{{orderTransferResult.transferOutDate}}完成债权转让</span></div>

      <div class="card">
        <p class="p1">合计可获得(元)</p>
        <p class="p2">{{orderTransferResult.totalAmount}}</p>
      </div>
      <ul>
        <li> <span class="span1" v-if="orderState=='5'">剩余未还本金(债权价值)</span><span class="span1" v-if="orderState=='6'">已转让本金(债权价值)</span><span class="span2">+{{orderTransferResult.waitingPrincipal}}元</span>
        </li>
        <li> <span class="span1" v-if="orderState=='5'">待收利息(按天数折算)</span><span class="span1" v-else>已获得利息(按天数折算)</span>
          <span class="span2">+{{orderTransferResult.waitingInterest}}元</span>
        </li>
        <li v-for="item in orderTransferResult.rewardList">
          <span class="span1">{{item.title}}</span><span class="span2">作废</span>
        </li>

        <li> <span class="span1">折让金额(折让率{{orderTransferResult.discountFeeRate}}%)<img v-on:click="discountRate()" src="https://static.facebank.cn/static/wapFront/calculator/img/i.png" alt=""></span><span class="span2 pred">-{{orderTransferResult.discountFee}}元</span>
        </li>
        <li> <span class="span1">转让服务费(服务费率{{orderTransferResult.serviceFeeRate}}%)<img v-on:click="serviceFee()" src="https://static.facebank.cn/static/wapFront/calculator/img/i.png" alt=""></span><span class="span2 pred">-{{orderTransferResult.serviceFee}}元</span>
        </li>
      </ul>
    </div>
    <div class="ctip">
      <p class="pred" v-if="orderState=='5'">最终可获得金额，按实际转出时的债权价值计算</p>

      <p>提示：</p>

      <p>
        1、在债权转让成功之前，待还本金、待还利息和待还奖励将按照还款计划还款至您的账户余额
      </p>
      <p>2、可获得金额=实际转让本金*（1-折让率）+债权当期待收利息-转让服务费
      </p>
    </div>
    <div style="height: 6rem"></div>

    <div class="footBtn" v-if="orderState=='5'">
      <input type="button" value="债权取消中" v-if="orderTransferResult.bizStatus==180||btnShow"  disabled="disabled" class="btn_tpls disabled">
      <input type="button" value="取消债转" v-else  class="btn_tpls goInvest" :class="{'disabled':cancelTransDisable}" v-on:click="cancelTrans()">
    </div>
    <discountRateTk  :dicountShow="dicountShowV" v-on:closeDiscount="closeDiscount()"></discountRateTk>
    <claimsTranSevice  :fwfShow="fwfShowV" v-on:closeLayer="closeLayer()"></claimsTranSevice>
    <tipLayer ref="tipLayer" :showInputMask.sync="layerInputMaskShow"></tipLayer>
    <tosat :content.sync="tosatContent" :show.sync="tosatShow" @tosatFns="tosatFn" ref="tosat"></tosat>

  </div>
</template>

<style lang="less" src="./claimsOutOrderStatus.less"></style>

<script>
  import * as constants from './claimsOutOrderStatusConstants';
  import discountRateTk from '@/components/discountRateTk';
  import claimsTranSevice from '@/components/claimsTranSevice';

  export default {
    name: constants.NAME,
    data() {
      return {
        orderTransferResult:'',
        orderState:'',
        dicountShowV:false,
        fwfShowV:false,
        tosatContent:'',
        tosatShow:false,
        layerInputMaskShow:false,
        cancelTransDisable:false,
        btnShow:false,
      }
    },
    created:function () {
      this.orderId = this.$route.query.orderId;
      this.orderState = this.$route.query.orderState;

      var _this=this;
      $.ajax({
        url: this.utils.AJAXDOMAINNAME + "/wap/orderTransferResult/v1.0?orderId="+this.orderId,
        type:'GET',
        success: function(res) {
          if (res.code == 1) {
            _this.orderTransferResult = res.data;
          }
        }
      })
    },
    methods: {
      cancelTrans(){
        if(this.cancelTransDisable) return;
        this.cancelTransDisable=true;
        var _this=this;
        $.ajax({
          url: this.utils.AJAXDOMAINNAME + "/wap/orderTransfer/cancel",
          data:"{'orderId':"+_this.orderId+"}",
          success: function(res) {
            if (res.code == 1) {
              _this.btnShow=true;
              _this.$refs.tipLayer.showLayer('1', '已申请取消债转<br>大约几分钟可以取消成功', '','','确定',function () {
                _this.btnShow=true;
                window.history.go(-1);
              });
            }else {
              _this.$refs.tosat.tosatShow({
                msg : res.message,
                time : 2
              }, function(){
                _this.cancelTransDisable=true;
              })
            }
          },
          error:function () { _this.cancelTransDisable=true;
          }
        })
      },
      discountRate(){
        this.dicountShowV=true;
      },
      closeDiscount(){
        this.dicountShowV=false;
      },
      closeLayer(){
        this.fwfShowV=false;
      },
      serviceFee(){
        this.fwfShowV=true;
      },
      tosatFn(){

      }
    },
    components: {discountRateTk,claimsTranSevice},
  }
</script>
