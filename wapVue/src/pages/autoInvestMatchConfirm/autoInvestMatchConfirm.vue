<template>
  <div id="autoInvestMatchConfirm"  v-cloak>
  	<div class="autoInvestMatchConfirm" >
      <div class="timeCountDown">
          {{countdownTimeShow}}后，所有匹配标的将被释放回标的池
      </div>
      <div class="autoCardBg">
          <div class="autoCard">
                <p class="p1">出借金额(元)</p>
                <p class="p2">{{matchResule.realAmount}}</p>
                <p class="p3">预期总回报(元)<strong>{{currency(allInterest|| '0.00')}}</strong></p>
          </div>
          <div class="redPacket">
              <span class="span2">+{{matchResule.baseInterest}}</span>
              <span class="span1">应收利息</span>
              <span class="span4" style="display:none">{{matchResule.rate}}%</span>

          </div>
          <div class="redPacket"  v-if="matchResule.vipRate!=null">
                <span class="span2">+{{matchResule.vipInterest}}</span>
                <span class="span1">会员加息奖励</span>
                <span class="span4">加息{{matchResule.vipRate}}%</span>
                <!-- <span class="span4">{{matchResule.vipLevelName}}+{{matchResule.vipRate}}%</span> -->
          </div>
          <div class="redPacket"  v-if="matchResule.activityRate*1 >0 && matchResule.activityInterest*1 > 0">
                <span class="span2">+{{matchResule.activityInterest}}</span>
                <span class="span1">限时加息奖励</span>
                <span class="span4">加息{{matchResule.activityRate}}%</span>
          </div>
          <div class="redPacket" v-if="matchResule.isEnableFirstAddCash=='1'">
                <span class="span2">+{{matchResule.firstAddCash}}</span>
                <span class="span1">首购返现奖励</span>
                <span class="span4">加息{{matchResule.firstAddCashRate}}%</span>
          </div>
      </div>

      <discount
          ref="discount"
          :curentSelectCoupon.sync="curentSelectCoupon"
          :investAmount.sync="realAmount"
          :proInfo.sync="matchResule"
          :tremDayCal.sync="tremDayCal"
          :couponProfit.sync="couponProfit"
          :productType="2"
          isLogin="true"
          :agreementState.sync="agreementState"
          @investConfirm="investConfirm"
          @selectedCoupon="selectedCoupon"
      ></discount>
      <div class="auto-part">
           <div class="ap-con" >
               <p style="border:0;"><strong>已匹配标的</strong>
  	              <span class="span1" v-if="matchResule.repaymentType==1">先息后本
  	                 <img @click="showLayer('在还款期内<br />出借人每月（整期）收回同等数额的利息，到期一次性收回本金')" src="~assets/wapFront/autoInvest/img/iconGreyI.png"/>
  	              </span>

                  <span class="span1" v-if="matchResule.repaymentType==2">一次性还本付息
  	                 <img @click="showLayer('期限到期后，一次性收回所有的本金和利息')" src="~assets/wapFront/autoInvest/img/iconGreyI.png"/>
  	              </span>

  	              <span class="span1" v-if="matchResule.repaymentType==3">等额本息
  	                 <img @click="showLayer('在还款期内<br/> 出借人每月收回同等数额的还款<br/> (包括本金和利息)')" src="~assets/wapFront/autoInvest/img/iconGreyI.png"/>
  	              </span>
                </p>
           </div>
      </div>

      <div class="auto-debt-list">
          <div class="div-list"  v-for="(item, index) in matchLoanList"  v-on:click="bidDetail(item.loanId)">
                <p class="title-num">编号：{{item.loanId}}</p>
                <ul class="ul-con">
                   <li class="li1"><span>{{item.matchAmount || '0.00'}}</span>匹配金额(元)</li>
                   <li class="li3"><span>{{item.termCount}}</span>期限(<font v-if="item.termUnit=='1'">天</font><font v-if="item.termUnit=='3'">月</font>)
                    <img class="jt" src="~assets/wapFront/autoInvest/img/jt.png"/>
                   </li>
  				 <li class="li2"><span>{{item.rate || '0'}}%</span>借款合同约定年化利率</li>
                </ul>
          </div>
            <router-link  class="div-more" v-if="matchLoanCount*1 > 4" :to="{ path: '/autoInvestMatchDebt', query: {autoInvestMatchId : autoInvestMatchId} }">

             查看更多已匹配债权（共{{matchLoanCount}}个）<img src="~assets/wapFront/autoInvest/img/jt.png"/>
          </router-link>
      </div>
      <div class="inv-confirm-desc">
          网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span>认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后</span>，并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。<br />具体内容请详见：<a href="javascript:;" @click="$refs.discount.$refs.layerAgreement.showAgreement('riskInfo', '',true)">《网络借贷风险揭示书》</a>
      </div>
        <div style="height:5.5rem;"> </div>
        <div class="foot-btn">

  	        <input name="investConfirm" type="button" value="确认出借"  class="btn_tpls goInvest" v-if="canInvest"  v-bind:disabled="isDisabled"
  			      v-on:click="investConfirm()">
                <input name="investConfirm" type="button" value="确认出借" class="btn_tpls goInvest" v-else
  				style="background:#DFE3EB">

  	  </div>

        <div class="wapMc" style="display:block;" v-show="wapMcStatus"  v-cloak></div>

    <!--风险测评弹框-->
    <div class="layer_style" v-show="riskLayerStatus" v-cloak>
        <a href="javascript:;" class="layer_close" @click="closeRiskLayer()"></a>
        <div class="layer_content" style="padding:1.5rem 1rem;" v-html="riskLayerContent"></div>
        <div class="layer_btn one">
            <a href="javascript:;" @click="gotoRisk()">风险测评</a>
        </div>
    </div>
    <div class="layerMask" v-show="riskLayerStatus" v-cloak></div>
  </div>
    <!--统一提示层-->
    <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>

    <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>
    <tipLayer ref="tipLayer"></tipLayer>
  </div>
