<template>
<div class="timeDepositDetail" id="timeDepositDetail" v-cloak>
    <div class="screenBox" ref="scrollTopPage" :style="'top:'+(currentUI == 1 ? 0 : -100)+'%'" @touchstart="touchStart" @touchend="touchEnd">
        <div class="page_scroll" ref="pageScrollOne">
          <a href="javascript:;" v-if="preId" @click="getProductInfo(preId)" class="floatBtn preBtn"></a>
          <a href="javascript:;" v-if="nextId" @click="getProductInfo(nextId)" class="floatBtn nextBtn"></a>
          <div class="page_box">
              <div class="product_name">
                  <shareComponents ref="shareComponents" :isLogin="isLogin" :shareTitle.sync="shareTitle" :shareContent.sync="shareContent" @updateShareData="resetShareData"></shareComponents>
                  <serviceComponents></serviceComponents>

                  <p>{{substrings(detailData.productName, 10)}}</p>
                  <span class="tag" v-if="detailData.isEnableFirstAddCash=='1'" @click="showFirstInvest" >首购返现</span>
                  <span class="tag" v-if="hasAddRate && detailData.activityRate*1 > 0 && detailData.activityRemainTime*1 > 0">限时加息</span>
                  <span class="tag" v-if="detailData.saleTags != null && detailData.saleTags.length > 0 && index < tagShowCount" v-for="(it, index) in detailData.saleTags">{{substrings(it, 4)}}</span>
              </div>
              <div class="product_info">
                  <div class="infos">
                      <div class="left">
                          <strong>{{detailData.rate}}<span v-if="hasAddRate">% +</span><span v-else>%</span><i v-if="hasAddRate">{{detailData.activityRate}}</i><span v-if="hasAddRate">%</span>
                          </strong>
                      </div>
                      <div class="right">
                          <p>
                              <span>{{detailData.termCount}}</span>
                              {{detailData.termUnit == 1 ? '天' : detailData.termUnit == 3 ? '个月' : ''}}后委托转让
                          </p>
                      </div>
                      <div class="p">
                        <div class="left">
                            <p>期待年化回报率<i class="iconfont icon-inf_huaban" @click="showInterestDescLayer">&nbsp;</i></p>
                        </div>
                        <div class="right" style="margin:0;">

                            <p>历史同期转出时间约3个工作日内</p>
                        </div>
                      </div>
                  </div>
                  <div class="pro_bar">
                      <div class="line"></div>
                      <li class="first">
                          <p>{{detailData.publishTime | formatDate}}</p>
                          <span></span>
                          <p>出借成功</p>
                      </li>

                      <li class="last">
                          <p>{{detailData.transferDate | formatDate}}</p>
                          <span></span>
                          <p>开始债权转让</p>
                      </li>
                      <li class="">
                          <p>{{detailData.investEndDate | formatDate}}</p>
                          <span></span>
                          <p>锁定期结束</p>
                      </li>
                  </div>
              </div>
              <div class="user_cash">
                  可投金额<span v-if="detailData && detailData.remainAmount"> {{detailData.remainAmount | formatNumber2}} {{detailData.remainAmount*1 < 10000 ? '' : '万元'}}</span>
                  <span>账户余额 <i>{{userCash}}</i>元</span>
              </div>
              <div class="inv-confirm-money">
                <span class="span-btn" v-on:click="allInvest()" v-if="userCash*1 >= detailData.startAmount*1 && investAmount*1<=0 && isLogin && detailData.remainAmount*1 != 0">全投</span>
                <span class="span1">¥</span>
                <!-- <input name="inputInvestAmount" class="inputInvestAmount" type="number" v-bind:disabled="inputDisabled"
                v-bind:placeholder="(detailData.startAmount || detailData.increaseAmount) && (detailData.startAmount+'元起投，'+detailData.increaseAmount+'元递增')"
                v-model="investAmount" @focus="InputClickFocus()" @blur="InputClickBlur()"> -->
                <input name="inputInvestAmount" class="inputInvestAmount" type="number" v-bind:disabled="inputDisabled"
                v-bind:placeholder="'起投金额最少'+(detailData.startAmount ? detailData.startAmount : '0')+'元'"
                v-model="investAmount" @focus="InputClickFocus()" @blur="InputClickBlur()">
              </div>
              <!--卡券优惠 productType = 1 : 散标     productType = 2 : 智能推荐-->
              <div class="margin1rem">
                  <discount
                      ref="discount"
                      noAgreementLayer='no'
                      :curentSelectCoupon.sync="curentSelectCoupon"
                      :investAmount.sync="investAmount"
                      :proInfo.sync="detailData"
                      :tremDayCal.sync="tremDayCal"
                      :productType="4"
                      :isLogin.sync="isLogin"
                      :agreementState.sync="agreementState"
                      :nowDay.sync="nowDay"
                      isDeposit="0"
                      :depositProInfo="depositProInfo"
                      @investConfirm="investConfirm"
                      @selectedCoupon="selectedCoupon"
                  ></discount>
              </div>
          </div>
          <div class="interestBox" v-if="investAmount > 0">预期回报 <span>{{currency(allInterest)}}</span>元</div>
          <div class="interestBox" v-else>万元预期回报 <span class="ten">{{detailData.tenThousandsInterest}}</span>元</div>

          <input name="investConfirm" type="button" v-if="!isLogin" value="未登录" class="btn_tpls" @click="utils.toLogin(loginCbUrl)">
          <a name="investConfirm" type="button" v-else class="btn_tpls" v-bind:class="{'disabled':btnInvestStatusDis, 'has_add_rate' : hasAddRate}" v-bind:disabled="btnInvestStatusDis" @click="investConfirm()" v-html="btnText"></a>
          <div class="tel_box">客服电话：<a href="tel:4008900766">4008-900-766</a></div>
          <div class="pull_box" @click="swipePage(2)"><span class="down">&nbsp;</span><p>点击查看详情</p></div>
          <div class="blank"></div>
             <!-- <div class="warn_tips">市场有风险，出借需谨慎</div> -->
         </div>
    </div>
    <div class="screenBox" :style="'top:'+(currentUI == 2 ? 0 : 100)+'%'" @touchstart="touchStart" @touchend="touchEnd">
        <div class="switchTab">
            <ul>

                <li @click="listTab(1)" :class="{'current' : (currentTag == 1)}">
                     <div>产品详情</div>
                 </li>
                <li @click="listTab(2)" :class="{'current' : (currentTag == 2)}">
                     <div>常见问题</div>
                 </li>
            </ul>
            <div class="switch_line" :style="'left:'+ ((currentTag-1) / 2*100) +'%'">&nbsp;</div>
        </div>
        <div class="switch_box" ref="scrollBox" :style="'margin-left:'+(-(currentTag-1)*100 + '%')">
            <div class="pull_box" @click="swipePage(1)" :style="(currentTag == 1 ? 'padding-right:50%;' : 'padding-left:50%;')"><span class="up">&nbsp;</span><p>点击返回产品</p></div>
            <div>
                <div class="intro_box">
                    <timeDepositoryDetailIntro></timeDepositoryDetailIntro>
                </div>
                <div class="intro_box">
                    <timeDepositoryQa :productQaList="productQaList"></timeDepositoryQa>
                </div>
            </div>
        </div>

        <footer class="button_area">
            <input name="investConfirm" type="button" v-if="!isLogin" value="未登录" class="btn_tpls" @click="utils.toLogin(loginCbUrl)">
            <a name="investConfirm" type="button" v-else class="btn_tpls" v-bind:class="{'disabled':btnInvestStatusDis, 'has_add_rate' : hasAddRate}" v-bind:disabled="btnInvestStatusDis" @click="investConfirmBottom()" v-html="btnText">></a>
        </footer>
    </div>

     <!--统一提示层-->
     <tipLayer ref="tipLayer"></tipLayer>
     <!--风险测评弹框-->
     <div class="layer_style" v-show="riskLayerStatus" v-cloak>
         <a href="javascript:;" class="layer_close" @click="closeRiskLayer()"></a>
         <div class="layer_content" style="padding:1.5rem 1rem;" v-html="riskLayerContent"></div>
         <div class="layer_btn one">
             <a href="javascript:;" @click="gotoRisk()">风险测评</a>

         </div>
     </div>
     <div class="wapMc" style="display:block"  v-show="wapMcShow"  v-cloak></div>

     <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>

     <needActive ref="needActive" :userInfo="userInfo"></needActive>

     <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>


     <div class="layer_style" v-show="firstBuyTimeDepositLayerTipsStatus" v-cloak>
         <div class="layer_title" style="text-align:left;padding-left:1.25rem;font-size:1.125rem;">重要提示</div>
         <div class="layer_content" style="text-align:left">
             <div class="TimeDepositLayerTips">
                 <div class="left">
                     <div class="circle"></div>
                     <div class="circle"></div>
                     <div class="line"></div>
                 </div>
             <h2>出借成功，进入锁定期<br><span>{{detailData.publishTime}}</span></h2>
            <p>实时撮合借款标的或受让债权，成功出借金额以实际撮合为准。每个债权单独计息。出借成功当天即进入锁定期，期间如有回款则继续撮合出借。标的回款成功后平台收取服务费。<br><br></p>

            <h2>锁定期满，执行退出<br><span>{{detailData.investEndDate}}</span></h2>
            <p class="black">1.停止出借撮合</p>
            <p>如有资金未撮合出借则实时结算到账户余额，不再委托平台进行撮合出借。</p>
            <p>&nbsp;</p>
            <p class="black">2.开始转让退出</p>
            <p>如仍持有有效债权则平台通过转让陆续完成退出，转让完成时间视实际交易情况而定。平台不承诺退出时效。根据历史经验转让时长不超过3个工作日。债权转让成功后平台收取服务费。</p>
            </div>
         </div>
         <div class="layer_btn one">
             <a href="javascript:;" @click="investConfirm()">知道了</a>
         </div>
     </div>
     <div class="layerMask" v-show="firstBuyTimeDepositLayerTipsStatus" v-cloak></div>
     <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>

     <!-- 投资超限 合规108条 风险测评弹框-->
     <div class="layer_style" v-show="investOverstepLimitLayerStatus" v-cloak>
         <div class="layer_title">未匹配成功</div>
         <!-- <div class="layer_content" style="padding:1.5rem 1rem;" v-html="investOverstepLimitContent"></div> -->
         <div class="layer_content" style="padding:1.5rem 1rem;">不小心为你匹配了超出你风险等级（{{riskName}}）承受能力的标的，请重新输入出借金额或重新风险测评</div>
         <div class="layer_btn two">count
             <a href="javascript:;" @click="utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/home/RiskEvaluation')">重新测评</a>
             <a href="javascript:;" @click="retryInput()">重新输入</a>
         </div>
     </div>
     <!--用户账户余额不足-->
     <div class="layer_style" v-show="userCashNotEnoughShow" v-cloak>
         <div class="layer_content">余额不足，请先充值。</div>
         <div class="layer_btn two">
             <a href="javascript:;" @click="closeLayer()">取消</a>
             <a href="javascript:;" @click="goToRecharge()">确定</a>
         </div>
     </div>
  </div>
