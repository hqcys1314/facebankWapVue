<template>
  <div class="discount" v-cloak>
    <div class="banner">
        <img src="https://static.facebank.cn/static/wapFront/discount/img/banner.png">
    </div>

    <div class="part" style="margin-top: -5rem;" v-if="isLogin&&subsidyInfo.subsidyList!=null">
        <p class="p-title-1"><img src="https://static.facebank.cn/static/wapFront/discount/img/title1.png"></p>
        <div class="div-con">
             <p class="p1">{{subsidyInfo.totalAmount|currency}}</p>
             <p class="p2">累计到账贴息金额(元)<br>(每笔债权在还款时发放贴息金额)</p>
        </div>
        <table cellpadding="0" cellspacing="0">
            <tr class="thead">
                <td>还款在途资金(元)</td>
                <td>在途天数</td>
                <td>贴息金额(元)</td>
                <td>赠送时间</td>
            </tr>
            <tr v-for="item in subsidyInfo.subsidyList">
                <td>{{item.amount}}</td>
                <td>{{item.days}}</td>
                <td>{{item.subsidyAmount}}</td>
                <td>{{item.time}}</td>
            </tr>
        </table>
        <a href="/discountList" class="moreBtn">查看更多已到账贴息金额></a>
    </div>
    <div class="part" style="margin-top: -5rem;" v-else-if="isLogin&&subsidyInfo.subsidyList==null">
      <p class="p-title-1"><img src="https://static.facebank.cn/static/wapFront/discount/img/title1.png"></p>
      <div class="div-con">
           <img src="https://static.facebank.cn/static/wapFront/discount/img/noRecord.png" alt="" class="noRec">
           <p class="p4">暂时没有记录哦~</p>
      </div>
    </div>
    <div class="part partBot"  style="margin-top: -5rem;" v-else>
      <p class="p-title-1"><img src="https://static.facebank.cn/static/wapFront/discount/img/title1.png"></p>
      <div class="div-con">
           <p class="p3">登录查看累计到账贴息金额</p>
      </div>
      <a class="loginBtn" v-on:click="utils.toLoginCburl('%2fdiscount')"><img src="~assets/wapFront/common/img/loginBtn.png"></a>
    </div>

    <div class="part partBot" >
        <p class="p-title"><img src="https://static.facebank.cn/static/wapFront/discount/img/title2.png"></p>
        <div class="div-con">
            由于银行结算或支付通道等原因，部分债权的本息（本金+利息）还款到账时间最迟为还款计划理论还款日的下一个工作日。笑脸平台将针对此部分“还款在途资金”，为您提供“还款在途资金贴息福利”：按照年化利率8%予以贴息。<span style="color:#fc4b44;">贴息金额随还款时一起发放。</span>
        </div>
        <div class="div-gs">
            <p class="gs1">还款在途资金=当期本金+当期利息</p>
        </div>
    </div>

    <div class="part partBot part3">
        <p class="p-title"><img src="https://static.facebank.cn/static/wapFront/discount/img/title3.png"></p>
        <div class="div-gs">
            <p class="gs1">贴息金额=还款在途资金 x 8%/365 x 在途天数</p>
            <p class="gs2">贴息金额按照年化利率8%进行计算</p>
        </div>

    </div>
    <div class="foots">活动时间：2018年08月22日~2018年11月22日<br>
    <span>在法律允许的范围内笑脸金融对本活动拥有最终解释权</span></div>
  </div>
</template>

<style lang="less" src="./discount.less"></style>

<script>
  import * as constants from './discountConstants';
  import {utils,Modal} from 'tools';
  import wapTk2 from '@/components/wapTk2'

  export default {
    name: constants.NAME,
    data() {
      return {
        pLeft2:'',
        wapTkStatus2:false,
        isLogin:false,
        subsidyInfo:'',
      }
    },
    created:function () {
      this.isLogin=utils.getUserInfo().isLogin;
      var _this = this;
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/credit/subsidyInfo",

          success : function(res){
              if(res.code==1){
                  _this.subsidyInfo=res.data;
              }else {
                _this.pLeft2=res.message;
                _this.wapTkStatus2=true;
              }
          }
      })
    },
    methods: {

    },
    components: {}
  }
</script>