</template>

<style src="./autoInvestMatchConfirm.css" scoped></style>

<script>
import * as constants from './autoInvestMatchConfirmConstants';
import informationLayer from '@/components/informationLayer'
import loading from '@/components/loading'
import {discount} from 'components'
import {utils} from 'tools';
import toastMessage from 'components/toastMessage'

export default {
    name: constants.NAME,
    data() {
        return {
            redbagListResult: '',
            matchLoanList: [],
            matchLoanListLength : 0,
            matchLoanCount : 0,
            //所有红包个数
            redId: '',
            redType: '',
            redValue: '',
            redRate: '',
            //加息红包利率
            redAmount: '',
            //返现红包金额
            redReturnMoney: 0,

            incomeCalculationResule: {},
            redPackageAmount: 0,

            isDisabled: false,

            abledRedPkgsCount: '0',
            //可用红包
            allInterest: '',
            //回报
            basicInterest: '',
            //借款利息
            redBagInterest: '',
            //加息红包
            redAmountInterest: '',
            //返现红包
            noUseRedBag: false,
            //错误弹框模板
            wapMcStatus: false,
            productId: '',
            realAmount: '',
            redbagTkStatus: false,
            showRedPackMc: false,
            showAgreementLayerState: false,
            agreementState: false,
            //是否同意协议
            autoInvestMatchId: '',
            curDevice: '',
            curVersion: '',
            curVersionNum: 0,
            riskNum: '',
            riskRankName: '',

            riskCount : '',
            riskName : '',
            riskStatus : '',

            pCon: '',
            riskTk: false,
            matchResule: '',
            riskLayerStatus : false,
            riskLayerContent : '',
            //用户匹配结果
            bidType: '',
            termCount: '',
            termUnit: '',
            isRiskShow: '0',
            tremDayCal: '',
            platform: 'wap',

            showLayerStatus : false,
            informationLayerContent : '',
            loadingLayerStatus : false,

            canInvest : false,

            haveAddRate : 0,

            //卡券
            showCoupon : true,
            curentSelectCoupon : {},
            couponProfit : 0,
            cardId : '',
            redpackageId : '',
            countdownTime:0,
            countdownTimeShow:'',
            isTmShow:false,//是否展示吐司
            tTime:2000,//吐司时间
            tMsg:'',
        }
    },
    components: {informationLayer, loading, discount,toastMessage},
    created: function() {
        if(utils.getCookie('orderId_success') && utils.getCookie('orderId_success') != ''){
            // this.$router.push({
            //     name : 'loanList',
            //     query : {type : 1}
            // })
            utils.setCookie('orderId_success', '', -1)
            utils.closeWebView('/loanList')
            return false;
        }
        this.haveAddRate = this.$route.query.haveAddRate*1;
        this.platform = utils.getPlatform();
        var _this = this;
        this.autoInvestMatchId = this.$route.query.autoInvestMatchId;
        this.loadingLayerStatus = true;
        this.getRiskStatus();
        this.getMatchResule()
        $.when(_this.getMatchList(), _this.getRedPackList()).then(function(matchList, redpackList){
            this.loadingLayerStatus = false;
            _this.canInvest = true;
            _this.redbagListResult = redpackList;
            if(matchList.loanList){
                _this.matchLoanCount = matchList.matchLoanCount;
                _this.matchLoanList = matchList.loanList.length > 4 ? matchList.loanList.slice(0,4) : matchList.loanList;
                _this.matchLoanListLength = matchList.loanList.length;
                var loanIdArr = [];
                for(var i=0;i<matchList.loanList.length;i++){
                    loanIdArr.push(matchList.loanList[i].loanId)
                }
                if(_this.matchResule != ''){
                    _this.$set(_this.$data.matchResule, 'loanIdArr', loanIdArr)
                }

            }

        })
        this.userInfo=utils.getUserInfo();
    },
    mounted(){

    },
    methods: {
        selectedCoupon(val){
            this.calMoney()
            this.curentSelectCoupon = val;
            if(this.curentSelectCoupon.bonusId){
                this.cardId = '';
                this.redpackageId = this.curentSelectCoupon.bonusId;
                var epr = this.curentSelectCoupon.estimateProfix+'';
                this.allInterest = this.allInterest + epr.replace(/,/g, '')*1;
            }else if(this.curentSelectCoupon.card_id){
                this.cardId = this.curentSelectCoupon.card_id;
                this.redpackageId = '';
                var epr = this.curentSelectCoupon.estimateProfix+'';
                this.allInterest = this.allInterest + epr.replace(/,/g, '')*1
            }else{
                this.cardId = '';
                this.redpackageId = '';
            }
        },
        closeRiskLayer(){
            this.riskLayerContent = '';
            this.riskLayerStatus = false;
        },
        getRedPackList() {
            var _this = this;
            var def = $.Deferred();
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
                data: '{"type":"1","pageNum":"1","pageSize":"200"}',
                complete : function(){
                    _this.loadingLayerStatus = false;
                },
                success: function(res) {
                    if (res.code * 1 == 1){
                        def.resolve(res.data.redPackageDtoList);
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            });
            return def.promise();
        },
        //获取并检测用户风险等级
        getRiskStatus() {
            var _this = this;
            $.ajax({
                url: utils.AJAXDOMAINNAME+ "/wap/user/riskEvaluationInformation",
                data: '',
                success: function(res) {
                    if (res.code == 1) {
                        _this.riskCount = res.data.riskNum ? res.data.riskNum : '';
                        _this.riskName = res.data.riskRankName ? res.data.riskRankName : '';
                        _this.riskStatus = res.data.isBlockInvest ? res.data.isBlockInvest : '';
                    }
                }
            })
        },
        getMatchList() {
            var _this = this;
            var def = $.Deferred();
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/autoInvest/getMatchLoanList',
                data: '{"matchInvestId":"' + _this.autoInvestMatchId + '", "confirm":"1"}',//confirm 传0,代表只提取前4条标的信息，其它则提全部
                complete : function(){
                    _this.loadingLayerStatus = false;
                },
                success: function(res) {
                    if (res.code == 1) {
                        def.resolve(res.data);
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })
            return def.promise();
        },
        getMatchResule() {
            var _this = this;
            //获取用户匹配结果
            $.ajax({
                url: utils.AJAXDOMAINNAME+"/wap/autoInvest/matchResultByInvestId",
                data: '{"matchInvestId":"' + _this.autoInvestMatchId + '"}',
                async : false,
                complete : function(){
                    _this.loadingLayerStatus = false;
                },
                success: function(res) {
                    if (res.code == 1) {
                        _this.countdownTime=res.data.countdownTime;

                        _this.realAmount = res.data.realAmount;
                        _this.matchResule = res.data;
                        _this.bidType = res.data.repaymentType;
                        _this.termUnit = res.data.termUnit;
                        _this.termCount = res.data.termCount;
                        setInterval(function(){
                          if(_this.countdownTime*1>0){
                            _this.countdownTime--;
                          }
                          let countdownTimeMiao=_this.countdownTime%60>9?'':'0';
                          _this.countdownTimeShow='0'+parseInt(_this.countdownTime/60)+'分'+countdownTimeMiao+_this.countdownTime%60+'秒';
                        },1000)
                        if(_this.haveAddRate*1 == 1 && (res.data.activityRate*1 <= 0 || res.data.activityRemainTime*1 <= 0)){
                            setTimeout(function(){
                                _this.$refs.tipLayer.showByParame({
                                    title : 'noTitle',
                                    content : '限时加息活动已结束，本次出借未成功参与限时加息，点击继续出借将为您继续出借，点击取消，将返回',
                                    btnArr : [
                                        {
                                            text : '继续出借',
                                            style: 'color:#848999',
                                            fn : function(){
                                                _this.$refs.tipLayer.closeLayer();
                                            }
                                        },
                                        {
                                            text : '取消',
                                            fn : function(){
                                                utils.closeWebView('/loanList')
                                            }
                                        }
                                    ]
                                })
                            },200)
                        }

                        //_this.$set(_this.$data.matchResule, 'loanIdArr', loanIdArr)
                        if (_this.termUnit == '1') {
                            _this.tremDayCal = _this.termCount;

                        } else if (_this.termUnit == '3') {
                            _this.tremDayCal = _this.termCount * 30;
                        }
                        _this.calMoney();
                    }else{
                        _this.showLayer(res.message)
                    }
                    setTimeout(function(){_this.$refs.discount.initialization();},100)
                }
            })
        },
        showLayer(content){
            this.informationLayerContent = content;
            this.showLayerStatus = true;
        },
        bidDetail: function(loanId) {
            utils.newWebView('/directInvestProjectDetailShow?loanId=' + loanId)
        },
        changeAgreementState: function(el) {
            this.agreementState = !this.agreementState;
        },
        isWeiXin: function() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        investConfirm: function() {
            if(this.countdownTime==0){
              this.isTmShow=true;
              this.tMsg="出借超时，页面等待时间已超过2分钟，所有匹配标的已释放";
              var self=this;
              setTimeout(
                      function () {
                          self.isTmShow=false;
                          utils.toLoanlist(1);
              }, 2000);
              return;
            }
            var discount = this.$refs.discount;
            if(discount.selectedCoupon == '' && discount.availableCouponCount > 0 && !discount.confirmNotSelect){
                discount.showDiscountTipsLayer(this.agreementState);
                return;
            }else if (!this.agreementState){
                discount.showAgreementLayer(this.agreementState);
                return false;
            }
            //埋点统计
            var redbagFilter=this.redbagListResult.filter(item => {
                return item.id == this.redId});
            var redbagMd=[];
            if(redbagFilter.length*1>0){
               redbagMd=redbagFilter[0];
            }
            if(this.matchResule.termUnit==1){
              var ProTermV= this.matchResule.termCount+'天';
            }else if(this.matchResule.termUnit==3){
              var ProTermV= this.matchResule.termCount+'个月';
            }
            if(this.matchResule.repaymentType==2){
              var RepayTypeV='一次性还本付息'
            }else if(this.matchResule.repaymentType==1){
              var RepayTypeV='先息后本'
            }else if(this.matchResule.repaymentType==3){
              var RepayTypeV='等额本息'
            }else if(this.matchResule.repaymentType==4){
              var RepayTypeV='等本等息'
            }

            if (this.riskCount == '0'&& this.riskStatus == '1') {
                this.riskLayerContent = "您未进行过风险测评，请进行完风险评测再进行出借。";
                this.riskLayerStatus = true;
            }else {
                var _this = this;
                _this.isDisabled = true;
                _this.loadingLayerStatus = true;
                $.ajax({
                    url : utils.AJAXDOMAINNAME+ '/wap/autoInvest/submitAutoInvestMatchConfirm',
                    data: '{"matchInvestId":"' + _this.autoInvestMatchId + '","platform":"' + _this.platform + '","redpackageId":"' + _this.redpackageId + '","cardId":"' + _this.cardId + '"}',
                    complete : function(){
                        _this.loadingLayerStatus = false;
                        _this.isDisabled = false;
                        _this.canInvest = true;
                    },
                    success: function(res) {
                        if (res.code == 1) {

                            utils.setCookie('orderId_success', res.data.orderid);

                            var routeParame = {
                                allInterest: _this.allInterest,
                                realAmount: _this.realAmount,
                                vipInterest: _this.matchResule.vipInterest,
                                activityInterest : _this.matchResule.activityInterest,
                                firstAddCash:_this.matchResule.firstAddCash,
                                baseInterest: _this.matchResule.baseInterest,
                                bidType: _this.matchResule.repaymentType,
                                orderId : res.data.orderId,
                                cardInterest : (_this.curentSelectCoupon.card_id ? _this.curentSelectCoupon.estimateProfix : ''),
                                redPackageAmount : (_this.curentSelectCoupon.bonusModel*1==1 || _this.curentSelectCoupon.bonusModel*1==2 ? _this.curentSelectCoupon.estimateProfix : ''),
                                mobile:_this.userInfo.info.mobile,
                                cacheKey: res.data.cacheKey,
                                isQualifiedForRewards: res.data.isQualifiedForRewards,
                            };
                            utils.setCookie('autoConSuc', JSON.stringify(routeParame), 1)
                            utils.setCookie('isShowTkAward', 'false')
                            /*_this.$router.push({
                                name : 'autoInvestMatchSuccess',
                                params: routeParame
                            })*/
                            setTimeout(function(){
                                _this.utils.newWebView('/autoInvestMatchSuccess')
                            },200)

                            //window.location.href = "/autoInvestMatchSuccess?" + params.join('&');
                        }else if(res.code == '-893'){
                            _this.isTmShow=true;
                            _this.tMsg=res.message;
                            var self=_this;
                            setTimeout(function () {
                                self.isTmShow=false;
                                utils.toLoanlist(1);
                            }, 2000);
                        }
                        else {
                            _this.showLayer(res.message)
                            _this.isDisabled = false;
                            _this.canInvest = true;
                        }
                    },
                    error:function(XMLHttpRequest, textStatus){


                      if(textStatus == 'error'){
                        utils.toastFuc('网络请求错误，请稍候重试');

                      }else if(textStatus == 'timeout'){
                        utils.toastFuc('网络请求超时，请稍候重试');

                      }
                      _this.canInvest = true;
                      _this.isDisabled = false;
                    }
                })
            }
        },
        gotoRisk: function() {
            var statisticssign = utils.getCookie('_key');
            window.location.href = "//promo"+utils.URLSET+".facebank.cn/home/RiskEvaluation?statisticssign=" + encodeURIComponent(statisticssign);
        },
        currency: function(number) {
            return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },

        closeTk: function() {
            this.riskTk = false;
            this.showAgreementLayerState = false;
            this.wapMcStatus = false;
            this.iosGuid = false;
            var _this = this;
            setTimeout(function() {
                _this.redbagTkStatus = false;
                _this.showRedPackMc = false;
            },
            320)
        },
        toFixed: function(number, digit) {
            var numbers = number || 0,
            digits = digit || 2;
            return Number(numbers).toFixed(digits);
        },
        calStep: function(rateVar) {
            var monthRate = rateVar / 1200;
            var monthMoney = this.realAmount * monthRate * Math.pow(1 + monthRate, this.termCount) / (Math.pow(1 + monthRate, this.termCount) - 1);
            var rateValue = (monthMoney * this.termCount - this.realAmount).toFixed(2);
            return rateValue;
        },
        //计算利息
        calMoney: function() {
            //天
            if (this.termUnit == 1) {
                //红包利息
                if (this.redType == "返现红包") {
                    this.redAmountInterest = this.redAmount;
                    this.redBagInterest = 0;
                } else if (this.redType == "加息红包") {
                    this.redAmountInterest = 0;
                    this.redBagInterest = (this.realAmount * this.termCount * this.redRate / (utils.DAYSET*100)).toFixed(2);
                } else {
                    this.redBagInterest = 0;
                    this.redAmountInterest = 0;
                }

            }
            //月
            else if (this.termUnit == 3) {
                //等额本息
                if (this.bidType == 3) {
                    //红包利息
                    if (this.redType == "返现红包") {
                        this.redAmountInterest = this.redAmount;
                        this.redBagInterest = 0;
                    } else if (this.redType == "加息红包") {
                        this.redAmountInterest = 0;
                        this.redBagInterest = this.calStep(this.redRate);
                    } else {
                        this.redBagInterest = 0;
                        this.redAmountInterest = 0;
                    }
                } else {
                    //红包利息
                    if (this.redType == "返现红包") {
                        this.redAmountInterest = this.redAmount;
                        this.redBagInterest = 0;
                    } else if (this.redType == "加息红包") {
                        this.redAmountInterest = 0;
                        this.redBagInterest = (this.realAmount * this.termCount * this.redRate / 1200).toFixed(2);
                    } else {
                        this.redBagInterest = 0;
                        this.redAmountInterest = 0;
                    }
                }
            }

            this.allInterest = Number(this.matchResule.baseInterest || 0.00) + Number(this.matchResule.vipInterest || 0.00) + Number(this.redBagInterest || 0.00) + Number(this.redAmountInterest || 0.00)+Number(this.matchResule.firstAddCash|| 0.00)+Number(this.matchResule.activityInterest|| 0.00);

        },

    },

}
</script>