</template>

<style scoped src="./timeDepositDetail.css">

</style>

<script>
import * as constants from './timeDepositDetailConstants';
import informationLayer from '@/components/informationLayer';
import shareComponents from '@/components/shareComponents';
import serviceComponents from '@/components/serviceComponents';
import timeDepositoryDetailIntro from '@/components/timeDepositoryDetailIntro';
import timeDepositoryQa from '@/components/timeDepositoryQa';
import {calculationProfit} from "tools";
import {discount} from 'components'

import {cal} from 'tools';

export default {
        name:
        constants.NAME,
        components:{informationLayer, discount, shareComponents, serviceComponents, timeDepositoryDetailIntro, timeDepositoryQa},//这里注册
        data() {
            return {
                tosatShow : false,
                tosatContent : '',
                loadingLayerStatus : true,
                detailData : '',
                submitOrderStatus : true,
                riskCount : '',
                riskName : '',
                riskStatus : '',
                riskEnable : false,

                userCashNotEnoughShow : false,
                layerMaskStatus : false,
                investOverstepLimitLayerStatus : false,


                //firstRate: '',
                vipRate: '',
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



                userCash : '0.00',
                userInfo : '',
                investAmount : '',
                inputDisabled: false,

                tremDayCal : '',
                curentSelectCoupon : {},

                allInterest: '',
                agreementState : false,
                nowDay : '',
                btnInvestStatusDis : false,

                firstBuyTimeDepositLayerTipsStatus : false,
                firstBuyTimeDepositLayerTipsStatusShowed : false,

                depositProInfo : '',
                productIdList : '',
                preId : '',
                nextId : '',
                btnText : '出借',
                loginCbUrl : '',

                productQaList : [],

                currentTag : 1,
                currentUI : 1,

                startX : 0,
                startY : 0,
                endX : 0,
                endY : 0,

                wechatConfigData : '',
                shareUrl : '',
                shareTitle : '我正在笑脸金融出借明星产品“月月笑”',
                shareContent : '回款循环复投，到期自动转让，月月轻松！月月笑！',
                shareImage : 'https://static.facebank.cn/static/wapFront/timeDeposit/share.jpg',

                pageOneScrollTop : 0,
                productCanSaleStatus : true,

                hasAddRate : false,
                countDownTime : '',
                time : 0,
                timer : null,
                profitData : '',
                tagShowCount : 3
            }
        },
        created() {
            var _this = this;
            this.productId = (this.utils.getCookie('currentId') && this.utils.getCookie('currentId')!='null') ? this.utils.getCookie('currentId') : this.$route.query.id;
            this.nowDay=cal.AddDays(new Date(),0);
            this.loginCbUrl = window.location.pathname + '?id=' + this.productId;
            this.shareUrl = this.loginCbUrl;
            if(this.utils.getCookie('timeDepositIdList') == '' || this.utils.getCookie('timeDepositIdList') == undefined){
                this.getProductList(function(){
                    _this.getPreNextId();
                });
            }else{
                _this.getPreNextId();
            }

            $.ajax({
                url: _this.utils.AJAXDOMAINNAME+ '/wap/getWXShareData',
                data: '{"url": "'+window.location.href+'"}',
                success: function(rs) {
                    if (rs.code*1 == 1) {
                        _this.wechatConfigData = rs.data;
                        _this.resetShareData(_this.wechatConfigData);
                    }
                }
            });

            this.utils.setCookie('currentMatchId', '', -1);

            this.userInfo = this.utils.getUserInfo();
            this.isLogin = this.userInfo.isLogin;
            if(this.isLogin) this.getUserCash();

            this.getProductInfo(this.productId);
            this.getQaList();
        },
        filters : {
            formatNumber2(num){
                if(num*1>0){
                    if(num*1<10000){
                        return '不足1万元';
                    }else{
                        return parseInt((num/10000)*100)/100;
                    }
                }else{
                    return '0元'
                }
            },
            formatDate(date){
                if(date){
                    return date.substring(0, 10)
                }
                return ''
            },
            unescapeHtml(html){
                var div = document.createElement('div');
                div.innerHTML = html;
                var str = div.innerHTML;
                return str;
            }
        },
        mounted(){

            var _this = this;
            // var _this = this;
            // this.$refs.scrollBox.addEventListener('scroll', function(){
            //     if(this.scrollTop > 20){
            //         return;
            //     }
            // })
            window.onresize = function(){
                _this.pageOneScrollTop = window.innerHeight - _this.$refs.pageScrollOne.clientHeight;
                console.log(_this.pageOneScrollTop)
            }
        },
        methods: {
            resetShareData(configData){
                var configDatas = configData ? configData : this.wechatConfigData;
                var _this = this;
                wx["config"]({
                    debug: false,
                    appId: configDatas["appId"],
                    timestamp: configDatas["timestamp"],
                    nonceStr: configDatas["nonceStr"],
                    signature: configDatas["signature"],
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo']
                });
                var shareData = {
                    title: _this.shareTitle,
                    desc: _this.shareContent,
                    link: _this.utils.DOMAINNAME+_this.loginCbUrl+(_this.isLogin && _this.userInfo.info ? ('&inviteCode='+_this.userInfo.info.inviteCode) : ''),
                    imgUrl: _this.shareImage,
                    type: 'link',
                    success: function() {
                        console.log(_this.$refs.shareComponents)
                        _this.$refs.shareComponents.closeShareBack();
                        if (typeof wechatShareSuccess === 'function') {
                            console.log('share success');
                        }
                    },
                    cancel: function() {
                        console.log(_this.$refs.shareComponents)
                        _this.$refs.shareComponents.closeShareBack();
                        if (typeof wechatShareCancel === 'function') {
                            console.log('share fail');
                        }
                    },
                    error:function(){
                        console.log(_this.$refs.shareComponents);
                        _this.$refs.shareComponents.closeShareBack();
                    }
                }
                wx.ready(function(){
                    wx.onMenuShareAppMessage(shareData)
                    wx.onMenuShareQQ(shareData)
                    wx.onMenuShareTimeline(shareData)
                    wx.onMenuShareQZone(shareData)
                    wx.onMenuShareWeibo(shareData)
                })
                wx.onMenuShareAppMessage(shareData)
                wx.onMenuShareQQ(shareData)
                wx.onMenuShareTimeline(shareData)
                wx.onMenuShareQZone(shareData)
                wx.onMenuShareWeibo(shareData)
            },
            getPreNextId(){
                var idList = this.utils.getCookie('timeDepositIdList');
                this.productIdList = idList ? idList.split(',') : [];
                var index = this.productIdList.indexOf(this.productId);
                this.preId = this.productIdList[index-1];
                this.nextId = this.productIdList[index+1];
            },
            touchStart(ev){
                ev = ev || event;
                if(ev.touches.length == 1){
                    // 手指按下的时候记录按下的位置
                    this.startX = ev.touches[0].clientX;
                    this.startY = ev.touches[0].clientY;
                }
            },
            touchEnd(evx){
                var offset = 70;
                if (evx.changedTouches.length == 1) {

                    if($(evx.target).parents('.layer_coupon').size() > 0) return;

                    //this.startX = 0;
                    // 手指移动结束后的水平位置
                    let endY = event.changedTouches[0].clientY;
                    // 触摸开始与结束,手指移动的距离
                    var disY = this.startY - endY;
                    //距离1.dX<10,向左滑动   2.dX>10向右滑动  3.-10=<dX<=10不滑动
                    if(disY*1>offset){
                        if(this.$refs.scrollTopPage.scrollTop >= (this.$refs.pageScrollOne.clientHeight - window.innerHeight)-20) {
                            this.currentUI = 2
                        };
                    }else if(disY*1<-offset){
                        if(this.$refs.scrollBox.scrollTop <= 20) this.currentUI = 1;
                    }
                }
            },
            listTab(val){
                this.currentTag = val;
                try{
                    this.$refs.scrollBox.scrollTo(0,0,0)
                }catch(err){
                    this.$refs.scrollBox.scrollTo(0,0)
                }
            },
            substrings(val, len){
                if(!val) return;
                var lastVal = this.len(val) > len ? (val.substring(0,len) + '...') : val.substring(0,len)
                return lastVal;
            },
              //获取字符长度
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
            currency(number) {
                return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            },
            retryInput(){
                this.investOverstepLimitContent = '';
                this.investOverstepLimitLayerStatus = false;
                this.investAmount = '';
                this.layerMaskStatus = false;
            },
            closeLayer(){
                this.layerInputMaskShow = false;
                this.layerMaskStatus = false;
                this.userCashNotEnoughShow = false;
            },
            selectedCoupon(val){
                this.curentSelectCoupon = val;
                this.calMoney()
                // if(this.curentSelectCoupon.bonusId){
                //     var epr = this.curentSelectCoupon.estimateProfix+'';
                //     this.allInterest = this.allInterest + epr.replace(/,/g, '')*1;
                // }else if(this.curentSelectCoupon.card_id){
                //     var epr = this.curentSelectCoupon.estimateProfix+'';
                //     this.allInterest = this.allInterest + epr.replace(/,/g, '')*1
                // }
            },
            swipePage(val){
                this.currentUI = val;
            },
            getProductList(fn){
                var _this = this;
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/product/sdqProductList',
                    async : false,
                    success : function(rs){
                        if(rs.code == '1'){
                            var timeDepositIdList = [];
                            for(var i in rs.data.productList){
                                timeDepositIdList.push(rs.data.productList[i].productId)
                            }
                            _this.utils.setCookie('timeDepositIdList', timeDepositIdList.join(','))
                            if(timeDepositIdList.length > 0) fn();
                        }
                    }
                })
            },
            //用户余额
            getUserCash(){
                var _this = this;
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/getAccountBalance',
                    success : function(res){
                        if(res.code*1 == 1){
                            _this.userCash = res.data.accountBalance ? res.data.accountBalance : '0.00'
                        }else{
                            _this.showLayer(res.message)
                        }
                    }
                })
            },
            //全投
            allInvest() {
                var _this = this;
                if(this.userCash*1 >= this.detailData.remainAmount*1){
                    this.investAmount = this.detailData.remainAmount*1;
                }else if(this.userCash*1 < this.detailData.remainAmount*1){
                    this.investAmount = this.userCash*1;
                }
                // else if(this.investAmount <= this.detailData.remainAmount*1 && this.detailData.remainAmount*1 <= this.detailData.startAmount*1){
                //     this.investAmount = this.detailData.startAmount;
                // }
                if(this.investAmount <= this.detailData.startAmount*1) this.investAmount = this.detailData.startAmount*1;
            },
            InputClickFocus(){
               this.startTime = new Date().getTime();
            },
            InputClickBlur(){

            },
            //检测用户账号状态
            checkUserStatus(){
                var _this = this;
                if(this.userInfo.info.accountState=='350'){
                    this.$refs.tipLayer.showLayer("您的笑脸账号异常，请联系客服4008-900-766！");
                    return false;
                }
                if(this.userInfo.info.accountState=='300'){
                    this.$refs.tipLayer.showLayer("您的账户状态异常，请联系客服4008-900-766！");
                    return false;
                }
                if (!this.userInfo.isIdValify) {
                    this.$refs.tosat.tosatShow({
                        msg : '请先完成实名 '
                    }, function(){
                        _this.utils.newWebView('/authentication' +'?cburl='+_this.loginCbUrl)
                    })
                    return false;
                }
                if(!this.$refs.needActive.checkDepositoryStatus(_this.loginCbUrl)){
                    return false;
                }
                return true;
            },
            closeRiskLayer(){
                this.riskLayerContent = '';
                this.riskLayerStatus = false;
                this.layerMaskStatus = false;
            },
            goToRecharge() {
                window.location.href = "/rechargeUI?investamount=" + this.investAmount + "&cburl=%2ftimeDepositDetail%3fproductId%3D" + this.productId;
            },
            productSaled(){
                var _this = this;
                this.loadingLayerStatus = false;
                this.productCanSaleStatus = false;
                //this.inputDisabled = true;
                this.btnInvestStatusDis = true;
                this.btnText = '已售罄'
                // this.$refs.tipLayer.showByParame({
                //     title : 'noTitle',
                //     content : '当前标的已出借<br>请返回出借列表重新挑选',
                //     btnText : '返回'
                // }, function(){
                //     _this.utils.closeWebView('/loanList')
                // })
            },
            countDown(){
                var _this = this;
                _this.timer = setInterval(function(){
                    _this.time--;
                    if(_this.time <= 0){
                        window.clearInterval(_this.timer);
                        _this.hasAddRate = false;
                        _this.btnText = '出借'
                        return;
                    }else{
                        _this.countHours = parseInt(_this.time/(60*60));
                        _this.countMinutes = parseInt(_this.time/60)%60;
                        _this.countSecond = _this.time%60;
                        _this.countDownTime = (_this.countHours<10 ? '0'+_this.countHours : _this.countHours) + ':' + (_this.countMinutes < 10 ? '0'+_this.countMinutes : _this.countMinutes) + ':' + (_this.countSecond < 10 ? '0'+_this.countSecond : _this.countSecond);
                        _this.btnText = '出借<span>距加息活动还剩 '+ _this.countDownTime +'</span>'
                    }
                },1000)
            },
            productCanSale(){
                var _this = this;
                this.loadingLayerStatus = false;
                this.inputDisabled = false;
                this.btnInvestStatusDis = false;
                if(this.hasAddRate){
                    this.btnText = '出借<span>距加息活动还剩'+ this.countDownTime +'</span>'
                }else{
                    this.btnText = '出借'
                }
            },
            getProductInfo(currentId,callBack){
                var _this = this;
                this.productId = currentId;
                this.hasAddRate = false;
                this.btnText = '出借'
                this.utils.setCookie('currentId', this.productId);
                this.loginCbUrl = window.location.pathname + '?id=' + this.productId;
                var index = this.productIdList.indexOf(this.productId);
                this.preId = this.productIdList[index-1];
                this.nextId = this.productIdList[index+1];
                this.detailData = '';
                this.loadingLayerStatus = true;

                window.clearInterval(this.timer)
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/product/sdqProductDetail',
                    data: '{"productId":"' + _this.productId + '"}',
                    error : function(XMLHttpRequest, textStatus){
                        _this.loadingLayerStatus = false;
                        _this.submitOrderStatus = true;
                        if(textStatus == 'error'){
                            _this.utils.toastFuc('网络请求错误，请稍候重试');
                		}else if(textStatus == 'timeout'){
                            _this.utils.toastFuc('网络请求超时，请稍候重试');
                		}
                    },
                    success: function(res) {
                        _this.loadingLayerStatus = false;
                        _this.submitOrderStatus = true;
                        if (res.code*1 == 1) {
                            _this.detailData = res.data;
                            if(_this.detailData.isEnableFirstAddCash=='1'){
                                _this.tagShowCount--;
                            }
                            if(_this.detailData.activityRate*1 > 0 && _this.detailData.activityRemainTime*1 > 0){
                                _this.tagShowCount--;
                            }
                            if(res.data.remainAmount*1 == 0){
                                _this.productSaled();
                                //return false;
                            }else{
                                if(res.data.activityRate*1 > 0 && res.data.activityRemainTime*1 > 0) {
                                    _this.hasAddRate = true;
                                    _this.time = res.data.activityRemainTime*1;
                                    _this.countDown();
                                }
                                _this.productCanSale();
                            }
                            _this.depositProInfo = {
                                productId : _this.productId,
                                termUnit : 1,
                                termCount : res.data.realDays,
                                repaymentType : 2,
                                assetType : 100,
                            }
                            //_this.firstRate = res.data.firstRate;
                            _this.vipRate = res.data.vipRate;
                            /*if (_this.detailData.termUnit == '1') {
                                _this.tremDayCal = res.data.termCount*1;
                            } else if (_this.detailData.termUnit == '3') {
                                _this.tremDayCal = res.data.realDays*1;
                            }*/
                            _this.tremDayCal = res.data.realDays*1;

                            if(_this.curentSelectCoupon.bonusId){
                                if(
                                    !(_this.tremDayCal >= _this.curentSelectCoupon.bonusEnableDate*1 &&
                                    _this.investAmount >= _this.curentSelectCoupon.bonusEnableMoney*1 &&
                                    _this.curentSelectCoupon.bonusEnableProduct.indexOf('4') > -1)
                                ){
                                    _this.curentSelectCoupon = '';
                                }
                            }else if(_this.curentSelectCoupon.card_id){
                                if(
                                    !(_this.tremDayCal >= _this.curentSelectCoupon.order_term*1 &&
                                    _this.investAmount >= _this.curentSelectCoupon.min_money*1 &&
                                    _this.curentSelectCoupon.order_type.indexOf('4') > -1)
                                ){
                                    _this.curentSelectCoupon = '';
                                }
                            }
                            _this.calMoney();
                            //if(typeof callBack != 'function' && _this.isLogin && res.data.remainAmount*1 > 0) _this.$refs.discount.initialization();
                            if(typeof callBack != 'function' && _this.isLogin) _this.$refs.discount.initialization();
                            if(typeof callBack == 'function') callBack(_this.detailData)
                        }else{
                            _this.showLayer(res.message)
                        }
                    }
                })
            },
            showFirstInvest(){
                this.$refs.tipLayer.showByParame({
                    title : '首购返现规则说明',
                    content : '1. 首次购买90天以上(含)，180天以内的产品，可获出借金额的年化0.3%现金返现;<br />2. 首次购买180天以上(含)的产品，可获出借金额的年化0.5%现金返现;<br />3. 返现金额=出借金额×出借期限(天)/365×返现率;<br />或，返现金额=出借金额×出借期限(月)/12×返现率;<br />举例：老王出借1万元至180天的产品，那么老王可获得的返现金额为：10000×180/365×0.5%=24.66元;<br />4.返现金额将在您出借后，直接返还至您的账户余额中，可提现;<br />5.首购返现奖励可与卡券奖励叠加  <br />',
                    textAlign : 'left',
                    btnText : '知道了'
                })
            },
            showInterestDescLayer(){
                this.$refs.tipLayer.showByParame({
                    title : '期待年化回报率',
                    content : '期待年化回报率不代表您的实际回报率，出借人的实际收益取决于锁定期内是否及时成功匹配借款人以及借款人是否按期足额偿还借款本息等情况。您在加入月月笑产品之前应主动了解该产品信息，理解并接受自身的交易行为可能存在不能够按期收回出借资金本息的风险，笑脸金融平台不对您在“月月笑”产品下本息的收回作出任何承诺、保证。',
                    textAlign : 'left',
                    btnText : '知道了'
                })

            },
            //控制风险等级浮层
            showRiskLayer(font){
                this.riskLayerContent = font;
                this.riskLayerStatus = true;
                this.layerMaskStatus = true;
            },
            showLayer(content){
                this.$refs.tipLayer.showLayer(1,content)
            },

            //获取并检测用户风险等级
            checkRiskStatus(callback){
                var _this = this;
                if(!this.riskEnable){
                    $.ajax({
                        url : _this.utils.AJAXDOMAINNAME+"/wap/user/riskEvaluationInformation",
                        data : '',
                        error : function(XMLHttpRequest, textStatus){
                            _this.loadingLayerStatus = false;
                            _this.submitOrderStatus = true;
                            if(textStatus == 'error'){
                                _this.utils.toastFuc('网络请求错误，请稍候重试');
                            }else if(textStatus == 'timeout'){
                                _this.utils.toastFuc('网络请求超时，请稍候重试');
                            }
                        },
                        success : function(res){
                            if(res.code==1){
                                _this.riskCount=res.data.riskNum;
                                _this.riskName=res.data.riskRankName;
                                _this.riskStatus=res.data.isBlockInvest;
                                if(res.data.riskNum*1==0&&_this.riskStatus=='1'){
                                    _this.loadingLayerStatus = false;
                                    _this.submitOrderStatus = true;
                                    _this.riskEnable = false;
                                    _this.showRiskLayer('您未进行过风险测评，请进行完风险评测再进行出借。')
                                }else{
                                    _this.riskEnable = true;
                                    if(typeof callback == 'function') callback();
                                }
                            }else{
                                _this.riskEnable = true;
                                if(typeof callback == 'function') callback();
                            }
                        }
                    })
                }else{
                    if(typeof callback == 'function') callback();
                }
            },
            //获取qs
            getQaList(){
                var _this = this;
                $.ajax({
                    url : 'https://cic.facebank.cn/api/getAppConfigByKey',
                    data : JSON.stringify({
                        configKey : 'product_qa'
                    }),
                    async : false,
                    success : function(rss){
                        var rs = typeof rss == 'string' ? eval('('+ rss +')') : rss;
                        if(rs.statusCode*1 == 200){
                            if(rs.generalModelList.length > 0){
                                _this.productQaList = rs.generalModelList
                            }
                        }
                    }
                })
            },
            investConfirmBottom(){
                if(this.investAmount == '' || this.investAmount == 0){
                    this.swipePage(1);
                }else{
                    this.swipePage(1);
                    this.investConfirm();
                }
            },
            //出借确认
            investConfirm() {
                var _this = this;

                if(!this.submitOrderStatus) return false;
                _this.submitOrderStatus = false;
                _this.firstBuyTimeDepositLayerTipsStatus = false;
                if(_this.time > 0) _this.hasAddRate = true
                if(!this.userInfo.isLogin){
                    this.$refs.tosat.tosatShow({
                        msg : '请先登录后操作'
                    },function(){
                        _this.utils.toLogin(_this.loginCbUrl)
                    })
                    this.submitOrderStatus = true;
                    return;
                }

                if(!this.checkUserStatus()){
                    this.submitOrderStatus = true;
                    return false;
                }

                _this.firstBuyTimeDepositLayerTipsStatus = false;
                if(_this.investAmount == '' || _this.investAmount == 0){
                    _this.showLayer('请输入您计划出借的金额')
                    _this.submitOrderStatus = true;
                    return false;
                }
                // if(
                //     _this.detailData.remainAmount*1 > _this.detailData.startAmount*1 &&
                //     _this.investAmount > _this.detailData.remainAmount*1 &&
                //     _this.investAmount < this.userCash*1
                // ){
                //     _this.showLayer('超出可投余额，请修改出借金额！')
                //     _this.submitOrderStatus = true;
                //     return false;
                // }



                if(parseFloat(_this.investAmount, 10) > parseFloat(_this.userCash, 10)){
                    _this.userCashNotEnoughShow=true;
                    _this.layerMaskStatus = true;
                    _this.submitOrderStatus = true;
                    return false;
                }
                if(_this.investAmount == "" || _this.investAmount*1<_this.detailData.startAmount*1){
                    _this.showLayer('起投金额最少'+ _this.detailData.startAmount +'元')
                    _this.submitOrderStatus = true;
                    return false;
                }

                _this.loadingLayerStatus = true;
                var couponId = _this.curentSelectCoupon.bonusId || _this.curentSelectCoupon.card_id;
                var couponType = _this.curentSelectCoupon.bonusId ? 'o' : _this.curentSelectCoupon.card_id ? 'c' : '';

                _this.checkRiskStatus(function(){
                    if(_this.detailData.isInvested == '0' && !_this.firstBuyTimeDepositLayerTipsStatusShowed){
                        //是否投资过锁定期产品0未投资过 1投资过
                        _this.firstBuyTimeDepositLayerTipsStatus = true;
                        _this.firstBuyTimeDepositLayerTipsStatusShowed = true;
                        _this.submitOrderStatus = true;
                        _this.loadingLayerStatus = false;
                        return false;
                    }
                    var discount = _this.$refs.discount;
                    if(discount.selectedCoupon == '' && discount.availableCouponCount > 0 && !discount.confirmNotSelect){
                        _this.submitOrderStatus = true;
                        _this.loadingLayerStatus = false;
                        discount.showDiscountTipsLayer(_this.agreementState);
                        return;
                    }

                    $.ajax({
                        url : _this.utils.AJAXDOMAINNAME+ '/wap/product/sdqProductMatch',
                        data: JSON.stringify({
                            productId : _this.productId,
                            amount : _this.investAmount,
                            _t : couponType,//o为红包,c为返现卡
                            _d : couponId ? couponId : ''
                        }),
                        error : function(XMLHttpRequest, textStatus){
                            _this.loadingLayerStatus = false;
                            _this.submitOrderStatus = true;
                            if(textStatus == 'error'){
                                _this.utils.toastFuc('网络请求错误，请稍候重试');
                            }else if(textStatus == 'timeout'){
                                _this.utils.toastFuc('网络请求超时，请稍候重试');
                            }
                        },
                        success: function(res) {
                            _this.loadingLayerStatus = false;
                            _this.submitOrderStatus = true;
                            if (res.code*1 == 1) {
                                var query = {}, couponMinAmount;
                                query = {
                                    productId : _this.productId,
                                    amount : _this.investAmount,
                                    allInterest : _this.allInterest,
                                    matchId : res.data.oid,
                                    termCount : _this.detailData.termCount,
                                    realDays : _this.detailData.realDays,
                                    termUnit : _this.detailData.termUnit,
                                    rate : _this.detailData.rate,
                                    _v : _this.detailData.vipRate,
                                    _f : _this.detailData.firstAddCashRate,
                                    _a : _this.detailData.activityRate,
                                    _p : _this.detailData.prjInterestRate,
                                    amo_punt : _this.detailData.prjInterestRate,
                                    hasAddRate : _this.hasAddRate ? 1 : 0
                                }
                                _this.utils.setCookie('currentMatchId', res.data.oid);

                                if(_this.curentSelectCoupon){
                                    query['_t']=(_this.curentSelectCoupon.bonusId ? 'o' : 'c');
                                    query['_d']=(_this.curentSelectCoupon.bonusId || _this.curentSelectCoupon.card_id);
                                    couponMinAmount = (_this.curentSelectCoupon.bonusEnableMoney||_this.curentSelectCoupon.min_money)*1;
                                }
                                if(res.data.realAmount*1 < _this.investAmount){
                                    var layerContent = '<p>成功匹配金额'+_this.utils.currency(res.data.realAmount*1) + '元</p>';
                                    if(res.data.realAmount*1 < couponMinAmount){
                                        layerContent = layerContent + '<p>因实际出借的金额小于当前卡券的最低可用金额(>='+couponMinAmount+')，当前卡券未被使用</p>';
                                        query['_t'] = "";
                                        query['_d'] = "";
                                        _this.profitData.length = 5;
                                    }

                                    _this.utils.setCookie('_timeDepositProfit', escape(JSON.stringify(_this.profitData)));

                                    _this.$refs.tipLayer.showByParame({
                                        title : 'noTitle',
                                        content : layerContent,
                                    }, function(){
                                        _this.$router.push({
                                            path : '/timeDepositConfirm',
                                            query : query
                                        })
                                    })
                                }else if(res.data.realAmount*1 >= _this.investAmount){
                                    _this.utils.setCookie('_timeDepositProfit', escape(JSON.stringify(_this.profitData)));
                                    _this.$router.push({
                                        path : '/timeDepositConfirm',
                                        query : query
                                    })
                                }
                            }else if (res.code == '-880' || res.code == '-881' || res.code == '-886') {
                                _this.riskLayerContent = res.message;
                                _this.riskLayerStatus = true;
                                _this.layerMaskStatus = true;
                                return;
                            } else if (res.code == '-906') {
                                _this.investOverstepLimitContent = res.message;
                                _this.investOverstepLimitLayerStatus = true;
                                _this.layerMaskStatus = true;
                                return;
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
                            } else if (res.code == '-853') {
                                _this.$refs.tosat.tosatShow({
                                    msg : '请先登录后操作'
                                },function(){
                                    _this.utils.toLogin(_this.loginCbUrl)
                                })
                                _this.submitOrderStatus = true;
                                return;
                            }else{
                                _this.showLayer(res.message)
                            }
                        }
                    })
                })
            },
            gotoRisk() {
                var statisticssign = this.utils.getCookie('_key');
                window.location.href = "//promo"+this.utils.URLSET+".facebank.cn/home/RiskEvaluation?statisticssign=" + encodeURIComponent(statisticssign);
            },
            toFixed(number, digits) {
                var numbers = number || 0,
                digits = digits || 2;
                return Number(number).toFixed(digits);
            },

            //红包计算
            calculationSignProfit(type, itemData){
                let rate = type == 2 ? itemData.bonusValue : itemData.card_proportion,
                    stype = type == 2 ? itemData.bonusModel : itemData.card_type,
                    estimateProfix = '0.00';
                let proInfo = this.detailData;
                if(type == 2){
                    let proInfo = {
                        termUnit : 1,
                        termCount : this.detailData.realDays,
                        repaymentType : 2,
                        assetType : 100,
                    }
                    estimateProfix = calculationProfit(
                        rate,
                        proInfo,
                        this.investAmount,
                        type,
                        stype,
                        this.nowDay,
                        this.firstRepaymentDate,
                    )
                }else if(type == 1){
                    let yearBill = 0;
                    yearBill = this.depositProInfo.termCount*1/365;
                    let profix = (this.investAmount *1) * (rate*1/100) * yearBill;
                    if(profix*1 >= itemData.card_num*1 && itemData.card_type == '1'){
                        estimateProfix = this.currency(itemData.card_num);
                    }else{
                        estimateProfix = this.currency(profix);
                    }
                }
                return estimateProfix
            },
            calMoney() {
                this.profitData = '';
                //单位为天,均为一次性还本付息
                this.basicInterest = (this.investAmount * (this.detailData.rate / (this.utils.DAYSET*100)) * this.detailData.realDays).toFixed(2);
                //限时加息
                this.activityRateInterest = this.detailData.activityRate ? (this.investAmount * (this.detailData.activityRate / (this.utils.DAYSET*100)) * this.detailData.realDays).toFixed(2) : 0;
                //首购加息利息
                this.firstInterestValue = this.detailData.firstAddCashRate ? (this.investAmount * this.detailData.realDays * this.detailData.firstAddCashRate / (this.utils.DAYSET*100)).toFixed(2) : 0;

                this.vipInterest = this.detailData.vipRate ? (this.investAmount * this.detailData.realDays * this.detailData.vipRate / (this.utils.DAYSET*100)).toFixed(2) : 0;

                this.prjInterestVal = this.detailData.prjInterestRate ? (this.investAmount * this.detailData.realDays * this.detailData.prjInterestRate / (this.utils.DAYSET*100)).toFixed(2) : 0;

                this.allInterest = Number(this.basicInterest) + Number(this.firstInterestValue) + Number(this.vipInterest) + Number(this.prjInterestVal) + Number(this.activityRateInterest);
                var epr = 0;
                var couType = this.curentSelectCoupon.bonusId ? '红包' : '返现卡';

                if(this.curentSelectCoupon.bonusId || (this.curentSelectCoupon.card_id || this.curentSelectCoupon.card_proportion)){
                    var ep = this.calculationSignProfit(this.curentSelectCoupon.bonusId ? 2 : 1, this.curentSelectCoupon);
                    this.$set(this.$data.curentSelectCoupon, 'estimateProfix', ep)

                    var couponMinAmount = (this.curentSelectCoupon.bonusEnableMoney||this.curentSelectCoupon.min_money)*1;
                    if(couponMinAmount <= this.investAmount){
                        epr = this.curentSelectCoupon.estimateProfix+'';
                        this.allInterest = this.allInterest + epr.replace(/,/g, '')*1;
                    }
                }

                this.profitData = [
                    {
                        'title' : '应收利息',
                        'content' : ' ',
                        'amount' : this.basicInterest
                    },
                    {
                        'title' : '首购返现奖励',
                        'content' : '加息'+ (this.detailData.firstAddCashRate ? this.detailData.firstAddCashRate : 0) +'%',
                        'amount' : this.firstInterestValue
                    },
                    {
                        'title' : '会员加息奖励',
                        'content' : '加息'+ (this.detailData.vipRate ? this.detailData.vipRate : 0) +'%',
                        'amount' : this.vipInterest
                    },
                    {
                        'title' : '限时加息奖励',
                        'content' : '加息'+ (this.detailData.activityRate ? this.detailData.activityRate : 0) +'%',
                        'amount' : this.activityRateInterest
                    },
                    {
                        'title' : '项目加息奖励',
                        'content' : '加息'+ (this.detailData.prjInterestRate ? this.detailData.prjInterestRate : 0) +'%',
                        'amount' : this.prjInterestVal
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
                        'content' : content,
                        'amount' : epr
                    })
                }

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
                if (this.investAmount * 1 > 0 && this.productCanSaleStatus) {
                    this.btnInvestStatusDis = false;
                } else {
                    //this.btnInvestStatusDis = true;
                }

                this.calMoney()
            }
        }
    }
</script>
