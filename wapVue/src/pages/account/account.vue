<template>
  <div id="account" v-cloak>
      <div class="acc_top_box">
    <div class="acc_1">
        <div class="left jh-btn" ref="face_box" jh-name="头像" >
            <img ref="faceImage" v-if="isBindWx && weChatHeadPic && weChatHeadPic != 'null' && weChatHeadPic != 'undefined'" :src="decodeURI(weChatHeadPic)" alt="" />
            <img v-else src="https://static.facebank.cn/static/wapFront/depository/img/face.png?v=1"  alt="">
        </div>
        <div class="center">
            <p class="p1 jh-btn" jh-name="姓名/手机号">{{userBaseInfoResult.hasIdValify == '1' ? accName: userBaseInfoResult.mobile}}</p>
            <a :href="'//shop'+urlTest+'.facebank.cn/Vip/index'" class="p2 jh-btn" jh-name="会员">
                 <img v-bind:src="marketingInfo.smallIcon" class="img1">{{marketingInfo.rankName}}
                 <img src="~assets/wapFront/myAccount/img/jiantouIcon.png" class="img2"></a>

        </div>

          <div class="right jh-btn" jh-name="设置"><router-link class="setting" :to="{ path: '/information'}">设置</router-link></div>

    </div>
     <router-link :to="{ path: '/setLoginPwd'}" class="setPwdTip sensors-btn" sensors-name="设置登录密码按钮" v-if="userBaseInfoResult.userHasSetPassword== 0">
              <span class="span3"><img src="~assets/wapFront/myAccount/img/tip_jt2.png"></span>
              <i class="iconfont icon-info"></i>
              <span class="span2">安全级别过低，请立即设置登录密码</span>
     </router-link>

     <div class="noActive" v-if="userBaseInfoResult.accountState=='100'">
         <img src="//static.facebank.cn/static/wapFront/depository/img/logo@3x.png" class="xw_logo" />
         <p @click="openDepository()">未开通银行存管账户</p>
     </div>
     <div class="acc_2" v-else-if="userBaseInfoResult.accountState=='150' || userBaseInfoResult.accountState=='160'">
        <p class="no_active">未激活银行存管账户</p>
         <p class="p1" v-if="(!hasAccount) && accountCashResult.totalAssert*1 == 0">--</p>
         <p class="p1" v-else><!--￥-->{{accountCashResult.totalAssert| currency}}</p>
         <a class="jh-btn" jh-name="总资产" href="javascript:;" @click="toTotalAsset">总资产(元)</a>
     </div>
      <div class="acc_2" v-else>
          <img src="//static.facebank.cn/static/wapFront/depository/img/logo@3x.png" class="xw_logo opened" />
          <p class="p1" v-if="(!hasAccount) && accountCashResult.totalAssert*1 == 0">--</p>
          <p class="p1" v-else><!--￥-->{{accountCashResult.totalAssert| currency}}</p>
          <a class="jh-btn" jh-name="总资产"  href="javascript:;" @click="toTotalAsset">总资产(元)</a>
      </div>
      <div class="money_info" v-if="userBaseInfoResult.accountState!='150' && userBaseInfoResult.accountState!='100'">
          <li>
              <span>{{accountCashResult.profitForHistory}}</span>
              <p>累计回报(元)</p>
          </li>
          <li>
              <span>{{accountCashResult.planProfit}}</span>
              <p>待收回报(元)</p>
          </li>
      </div>
  </div>
        <div class="banner_box" v-if="taskId != ''">
            <!--首投后，引导邀请-->
            <a class="acc_3"  v-if="taskId=='4'" :href="'https://partner'+utils.URLSET+'.facebank.cn/partner_plan'">
                <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner4v1.png">
            </a>
            <!--充值后，引导首投  -->
            <router-link class="acc_3"  v-if="taskId=='3'&&!isThreeGiftNewUser" :to="{ path: '/loanList'}">
                <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner3v2.png">
            </router-link>
            <a class="acc_3"  v-if="taskId=='3'&&isThreeGiftNewUser" :href="'https://partner'+utils.URLSET+'.facebank.cn/partner_plan'">
              <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner4v1.png">
            </a>
            <!--开户后，引导充值-->
            <a class="acc_3" @click="gotoRecharge()" v-if="taskId=='2'&&!isThreeGiftNewUser">
                <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner3v2.png">
            </a>
            <a class="acc_3"  v-if="taskId=='2'&&isThreeGiftNewUser" :href="'https://partner'+utils.URLSET+'.facebank.cn/partner_plan'">
              <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner4v1.png">
            </a>
            <!--注册后，引导绑卡-->
            <a href="javascript:;" class="acc_3" @click="openDepository()" v-if="taskId=='1'">
                <img src="//static.facebank.cn/static/wapFront/myAccount/img/acc_banner1v2.png">
            </a>
        </div>
      <div class="acc_withdraw_show" v-if="frozenWithdrawCashLists&&frozenWithdrawCashLists.length*1>0">
          <span class="span1">提现中：</span><span class="span2">{{accountCashResult.drawCashFrozenCash | currency}}元</span>
          <i class="iconfont icon-info sensors-btn jh-btn" jh-name="提现审核中" v-on:click="showWithdrawLayer" sensors-name="提现冻结提示"></i>
      </div>


      <div class="acc_4">
          <div class="div1 infoborder2 rewardTipsBox">
              <div class="left" v-if="!hasAccount">
                  <p class="p1 jh-btn" jh-name="可用余额" v-if="accountCashResult.accountBalance*1 == 0">--</p>
                  <p class="p1" v-if="accountCashResult.accountBalance*1 > 0">￥{{accountCashResult.accountBalance| currency}}</p>
                  <p class="p2 jh-btn" jh-name="可用余额" v-if="accountCashResult.accountBalance*1 == 0">可用余额(元)</p>
                  <p class="p2" v-if="accountCashResult.accountBalance*1 > 0">奖励金额(元)</p>
                  <div class="rewardTips" v-if="accountCashResult.accountBalance*1 > 0">
                      <a href="javascript:;" class="tips_link" @click="openDepository()">开户后该金额可用于出借或提现 &gt;</a>
                  </div>
              </div>

              <div class="left jh-btn"  jh-name="可用余额" v-else>
                  <p class="p1">￥{{accountCashResult.accountBalance| currency}}</p>
                  <p class="p2">可用余额(元)</p>
              </div>


              <a class="right jh-btn"  jh-name="提现" style="color:#848999;" v-on:click="gotoWithdraw()">
                  <i class="iconfont icon-ic_withdraw"></i>提现
              </a>

              <a class="right jh-btn"  jh-name="充值"  v-on:click="gotoRecharge()">
                  <i class="iconfont icon-ic_recharge"></i>充值
              </a>

              <div class="clear"></div>
          </div>
          <div class="div1 infoborder jh-btn" jh-name="交易明细">
              <router-link :to="{ path: '/transactionRecord'}">
                   <span class="aIcon"><i class="iconfont icon-ic_personal_record_detailed"></i></span>
                   <span class="span1">交易明细</span>
                   <span class="span2"><i class="iconfont icon-ic_rightarrow"></i><span class="span-spot_type2" v-if="userBaseInfoResult.userJournalCuePoint*1 == 1"></span></span>
             </router-link>
           </div>
           <div class="div1 jh-btn" jh-name="还款日历" v-show="isShowCalendar">
             <!--<router-link :to="{ path: '/repaymentCalendar'}">-->
               <a href="javascript:;" @click="goCalendarView()">
                  <span class="aIcon"><i class="iconfont icon-ic_personal_calendar"></i></span>
                  <span class="span1">还款日历</span>
                  <span class="span2"><span class="span-spot_type2" v-show="isRedSpot"></span><i class="iconfont icon-ic_rightarrow"></i></span>
               </a>
            <!--</router-link>-->
          </div>
      </div>
      <div class="menu_item">
          <router-link class="item jh-btn" jh-name="月月笑" :to="{ path: '/timeDepositRecordList'}">
              <p>
                  <i class="iconfont icon-youxiandingcun"></i>
                  <span>月月笑</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont" v-if="marketingInfo.sdqInvestCount*1 > 99">99+</em>
                  <em class="numberFont" v-else-if="marketingInfo.sdqInvestCount*1 > 0 && marketingInfo.sdqInvestCount*1 < 100">{{marketingInfo.sdqInvestCount}}</em>
                  <em v-else>锁定期限出借,收益更高!</em>
              </p>
          </router-link>
          <router-link class="item jh-btn" jh-name="智能推荐" :to="{ path: '/autoInvestRecordList'}">
              <p>
                  <i class="iconfont icon-ic_personal_zn"></i>
                  <span>智能推荐</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont" v-if="marketingInfo.autoInvestCount*1 > 99">99+</em>
                  <em class="numberFont" v-if="marketingInfo.autoInvestCount*1 > 0 && marketingInfo.autoInvestCount*1 < 100">{{marketingInfo.autoInvestCount}}</em>
              </p>
          </router-link>
          <router-link class="item jh-btn" jh-name="自动投标" :to="{ path: '/automaticBidding'}">
              <p>
                  <i class="iconfont icon-ic_personal_automati"></i>
                  <span>自动投标<em class="img_tips" v-if="!userBaseInfoResult.userAutoBiddingState"><img src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/autoInvestTips2.png" /></em></span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em v-if="userBaseInfoResult.userAutoBiddingState">已开启</em>
                  <em v-else>未开启</em>
              </p>
         </router-link>

          <!-- <router-link class="item" :to="{ path: '/regularPlanRecord'}">
              <p>
                  <i class="iconfont icon-ic_personal_regular"></i>
                  <span>定存计划</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em></em>
              </p>
          </router-link> -->

          <router-link class="item jh-btn" jh-name="散标" :to="{ path: '/subjectInvestRecordList'}">
              <p>
                  <i class="iconfont icon-sanbiao"></i>
                  <span>散标</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont" v-if="marketingInfo.retailInvestCount*1 > 99">99+</em>
                  <em class="numberFont" v-if="marketingInfo.retailInvestCount*1 > 0 && marketingInfo.retailInvestCount*1 < 100">{{marketingInfo.retailInvestCount}}</em>
              </p>
          </router-link>

        <!--<router-link class="item jh-btn" jh-name="债转出借" :to="{ path: '/claimsTranRecordList'}">-->
          <!--<p>-->
            <!--<i class="iconfont icon-zhaizhuan"></i>-->
            <!--<span>债转出借</span>-->
            <!--<i class="iconfont icon-ic_rightarrow"></i>-->
            <!--<em class="numberFont" v-if="marketingInfo.transferOrderCount*1 > 99">99+</em>-->
            <!--<em class="numberFont" v-if="marketingInfo.transferOrderCount*1 > 0 && marketingInfo.transferOrderCount*1 < 100">{{marketingInfo.transferOrderCount}}</em>-->
          <!--</p>-->
        <!--</router-link>-->
          <router-link class="item jh-btn" jh-name="直投项目" :to="{ path: '/directRecordList'}">
              <p>
                  <i class="iconfont icon-ic_personal_record"></i>
                  <span>直投项目</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont" v-if="marketingInfo.directInvestCount*1 > 99">99+</em>
                  <em class="numberFont" v-if="marketingInfo.directInvestCount*1 > 0 && marketingInfo.directInvestCount*1 < 100">{{marketingInfo.directInvestCount}}</em>
              </p>
          </router-link>
          <!-- <a class="item" :href="'//promo'+urlTest+'.facebank.cn/home/RiskEvaluation'" v-show="isRiskShow">
              <p>
                  <i class="iconfont icon-ic_personal_risk"></i>
                  <span>风险评测</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font" v-if="riskEvaluationInformation.riskNum*1>0">{{riskEvaluationInformation.riskRankName}}</em>
                  <em class="font" v-else>请测评<font class="import"></font></em>
              </p>
          </a> -->
      </div>

      <div class="menu_item">
          <a class="item jh-btn"  jh-name="合伙人"  :href="'//partner'+urlTest+'.facebank.cn/partner_plan'">
              <p>
                  <i class="iconfont icon-ic_personal_partner"></i>
                  <span>合伙人</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font" v-html="partnerNum"></em>
              </p>
          </a>
          <a class="item jh-btn" jh-name="会员中心" :href="'//shop'+urlTest+'.facebank.cn/Vip/index'">
              <p>
                  <i class="iconfont icon-ic_personal_vip"></i>
                  <span>会员中心</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
              </p>
          </a>
          <router-link :to="{ path: '/coupon'}" class="jh-btn" jh-name="我的卡券">
              <p>
                  <i class="iconfont icon-icon_qiaquan-"></i>
                  <span>我的卡券</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont" v-if="couponCount>0">{{couponCount}}</em>
              </p>
          </router-link>
          <a class="item jh-btn" jh-name="笑脸币" href="javascript:;" v-on:click="myCoin">
              <p>
                  <i class="iconfont icon-ic_personal_gold"></i>
                  <span>笑脸币</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="numberFont">{{marketingInfo.facecoinCount}}</em>
              </p>
          </a>
          <a class="item jh-btn" jh-name="我的任务" href="javascript:;" v-on:click="myTask">
              <p>
                  <i class="iconfont icon-ic_renwu"></i>
                  <span>我的任务</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <!-- <em class="font" v-show="!issignInStatus">签到<small class="import"></small></em> -->
              </p>
          </a>
      </div>

      <div class="menu_item">


          <a class="item" :href="'//promo'+urlTest+'.facebank.cn/home/ViableRedpacket'" v-if="marketingInfo.privilegeRedMoneyCount*1> 0">
              <p>
                  <i class="iconfont icon-ic_personal_zz"></i>
                  <span>特权红包</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em>{{marketingInfo.privilegeRedMoneyCount}}</em>
              </p>
          </a>

          <router-link class="item jh-btn" jh-name="站内信" :to="{ path: '/myNotice'}">
              <p>
                  <i class="iconfont icon-zhanneixin_huaban"></i>
                  <span>站内通知</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <!-- <em v-if="marketingInfo.redPackageCount*1>0">{{marketingInfo.redPackageCount}}</em> -->
              </p>
          </router-link>
          <a class="item jh-btn" jh-name="理财计算器" :href="'//cgw'+urlTest+'.facebank.cn/promo/activity/calculator/index'">
              <p>
                  <i class="iconfont icon-ic_personal_jisuanqi"></i>
                  <span>理财计算器</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
              </p>
          </a>
      </div>

      <div class="menu_item">

          <a class="item jh-btn" jh-name="下载APP" v-show="!curDevice||curDevice==''||curDevice=='undefined'" v-on:click="appLoad">
              <p>
                  <i class="iconfont icon-ic_personal_down"></i>
                  <span>下载APP</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font">财富专享</em>
              </p>
          </a>
          <!--<a class="item" href="https://cms.facebank.cn/wapHelpNew.html">
              <p>
                  <i class="iconfont icon-ic_personal_helpcenter"></i>
                  <span>帮助中心</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
              </p>
          </a>
          <a class="item sensors-btn" v-on:click="kfTkShow" sensors-name="联系客服">
              <p>
                  <i class="iconfont icon-ic_personal_tell"></i>
                  <span>联系客服<small>8:00-20:00</small></span>
                  <em class="tel">4008-900-766</em>
              </p>
          </a>-->

      </div>
      <services showItem="online"></services>
      <div class="empty"></div>
      <div class="wapMc" v-show="wapMcStatus"></div>
      <div class="wapPos kf" v-show="kfTkStatus">
          <div class="wapTip">
             <p class="p-center">关注“笑脸平台”微信公众号为您解答各种问题或拨打客服热线</p>
             <!-- <p class="p_phone"><a href="tel:01053957570">010-53957570</a></p> -->
             <p class="p_phone" ><a href="tel:4008900766">4008-900-766</a></p>
             <p class="p3" v-on:click="wapTkClose">
                 我知道了
             </p>
          </div>
      </div>

      <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>
      <withdrawLayer ref="withdrawLayer" :listItem="frozenWithdrawCashLists" :drawCashFrozenCash="accountCashResult.drawCashFrozenCash"></withdrawLayer>
      <needActive :userInfo.sync="userBaseInfoResult" :show.sync="showActive" ref="needActive"></needActive>
      <navBottom v-bind:isOn3="true"></navBottom>
      <tipLayer ref="tipLayer"></tipLayer>
    <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>
  </div>
