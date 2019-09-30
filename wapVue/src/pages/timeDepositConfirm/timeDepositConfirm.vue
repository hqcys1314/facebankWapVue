<template>
    <div class="timeDepositConfirm" id="timeDepositConfirm" v-cloak>
        <div class="page_box">
            <div class="timeCountdown">{{countdownTimeShow}}后，所有匹配标的将被释放回标的池</div>
            <div class="matchInfo">
                <p class="p1">出借金额(元)</p>
                <p class="p2">{{resuleData.realAmount}}</p>
                <p class="p3">预期总回报(元)<span @click="showProfitLayer(true)"> {{utils.currency(allInterest)}}</span></p>
            </div>
            <div class="matchInfoList">
                <dl>
                    <dt>锁定期</dt>
                    <dd>{{query.termCount}}{{query.termUnit == 1 ? '天' : query.termUnit == 3 ? '个月' : ''}}</dd>
                </dl>
                <dl>
                    <dt>出借日期</dt>
                    <dd>{{resuleData.publishTime}}</dd>
                </dl>
                <dl>
                    <dt>解锁日期</dt>
                    <dd>{{resuleData.investEndDate}}</dd>
                </dl>
                <dl>
                    <dt>退出方式</dt>
                    <dd>自动委托平台转让退出</dd>
                </dl>
            </div>
        </div>
        <a href="javascript:;" class="matchCount" @click="toDepositDebtMatched()">
            已匹配标的
            <span>{{resuleData.matchLoanCount || 0}}个<i class="iconfont icon-ic_rightarrow"></i></span>
        </a>


        <div class="depositDesc">

            <p>期待年化回报率不代表您的实际回报利率，您可能因出借风险、流动性风险、政策风险、信息传递风险、市场风险、不可抗力风险等因素无法得到期待回报，甚至造成本金的损失。<br><br></p>
            <p>网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<i>认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后，</i>并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。<br>具体内容请详见：<a href="javascript:;" @click="$refs.layerAgreement.showAgreement('riskInfo', '',true)">《网络借贷风险揭示书》</a></p>
        </div>

        <footer class="button_area">
            <a href="javascript:;" class="btn_tpls" @click="investConfirm()" :class="{'disabled': btnDisabledStatus}">确认出借</a>
        </footer>
        <layerAgreement ref="layerAgreement"></layerAgreement>
        <agreementLayer
            :show.sync="showAgreementStateLayer"
            :proInfo.sync="resuleData"
            productType="deposit"
            :abandonSelectChange.sync="abandonSelectChange"
            @investConfirm="investConfirm"
        ></agreementLayer>
        <smileLoading :showSmileLoading="loadingLayerStatus"></smileLoading>
        <tipLayer ref="tipLayer"></tipLayer>
        <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>

        <div class="layer_style" v-show="showTimeOverLayer" v-cloak>
            <div class="layer_title">出借超时</div>
            <div class="layer_content" style="text-align:left;line-height:1.5rem;">
                页面等待时间已超出2分钟，所有匹配标的已释放<br />
                点击【继续出借】将自动为你重新撮合标的并出借<br />
                点击【取消】，将返回
            </div>
            <div class="layer_btn two">
                <a href="javascript:;" style="color:#848999" @click="returnDetail()">取消</a>
                <a href="javascript:;" @click="reMatch()">继续出借</a>
            </div>
        </div>
        <div class="layer_style" v-show="showProfitLayerStatus" v-cloak>
            <div class="profit_title">
                <p>预期总回报(元)</p>
                <p class="money">{{utils.currency(allInterest)}}</p>
            </div>
            <div class="layer_content" style="text-align:left;line-height:1.5rem;padding:.5rem 1rem;margin:0">
                <div class="layer_profit_list">
                    <dl v-for="t in profitData" v-if="t.amount*1 > 0">
                        <dt><p>{{t.title}}</p><span>{{t.content}}</span></dt>
                        <dd>{{utils.currency(t.amount)}}<span>元</span></dd>
                    </dl>
                </div>
            </div>
            <div class="layer_btn one">
                <a href="javascript:;" @click="showProfitLayer(false)">知道了</a>
            </div>
        </div>
        <div class="layerMask" v-show="showTimeOverLayer" v-cloak></div>
        <div class="layerMask" v-show="showProfitLayerStatus" v-cloak></div>

        <!-- 投资超限 合规108条 风险测评弹框-->
        <div class="layer_style" v-show="investOverstepLimitLayerStatus" v-cloak>
            <div class="layer_title">未匹配成功</div>
            <div class="layer_content" style="padding:1.5rem 1rem;">不小心为你匹配了超出你风险等级<span v-if="riskName!='' || riskName != null">（{{riskName}}）</span>承受能力的标的，请重新输入出借金额或重新风险测评</div>
            <div class="layer_btn two">
                <a href="javascript:;" @click="utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/home/RiskEvaluation')">重新测评</a>
                <a href="javascript:;" @click="reMatch()">继续出借</a>
            </div>
        </div>
        <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>
        <div class="reload_box" v-show="layerReloadStatus">
            <div class="animation" ref="loadingAnimation"></div>
            <div class="font">系统正在匹配出借标的...</div>
        </div>

        <tosat ref="tosat"></tosat>
    </div>
