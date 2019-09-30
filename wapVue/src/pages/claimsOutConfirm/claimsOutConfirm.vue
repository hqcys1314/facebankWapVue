<template>
  <div class="claimsOutConfirm" id="claimsOutConfirm">
    <div class="bgColor">
      <div class="title">债权转让成功后可获得的金额</div>
      <div class="smallTitle"><span>假设今天发起转让且今天全部转让成功</span></div>
      <div class="card">
        <p class="p1">合计可获得(元)</p>
        <p class="p2">{{(prepareOrderTransfer.waitingPrincipal*1+prepareOrderTransfer.waitingInterest*1-v3-prepareOrderTransfer.serviceFee)|currency}}</p>
      </div>
      <ul>
        <li> <span class="span1">剩余未还本金(债权价值)</span><span class="span2">+{{prepareOrderTransfer.waitingPrincipal|currency}}元</span>
        </li>
        <li> <span class="span1">待收利息(按天数折算)</span><span class="span2">+{{prepareOrderTransfer.waitingInterest|currency}}元</span>
        </li>
        <li v-for="item in prepareOrderTransfer.rewardList">
          <span class="span1">{{item.title}}</span><span class="span2">作废</span>
        </li>

        <li> <span class="span1">折让金额(折让率{{discountRate}}%)<img v-on:click="discountRateShow()" src="https://static.facebank.cn/static/wapFront/calculator/img/i.png" alt=""></span><span class="span2 pred">-{{v3|currency}}元</span>
        </li>
        <li> <span class="span1">转让服务费(服务费率{{prepareOrderTransfer.serviceFeeRate}}%)<img v-on:click="serviceFee()" src="https://static.facebank.cn/static/wapFront/calculator/img/i.png" alt=""></span><span class="span2 pred">-{{prepareOrderTransfer.serviceFee|currency}}元</span>
        </li>
      </ul>
    </div>
    <div class="ctip">
      <p class="pred">最终可获得金额，按实际转出时的债权价值计算</p>

      <p>提示：</p>
      <p>
        1、转出效率由您的债权价值、您设置的折让率、受让人的喜好综合决定；</p>
      <p>
        2、当您发起债权转让后，请及时关注本订单的债转状态</p>


    </div>
    <div style="height: 6rem"></div>
    <div class="footBtn">
      <router-link :to="{ path: '/claimsOutDetail',query: {orderId : orderId}}" class="al">
           修改
      </router-link>
      <input type="button" value="确定债权转让"  class="btn_tpls con" v-on:click="confirmTranStep1()">
    </div>
    <div class="layer_style" v-show="time20show" v-cloak style="padding-top:0;top:25%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;">
      <div class="layer_content" style="text-align:left;padding:0;margin:1.25rem 1.15rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;">
        <p>
          1. 在您发起债权转让后，您的本订单未结清债权将进入债转专区出售。转出所用时间由您的债权价值、您设置的折让率、受让人的喜好综合决定。</p>
        <p>2. 在债转成功之前，待还本金、待还利息和待还奖励将按照还款计划还款之您的账户余额。因此<span style="color:#f48a12;">您的最终可获得金额，需按照实际转出时的债权价值计算。</span></p>
        <p>3. 因为债权转让是自由交易，<span style="color:#f48a12;">笑脸平台无法保证转让成功，也无法干涉转让交易速度。</span></p>
      </div>
      <div class="layer_btn two">
        <a href="javascript:;" style="color: #848999" @click="closeLayer()">关闭</a>
        <a href="javascript:;" id="ctGrey" :class="{'ctGrey':confirmTranStepDisable}" @click="confirmTranStep2()">发起债转<span v-show="time20*1>0">({{time20}}s)</span></a>
      </div>
    </div>
    <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>


    <claimsAgreementLayer
      :show.sync="showAgreementStateLayer"
      :proInfo.sync="productData"
      @investConfirm="investConfirm"
      @abandonSelectChange="abandonSelectChange"
    ></claimsAgreementLayer>
    <tipLayer ref="tipLayer" :showInputMask.sync="layerInputMaskShow"></tipLayer>
    <discountRateTk  :dicountShow="dicountShowV" v-on:closeDiscount="closeDiscount()"></discountRateTk>
    <claimsTranSevice  :fwfShow="fwfShowV" v-on:closeLayer="closeLayer()"></claimsTranSevice>
  </div>