</template>

<style scoped src="./account.css">
</style>

<script>
import navBottom from 'components/navBottom';
import wapTk2 from 'components/wapTk2';
import toastMessage from 'components/toastMessage';
import withdrawLayer from '@/components/withdrawLayer'
import {globalVariable}from 'tools';
export default {
      name: 'account',
      data() {
          return {
              couponCount: 0,
              hasAccount : false,
              //我的卡券数量
              userBindedCard: false,
              userOpenAccount: false,
              isShowCalendar: false,
              isRedSpot: false,
              accountCashResult: '',
              userBaseInfoResult: "",
              //用户基本信息
              marketingInfo: "",
              //营销工具接口
              riskEvaluationInformation: "",
              loginpwd: '',
              taskId: '',
              frozenWithdrawCashLists: '',
              messageText: '',
              wapMcStatus: false,
              backInvestNum: '',
              fpOrderCount: '',
              partnerNum: '',
              issignInStatus: true,
              //是否显示签到
              isTmShow: false,
              //是否展示吐司
              tTime: 2000,
              //吐司时间
              tMsg: '',
              phoneId: '',
              userId: '',
              isRiskShow: false,
              urlTest: this.utils.URLSET,
              //
              curDevice: this.utils.getCookie('curDevice'),
              kfTkStatus: false,
              isLogin: false,
              browser: {
                  versions: function() {
                      var u = navigator.userAgent,
                      app = navigator.appVersion;
                      return { //移动终端浏览器版本信息
                          trident: u.indexOf('Trident') > -1,
                          //IE内核
                          presto: u.indexOf('Presto') > -1,
                          //opera内核
                          webKit: u.indexOf('AppleWebKit') > -1,
                          //苹果、谷歌内核
                          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                          //火狐内核
                          mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                          //是否为移动终端
                          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                          //ios终端
                          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                          //android终端或uc浏览器
                          iPhone: u.indexOf('iPhone') > -1,
                          //是否为iPhone或者QQHD浏览器
                          iPad: u.indexOf('iPad') > -1,
                          //是否iPad
                          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                      };
                  } (),
                  language: (navigator.browserLanguage || navigator.language).toLowerCase()
              },

              tosatContent: '',
              tosatShow: false,

              showActive: false,
              signClicked : false,

              isThreeGiftNewUser:true,

              weChatHeadPic: '', // 微信头像
              isBindWx : false,
              accName:'',
          }
      },
      components: {navBottom, wapTk2, toastMessage, withdrawLayer},
      //这里注册
      created: function() {
          this.weChatHeadPic= this.utils.getCookie('_WeChatHeadImgLink');
          // setTimeout(function(){
          //     _this.initFace();
          // },200)
          //将设备号及版本号写进cookies
          var curDevice = this.$route.query.curDevice;
          var curVersion = this.$route.query.curVersion;
          if (typeof curDevice !== "undefined" && curDevice && curDevice != '' && curDevice != null) {
              this.utils.setCookie('curDevice', curDevice);
          }
          if (typeof curVersion !== "undefined" && curVersion && curVersion != '' && curVersion != null) {
              this.utils.setCookie('curVersion', curVersion);
          }

          var _this = this;
          //获取用户基本信息
          $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/getUserBaseInfo",
              success: function(res) {
                  if (res.code == '1') {

                      if (res.data.accountState == 150 || res.data.accountState == 160) {
                          _this.showActive = true;
                      }
                      if(res.data.wechatOpenid*1 == 1){ // 微信openid为空 => 未绑定微信
                         _this.isBindWx = true;
                      }
                      var chenghu=res.data.userGender=='1'?"先生": "女士";
                      _this.accName=res.data.userRealName +chenghu;
                      _this.userBaseInfoResult = res.data;
                      _this.phoneId = res.data.encodeMobile;
                      _this.userId = res.data.userId;
                      _this.isLogin = true;

                      _this.userBindedCard = res.data.userBindCardState == '1';
                      _this.userOpenAccount = res.data.accountState == '200';
                      _this.hasAccount = res.data.accountState == '150' || res.data.accountState == '160'|| res.data.accountState == '200';

                      _this.isShowCalendar = (res.data.isShowRepayCalendarEntrance * 1 == 1 ? true: false);
                      _this.isRedSpot = (res.data.isShowRepayCalendarRedPoint * 1 == 1 ? true: false);
                      if (res.data.accountState == '100') {
                          _this.taskId = '1';
                      } else if (!res.data.hasRecharge) {
                          _this.taskId = '2';
                      } else if (!res.data.hasInvest) {
                          _this.taskId = '3';
                      } else {
                          _this.taskId = '4';
                      }
                      _this.isThreeGiftNewUser=res.data.hasRegisterBeforeTGOnline;//true为上线前 false为上线后
                  } else {
                      _this.isLogin = false;
                  }
              }
          })
          //获取用户营销信息
          $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/user/marketingInfo",
              success: function(res) {
                  if (res.code == 1) {
                      _this.marketingInfo = res.data;
                      //红包数量
                      //var redpackCount = _this.marketingInfo.redPackageCount*1 > 0 ? _this.marketingInfo.redPackageCount*1 : 0
                      var redpackCount = 0;
                      //卡数量
                      var cardCount = _this.marketingInfo.backCashCardCount * 1 > 0 ? _this.marketingInfo.backCashCardCount * 1 : 0
                      _this.couponCount = redpackCount + cardCount;
                      if (_this.marketingInfo.partnerCount > 0) {
                          _this.partnerNum = "<font style='color:#2B313D;'>" + _this.marketingInfo.partnerCount + "</font>";
                      } else {
                          _this.partnerNum = '邀请有奖<span class="span-spot"></span>'
                      }
                  }
              }
          })
          //获取提现中列表
          $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/getUserProcessingWithdrawList",
              success: function(res) {
                  if (res.code == 1) {
                      _this.frozenWithdrawCashLists = res.data;
                  }
              }
          })
          //获取用户资金
          $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/getUserAccountCashInfo",
              success: function(res) {
                  if (res.code == 1) {
                      _this.accountCashResult = res.data;
                  } else if (res.code == '-853') {
                      window.location.href = "/regOrlogin";
                  }
              }
          })

          //是否签到
          $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/user/isSignIn",
              success: function(res) {
                  if (res.code == 1) {
                      _this.issignInStatus = res.data.isSignIn;
                  }
              }
          })
      },
      mounted(){

      },
      methods: {
          /*initFace(){
              if(this.isBindWx && this.weChatHeadPic && this.weChatHeadPic != 'null' && this.weChatHeadPic != 'undefined'){
                  var _this = this;
                  var img = new Image(),w, h, nw, nh,b = _this.$refs.face_box.clientWidth;
                  var faces = _this.weChatHeadPic;
                  img.src=decodeURI(faces);
                  img.onload=function(){
                      w = this.width;
                      h = this.height;
                      if(w > h){
                          nh = b;
                          nw = (b/h)*w;
                          _this.$refs.faceImage.style.cssText="width:"+ nw +'px;height:'+  nh+'px;left:50%;margin-left:-'+ (nw/2) +'px;';
                      }else if(w < h){
                          nw = b;
                          nh = b/w*h;
                          _this.$refs.faceImage.style.cssText="width:"+ nw +'px;height:'+  nh+'px;top:50%;margin-top:-'+ (nh/2) +'px;';
                      }
                      _this.$refs.faceImage.src=decodeURI(faces);
                  }
              }
          },*/
          showWithdrawLayer(){
              var _this = this;
              setTimeout(function(){
                  _this.$refs.withdrawLayer.show();
              },200)

          },
          showTipsLayer(msg, title, btnText, textAlign){
              this.$refs.tipLayer.showByParame({
                  title : (title!='' ? title : ''),
                  content : msg,
                  btnText : (btnText ? btnText : '确定'),
                  textAlign : textAlign
              })
          },
          kfTkShow: function() {
              this.kfTkStatus = true;
              this.wapMcStatus = true;
          },
          checkAccountState: function() {
              if (this.userBaseInfoResult.accountState == '350') {
                  this.showTipsLayer('您的笑脸账号异常，请联系客服4008-900-766！', 'noTitle')
                  return false;
              };
              if (this.userBaseInfoResult.accountState == '300') {
                  this.showTipsLayer('您的账户状态异常，请联系客服4008-900-766！', 'noTitle')
                  return false;
              };
              return true;
          },
          checkAuthentication: function() {
              var _this = this;
              if (this.userBaseInfoResult.hasIdValify == '0') {
                  this.$refs.tosat.tosatShow({
                      msg: '请先完成实名',
                      time: 2
                  }, function() {
                      _this.utils.newWebView('/authentication?cburl=%2Faccount')
                  });
                  return false;
              }
              return true;
          },
          gotoAuthentication: function() {
              this.utils.newWebView('/authentication?cburl=%2Faccount')
          },


          openDepository: function() {
            

              var _this = this;
              if (!this.checkAccountState()) return;
              if (!this.checkAuthentication()) return;
              this.utils.activeType(function(re) {
                  if (re == 'isTwo') {
                      _this.$router.push({
                          name: 'depositoryOpen'
                      })
                  } else {
                      _this.$router.push({
                          name: 'bindBankCard'
                      })
                  }
              })
          },
          gotoRecharge: function() {
              if (!this.checkAccountState()) return;
              if (!this.$refs.needActive.checkDepositoryStatus()) return false;
              if (this.userBaseInfoResult.mobile == "") {
                  this.showTipsLayer("您好，由于平台账户安全升级，为更有效保障您的资金安全，需请您去<a href='#' style='color:red;text-decoration: underline;'>https://www.facebank.cn</a>或者登录笑脸金融客户端完善个人信息，完成升级操作后再充值，谢谢您的配合！", '温馨提示', '', 'left')
                  return;
              };
              this.$router.push({
                  name: 'rechargeUI',
              })
          },
          gotoWithdraw: function() {
              if (!this.checkAccountState()) return;
              if (!this.$refs.needActive.checkDepositoryStatus()) return false;
              if (this.userBaseInfoResult.mobile == "") {
                  this.showTipsLayer("您好，由于平台账户安全升级，为更有效保障您的资金安全，需请您去<a href='#' style='color:red;text-decoration: underline;'>https://www.facebank.cn</a>或者登录笑脸金融客户端完善个人信息，完成升级操作后再充值，谢谢您的配合！", '温馨提示', '', 'left')
                  return;
              };
              this.$router.push({
                  name: 'withdraw',
              })
          },
          toTotalAsset: function() {
              if (!this.$refs.needActive.checkDepositoryStatus()) return false;
              this.$router.push({
                  name: 'accTotalAsset',
              })
          },
          goCalendarView: function() {
              this.utils.setCookie('CacheCalendarDate', '');
              var ua = navigator.userAgent.toLowerCase();
              let path = ua.match(/MicroMessenger/i) == "micromessenger" ? '/repaymentCalendarMicroMessager': '/repaymentCalendar';
              this.$router.push({
                  path: path
              });

          },
          myCoin: function() {
              var _this = this;
              $.ajax({
                  url: this.utils.AJAXDOMAINNAME + "/wap/user/createPhpToken",
                  success: function(res) {
                      if (res.code == 1) {
                          var token = res.data.token;
                          var url = "https://shop" + _this.urlTest + ".facebank.cn/Mypoints?id=" + _this.userId + "&token=" + token;
                          window.location.href = url;
                      } else {
                          _this.showTipsLayer(res.message, 'noTitle')
                      }
                  }
              })

          },
          myTask: function() {
              /*if (!this.issignInStatus && this.isLogin && !this.signClicked) {
                  this.isTmShow = true;
                  this.signClicked = true;
                  this.tMsg = "签到成功，笑脸币+2";
                  var self = this;
                  setTimeout(function() {
                      self.isTmShow = false;
                  }, 2000);
              }*/
              var _this = this;
              $.ajax({
                  url: this.utils.AJAXDOMAINNAME + "/wap/user/createPhpToken",
                  success: function(res) {
                      if (res.code == 1) {
                          var token = res.data.token;
                          var url = "https://shop" + _this.urlTest + ".facebank.cn/task?id=" + _this.userId + "&token=" + token;
                          window.location.href = url;
                      } else {
                          _this.showTipsLayer(res.message, 'noTitle')
                      }
                  }
              })

          },
          //下载客户端立即下载按钮
          appLoad: function() {
              if (this.utils.isWeiXin()) {
                  window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile";
              } else {
                  if (this.browser.versions.ios || this.browser.versions.iPhone || this.browser.versions.iPad) {
                      window.location.href = "https://itunes.apple.com/cn/app/xiao-lian-jin-rong-li-cai/id1038803512?mt=8";
                  } else if (this.browser.versions.android) {
                      window.location.href = "https://facebank-static.oss-cn-hangzhou.aliyuncs.com/facebank/mic/test/1527736912657FaceSmile-PRO-release_113_jiagu_sign.apk";
                  } else {
                      alert("当前浏览器非Android或IOS");
                  }
              }
          },
          //新手专享弹框关闭
          wapTkClose: function() {
              this.wapMcStatus = false;
              this.kfTkStatus = false;
          },
      }
  }

</script>