</template>

<style src="./timeDepositConfirm.css">

</style>

<script>
import * as constants from './timeDepositConfirmConstants';
import agreementLayer from 'components/discount/agreementLayer';
import {calculationProfit} from "tools";
import toastMessage from 'components/toastMessage'
export default {
        name:
        constants.NAME,
        components: {agreementLayer, toastMessage},
        data() {
            return {
                productId : '',
                btnDisabledStatus : true,
                matchId : '',
                loadingLayerStatus : true,
                couponType : '',
                couponId : '',
                query : '',
                curentSelectCoupon : '',
                allInterest : 0,

                userInfo : '',

                tremDayCal : '',

                resuleData : '',
                matchLoanCount : 0,
                matchLoanList : '',
                matchLoanAllList : '',

                redbagList : '',
                couponCardList : '',
                selectCouponItem : '',
                countdownTime : '',
                countdownTimeShow : '',
                countTimer : '',

                showAgreementStateLayer : false,
                abandonSelectChange : false, //同意协议
                productSaledStatus : false,

                isTmShow:false,//是否展示吐司
                tTime:2000,//吐司时间
                tMsg:'',
                investOverstepLimitLayerStatus : false,
                layerMaskStatus: false,
                showTimeOverLayer : false,
                layerReloadStatus : false,
                riskName : '',

                haveAddRate : false,

                showProfitLayerStatus : false,
                profitData : '',

            }
        },
        created() {
            if(this.utils.getCookie('orderId_success') && this.utils.getCookie('orderId_success') != ''){
                this.utils.setCookie('orderId_success', '', -1)
                this.utils.toLoanlist()
                return false;
            }
            var proFitCookie = this.utils.getCookie('_timeDepositProfit');
            this.profitData = (proFitCookie && proFitCookie != '' && proFitCookie != 'undefined' && proFitCookie != 'null') ? JSON.parse(unescape(proFitCookie)) : [];

            var _this = this;
            this.query = this.$route.query;
            this.productId = this.query.productId;
            this.amount = this.query.amount;
            this.matchId = this.utils.getCookie('currentMatchId') ? this.utils.getCookie('currentMatchId') : this.query.matchId;
            this.couponType = this.query._t ? this.query._t : '';
            this.allInterest = _this.query.allInterest;
            this.haveAddRate = _this.query.haveAddRate*1 == 1 ? true : false;
            this.couponId = this.query._d ? this.query._d : '';

            if (this.query.termUnit == '1') {
                this.tremDayCal = this.query.termCount;
            } else if (_this.query.termUnit == '3') {
                this.tremDayCal = (this.query.termCount*1) * 30;
            }
            setTimeout(function(){
                _this.userInfo = _this.utils.getUserInfo();
                var allIsOver = true;
                $.when(_this.getMatchResule(), _this.getRedPackList(), _this.getCouponCardList(), _this.getMatchList()).then(function(resuleDataRes, redPackRes, couponCardRes, matchListRes){
                    if(redPackRes.code*1 != 1){
                        _this.showLayer(redPackRes.message);
                        allIsOver = false;
                    }else{
                        var redPack = redPackRes.data.redPackageDtoList;
                        if (redPack != "" || redPack != null) {
                            _this.redbagList = redPack;
                        }
                    }
                    if(couponCardRes.code*1 != 1){
                        _this.showLayer(couponCardRes.message);
                        allIsOver = false;
                    }else{
                        var couponCard = couponCardRes.data;
                        if (couponCard != null && couponCard.cardList != "") {
                            _this.couponCardList = couponCard;
                        }
                    }
                    if(resuleDataRes.code*1 != 1){
                        _this.showLayer(resuleDataRes.message);
                        allIsOver = false;
                    }else{

                        _this.resuleData = resuleDataRes.data;
                    }
                    if(matchListRes.loanList){
                        _this.matchLoanList = matchListRes.loanList.length > 4 ? matchListRes.loanList.slice(0,4) : matchListRes.loanList;
                        _this.matchLoanAllList = matchListRes.loanList;
                        _this.matchLoanListLength = matchListRes.loanList.length;
                    }
                    if(allIsOver){
                        _this.resuleHandler()
                    }
                })
            }, 200)
        },
        mounted(){

        },
        methods: {
            returnDetail(){
                this.showTimeOverLayer=false;
                window.history.go(-1)
            },
            showProfitLayer(show){
                this.showProfitLayerStatus = show;
            },
            showReloadLayer(type){
                var _this = this;
                this.layerReloadStatus = type;
                this.layerMaskStatus = type;
                setTimeout(function(){
                    if(_this.$refs.loadingAnimation.getElementsByTagName('svg').length == 0){
                        lottie.loadAnimation({
                            container: _this.$refs.loadingAnimation, // the dom element that will contain the animation
                            renderer: 'svg',
                            loop: true,
                            autoplay: true,
                            path: '/static/js/loading.json' // the path to the animation json
                        });
                    }
                },100)
            },
            //处理日期
            handlerDate(date){
                return date.replace('年', '|').replace('月', '|').replace('日', '|')
            },
            toDepositDebtMatched(){
                var _this = this;

                setTimeout(function(){
                    _this.$router.push({
                        path : '/timeDepositDebt',
                        query : {
                            'matchId': _this.matchId
                        }
                    })
                    //_this.utils.newWebView('/timeDepositDebt?matchId='+_this.matchId)
                },320)
            },
            netErrorHandler(XMLHttpRequest, textStatus){
                this.loadingLayerStatus = false;
                if(textStatus == 'error'){
                    this.utils.toastFuc('网络请求错误，请稍候重试');
                }else if(textStatus == 'timeout'){
                    this.utils.toastFuc('网络请求超时，请稍候重试');
                }
            },
            showLayer(msg){
                this.$refs.tipLayer.showLayer(1, msg);
            },
            //重新计算收益
            calculationSignProfit(){
                var estimateProfix = '0.00';
                if(this.curentSelectCoupon.card_id || this.curentSelectCoupon.bonusId){

                    let proInfo = {
                        termUnit : 1,
                        termCount : this.query.realDays,
                        repaymentType : 2,
                        assetType : 100,
                    }
                    let type = this.curentSelectCoupon.card_id ? 1 : this.curentSelectCoupon.bonusId ? 2 : '';
                    let rate = type == 2 ? this.curentSelectCoupon.bonusValue : this.curentSelectCoupon.card_proportion,
                        stype = type == 2 ? this.curentSelectCoupon.bonusModel : this.curentSelectCoupon.card_type;
                    if(type == 2){
                        estimateProfix = calculationProfit(
                            rate,
                            proInfo,
                            this.resuleData.realAmount,
                            type,
                            stype,
                            '',
                            '',
                        )
                    }else if(type == 1){
                        var yearBill = this.query.realDays*1/365;
                        let profix = (this.resuleData.realAmount *1) * (rate*1/100) * yearBill;
                        if(profix*1 >= this.curentSelectCoupon.card_num*1 && this.curentSelectCoupon.card_type == '1'){
                            estimateProfix = this.curentSelectCoupon.card_num;
                        }else{
                            estimateProfix = profix;
                        }
                    }
                }

                var basicInterest, firstInterestValue, activityRateInterest, vipInterest, prjInterestVal, amount = this.resuleData.realAmount*1;
                //限时加息
                basicInterest = (amount * this.query.realDays * this.query.rate / (this.utils.DAYSET*100)).toFixed(2);
                //借款利息
                activityRateInterest = (amount * this.query.realDays * (this.resuleData.activityRate ? this.resuleData.activityRate : 0) / (this.utils.DAYSET*100)).toFixed(2);
                //首购加息利息
                firstInterestValue = this.query._f ? (amount * this.query.realDays * this.query._f / (this.utils.DAYSET*100)).toFixed(2) : 0;
                //vip加息利息
                vipInterest = this.query._v ? (amount * this.query.realDays * this.query._v / (this.utils.DAYSET*100)).toFixed(2) : 0;
                //项目加息
                prjInterestVal = this.query._p ? (amount * this.query.realDays * this.query._p / (this.utils.DAYSET*100)).toFixed(2) : 0;

                this.allInterest = Number(basicInterest) + Number(firstInterestValue) + Number(vipInterest) + Number(prjInterestVal) + Number(estimateProfix) + Number(activityRateInterest);
                console.log(basicInterest)
                this.profitData = [
                    {
                        'title' : '应收利息',
                        content : '',
                        amount : basicInterest
                    },
                    {
                        'title' : '首购返现奖励',
                        content : '加息'+ this.query._f +'%',
                        amount : firstInterestValue
                    },
                    {
                        'title' : '会员加息奖励',
                        content : '加息'+ this.query._v +'%',
                        amount : vipInterest
                    },
                    {
                        'title' : '限时加息奖励',
                        content : '加息'+ this.query._a +'%',
                        amount : activityRateInterest
                    },
                    {
                        'title' : '项目加息奖励',
                        content : '加息'+ this.query._p +'%',
                        amount : prjInterestVal
                    }
                ];
                if(this.curentSelectCoupon.card_id || this.curentSelectCoupon.bonusId){
                    var content = '';
                    let type = this.curentSelectCoupon.card_id ? 1 : this.curentSelectCoupon.bonusId ? 2 : '';
                    let coupon = this.curentSelectCoupon;

                    if(type == 2){
                        content = coupon.bonusModel*1 == 1 ? ('返现' + coupon.bonusValue + '元') : ('加息' + coupon.bonusValue + '%');
                    }else if(type == 1){
                        //返现卡
                        content = '返现' + coupon.card_proportion + '%';
                    }
                    this.profitData.push({
                        'title' : '卡券奖励',
                        content : content,
                        amount : estimateProfix
                    })
                }
                console.log(this.profitData)
            },
            //当前商品已售光光
            productSaled(){
                var _this = this;
                this.$refs.tipLayer.showByParame({
                    title : 'noTitle',
                    content : '当前标的已出借<br>请返回出借列表重新挑选',
                    btnText : '返回'
                }, function(){
                    _this.utils.toLoanlist();
                })
            },
            //处理匹配结果
            resuleHandler(){
                var _this = this;
                _this.loadingLayerStatus = false;
                window.clearInterval(_this.countTimer)
                _this.countTimer
                if(_this.couponType == 'o'){
                    _this.selectCouponItem = _this.redbagList.filter(function(item){
                        return encodeURIComponent(item.id) == _this.couponId;
                    })
                }
                if(_this.couponType == 'c'){
                    _this.selectCouponItem = _this.couponCardList.filter(function(item){
                        return encodeURIComponent(item.card_id) == _this.couponId;
                    })
                }
                _this.curentSelectCoupon = _this.selectCouponItem.length > 0 ? _this.selectCouponItem[0] : '';

                //匹配结果处理

                _this.btnDisabledStatus = false;
                _this.countdownTime=_this.resuleData.countdownTime;

                if(_this.resuleData.realAmount*1 != _this.query.amount){
                    _this.calculationSignProfit();
                }
                _this.countTimer = setInterval(function(){
                  if(_this.countdownTime*1>0){
                    _this.countdownTime--;
                  }
                  let countdownTimeMiao=_this.countdownTime%60>9?'':'0';
                  let has0 = _this.countdownTime/60 < 10;
                  _this.countdownTimeShow=(has0 ? '0' : '')+parseInt(_this.countdownTime/60)+'分'+countdownTimeMiao+_this.countdownTime%60+'秒';
                },1000)


                //匹配标的列表处理

                var contractListArr = [];
                for(var i=0;i<this.matchLoanAllList.length;i++){
                    contractListArr.push(this.matchLoanAllList[i].contractList)
                }
                if(_this.matchResule != '' && contractListArr.length > 0){
                    _this.$set(_this.$data.resuleData, 'contractListArr', contractListArr)
                }
            },
            //出借已完成了
            investOver(){
                var _this = this;
                _this.loadingLayerStatus = false;
                _this.$refs.tipLayer.showByParame({
                    title : 'noTitle',
                    content : '出借已完成',
                    btnText : '返回'
                }, function(){
                    _this.utils.toLoanlist();
                })
            },
            //获取红包列表
            getRedPackList:function(){
                var _this= this;
                var def = $.Deferred();
                $.ajax({
                  url : this.utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
                    data: '{"type":"0","pageNum":"1","pageSize":"200"}',
                    error : function(XMLHttpRequest, textStatus){
                        _this.netErrorHandler();
                    },
                    success : function(res){
                        def.resolve(res);
                    }
                })
                return def.promise();
            },
            //获取返现列表
            getCouponCardList:function(){
                var _this= this;
                var def = $.Deferred();
                $.ajax({
                  url : this.utils.AJAXDOMAINNAME+ '/wap/getUserAllBCCard',
                    data: '{"type":"0"}',
                    error : function(XMLHttpRequest, textStatus){
                        _this.netErrorHandler();
                    },
                    success : function(res){
                        def.resolve(res);
                    }
                })
                return def.promise();
            },
            //获取匹配详情
            getMatchResule:function(){
                var _this= this;
                var def = $.Deferred();
                $.ajax({
                    url: this.utils.AJAXDOMAINNAME+"/wap/product/getSDQProductMatchResult",
                    data: '{"oid":"' + _this.matchId + '"}',
                    error : function(XMLHttpRequest, textStatus){
                        _this.showReloadLayer(false)
                        _this.netErrorHandler();
                    },
                    success : function(res){
                        _this.resuleData = '';
                        if(res.data == null){
                            _this.showReloadLayer(false)
                            _this.investOver();

                            return false;
                        }
                        if(_this.haveAddRate && (res.data.activityRate*1 <= 0 || res.data.activityRemainTime*1 <= 0)){
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
                                            window.history.go(-1)
                                        }
                                    }
                                ]
                            })
                        }
                        if(res.data.activityRate*1 <= 0 && res.data.activityRemainTime*1 <= 0){
                            //_this.profitData[3].amount = 0;
                            _this.$set(_this.$data.profitData[3], 'amount', 0);
                            _this.resetProfitData();
                        }
                        def.resolve(res);
                    }
                })
                return def.promise();
            },
            resetProfitData(){
                var allInterest = 0;
                for(var i=0;i<this.profitData.length; i++){
                    allInterest = allInterest + this.profitData[i].amount*1;
                }
                this.allInterest = allInterest;
            },
            //匹配标的列表
            getMatchList:function() {
                var _this = this;
                var def = $.Deferred();
                $.ajax({
                    url : this.utils.AJAXDOMAINNAME+ '/wap/product/getSDQMatchLoanList',
                    data: '{"oid":"' + _this.matchId + '", "confirm":"1"}',//confirm 传0,代表只提取前4条标的信息，其它则提全部
                    error : function(XMLHttpRequest, textStatus){
                        _this.showReloadLayer(false)
                        _this.netErrorHandler();
                    },
                    success: function(res) {
                        if (res.code == 1) {
                            def.resolve(res.data);
                        }else{
                            _this.showReloadLayer(false)
                            _this.showLayer(res.message)
                        }
                    }
                })
                return def.promise();
            },
            //获取用户风险等级
            getRiskInfo:function(){
                var _this = this;
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+"/wap/user/riskEvaluationInformation",
                    success : function(res){
                        if(res.code==1){
                            _this.riskName=res.data.riskRankName;
                        }
                    }
                })
            },
            //获取商品详情
            getProductInfo:function(callBack){
                var _this = this;
                this.detailData = '';

                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/product/sdqProductDetail',
                    data: '{"productId":"' + _this.productId + '"}',
                    error : function(XMLHttpRequest, textStatus){
                        _this.showReloadLayer(false)
                        _this.netErrorHandler(XMLHttpRequest, textStatus);
                    },
                    success: function(res) {
                        _this.loadingLayerStatus = false;
                        _this.submitOrderStatus = true;
                        if (res.code*1 == 1) {
                            _this.detailData = res.data;
                            if(res.data.remainAmount*1 == 0){
                                _this.showReloadLayer(false)
                                _this.productSaled();
                                return false;
                            }

                            _this.vipRate = res.data.vipRate;
                            if(typeof callBack == 'function') callBack(_this.detailData)
                        }else{
                            _this.showReloadLayer(false)
                            _this.showLayer(res.message)
                        }
                    }
                })
            },
            //重新匹配
            reMatch:function(){
                var _this = this;
                _this.showTimeOverLayer = false;

                _this.showReloadLayer(true);

                _this.getProductInfo(function(detail){
                    _this.haveAddRate = (detail.activityRate*1 > 0 && detail.activityRemainTime*1 > 0)
                    $.ajax({
                        url : _this.utils.AJAXDOMAINNAME+ '/wap/product/sdqProductMatch',
                        data: JSON.stringify({
                            productId : _this.productId,
                            amount : _this.amount,
                            _t : _this.couponType,//o为红包,c为返现卡
                            _d : _this.couponId ? _this.couponId : ''
                        }),
                        error : function(XMLHttpRequest, textStatus){
                            _this.showReloadLayer(false)
                            _this.netErrorHandler(XMLHttpRequest, textStatus);
                        },
                        success: function(res) {

                            _this.loadingLayerStatus = false;
                            _this.submitOrderStatus = true;
                            if (res.code*1 == 1) {
                                _this.utils.setCookie('currentMatchId', res.data.oid);
                                _this.matchId = res.data.oid;
                                var couponMinAmount = 0;
                                if(_this.curentSelectCoupon){
                                    couponMinAmount = (_this.curentSelectCoupon.bonusEnableMoney||_this.curentSelectCoupon.min_money)*1;
                                }
                                if(res.data.realAmount*1 < _this.amount){
                                    var layerContent = '<p>成功匹配金额'+_this.utils.currency(res.data.realAmount*1) + '元</p>';
                                    if(res.data.realAmount*1 < couponMinAmount){
                                        layerContent = layerContent + '<p>因实际出借的金额小于当前卡券的最低可用金额(>='+couponMinAmount+')，当前卡券未被使用</p>';
                                        _this.profitData.length = 5;
                                    }
                                    _this.$refs.tipLayer.showByParame({
                                        title : 'noTitle',
                                        content : layerContent,
                                    })
                                    _this.curentSelectCoupon = null;
                                }
                                _this.utils.setCookie('_timeDepositProfit', escape(JSON.stringify(_this.profitData)));
                                _this.getMatchInfo();
                            } else if (res.code == '-872') {
                                _this.$refs.tipLayer.showByParame({
                                    title : 'noTitle',
                                    content : res.message,
                                    btnText : '我知道了'
                                }, function(){
                                    _this.utils.toLoanlist();
                                })
                                _this.layerMaskStatus = true;
                                return;
                            } else if (res.code == '-906') {
                                _this.showReloadLayer(false)
                                _this.investOverstepLimitLayerStatus = true;
                                _this.layerMaskStatus = true;
                                return;
                            }else if (res.code == '-853') {
                                _this.$refs.tosat.tosatShow({
                                    msg : '请先登录后操作'
                                },function(){
                                    _this.utils.toLogin(_this.loginCbUrl)
                                })
                                _this.btnDisabledStatus = true;
                                return;
                            }else{
                                _this.showReloadLayer(false)
                                _this.btnDisabledStatus = false;
                                _this.showLayer(res.message)
                            }
                        }
                    })
                })
            },
            //同时获取重新匹配出来的信息
            getMatchInfo:function(){
                var allIsOver = true;
                var _this = this;
                $.when(_this.getMatchResule(), _this.getMatchList()).then(function(resuleDataRes, matchListRes){
                    _this.showReloadLayer(false)
                    if(resuleDataRes.code*1 != 1){
                        _this.showLayer(resuleDataRes.message);
                        allIsOver = false;
                    }else{
                        _this.resuleData = resuleDataRes.data;

                    }
                    if(matchListRes.loanList){
                        _this.matchLoanList = matchListRes.loanList.length > 4 ? matchListRes.loanList.slice(0,4) : matchListRes.loanList;
                        _this.matchLoanAllList = matchListRes.loanList;
                        _this.matchLoanListLength = matchListRes.loanList.length;
                    }
                    if(allIsOver){
                        _this.resuleHandler()
                    }
                })
            },
            //确认投资
            investConfirm:function(){
                var _this = this;
                if(_this.btnDisabledStatus) return false;
                if(_this.countdownTime==0){
                    this.showTimeOverLayer = true;
                    this.btnDisabledStatus = true;
                    return false;
                  // _this.isTmShow=true;
                  // _this.tMsg="确认出借超时，推荐标的已被其他用户锁定，请重新出借";
                  // setTimeout(function () {
                  //     _this.isTmShow=false;
                  //     _this.utils.toLoanlist(1);
                  // }, 2000);
                  // return false;
                }
                if(!_this.abandonSelectChange){
                    _this.showAgreementStateLayer = true;
                    _this.btnDisabledStatus = false;
                    return;
                }
                _this.loadingLayerStatus = true;
                _this.btnDisabledStatus = true;
                if(this.query.termUnit==1){
                  var ProTermV= this.query.termCount+'天';
                }else if(this.query.termUnit==3){
                  var ProTermV= this.query.termCount+'个月';
                }
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/product/submitSDQProductMatch',
                    data: JSON.stringify({
                        oid : _this.matchId,
                        platform : 'wap',
                        _t : _this.query._t ? _this.query._t : '',
                        _d : _this.query._d ? _this.query._d : ''
                    }),
                    error : function(XMLHttpRequest, textStatus){
                        _this.btnDisabledStatus = false;
                        _this.netErrorHandler();
                    },
                    success: function(res) {
                        _this.loadingLayerStatus = false;
                        _this.btnDisabledStatus = false;
                        if (res.code == 1) {
                            var routeParame = {
                                orderId : res.data.orderId,
                                investAmount: _this.resuleData.realAmount,
                                allInterest : _this.utils.currency(_this.allInterest),
                                publishTime : encodeURIComponent(_this.handlerDate(_this.resuleData.publishTime)),
                                investEndDate : encodeURIComponent(_this.handlerDate(_this.resuleData.investEndDate)),
                                cacheKey: res.data.cacheKey,
                                isQualifiedForRewards: res.data.isQualifiedForRewards,
                                mobile:encodeURIComponent(_this.userInfo.info.mobile.replace('****', '|')),
                                termCount : _this.$route.query.termCount,
                                termUnit : _this.$route.query.termUnit
                            }



                            _this.utils.setCookie('orderId_success', new Date())
                            _this.utils.setCookie('timeDepositConSuc', JSON.stringify(routeParame))
                            _this.utils.setCookie('isShowTkAward', 'false')

                            var url = '/timeDepositSuccess?',
                                querys = [];
                            for(var k in routeParame){
                                querys.push(k+'='+routeParame[k])
                            }
                            url = url+querys.join('&')
                            _this.utils.newWebView(url)

                        }else if(res.code == '-893'){
                            _this.isTmShow=true;
                            _this.tMsg=res.message;

                            setTimeout(function () {
                                _this.isTmShow=false;
                                _this.utils.toLoanlist();
                            }, 2000);
                        }else{

                            _this.showLayer(res.message)
                        }
                    }
                })
            }
        }
    }
</script>
