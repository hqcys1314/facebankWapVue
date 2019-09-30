<template>
  <div class="claimsOutDetail">
     <div class="bgColor">
       <div class="title">债权转让-订单当前状态</div>
       <div class="smallTitle">截至今日，预计最后一期出借资金撤出时间为<span>{{prepareOrderTransfer.remainDays}}天</span>后</div>
       <ul>
         <li> <span class="span1">剩余未还本金(债权价值)</span><span class="span2">{{prepareOrderTransfer.waitingPrincipal}}元</span>
         </li>
         <li> <span class="span1">待收利息</span><span class="span2">{{prepareOrderTransfer.waitingAllInterest}}元</span>
         </li>
         <li v-for="item in prepareOrderTransfer.rewardList">
           <span class="span1">{{item.title}}</span><span class="span2">{{item.amount}}元</span>
         </li>

       </ul>
     </div>
     <div class="fl">
       <span class="span1">转让服务费费率<img v-on:click="serviceFee()" src="https://static.facebank.cn/static/wapFront/calculator/img/i.png" alt=""></span><span class="span2">{{prepareOrderTransfer.serviceFeeRate}}%</span>
     </div>
    <div class="footBtn">
      <input type="button" value="设置折让率"  class="btn_tpls goInvest" v-on:click="setRate()">
    </div>

    <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>
    <div class="layer_setRate" v-show="layer_setRate">
      <div class="layer_title">
        <a href="javascript:;" id="closeInvestLayer" class="close" @click="close()"></a>
        <div class="d1">设置折让率</div>
      </div>
      <div class="layer_content">
        <div class="input">
          <input  type="number" placeholder="请输入折让率，0%-40%" v-model="discountRate"/>
          <div class="unit">%</div>

        </div>
        <div v-show="calResultShow" class="other otherBl" >
          假设今天发起转让且今天全部转让成功，受让人可以向您支付<span>{{v1}}</span>元，获得您价值<span>{{v2}}</span>元的债权（即：为提高债转速度，您愿意折让<span>{{v3}}</span>元给受让人）
        </div>
        <div class="other">
          <p>1、一般情况下，折让率越高，债权转让的效率越高，售出速度越快；</p>
          <p>2、出让价格=债权价值*（1-折让率）。</p>
          <p>3、折让率仅对债权价值(剩余未还本金)生效</p>
          <p>4、最终的出让价格，由最终转让成功时转出的债权价值决定
          </p>

          <p class="pred" v-on:click="discountRateTk()">什么是折让率?</p>

        </div>
      </div>
      <input class="btn_tpls" v-if="fqBtnDisable" type="button" @click="fqTranStep1()" value="下一步" />
      <input class="btn_tpls disabled" v-else disabled="disabled" type="button" @click="fqTranStep1()" value="下一步" />

    </div>


    <tipLayer ref="tipLayer" :showInputMask.sync="layerInputMaskShow"></tipLayer>
    <discountRateTk  :dicountShow="dicountShowV" v-on:closeDiscount="closeDiscount()"></discountRateTk>
    <claimsTranSevice  :fwfShow="fwfShowV" v-on:closeLayer="closeLayer()"></claimsTranSevice>

  </div>
</template>

<style lang="less" src="./claimsOutDetail.less"></style>

<script>
  import * as constants from './claimsOutDetailConstants';
  import discountRateTk from '@/components/discountRateTk';
  import claimsTranSevice from '@/components/claimsTranSevice';

  export default {
    name: constants.NAME,
    data() {
      return {
        layer_setRate:false,
        layerMaskStatus:false,
        fwfShowV:false,
        dicountShowV:false,
        orderId:'',
        prepareOrderTransfer:'',
        discountRate:'',
        layerInputMaskShow:false,
        v1:'',
        v2:'',
        v3:'',
        calResultShow:false,
        fqBtnDisable:false,
      }
    },
    created:function () {
      this.orderId = this.$route.query.orderId;
      var _this=this;
      $.ajax({
        url: this.utils.AJAXDOMAINNAME + "/wap/prepareOrderTransfer/v1.0?orderId="+this.orderId,
        type:'GET',
        success: function(res) {
          if (res.code == 1) {
            _this.prepareOrderTransfer = res.data;
          }
        }
      })
    },
    methods: {
      setRate(){
        this.layer_setRate=true;
        this.layerMaskStatus=true;
      },
      close(){
        this.layer_setRate=false;
        this.layerMaskStatus=false;
      },
      fqTranStep1(){
        if((typeof this.discountRate=='')||this.discountRate*1<=-1||this.discountRate*1>40){
          this.$refs.tipLayer.showLayer('1', '输入的折让率不正确');
          return;

        }

        this.$router.push({
          path : '/claimsOutConfirm',
          query:{
            orderId:this.orderId,
            discountRate:this.discountRate,
          }
        })

      },
      closeLayer(){
        this.fwfShowV=false;
      },
      serviceFee(){
        this.fwfShowV=true;
      },
      discountRateTk(){
        this.dicountShowV=true;
      },
      closeDiscount(){
        this.dicountShowV=false;

      }
    },
    components: {discountRateTk,claimsTranSevice},
    watch:{

      discountRate(val){
        var val = this.discountRate+'';
        val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(val.indexOf(".")< 0 && val !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          val= parseFloat(val);
        }
        this.discountRate = val;
        console.log(this.discountRate=='');
        if(this.discountRate||this.discountRate=='0'){
          if(this.discountRate*1>=0&&this.discountRate*1<=40){
            this.calResultShow=true;
            this.fqBtnDisable=true;
          }else{
            this.calResultShow=false;
            this.fqBtnDisable=false;
          }
          this.v1=this.utils.currency(this.prepareOrderTransfer.waitingPrincipal*(1-this.discountRate/100));
          this.v2=this.utils.currency(this.prepareOrderTransfer.waitingPrincipal);
          this.v3=this.utils.currency(this.prepareOrderTransfer.waitingPrincipal*(this.discountRate/100));
        }else{
          this.calResultShow=false;
          this.fqBtnDisable=false;
        }

      },
    }
  }
</script>
