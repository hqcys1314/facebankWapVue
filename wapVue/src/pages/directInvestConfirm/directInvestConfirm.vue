<template>
    <div v-cloak id="directInvestConfirm">
          <div class="inv-confirm-detail">
              <div class="ketou"><span class="span1">可投金额</span>¥{{currency(resuleData.remainAmount || 0)}}</div>
              <div class="yuE">
                <a v-on:click="goToRecharge()">充值</a>
                <span class="span1">账户余额</span>¥{{currency(userCash)}}
              </div>
          </div>
          <div class="inv-confirm-money">
            <span class="span-btn" v-on:click="allInvest()" v-if="userCash*1 >= resuleData.remainAmount*1">全投</span>
            <span class="span1">¥</span>
            <input name="inputInvestAmount" class="inputInvestAmount" type="number" v-bind:disabled="inputDisabled"
            v-bind:placeholder="(resuleData.startAmount || resuleData.increaseAmount) && (resuleData.startAmount+'元起投，'+resuleData.increaseAmount+'元递增')"
            v-model="investAmount"   @focus="InputClickFocus()" @blur="InputClickBlur()">
          </div>
          <div class="expectedReturn">
             预期总回报约为<span class="span1">¥{{currency(allInterest)}}</span>
             <span class="span2" v-on:click="shouyiTip()"><i class="iconfont icon-ic_help"></i></span>

             <!-- <span v-if="curentSelectCoupon.card_type">
             　返现卡<span class="span1">¥{{currency(curentSelectCoupon.estimateProfix || '0.00')}}</span>
            </span> -->
          </div>
          <div class="sameMoneyTip"  v-if="resuleData.repaymentType==1">
            回报说明：<br>在先息后本的情况下，每月还款（还利息）金额将进入您的账户余额。<br>
            收回利息后立 即再次出借，可获得更高回报。
          </div>
          <div class="sameMoneyTip"  v-if="resuleData.repaymentType==3">
            回报说明：<br>在等额本息情况下，每月还款金额将进入您的账户余额。 <br>
            若想获得更多利息，建议您每月收到回款后立即循环出借。
          </div>
          <div class="sameMoneyTip"  v-if="resuleData.repaymentType==5">

            回报说明：<br>在等额本息情况下，每月还款金额将进入您的账户余额。 <br>
            若想获得更多利息，建议您每月收到回款后立即循环出借。<br>
            此标的的首次还款日已经确定，最终还款计划和回报总金额由标的实际起息日决定。
          </div>
          <div class="sameMoneyTip"  v-if="resuleData.repaymentType==4">
            回报说明：<br>在等本等息情况下，每月还款金额将进入您的账户余额。<br>
            建议您每月收到回款后立即循环出借，以获取更高回报。
          </div>
          <!--卡券优惠 productType = 1 : 散标     productType = 2 : 智能推荐-->
          <discount
              ref="discount"
              :curentSelectCoupon.sync="curentSelectCoupon"
              :investAmount.sync="investAmount"
              :proInfo.sync="resuleData"
              :tremDayCal.sync="tremDayCal"
              :couponProfit.sync="couponProfit"
              :productType="1"
              isLogin="true"
              :agreementState.sync="agreementState"
              :nowDay.sync="nowDay"
              :firstRepaymentDate.sync="firstRepaymentDate"
              @investConfirm="investConfirm"
              @selectedCoupon="selectedCoupon" style="border-top:1px #DFE3EB solid;"
          ></discount>

          <div class="inv-confirm-btn">
              <input name="investConfirm" class="btn_tpls" type="button" value="确认出借"  v-bind:class="{'disabled':btnInvestStatusDis}"
               v-on:click="investConfirm()">
          </div>
          <div class="inv-confirm-desc">
              网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span>认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后</span>，并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。<br />具体内容请详见：<a href="javascript:;" @click="$refs.discount.$refs.layerAgreement.showAgreement('riskInfo', '',true)">《网络借贷风险揭示书》</a>
          </div>
          <div class="wapMc" v-show="wapMcStatus" style="display:block"  v-cloak>
          </div>
          <div class="wapMc" id="redPackMc" style="display:block;" v-show="showRedPackMc" v-on:click="closeTk"></div>
          <div class="wapPos" v-show="expectedReturnShowStatus1"  style="display:block"  v-cloak>
              <div class="wapTip">
                  <div class="div-value">
                      <p>借款利息({{resuleData.rate}}%)<span class="span-right"><font>{{basicInterest}}</font>元</span></p>
                      <p v-if="curentSelectCoupon.bonusModel=='2'">加息红包奖励({{curentSelectCoupon.bonusValue}}%)<span class="span-right"><font>{{curentSelectCoupon.estimateProfix}}</font>元</span></p>
                      <p v-if="curentSelectCoupon.bonusModel=='1'">返现红包奖励<span class="span-right"><font>{{curentSelectCoupon.estimateProfix}}</font>元</span></p>
                      <p v-if="curentSelectCoupon.card_id">返现卡奖励<span class="span-right"><font>{{curentSelectCoupon.estimateProfix}}</font>元</span></p>
                      <p v-if="resuleData.isEnableFirstAddCash==1">首购返现奖励({{resuleData.firstAddCashRate}}%)
                        <span class="span-right"><font>{{firstInterestValue}}</font>元</span></p>
                        <p v-if="resuleData.vipRate != null && resuleData.vipRate > 0">会员加息奖励({{resuleData.vipRate}}%)
                          <span class="span-right"><font>{{vipInterest}}</font>元</span></p>
                      <p v-if="resuleData.prjInterestRate > 0">
                          项目加息奖励({{resuleData.prjInterestRate}}%)
                          <span class="span-right"><font>{{prjInterestVal}}</font>元</span>
                      </p>
                  </div>
                  <p class="p3" v-on:click="closeTk()">
                      知道了
                  </p>
              </div>
          </div>
          <div class="wapPos" v-show="expectedReturnShowStatus2"  style="display:block"  v-cloak>
              <div class="wapTip">
                  <div class="p-title"><img src="//static.facebank.cn/static/wapFront/invest/img/ic_decorate@2x.png"></div>
                  <div class="cash">
                      <span class="span1">{{currency(allInterest)}}</span><span class="span2">元</span>
                      <p>新手专享奖励({{resuleData.rate}}%）</p>
                  </div>
                  <p class="p3" v-on:click="closeTk()">
                      知道了
                  </p>
              </div>
          </div>
          <div class="wapPos" v-show="wapTkStatus2"  style="display:block"  v-cloak>
	        <div class="wapTip">
	            <p class="p-left" v-html="pLeft2"></p>
	            <p class="p3"  v-on:click="closeLayerAndInitAmont()">确定</p>
	        </div>
	      </div>
        <!--返回出借列表-->
        <div class="wapPos" v-show="wapLayerToInvestListState"  style="display:block"  v-cloak>
           <div class="wapTip">
               <p class="p-left" v-html="pLeft2"></p>
               <p class="p3" v-on:click="toLoanlist()">
                   返回
               </p>
           </div>
        </div>

       <!--风险测评弹框-->
       <div class="layer_style" v-show="riskLayerStatus" v-cloak>
           <a href="javascript:;" class="layer_close" @click="hideRiskLayer()"></a>
           <div class="layer_content" v-html="riskLayerContent"></div>
           <div class="layer_btn one">
               <a href="javascript:;" @click="gotoRisk()">风险测评</a>
           </div>
       </div>
       <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>

       <!-- 投资超限 合规108条 风险测评弹框-->
       <div class="layer_style" v-show="investOverstepLimitLayerStatus" v-cloak>
           <div class="layer_title">出借失败</div>
           <!-- <div class="layer_content" style="padding:1.5rem 1rem;" v-html="investOverstepLimitContent"></div> -->
           <div class="layer_content" style="padding:1.5rem 1rem;">本次出借已超出你风险等级（{{riskName}}）的承受能力，请重新输入出借金额或重新风险测评</div>
           <div class="layer_btn two">
               <a href="javascript:;" @click="utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/home/RiskEvaluation')">重新测评</a>
               <a href="javascript:;" @click="retryInput()">重新输入</a>
           </div>
       </div>
       <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>

       <!--统一提示层-->
       <informationLayer :content.sync="LayerContent" :show.sync="showLayerStatus"></informationLayer>


  </div>
</template>
<style scoped src="./directInvestConfirm.css">
</style>
<script>
import wapTk2 from '@/components/wapTk2';
import informationLayer from '@/components/informationLayer'
import {discount} from 'components'
import {utils, Modal,cal} from 'tools';
import httpErrorTips from '../../httpErrorTips.html';
export default {
    name: 'directInvestConfirm',
    data() {
        return {
            resuleData: {},
            redbagListResult: [],
            userCash : 0,
            //红包相关
            totalRedPkgsCount: '',            //所有红包个数
            abledRedPkgsCount: '0',            //可用红包
            noUseRedBag: false,
            redId: '',
            redType: '',
            redValue: '',
            redRate: '',            //加息红包利率
            redAmount: '',            //返现红包金额

            //旧浮层相关
            pLeft2: '',            //错误弹框模板
            wapTkStatus2: false,            //错误弹框模板
            wapMcStatus: false,
            showRedPackMc: false,
            redbagTkStatus: '',


            expectedReturnShowStatus1: false,            //老普通用户产品弹框
            expectedReturnShowStatus2: false,            //新手标产品弹框

            //收益相关
            investAmount: '',
            allInterest: '0',            //总利息
            basicInterest: '',            //借款利息
            redBagInterest: '',            //加息红包
            prjInterestVal: '',            //项目加息
            firstInterestValue: '',            //利息加息
            redAmountInterest: '',            //返现红包
            vipInterest: '',            //VIP加息


            inputDisabled: false,



            agreementState: false,
            wapLayerToInvestListState: false,


            //出代按钮状态
            btnInvestStatusYes : false,
            btnInvestStatusDis : true,

            tremDayCal: '',
            platform: 'wap',
            token : '',
            productId: '',

            //浮层
            LayerContent : '',
            showLayerStatus : false,
            riskLayerStatus : false,
            layerMaskStatus : false,
            riskLayerContent : '',
            startTime:'',

            //投资超限 合规108条 风险测评弹框
            investOverstepLimitContent : '',
            investOverstepLimitLayerStatus : false,



            riskName : '',



            //卡券
            showCoupon : true,
            curentSelectCoupon : {},
            couponProfit : 0,
            cardId : '',
            redpackageId : '',
            loadingLayerStatus:false,
            userInfo:'',
            nowDay:'',
            firstRepaymentDate:'',
        }
    },
    components: {wapTk2, informationLayer, discount},
    //这里注册
    created: function() {
        if(utils.getCookie('orderId_success') && utils.getCookie('orderId_success') != ''){
            // this.$router.push({
            //     name : 'loanList',
            //     query : {type : 2}
            // })
            utils.setCookie('orderId_success', '', -1)
            utils.closeWebView('/loanList')
            //this.utils.toLoanlist();
            return false;
        }
        //读取cookies中的版本号及设备号
        this.productId = this.$route.query.productId;
        this.platform = utils.getPlatform();
        this.nowDay=cal.AddDays(new Date(),0);
        var _this = this;
        _this.getProductInfo();
        _this.getToken();
        _this.getRedPackList();
        _this.getUserCash();
        $.ajax({
            url : utils.AJAXDOMAINNAME+"/wap/user/riskEvaluationInformation",
            data : '',
            success : function(res){
                if(res.code==1){
                    _this.riskName=res.data.riskRankName;
                }
            }
        })
        this.userInfo=utils.getUserInfo();
    },
    mounted(){

    },
    computed: {},
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
        getToken(){
            var _this = this;
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/getToken',
                success : function(res){
                    if(res.code == '1'){
                        _this.token = res.data.token;
                    }
                }
            })
        },
        InputClickFocus(){
           this.startTime = new Date().getTime();
        },
        InputClickBlur(){
            var endTime=(new Date().getTime()-this.startTime)/1000;

        },
        getUserCash(){
            var _this = this;
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/getUserAccountCashInfo',
                success : function(res){
                    if(res.code*1 == 1) _this.userCash = res.data.accountBalance;
                }
            })
        },
        getRedPackList(){
            var _this = this;
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
                data: '{"type":"1","pageNum":"1","pageSize":"200"}',
                success : function(res){
                    if(res.code*1 == 1){
                        if (res.data.redPackageDtoList != "") {
                            _this.redbagListResult = res.data.redPackageDtoList;
                            _this.totalRedPkgsCount = res.data.redPackageDtoList.length;
                        }
                    }
                }
            })
        },
        getProductInfo(){
            var _this = this;
            //_this.$set(_this.$data.resuleData, 'newUserProduct', 0)
            var def = $.Deferred();
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/product/productDetail',
                data: '{"productId":"' + _this.productId + '"}',
                async: false,
                success: function(res) {

                    if (res.code == 1) {
                        _this.resuleData = res.data;
                        _this.firstRepaymentDate=_this.resuleData.firstRepaymentDate;
                        _this.vipRate = res.data.vipRate;
                        _this.progressBar = (res.data.amount - res.data.remainAmount) / (res.data.amount) * 100;
                        if (_this.resuleData.remainAmount * 1 <= _this.resuleData.startAmount * 1) {
                            _this.resuleData.startAmount = _this.resuleData.remainAmount;
                            _this.investAmount = _this.resuleData.remainAmount;
                            _this.inputDisabled = true;
                        }
                        if (_this.resuleData.termUnit == '1') {
                            _this.tremDayCal = _this.resuleData.termCount;
                        } else if (_this.resuleData.termUnit == '3') {
                            _this.tremDayCal = _this.resuleData.termCount * 30;
                        }
                        setTimeout(function(){_this.$refs.discount.initialization();},100)
                    }
                }
            })
            return def.promise();
        },
        goToRecharge() {
            window.location.href = "/rechargeUI?investamount=" + this.investAmount + "&cburl=%2fdirectInvestConfirm%3fproductId%3D" + this.productId;
        },
        changeAgreementState(el) {
            this.agreementState = !this.agreementState;
        },

        showLayer(content){
            this.LayerContent = content;
            this.showLayerStatus = true;
        },
        retryInput(){
            this.investOverstepLimitContent = '';
            this.investOverstepLimitLayerStatus = false;
            this.layerMaskStatus=false;
            this.investAmount = '';
        },
        //出借确认
        investConfirm() {
            var discount = this.$refs.discount;
            if(discount.selectedCoupon == '' && discount.availableCouponCount > 0 && !discount.confirmNotSelect){
                discount.showDiscountTipsLayer(this.agreementState);
                return;
            }else if (!this.agreementState){
                discount.showAgreementLayer(this.agreementState);
                return false;
            }
          //埋点统计
          if(this.btnInvestStatusDis) return;
          var redbagFilter=this.redbagListResult.filter(item => {
              return item.id == this.redId});
          var redbagMd=[];
          if(redbagFilter.length*1>0){
             redbagMd=redbagFilter[0];
          }


            var _this = this;
            var _self = this;

            if (_self.investAmount == null || _self.investAmount == "" || _self.investAmount == 0 || (_self.resuleData.startAmount * 1 > _self.investAmount * 1)) {
                _self.showLayer("起投金额最少" + _self.resuleData.startAmount + "元")
                return;
            }
            if ((_self.resuleData.remainAmount * 1 - _self.investAmount * 1 < 100) && (_self.resuleData.remainAmount * 1 != _self.investAmount * 1) && (_self.resuleData.remainAmount * 1 - _self.investAmount * 1 > 0)) {
                _self.showLayer("您的出借金额导致剩余金额不足100元<br>建议全部出借或重新确认出借金额")
                return;
            }
            if (_self.investAmount * 1 > _self.resuleData.remainAmount * 1) {
                _self.showLayer("当前可投金额不足 请重新确认出借金额")
                return;
            }
            if (_self.userCash * 1 < _self.investAmount * 1) {
                window.location.href = "/rechargeUI?investamount=" + this.investAmount + "&cburl=%2fdirectInvestConfirm%3fproductId%3D" + this.productId;
                return;
            }

            //禁止按钮操作
            this.btnInvestStatusYes = false;
            this.btnInvestStatusDis = true;
            var data = {
                productId: _this.productId,
                platform: _this.platform,
                redpackageId: _this.redpackageId,
                cardId: _this.cardId,
                amount: _this.investAmount,
                token: _this.token
            };
            this.loadingLayerStatus=true;
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/product/invest',
                data: JSON.stringify(data),
                complete(){
                  _this.loadingLayerStatus=false;
                },
                success: function(res) {
                    _this.btnInvestStatusYes = true;
                    _this.btnInvestStatusDis = false;
                    if (res.code == 1) {

                        var routeParame = {
                            orderId : res.data.orderId,
                            investAmount: _this.investAmount,
                            productType : _this.resuleData.repaymentType,
                            assetType : _this.resuleData.assetType,
                            allInterest : _this.allInterest,
                            cardInterest : (_this.curentSelectCoupon.card_id ? _this.curentSelectCoupon.estimateProfix : ''),
                            redBagInterest : (_this.curentSelectCoupon.bonusModel*1==1 ? _this.curentSelectCoupon.estimateProfix : ''),
                            vipInterest : _this.vipInterest,
                            basicInterest : _this.basicInterest,
                            redAmountInterest : (_this.curentSelectCoupon.bonusModel*1==2 ? _this.curentSelectCoupon.estimateProfix : ''),
                            prjInterestVal : _this.prjInterestVal,
                            firstInterestValue : _this.firstInterestValue,
                            mobile:_this.userInfo.info.mobile,
                            cacheKey: res.data.cacheKey,
                            isQualifiedForRewards: res.data.isQualifiedForRewards,
                        }
                        utils.setCookie('orderId_success', new Date())
                        utils.setCookie('directConSuc', JSON.stringify(routeParame), 1)
                        utils.setCookie('isShowTkAward', 'false')
                        // _this.$router.push({
                        //     name : 'directInvestSuccess',
                        //     params: routeParame
                        // })
                        setTimeout(function(){
                            _this.utils.newWebView('/directInvestSuccess')
                        },200)
                    } else if (res.code * 1 == 0 && res.appCode * 1 == -200) {
                        _self.pLeft2 = res.message;
                        _self.wapLayerToInvestListState = true;
                        _self.wapMcStatus = true;

                        return;
                    } else if (res.code == '-880' || res.code == '-881' || res.code == '-886') {
                        _self.riskLayerContent = res.message;
                        _self.riskLayerStatus = true;
                        _self.layerMaskStatus = true;

                        return;
                    } else if (res.code == '-906') {
                        _this.investOverstepLimitContent = res.message;
                        _this.investOverstepLimitLayerStatus = true;
                        _this.layerMaskStatus = true;

                        return;
                    } else {
                        _self.showLayer(res.message);

                        return;
                    }
                },
                error:function(XMLHttpRequest, textStatus){

                  if(textStatus == 'error'){
                    utils.toastFuc('网络请求错误，请稍候重试');

                  }else if(textStatus == 'timeout'){
                    utils.toastFuc('网络请求超时，请稍候重试');

                  }
                }
            })

        },
        gotoRisk() {
            var statisticssign = utils.getCookie('_key');
            window.location.href = "//promo"+utils.URLSET+".facebank.cn/home/RiskEvaluation?statisticssign=" + encodeURIComponent(statisticssign);
        },
        hideRiskLayer(){
            this.riskLayerContent = '';
            this.riskLayerStatus = false;
            this.layerMaskStatus = false;
            this.btnInvestStatusYes = true;
            this.btnInvestStatusDis = false;
        },
        //选择红包
        chooseRedBag(index) {
            var selectPack = this.redbagListResult[index];
            if (selectPack.bonusModel == 1) {
                this.redType = "返现红包";
                this.redValue = "+" + selectPack.bonusValue + "元";
                this.redAmount = selectPack.bonusValue;
                //已选中加息红包id
                this.redId = selectPack.bonusId;
            }
            if (selectPack.bonusModel == 2) {
                this.redType = "加息红包";
                this.redValue = "+" + selectPack.bonusValue + "%";
                this.redRate = selectPack.bonusValue;
                //已选中返现红包id
                this.redId = selectPack.bonusId;
            }
            var _this = this;
            this.noUseRedBag = false;
            setTimeout(function() {
                _this.wapMcStatus = false;
                _this.redbagTkStatus = false;
                _this.showRedPackMc = false;
            }, 100);
            this.calMoney()
        },
        noRedbag() {

            this.wapMcStatus = false;
            this.redValue = "";
            this.redType = "";
            this.redId = "";
            this.redRate = "";
            this.redAmount = "";
            this.noUseRedBag = true;

            var _this = this;
            setTimeout(function() {
                _this.redbagTkStatus = false;
                _this.showRedPackMc = false;
            }, 320);
            this.calMoney()

        },
        currency(number) {
            return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },
        //红包弹框出现
        redbagTkShow() {
            if (this.totalRedPkgsCount > 0 && this.abledRedPkgsCount > 0) {
                this.redbagTkStatus = true;
                this.wapMcStatus = true;
            }
        },
        toFixed(number, digit) {
            var numbers = number || 0,
            digits = digit || 2;
            return Number(numbers).toFixed(digits);
        },
        //预期利息弹框出现
        shouyiTip() {
            //1、newUserProduct==1  普通产品  2、newUserProduct==1  新手标产品
            if(this.resuleData.newUserProduct==0){
              this.expectedReturnShowStatus1=true;
            }else {
              this.expectedReturnShowStatus2=true;
            }
            this.wapMcStatus=true;
        },
        allInvest() {
            if(
                this.userCash > 0 &&
                this.resuleData.startAmount > 0 &&
                this.resuleData.increaseAmount > 0 &&
                this.resuleData.remainAmount > 0
            ){
                if (this.userCash * 1 >= this.resuleData.remainAmount * 1) {
                    this.investAmount = this.resuleData.remainAmount;
                } else if (this.userCash * 1 >= this.resuleData.startAmount * 1) {
                    this.investAmount = parseInt(this.userCash / this.resuleData.increaseAmount) * this.resuleData.increaseAmount;
                }
            }
        },
        closeTk() {
            this.expectedReturnShowStatus1 = false;
            this.expectedReturnShowStatus2 = false;
            this.wapMcStatus = false;
            this.wapTkStatus2 = false;
            this.iosGuid = false;
            var _this = this;
            setTimeout(function() {
                _this.redbagTkStatus = false;
                _this.showRedPackMc = false;
            },
            320)
        },
        closeLayerAndInitAmont() {
            this.closeTk();
            this.investAmount = '';
            this.redType = "";
            this.redAmount = '';
            this.redValue = "";
            this.redId = '';
        },
        //等额本息期数repaymentType==3时，计算利息
        calStep(rateVar) {
            var monthRate = rateVar / 1200;
            var monthMoney = this.investAmount * monthRate * Math.pow(1 + monthRate, this.resuleData.termCount) / (Math.pow(1 + monthRate, this.resuleData.termCount) - 1)
            var rateValue = (monthMoney * this.resuleData.termCount - this.investAmount).toFixed(2);
            return rateValue;
        },
        calStep60Ajax(rate) {
            var _this = this;
            var data = '{';
            //repaymentType == 4 等本等息
            if (_this.resuleData.repaymentType == 4) {
                data += '"termUnit":"' + _this.resuleData.termUnit + '"';
                data += ',"termCount":"' + _this.resuleData.termCount + '"';
                data += ',"amount":"' + this.investAmount + '"';
                data += ',"dateDiff":"' + _this.resuleData.dateDiff + '"';
                data += ',"allDateDiff":"' + _this.resuleData.allDateDiff + '"';
                data += ',"repaymentType":"' + _this.resuleData.repaymentType + '"';
                data += ',"fixDate":"' + _this.resuleData.fixDate + '"';
                data += ',"rate":"' + rate + '"';
            } else {
                data += '"termUnit":"' + _this.resuleData.termUnit + '"';
                data += ',"termCount":"' + _this.resuleData.termCount + '"';
                data += ',"amount":"' + this.investAmount + '"';
                data += ',"dateDiff":"' + _this.resuleData.dateDiff + '"';
                data += ',"allDateDiff":"' + _this.resuleData.allDateDiff + '"';
                data += ',"repaymentType":"' + _this.resuleData.repaymentType + '"';
                data += ',"rate":"' + rate + '"';
            }
            data += '}';
            var val = 0;
            $.ajax({
                url: utils.AJAXDOMAINNAME+ (_this.resuleData.repaymentType == 4 ? '/userInvestInterestCalS': '/userInvestInterestCal'),
                data: data,
                async: false,
                success: function(rs) {
                    var data = JSON.parse(rs.data)
                    val = data.interest
                }
            })
            return val;
        },
        calMoney60() {
            //1、repaymentType == 4  等本等息
            //2、repaymentType == 3  等额本息
            if (this.resuleData.termUnit == 3 && this.resuleData.assetType == 60 && (this.resuleData.repaymentType == 3 || this.resuleData.repaymentType == 4)) {
                this.basicInterest = this.calStep60Ajax(this.resuleData.rate);
                if (this.resuleData.firstAddCashRate) {
                    this.firstInterestValue = this.calStep60Ajax(this.resuleData.firstAddCashRate);
                } else {
                    this.firstInterestValue = 0;
                }
                //红包利息
                if (this.redType == "返现红包") {
                    this.redAmountInterest = this.redAmount;
                    this.redBagInterest = 0;
                } else if (this.redType == "加息红包") {
                    this.redAmountInterest = 0;
                    this.redBagInterest = this.calStep60Ajax(this.redRate);
                } else {
                    this.redBagInterest = 0;
                    this.redAmountInterest = 0;
                }

                this.vipInterest = this.resuleData.vipRate ? this.calStep60Ajax(this.resuleData.vipRate) : 0;

                this.prjInterestVal = this.resuleData.prjInterestRate ? this.calStep60Ajax(this.resuleData.prjInterestRate) : 0;

                this.allInterest = Number(this.basicInterest) + Number(this.redAmountInterest) + Number(this.redBagInterest) + Number(this.firstInterestValue) + Number(this.vipInterest) + Number(this.prjInterestVal);
            }
        },
        calMoney() {
            //单位为天,均为一次性还本付息
            if (this.resuleData.termUnit == 1) {
              if(this.resuleData.repaymentType ==5){//固定账单日
                 var nowDay=cal.AddDays(new Date(),0);
                 this.basicInterest=cal.getProfit(this.investAmount,this.resuleData.rate,nowDay,this.resuleData.termCount,this.resuleData.firstRepaymentDate).toFixed(2);
                 if (this.resuleData.firstAddCashRate) {
                    this.firstInterestValue = (this.investAmount * this.resuleData.termCount * this.resuleData.firstAddCashRate / (utils.DAYSET*100)).toFixed(2);
                 } else {
                     this.firstInterestValue = 0;
                 }
                 //红包利息
                 if (this.redType == "返现红包") {
                     this.redAmountInterest = this.redAmount;
                     this.redBagInterest = 0;
                 } else if (this.redType == "加息红包") {
                     this.redAmountInterest=cal.getProfit(this.investAmount,this.redRate,nowDay,this.resuleData.termCount,this.resuleData.firstRepaymentDate);
                 } else {
                     this.redBagInterest = 0;
                     this.redAmountInterest = 0;
                 }
                 this.vipInterest = this.resuleData.vipRate?cal.getProfit(this.investAmount,this.resuleData.vipRate,nowDay,this.resuleData.termCount,this.resuleData.firstRepaymentDate).toFixed(2):0;
                 this.prjInterestVal = this.resuleData.prjInterestRate?cal.getProfit(this.investAmount,this.resuleData.prjInterestRate,nowDay,this.resuleData.termCount,this.resuleData.firstRepaymentDate).toFixed(2):0;
              }else{
                //借款利息
                this.basicInterest = (this.investAmount * this.resuleData.termCount * this.resuleData.rate / (utils.DAYSET*100)).toFixed(2);
                //首购加息利息
                if (this.resuleData.firstAddCashRate) {
                    this.firstInterestValue = (this.investAmount * this.resuleData.termCount * this.resuleData.firstAddCashRate / (utils.DAYSET*100)).toFixed(2);
                } else {
                    this.firstInterestValue = 0;
                }
                //红包利息
                if (this.redType == "返现红包") {
                    this.redAmountInterest = this.redAmount;
                    this.redBagInterest = 0;
                } else if (this.redType == "加息红包") {
                    this.redAmountInterest = 0;
                    this.redBagInterest = (this.investAmount * this.resuleData.termCount * this.redRate / (utils.DAYSET*100)).toFixed(2);
                } else {
                    this.redBagInterest = 0;
                    this.redAmountInterest = 0;
                }

                this.vipInterest = this.resuleData.vipRate ? (this.investAmount * this.resuleData.termCount * this.resuleData.vipRate / (utils.DAYSET*100)).toFixed(2) : 0;

                this.prjInterestVal = this.resuleData.prjInterestRate ? (this.investAmount * this.resuleData.termCount * this.resuleData.prjInterestRate / (utils.DAYSET*100)).toFixed(2) : 0;
               }
            }
            //单位月
            else if (this.resuleData.termUnit == 3) {
                //等本等息
                if (this.resuleData.repaymentType == 4 && this.resuleData.assetType == 60) {
                    this.calMoney60();
                } else if (this.resuleData.repaymentType ==3) {  //等额本息
                    if (this.resuleData.assetType == 60) {
                        this.calMoney60();
                    } else {
                        //债转项目
                        this.basicInterest = this.calStep(this.resuleData.rate);
                        if (this.resuleData.firstAddCashRate) {
                            this.firstInterestValue = (this.investAmount * this.resuleData.termCount * this.resuleData.firstAddCashRate / 1200).toFixed(2);;
                        } else {
                            this.firstInterestValue = 0;
                        }
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
                        this.vipInterest = this.resuleData.vipRate ? this.calStep(this.resuleData.vipRate) : 0;

                        this.prjInterestVal = this.resuleData.prjInterestRate ? this.calStep(this.resuleData.prjInterestRate) : 0;

                    }
                }else {//一次性还本付息+先息后本
                    this.basicInterest = (this.investAmount * this.resuleData.termCount * this.resuleData.rate / 1200).toFixed(2);
                    if (this.resuleData.firstAddCashRate) {
                        this.firstInterestValue = (this.investAmount * this.resuleData.termCount * this.resuleData.firstAddCashRate / 1200).toFixed(2);
                    } else {
                        this.firstInterestValue = 0;
                    }
                    //红包利息
                    if (this.redType == "返现红包") {
                        this.redAmountInterest = this.redAmount;
                        this.redBagInterest = 0;
                    } else if (this.redType == "加息红包") {
                        this.redAmountInterest = 0;
                        this.redBagInterest = (this.investAmount * this.resuleData.termCount * this.redRate / 1200).toFixed(2);
                    } else {
                        this.redBagInterest = 0;
                        this.redAmountInterest = 0;
                    }

                    this.vipInterest = this.resuleData.vipRate ? (this.investAmount * this.resuleData.termCount * this.resuleData.vipRate / 1200).toFixed(2) : 0;

                    this.prjInterestVal = this.resuleData.prjInterestRate ? (this.investAmount * this.resuleData.termCount * this.resuleData.prjInterestRate / 1200).toFixed(2) : 0;
                }
            }
            this.allInterest = Number(this.basicInterest) + Number(this.redAmountInterest) + Number(this.redBagInterest) + Number(this.firstInterestValue) + Number(this.vipInterest) + Number(this.prjInterestVal);
        }
    },
    watch: {
        investAmount: function() {
            if (this.investAmount) {
                var val = this.investAmount + '';
                val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
                val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
                if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    val = parseFloat(val);
                }
                this.investAmount = val;
            }
            if (this.investAmount == '' || this.investAmount == 0) {
                this.allInterest = '0.00';
            }
            this.abledRedPkgsCount = 0;
            if (this.investAmount * 1 > 0) {
                this.btnInvestStatusYes = true;
                this.btnInvestStatusDis = false;
            } else {
                this.btnInvestStatusYes = false;
                this.btnInvestStatusDis = true;
            }

            this.calMoney()
        },
        curentSelectCoupon(){

        }
    }
}
</script>
