<template>
  <div class="directInvestDetail" v-cloak>
     	<div class="top">
          <div class="firstInvest_tip" v-if="detailInfo.isEnableFirstAddCash==1">
             <div class="firstInvest_tipPos">
               本次出借享受{{detailInfo.firstAddCashRate}}%首购返现奖励 <span class="iTip" v-on:click="showFirstInvest()"><img src="~assets/wapFront/common/img/sicon_warn.png"></span>
             </div>
          </div>

         	<div class="comparison">
             	<div class="interest_rate">
                 {{detailInfo.rate}}%<div class="clear"></div>
                 <span v-if="detailInfo.repaymentType==1" @click="showLayer('在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报','tips')">借款合同约定年化利率</span>
                 <span v-if="detailInfo.repaymentType==3||detailInfo.repaymentType==5" @click="showLayer('年化利率不代表实际回报。<br>在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借。','tips')">借款合同约定年化利率</span>
                 <span v-if="detailInfo.repaymentType==4" @click="showLayer('在等本等息情况下，本金和利息会每月收回，建议您每月收到回款后立即循环出借，以获取更高回报','tips')">借款合同约定年化利率</span>
                 <span v-if="detailInfo.repaymentType==2" class="noIcon">借款合同约定年化利率</span>
                 </div>
             	 <!--<div class="item" v-if="firstRate > 0">
                 	<p>{{firstRate}}<i>%</i></p>
                 	<span>首购加息</span>
                </div>
                 <div class="item" v-if="detailInfo.prjInterestRate > 0">
                     <p>{{detailInfo.prjInterestRate}}<i>%</i></p>
                     <span>项目加息</span>
                 </div>-->
               <div class="item" v-if="vipRate > 0">
                   	<p>+{{detailInfo.vipRate}}<i>%</i></p><div class="clear"></div>
                   	<span>会员加息奖励</span>
               </div>
             	<!-- <div class="item">
                 	<p>2<i>个</i></p>
                 	<span>可用红包</span>
                 </div> -->
             </div>

             <div class="infos">
             	<div class="item">
                     <font>期限</font>
                     <span v-if="detailInfo.assetType == 60">{{detailInfo.termCount}}天</span>
                     <span v-else-if="detailInfo.termUnit == 1">{{detailInfo.termCount}}天</span>
                     <span v-else-if="detailInfo.termUnit == 3">{{detailInfo.termCount}}个月</span>
                 </div>
             	<div class="item"><font>借款金额(元）</font><span>{{detailInfo.amount}}</span></div>
             </div>
         </div>
     	<div class="countdown">{{detailInfo.investEndDate}}</div>
         <div class="project_state">
         	<div class="progress_bar">
             	<div class="line"></div>
                 <div class="bar" v-bind:style="'width:'+progressBar+'%'">
                 	<div class="line"></div>
                     <div class="dian"></div>
                 </div>
             </div>
             <div class="font">
             	<div class="left">已售<span>{{ toFixed(progressBar)}}%</span></div>
                 <div class="right">剩余可投金额(元）<span>{{detailInfo.remainAmount}}</span></div>
             </div>
         </div>
         <!--<div class="first_interest" v-if="detailInfo.freshManProductInvestTips">{{detailInfo.freshManProductInvestTips}}</div>-->

         <div class="item_box">
         	<div class="title">融资进度</div>
             <div class="progress">
                 <div class="progress_bar" v-if="detailInfo.repaymentType==1">
                     <div class="line"></div>
                     <div class="bar">
                         <div class="item"><div class="tit">今日出借</div><div class="desc">{{detailInfo.currentDate}}</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">开始计息</div>
                         <div class="desc" v-if="detailInfo.assetType == 60">满标当日</div>
                         <div class="desc" v-else>预计满标后<br>一日内</div>
                         <div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">每月回款</div><div class="desc"> 先息后本<br>每月还款日</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">项目结束</div><div class="desc"> 最后一期<br>还款日</div><div class="dian"><span></span></div></div>
                     </div>
                 </div>
                 <div class="progress_bar" style="margin: 0 0 0 8%;"  v-if="detailInfo.repaymentType==2">
                     <div class="line" style="width:84%;"></div>
                     <div class="bar">
                         <div class="item" style="width:25%;"><div class="tit">今日出借</div><div class="desc">{{detailInfo.currentDate}}</div><div class="dian"><span></span></div></div>
                         <div class="item"  style="width:42%;"><div class="tit">开始计息</div><div class="desc">预计满标后<br>一日内</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">收回本息</div><div class="desc"> 项目还款日</div><div class="dian"><span></span></div></div>
                     </div>
                 </div>

                 <div class="progress_bar" v-if="detailInfo.repaymentType==3||detailInfo.repaymentType==5">
                     <div class="line"></div>
                     <div class="bar">
                         <div class="item"><div class="tit">今日出借</div><div class="desc">{{detailInfo.currentDate}}</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">开始计息</div>
                         <div class="desc" v-if="detailInfo.assetType == 60">满标当日</div>
                         <div class="desc" v-else>预计满标后<br>一日内</div>
                         <div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">每月回款</div><div class="desc"> 等额本息<br>每月还款日</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">项目结束</div><div class="desc"> 最后一期<br>还款日</div><div class="dian"><span></span></div></div>
                     </div>
                 </div>
                 <div class="progress_bar" v-if="detailInfo.repaymentType==4">
                     <div class="line"></div>
                     <div class="bar">
                         <div class="item"><div class="tit">今日出借</div><div class="desc">{{detailInfo.currentDate}}</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">开始计息</div>
                         <div class="desc" v-if="detailInfo.assetType == 60">满标当日</div>
                         <div class="desc" v-else>满标后一个<br>自然日内</div>
                         <div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">每月回款</div><div class="desc"> 等本等息<br>每月还款日</div><div class="dian"><span></span></div></div>
                         <div class="item"><div class="tit">项目结束</div><div class="desc"> 最后一期<br>还款日</div><div class="dian"><span></span></div></div>
                     </div>
                 </div>
             </div>
         </div>


         <div class="items">
             <a @click="showLayer('','desc')" v-if="detailInfo.repaymentType==1"><span class="bicon_warn">先息后本</span>还款方式</a>
             <a @click="showLayer('','desc')" v-if="detailInfo.repaymentType==2"><span class="bicon_warn">一次性还本付息</span>还款方式</a>

             <a @click="showLayer('','desc')" v-if="detailInfo.repaymentType==3||detailInfo.repaymentType==5"><span class="bicon_warn">等额本息</span>还款方式</a>

             <a @click="showLayer('','desc')" v-if="detailInfo.repaymentType==4"><span class="bicon_warn">等本等息</span>还款方式</a>
             <router-link :to="{ path: '/directInvestDetailRepayment', query : {productId : productId, firstRepaymentDate : detailInfo.firstRepaymentDate}}" >
         	 <span>万元利息{{detailInfo.tenThousandsInterest}}元</span>出借还款示例
            </router-link>
            <a href="javascript:;">
               <span style="padding-right: 0.5rem;background-position-x: 120%;">平台暂不向出借人收取任何费用</span>相关费用
            </a>
         </div>


         <div class="items">
             <router-link :to="{ path: '/directInvestProjectDetailShow', query : {loanId : detailInfo.loanId}}" >
                <span >&nbsp;</span>
              更多信息
           </router-link>
           <router-link :to="{ path: '/productOrderList', query : {productId : productId}}" >
                <span >已出借{{detailInfo.buyTimes}}笔</span>购买记录
            </router-link>

         </div>
         <detailItemTips></detailItemTips>

         <div class="warn_tips">市场有风险，出借需谨慎</div>

         <div class="foot-btn">
             <a class="btn_tpls"  v-if="detailInfo.isShow==0||detailInfo.remainAmount== 0" style="background-color:#ddd;">立即出借</a>
             <a class="btn_tpls"  v-if="detailInfo.isShow==1" v-on:click="investConfirm()">立即出借</a>
         </div>
         <!--统一提示层　说明-->
         <div class="wapPos"  style="display:block" v-show="subjectLoanedState" v-cloak>
            <div class="wapTip">
                <div class="p1">当前标的已出借<br>请返回出借列表重新挑选</div>
                <p class="p3" v-on:click="utils.toLoanlist(2)">
                    返回
                </p>
            </div>
         </div>

         <!--还款方式解释层-->
         <layerRepaymentExplain :repaymentType="detailInfo.repaymentType" :show.sync="showLayerRempayStatus"></layerRepaymentExplain>
         <!--统一提示层-->
         <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>

         <!--风险测评弹框-->
         <div class="layer_style" v-show="riskLayerStatus" v-cloak>
             <a href="javascript:;" class="layer_close" @click="closeRiskLayer()"></a>
             <div class="layer_content" style="padding:1.5rem 1rem;" v-html="riskLayerContent"></div>
             <div class="layer_btn one">
                 <a href="javascript:;" @click="gotoRisk()">风险测评</a>

             </div>
         </div>
         <div class="layerMask" v-show="riskLayerStatus" v-cloak></div>
         <div class="wapMc" style="display:block"  v-show="wapMcShow"  v-cloak></div>

         <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>

         <needActive ref="needActive"></needActive>

         <standardFrame v-bind:isSfShow.sync="sfStatus" v-bind:sfLeft.sync="sfLeft" v-bind:sfTitle.sync="sfTitle"></standardFrame>

  </div>
</template>

<style scoped src="./directInvestDetail.css">

</style>

<script>
import * as constants from './directInvestDetailConstants';
import layerRepaymentExplain from '@/components/layerRepaymentExplain';
import informationLayer from '@/components/informationLayer';
import detailItemTips from '@/components/detailItemTips';
import standardFrame from '@/components/standardFrame';

import {utils} from 'tools';

export default {
        name:
        constants.NAME,
        components:{layerRepaymentExplain, detailItemTips, informationLayer,standardFrame},//这里注册
        data() {
            return {
                tosatShow : false,
                tosatContent : '',
                detailInfo: '',
                tenThousandsInterest: '0.00',
                progressBar: '',
                //firstRate: '',
                vipRate: '',
                interestLayerShow: false,
                equalnterestRateLayerShow: false,
                subjectLoanedState: false,
                wapMcShow: false,
                productId: '',
                isBindCard: false,
                isIdValify : false,
                isLogin: '',
                //riskNum:'',
                //riskRankName:'',
                pCon: '',
                riskTk: false,
                riskLayerStatus : false,
                riskLayerContent : '',

                detailInfo : {},
                showLayerRempayStatus : false,
                showLayerStatus : false,
                informationLayerContent : '',
                btnSure : '',
                sfStatus:false,//标准弹框组件
                sfLeft:'',//标准弹框组件
                sfTitle:'',//标准弹框组件
            }
        },
        created() {
            this.productId = this.$route.query.productId;
            this.getProductInfo();

        },
        methods: {
            closeRiskLayer(){
                this.riskLayerContent = '';
                this.riskLayerStatus = false;
            },
            getProductInfo(callBack){
                var _this = this;
                $.ajax({
                    url : utils.AJAXDOMAINNAME+ '/wap/product/productDetail',
                    data: '{"productId":"' + _this.productId + '"}',
                    success: function(res) {
                        if (res.code == 1) {
                            _this.detailInfo = res.data;
                            //_this.firstRate = res.data.firstRate;
                            _this.vipRate = res.data.vipRate;
                            _this.progressBar = (res.data.amount - res.data.remainAmount) / (res.data.amount) * 100;
                            if(typeof callBack == 'function') callBack(_this.detailInfo)
                        }else{
                            _this.showLayer(res.message)
                        }
                    }
                })
            },
            showFirstInvest(){
              this.sfTitle="首购返现规则说明";
              this.sfLeft = '1. 首次购买90天以上(含)，180天以内的产品，可获出借金额的年化0.3%现金返现;<br />2. 首次购买180天以上(含)的产品，可获出借金额的年化0.5%现金返现;<br />3. 返现金额=出借金额×出借期限(天)/365×返现率;<br />或，返现金额=出借金额×出借期限(月)/12×返现率;<br />举例：老王出借1万元至180天的产品，那么老王可获得的返现金额为：10000×180/365×0.5%=24.66元;<br />4.返现金额将在您出借后，直接返还至您的账户余额中，可提现;<br />5.首购返现奖励可与卡券奖励叠加  <br />';
              this.sfStatus=true;
            },
            showLayer(content, type){
                if(type == 'desc'){
                    this.showLayerRempayStatus = true;
                }else if(type == 'tips'){
                    this.informationLayerContent = content;
                    this.showLayerStatus = true;
                }
                else{
                    this.informationLayerContent = content;
                    this.showLayerStatus = true;
                }
            },
            //出借确认
            investConfirm() {

                var _this = this;


                var userInfo = utils.getUserInfo();
                this.isLogin = userInfo.isLogin;
                this.isBindCard = userInfo.isBindCard;
                this.isIdValify = userInfo.isIdValify;
                if(userInfo.info.accountState=='350'){
                    this.showLayer("您的笑脸账号异常，请联系客服4008-900-766！");
                    return;
                }
                if(userInfo.info.accountState=='300'){
                    this.showLayer("您的账户状态异常，请联系客服4008-900-766！");
                    return;
                }
                var cburl = "/directInvestDetail?productId=" + this.productId;
                if (!this.isLogin) {
                    utils.toLogin(cburl);
                    return false;
                }else if (!this.isIdValify) {
                    this.$refs.tosat.tosatShow({
                        msg : '请先完成实名 ',
                        time : 2
                    }, function(){
                        utils.newWebView('/authentication?cburl='+cburl)
                        /*_this.$router.push({
                            name : 'authentication',
                            query : {
                                cburl : cburl
                            }
                        })*/
                    })
                }else {
                    if(!_this.$refs.needActive.checkDepositoryStatus()) return false;
                    _this.getProductInfo(function(detail){
                        if (detail.remainAmount * 1 == 0) {
                            _this.subjectLoanedState = true;
                            _this.wapMcShow = true;
                            return false;
                        } else {
                            if (detail.isSupportInvest*1 == 0) {
                                _this.riskLayerContent = detail.riskWarningMsg;
                                _this.riskLayerStatus = true;
                            } else {
                                var url = "/directInvestConfirm?productId=" + _this.productId ;
                                window.location.href = url
                            }
                        }
                    })
                }
            },
            gotoRisk() {
                var statisticssign = utils.getCookie('_key');
                window.location.href = "//promo"+utils.URLSET+".facebank.cn/home/RiskEvaluation?statisticssign=" + encodeURIComponent(statisticssign);
            },
            toFixed(number, digits) {
                var numbers = number || 0,
                digits = digits || 2;
                return Number(number).toFixed(digits);
            }
        }
    }
</script>