</template>

<style lang="less" src="./claimsOutConfirm.less"></style>

<script>
  import * as constants from './claimsOutConfirmConstants';
  import claimsAgreementLayer from '@/components/claimsAgreementLayer';
  import discountRateTk from '@/components/discountRateTk';
  import claimsTranSevice from '@/components/claimsTranSevice';

  export default {
    name: constants.NAME,
    data() {
      return {
        showAgreementStateLayer : false,
        productData : '',
        discountRate:'',
        orderId:'',
        prepareOrderTransfer:'',
        fqBtnDisable:false,
        layerInputMaskShow:false,
        dicountShowV:false,
        fwfShowV:false,
        v3:'',
        serviceFeeRate:'0',
        time20show:false,
        layerMaskStatus:false,
        time20:20,
        confirmTranStepDisable:false,//倒计时中不可点击
        timer:'',
      }
    },
    created:function () {
      this.orderId = this.$route.query.orderId;
      this.discountRate = this.$route.query.discountRate;
      var _this=this;
      $.ajax({
        url: this.utils.AJAXDOMAINNAME + "/wap/prepareOrderTransfer/v1.0?orderId="+this.orderId,
        async:false,
        type:'GET',
        success: function(res) {
          if (res.code == 1) {
            _this.prepareOrderTransfer = res.data;
            _this.serviceFeeRate=res.data.serviceFeeRate;
            _this.v3=_this.prepareOrderTransfer.waitingPrincipal*(_this.discountRate/100);

          }
        }
      })
    },
    methods: {
      confirmTranStep1(){
        this.time20show = true;
        this.layerMaskStatus=true;
        this.confirmTranStepDisable=true;
        var _this=this;
        this.timer=setInterval(function () {
          if(_this.time20*1>0){
            _this.confirmTranStepDisable=true;
            _this.time20--;
          }else{
            _this.time20=0;
            _this.confirmTranStepDisable=false;
          }
        },1000)
      },
      confirmTranStep2(){
        if(this.confirmTranStepDisable) return;
        this.showAgreementStateLayer = true;
        this.time20show = false;
        this.layerMaskStatus=false;
      },
      abandonSelectChange(){
        this.showAgreementStateLayer = false;
        this.layerMaskStatus=false;
        clearInterval(this.timer);
        this.time20=20;
      },
      investConfirm(){
        if(this.fqBtnDisable) return;
        this.fqBtnDisable=true;
        var _this=this;
        //获取提现中列表
        $.ajax({
          url: this.utils.AJAXDOMAINNAME + "/wap/orderTransfer/add",
          data:'{"orderId":"'+this.orderId+'","rate":"'+this.discountRate+'","serviceFeeRate":"'+this.serviceFeeRate+'"}',
          complete(){
            clearInterval(_this.timer);
            _this.time20=20;
          },
          success: function(res) {
            if (res.code == 1) {
              _this.$router.push({
                path : '/claimsOutSuc',

              })
            }else{
              _this.fqBtnDisable=false;
              _this.layerInputMaskShow=true;
              _this.$refs.tipLayer.showLayer('1', res.message);
            }
          },
          error:function () {
            _this.fqBtnDisable=false;
          }
        })
      },
      discountRateShow(){
        this.dicountShowV=true;
      },
      closeDiscount(){
        this.dicountShowV=false;
      },
      closeLayer(){
        this.fwfShowV=false;
        this.time20show=false;
        this.layerMaskStatus=false;
        clearInterval(this.timer);
        this.time20=20;
      },
      serviceFee(){
        this.fwfShowV=true;
      },
    },
    components: {claimsAgreementLayer,discountRateTk,claimsTranSevice}
  }
</script>
