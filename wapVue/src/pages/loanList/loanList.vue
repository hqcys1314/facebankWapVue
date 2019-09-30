<template>
<!-- <header></header> -->
<div id="investList" v-cloak  ref="investList">
    <div class="switchTab" v-if="showNavSwitch">
        <ul>
            <!-- <li id="deposit">定存</li>
            <li id="debtTransfer">债转</li> -->
            <li id="investTab_deposit" @click="listTab(1, '月月笑')" :class="{'current' : (currentTag == 1)}">
                 <div>月月笑
                     <i :style="'left:'+setLabelPosition(3, len(configData.deposit.tab_label))+'rem'" v-if="configData && configData.deposit.tab_label" class="tab_label">{{configData.deposit.tab_label}}</i>
                 </div>
                 <!-- <img src="~assets/wapFront/invest/img/big.png" class="hot"> -->
             </li>
            <li id="investTab_autoInvest" @click="listTab(2, '智能推荐')" :class="{'current' : (currentTag == 2)}">
                 <div>智能推荐
                     <i :style="'left:'+setLabelPosition(4, len(configData.autoInvest.tab_label))+'rem'" v-if="configData && configData.autoInvest.tab_label" class="tab_label">{{configData.autoInvest.tab_label}}</i>
                 </div>
                 <!-- <img src="~assets/wapFront/invest/img/big.png" class="hot"> -->
             </li>
             <li id="investTab_subject" @click="listTab(3, '散标')" :class="{'current' : (currentTag == 3)}">
                 <div>散标
                     <i :style="'left:'+setLabelPosition(2, len(configData.subject.tab_label))+'rem'" v-if="configData && configData.subject.tab_label" class="tab_label">{{configData.subject.tab_label}}</i>
                 </div>
             </li>
             <!--<li @click="listTab(4)" :class="{'current' : (currentTag == 4)}">-->
                 <!--债权转让-->
             <!--</li>-->
        </ul>
        <div class="switch_line" :style="'left:'+ ((currentTag-1) / 3*100) +'%'">&nbsp;</div>
        <!-- <a class="ad_box" v-if="!userInfo.userAutoBiddingState" href="javascript:;" @click="toAutomaticBidding"><img src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/banner_loanList.png?v=2" height="100%" /></a> -->
    </div>

    <div class="container noAd" :class="{'top0' : !showNavSwitch, 'bottom0' : !showNavSwitch}" :style="'bottom:'+ containerBottom">
        <div class="content" :style="'margin-left:'+contentMoveLeft">
            <div id="timeDepositBox" class="boxx">
                <div class="loanList_top" v-if="configData.deposit">
                    <div class="product_tips ad" v-if="configData.deposit && configData.deposit.text_ad">
                        <div class="option_area">
                            <span class="icon icon_close" id="noticeDepositClose" @click="closeAdTips('deposit', '定存')"></span>
                        </div>
                        <div class="font" id="noticeDeposit" @click="bannerJumpPage(configData.deposit.text_ad_url, '定存', 'text_ad')">
                            <div v-if="len(configData.deposit.text_ad) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.deposit.text_ad}}</div></div>
                            <p v-else>{{configData.deposit.text_ad}}</p>
                        </div>
                    </div>
                    <div class="product_tips" v-else-if="configData.deposit.product_introduce">
                        <div class="option_area">
                            <span class="icon icon_tips" id="showProductInfoDeposit" @click="showTips(1, configData.deposit.product_tips, 'left', 2, '定存')"></span>
                        </div>
                        <div class="font">
                            <div v-if="len(configData.deposit.product_introduce) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.deposit.product_introduce}}</div></div>
                            <p v-else>{{configData.deposit.product_introduce}}</p>
                        </div>
                    </div>


                    <div class="ad_box" :url="configData.deposit.banner_url" v-if="configData.deposit && configData.deposit.banner_img">
                        <a href="javascript:;" id="bannerDeposit" @click="bannerJumpPage(configData.deposit.banner_url, '定存', 'banner')"><img :src="configData.deposit.banner_img" /></a>
                    </div>
                </div>

                <limitTime limitType="deposit" :limitData="timeDepositLimitData" @timeOverFn="getTimeDepositList"></limitTime>
                <!--一次性还本付息-->
                <ul class="list" v-if="timeDepositList.length > 0">
                    <timeDepositItem :showNavSwitch="showNavSwitch" v-for="(item, index) in timeDepositList" :key="index" :list-item="item" />
                </ul>
                <div class="meptyList" v-if="isNoNet">

                </div>
                <div class="meptyList" v-else-if="isTimeOutyyx">
                  <img src="https://static.facebank.cn/static/wapFront/depository/img/noNet.png" alt="">
                  <p class="strong" style="margin-top:1rem;">网络超时</p>
                  <p style="margin-bottom:1rem;">请检查你的网络</p>
                  <a href="#" class="btn_tpls">重试</a>
                </div>
                <div class="meptyList" v-else-if="timeDepositList.length == 0 && !loadingLayerStatus">
                    <img src="https://static.facebank.cn/static/wapFront/common/img/listNorecord.png" alt="">
                    <p class="strong">当前产品已售罄</p>
                    <p>平台将不定时发布新产品<br>请您随时关注并刷新出借列表</p>

                </div>

                <div class="on_sale" v-if="timeDepositLoanCount > 0">
                    <div class="menu_item">
                        <a href="javascript:;" @click="toDepositDebtOnSale()" class="item">
                            <p>
                                <span>在售标的</span>
                                <i class="iconfont icon-ic_rightarrow"></i>
                                <!-- <em class="font">{{timeDepositLoanCount}}个</em> -->
                            </p>
                        </a>
                    </div>
                </div>
                <timeDepositoryIntro v-if="timeDepositList.length > 0"></timeDepositoryIntro>
                <div class="blank"></div>
            </div>
            <div id="autoInvestBox" class="boxx">
                <div class="loanList_top" v-if="configData.autoInvest">
                    <div class="product_tips ad" v-if="configData.autoInvest && configData.autoInvest.text_ad">
                        <div class="option_area">
                            <span class="icon icon_close" id="noticeAutoInvestClose" @click="closeAdTips('autoInvest', '智能推荐')"></span>
                        </div>
                        <div class="font" id="noticeAutoInvest" @click="bannerJumpPage(configData.autoInvest.text_ad_url, '智能推荐', 'text_ad')">
                            <div v-if="len(configData.autoInvest.text_ad) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.autoInvest.text_ad}}</div></div>
                            <p v-else>{{configData.autoInvest.text_ad}}</p>
                            <!-- <marquee behavior="scroll" loop="-1" v-if="len(configData.autoInvest.text_ad) > 28">{{configData.autoInvest.text_ad}}</marquee>
                            <p v-else>{{configData.autoInvest.text_ad}}</p> -->
                        </div>
                    </div>
                    <div class="product_tips" v-else-if="configData.autoInvest.product_introduce">
                        <div class="option_area">
                            <span class="icon icon_tips" id="showProductInfoAutoInvest" @click="showTips(1, configData.autoInvest.product_tips, 'left', 2, '智能推荐')"></span>
                        </div>
                        <div class="font">
                            <div v-if="len(configData.autoInvest.product_introduce) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.autoInvest.product_introduce}}</div></div>
                            <p v-else>{{configData.autoInvest.product_introduce}}</p>
                        </div>
                    </div>


                    <div class="ad_box" :url="configData.autoInvest.banner_url" v-if="configData.autoInvest && configData.autoInvest.banner_img">
                        <a href="javascript:;" id="bannerAutoInvest" @click="bannerJumpPage(configData.autoInvest.banner_url, '智能推荐', 'banner')"><img :src="configData.autoInvest.banner_img" /></a>
                    </div>
                </div>
                <limitTime ref="autoInvestLimit" :remainTime.sync="autoInvestLimitData.activityRemainTime" limitType="autoInvest" :limitData="autoInvestLimitData" @timeOverFn="getAutoInfo"></limitTime>
                <!--一次性还本付息-->
                <div class="item_box" v-if="autoInvestConfigList.disposableList.length > 0">
                    <div class="title"><div class="title_content"><span class="iconfont icon-huankuanfangshi"></span>一次性还本付息<span id="showRepaymentInfoTips_disposable" class="jt" @click="showLayer('disposable')">&nbsp;</span></div></div>
                    <ul>
                        <investListItem :ref="'autoInvest_'+item.configId" @click.native="selectAutoInvestItem(item.configId, 2)"  v-for="(item, index) in autoInvestConfigList.disposableList" :key="index" :list-item="item" />
                    </ul>
                </div>
                <!--先息后本-->
                <div class="item_box" v-if="autoInvestConfigList.filp.length > 0">
                    <div class="title"><div class="title_content"><span class="iconfont icon-huankuanfangshi"></span>先息后本<span class="jt" id="showRepaymentInfoTips_filp" @click="showLayer('filp')">&nbsp;</span></div></div>
                    <ul>
                        <investListItem @click.native="selectAutoInvestItem(item.configId, 1)" v-for="(item, index) in autoInvestConfigList.filp" :key="index" :list-item="item" />
                    </ul>
                </div>
                <!--等额本息-->
                <div class="item_box" v-if="autoInvestConfigList.equalList.length > 0">
                    <div class="title"><div class="title_content"><span class="iconfont icon-huankuanfangshi"></span>等额本息<span class="jt" id="showRepaymentInfoTips_equal" @click="showLayer('equal')">&nbsp;</span></div></div>
                    <ul>
                        <investListItem @click.native="selectAutoInvestItem(item.configId, 3)" v-for="(item, index) in autoInvestConfigList.equalList" :key="index" :list-item="item" />
                    </ul>
                </div>
                <div class="meptyList" v-if="isNoNet">

                </div>
                <div class="meptyList" v-else-if="isTimeOutzntj">
                  <img src="https://static.facebank.cn/static/wapFront/depository/img/noNet.png" alt="">
                  <p class="strong" style="margin-top:1rem;">网络超时</p>
                  <p style="margin-bottom:1rem;">请检查你的网络</p>
                  <a href="#" class="btn_tpls">重试</a>
                </div>
                <div class="meptyList" v-else-if="isShowAutoOver">
                    <img src="https://static.facebank.cn/static/wapFront/common/img/listNorecord.png" alt="">
                    <p class="strong">当前产品已售罄</p>
                    <p>平台将不定时发布新产品<br>请您随时关注并刷新出借列表</p>
                </div>

                <div class="on_sale" v-if="loanCountOnSale*1 > 0">
                    <p>为方便您的出借，系统已将标的自动分组展示并推荐给您</p>
                    <div class="menu_item">
                        <a href="javascript:;" @click="toAutoInvestMatchDebtOnSale()" class="item">
                            <p>
                                <span>在售标的</span>
                                <i class="iconfont icon-ic_rightarrow"></i>
                                <em class="font">{{loanCountOnSale}}个</em>
                            </p>
                        </a>
                    </div>
                </div>
                <div class="blank"></div>
            </div>
            <div id="subjectInvestBox" class="boxx">
                <div class="sjiList list" v-show="subjectList.length > 0" ref="sjiList">
                    <div class="loanList_top" v-if="configData.subject">
                        <div class="product_tips ad" v-if="configData.subject.text_ad">
                            <div class="option_area">
                                <span class="icon icon_close" id="noticeSubjectClose" @click="closeAdTips('subject', '散标')"></span>
                            </div>
                            <div class="font" id="noticeSubject" @click="bannerJumpPage(configData.subject.text_ad_url, '散标', 'text_ad')">
                                <div v-if="len(configData.subject.text_ad) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.subject.text_ad}}</div></div>
                                <p v-else>{{configData.subject.text_ad}}</p>
                            </div>
                        </div>
                        <div class="product_tips" v-else-if="configData.subject.product_introduce">
                            <div class="option_area">
                                <span class="icon icon_tips" id="showProductInfoSubject" @click="showTips(1, configData.subject.product_tips, 'left', 2, '散标')"></span>
                            </div>
                            <div class="font">
                                <div v-if="len(configData.subject.product_introduce) > 28" class="marquee marquee-horizontal"><div class="content">{{configData.subject.product_introduce}}</div></div>
                                <p v-else>{{configData.subject.product_introduce}}</p>
                            </div>
                        </div>
                        <div class="ad_box" v-if="configData.subject && configData.subject.banner_img">
                            <a href="javascript:;" id="bannerSubject" @click="bannerJumpPage(configData.subject.banner_url, '散标', 'banner')"><img :src="configData.subject.banner_img" /></a>
                        </div>
                    </div>
                    <ul class="loan_list">
                        <subjectListItem :isBindCardLi="isBindCard" :isLogin="isLogin" v-for="(item, index) in subjectList" :key="index" :list-item="item" />
                    </ul>
                    <loadingMoreData :isLoading="isSubjectViewLoading" :reloadDataStatus="reloadSubjectViewDataStatus" :enLong="enLong"  v-on:getresultData="getSubjectList(true)"></loadingMoreData>
                </div>
                <div class="meptyList" v-if="isNoNet">

                </div>
                <div class="meptyList" v-else-if="isTimeOutsb">
                  <img src="https://static.facebank.cn/static/wapFront/depository/img/noNet.png" alt="">
                  <p class="strong" style="margin-top:1rem;">网络超时</p>
                  <p style="margin-bottom:1rem;">请检查你的网络</p>
                  <a href="#" class="btn_tpls">重试</a>

                </div>
                <div class="meptyList" v-else-if="isShowSubjectOver">
                    <img src="https://static.facebank.cn/static/wapFront/common/img/listNorecord.png" alt="">
                    <p class="strong" v-if="subjectDataFromFilter">当前无符合条件的标的</p>
                    <p class="strong" v-else>当前产品已售罄</p>
                    <p v-if="!subjectDataFromFilter">平台将不定时发布新产品<br>请您随时关注并刷新出借列表</p>
                </div>

            </div>
            <div id="claimsTransfor" class="boxx">
              <div class="ctfList" ref="ctfList" v-show="claimTransList.length > 0">
                <ul class="loan_list">
                  <claimTransListItem   v-for="(item, index) in claimTransList" :key="index" :list-item="item" />
                </ul>
                <loadingMoreData ref="loadingMdctf" :isLoading="isClaimsViewLoading" :reloadDataStatus="reloadClaimsViewDataStatus" :enLong="enLong"  v-on:getresultData="getClaimTransList(true)"></loadingMoreData>

              </div>
              <div class="meptyList" v-if="isNoNet">

              </div>
              <div class="meptyList" v-else-if="isTimeOutcl">
                <img src="https://static.facebank.cn/static/wapFront/depository/img/noNet.png" alt="">
                <p class="strong" style="margin-top:1rem;">网络超时</p>
                <p style="margin-bottom:1rem;">请检查你的网络</p>
                <a href="#" class="btn_tpls">重试</a>

              </div>
              <div class="meptyList" v-else-if="isShowClaimsOver">
                <img src="https://static.facebank.cn/static/wapFront/common/img/listNorecord.png" alt="">
                <p class="strong" >当前产品已售罄</p>
              </div>
            </div>

            <div class="btn_filter" :style="'bottom:'+filterBtnBottom" v-if="currentTag == 3">
                <p v-on:click="showFilterLayer()" class="sensors-btn" sensors-name="筛选">
                    <em><span class="icon iconfont icon-shaixuan"></span>筛选</em>
                </p>
                <p v-on:click="toAutoInvestTabPage()" class="sensors-btn" sensors-name="批量">
                    <em><span class="icon iconfont icon-ic_personal_zn"></span>批量</em>
                </p>
            </div>
        </div>
    </div>

    <!--浮层区-->
    <!--筛选层-->
    <div class="filter_page" v-if="filterLayerShowState" :style="'bottom:'+ containerBottom">
        <div class="filter_top" v-on:click="startFilter()"></div>
        <div class="filter_layer">
            <div class="ad_box" v-on:click="filterAdLink()">
                <img src="https://static.facebank.cn/static/wapFront/autoInvest/img/autMatchBanner_20180403.jpg">
            </div>
            <section ref="filter_limit">
                <div class="title">期限</div>
                <ul>
                   <li class="sensors-btn" sensors-name="0~3个月" v-bind:class="{'selected' : limitClassSelect[0]}" data-value="0|3" v-on:click="selectFilterItem('limit', $event)">0~3个月</li>
                   <li class="sensors-btn" sensors-name="3~6个月" v-bind:class="{'selected' : limitClassSelect[1]}" data-value="3|6" v-on:click="selectFilterItem('limit', $event)">3~6个月</li>
                   <li class="sensors-btn" sensors-name="6个月以上" v-bind:class="{'selected' : limitClassSelect[2]}" data-value="6|100" v-on:click="selectFilterItem('limit', $event)">6个月以上</li>
               </ul>
            </section>
            <section ref="filter_rate">
                <div class="title">借款合同约定年化利率</div>
                <ul>
                   <li class="sensors-btn" sensors-name="6%~6.8%" v-bind:class="{'selected' : rateClassSelect[0]}" data-value="6|6.8" v-on:click="selectFilterItem('rate', $event)">6%~6.8%</li>
                   <li class="sensors-btn" sensors-name="6.8%~7.5%" v-bind:class="{'selected' : rateClassSelect[1]}" data-value="6.8|7.5" v-on:click="selectFilterItem('rate', $event)">6.8%~7.5%</li>
                   <li class="sensors-btn" sensors-name="7.5%以上" v-bind:class="{'selected' : rateClassSelect[2]}" data-value="7.5|100" v-on:click="selectFilterItem('rate', $event)">7.5%以上</li>
               </ul>
            </section>
            <section ref="filter_repayment">
                <div class="title">还款方式</div>
                <ul>
                    <li class="sensors-btn" sensors-name="先息后本" v-bind:class="{'selected' : repaymentClassSelect[0]}" data-value="1" v-on:click="selectFilterItem('repayment', $event)">先息后本</li>
                    <li class="sensors-btn" sensors-name="等额本息" v-bind:class="{'selected' : repaymentClassSelect[1]}" data-value="3" v-on:click="selectFilterItem('repayment', $event)">等额本息</li>
                    <li class="sensors-btn" sensors-name="一次性还本付息" v-bind:class="{'selected' : repaymentClassSelect[2]}" data-value="2" v-on:click="selectFilterItem('repayment', $event)">一次性还本付息</li>
                </ul>
            </section>

            <div class="btn_area">
                <a class="sensors-btn" sensors-name="重置" href="javascript:;" v-on:click="resetFilter()">重置</a>
                <a class="sensors-btn" sensors-name="确认" href="javascript:;" v-on:click="startFilter()">确认</a>
            </div>
        </div>
    </div>
    <!--智能推荐第一步-->
    <div class="layer_autoInvest" v-show="autoInvestLayerStep1" :style="'bottom:'+ containerBottom">
        <div class="mask" v-if="layerInputMaskShow"></div>
        <div class="layer_title">
            <a href="javascript:;" id="closeInvestLayer" class="close" @click="closeLayerAndRefresh()"></a>
            设置您的预期出借金额({{autoSelectItem.termCount}}{{autoSelectItem.termUnit*1 == 1 ? '天' : autoSelectItem.termUnit*1 == 3 ? '个月' : ''}})
        </div>
        <div class="layer_content">
            <div class="input">
                <div class="unit"></div>
                <input name="autoInvestAmount" type="number" :placeholder="'起投金额最少'+ minInvestAmount +'元'" v-model="autoInvestAmount"
                    @focus="forcusThisInput()"
                    @blur="blurThisInput()" />
                <a href="javascript:;" @click="allInvest()" id="allInvest" v-if="userCash*1 >= minInvestAmount">全投</a>
            </div>
            <div class="other">
                <span>可投金额  {{autoSelectItem.remainAmount | formatNumber2}} {{autoSelectItem.remainAmount*1 < 10000 ? '' : '万元'}}</span>
                <span>账户余额  {{userCash}}元</span>
            </div>
        </div>
        <input class="btn_tpls" id="recommendForMe" name="recommendForMe" type="button" v-if="autoInvestAmount*1 > 0 || canRecommend" @click="recommendForMe()" value="推荐标的" />
        <input class="btn_tpls disabled" name="recommendForMe" type="button" v-else disabled="disabled" value="推荐标的" />
    </div>
    <!--智能推荐 - Loading-->
    <div class="layer_autoInvest" v-show="autoInvestLayerLoading" :style="'bottom:'+ containerBottom">
        <div class="layer_title">
            努力匹配中...
        </div>
        <div class="loading_box"></div>
    </div>
    <!--智能推荐第二步-->
    <div class="layer_autoInvest" v-show="autoInvestLayerStep2" :style="'bottom:'+ containerBottom">

        <div class="layer_title">
            <a href="javascript:;" class="close" @click="cancleAutoMatch()"></a>
            为您推荐的标的
        </div>
        <div class="layer_content">
            <ul>
              <li class="li1">
                  <p class="p1"><span class="span1">{{autoMatchResule.realAmount}}</span><span class="span2">元</span></p>
                  <p class="p2">出借金额</p>
              </li>
              <li class="li2">
                  <p class="p1">{{autoMatchResule.rate}}<span class="span2">%</span></p>
                  <p class="p2">借款合同约定年化利率</p>
              </li>
              <li class="li3">
                  <p class="p1">{{autoMatchResule.termCount}}
                  <span class="span2">{{autoMatchResule.termUnit=='1' ? '天' : '个月'}}</span>
                  </p>
                  <p class="p2">期限</p>
              </li>
            </ul>
            <div class="pd-profit">
               <span class="pd-profit-icon" v-if="autoMatchResule.vipRate!=null">{{autoMatchResule.vipLevelName}}+{{autoMatchResule.vipRate}}%</span>
               <span class="pd-profit-icon" v-if="autoMatchResule.isEnableFirstAddCash==1">首购返现{{autoMatchResule.firstAddCashRate}}%</span>
               <span class="pd-profit-icon" v-if="autoMatchResule.activityRate*1 > 0 && autoMatchResule.activityRemainTime*1 > 0">限时加息{{autoMatchResule.activityRate}}%</span>
            </div>
        </div>
        <input class="btn_tpls" name="autoInvestConfirm" type="button" value="下一步" @click="autoInvestConfirm()" />
    </div>
    <!--智能推荐 - Loading-->
    <div class="layer_autoInvest" v-show="autoInvestJumping" :style="'bottom:'+ containerBottom">
        <div class="layer_title">
            跳转中...
        </div>
        <div class="loading_box"></div>
    </div>
    <!--统一提示层-->
    <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    <tipLayer ref="tipLayer" :showInputMask.sync="layerInputMaskShow"></tipLayer>

    <!--风险测评弹框-->
    <div class="layer_style" v-show="riskLayerStatus" v-cloak>
        <div class="layer_content" style="padding:1.5rem 1rem;" v-html="riskLayerContent"></div>
        <div class="layer_btn two">
            <a href="javascript:;" @click="utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/home/RiskEvaluation')">风险测评</a>
            <a href="javascript:;" @click="hideRiskLayer()">取消</a>
        </div>
    </div>

    <!-- 投资超限 合规108条 风险测评弹框-->
    <div class="layer_style" v-show="investOverstepLimitLayerStatus" v-cloak>
        <div class="layer_title">未匹配成功</div>
        <!-- <div class="layer_content" style="padding:1.5rem 1rem;" v-html="investOverstepLimitContent"></div> -->
        <div class="layer_content" style="padding:1.5rem 1rem;">不小心为你匹配了超出你风险等级（{{riskName}}）承受能力的标的，请重新输入出借金额或重新风险测评</div>
        <div class="layer_btn two">
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
    <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>
    <!--浮层黑色遮罩-->
    <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>
    <navBottom :isOn2="true" v-if="showNavSwitch"></navBottom>
    <tosat :content.sync="tosatContent" :show.sync="tosatShow" @tosatFns="tosatFn" ref="tosat"></tosat>
    <needActive ref="needActive"></needActive>
    <standardFrame v-bind:isSfShow.sync="sfStatus" v-bind:sfLeft.sync="sfLeft" v-bind:sfTitle.sync="sfTitle"></standardFrame>
</div>
</template>

<style scoped src="./loanList.css">
</style>

<script>
    import navBottom from '@/components/navBottom';
    import {utils} from 'tools';
    import loading from '@/components/loading';
    import firstAddRate from '@/components/firstAddRate';
    import informationLayer from '@/components/informationLayer';
    import investListItem from '@/components/investListItem';
    import subjectListItem from '@/components/subjectListItem';
    import creditorListItem from '@/components/creditorListItem';
    import timeDepositItem from '@/components/timeDepositItem';
    import claimTransListItem from '@/components/claimTransListItem';
    import limitTime from '@/components/limitTime';
    import timeDepositoryIntro from '@/components/timeDepositoryIntro';
    import standardFrame from '@/components/standardFrame';
    export default {
        name: 'loanList',
        components:{navBottom,firstAddRate, investListItem, informationLayer, subjectListItem, creditorListItem, loading,standardFrame, timeDepositItem, claimTransListItem,timeDepositoryIntro, limitTime},//这里注册
        data () {
            return {
                tosatShow : false,
                tosatContent : '',
                //基础
                currentTag : 1, //当前||默认标签id
                contentMoveLeft : '',
                curVersion : '',
                curDevice : '',

                //接口数据
                subjectPageNum : 1,
                subjectPageSize : 10,
                claimsPageNum : 1,
                creditorPageSize : 10,


                //用户相关信息
                isLogin : 'false',
                userCash : '', //用户账户余额
                isBindCard : false,//用户是否绑卡
                canRecommend : false,
                isIdValify : false,
                userInfo : '',

                //列表数据：
                loanCountOnSale : 0,//在售标的统计
                //智能推荐列表
                autoInvestConfigList : {
                    disposableList : [],
                    equalList : [],
                    filp : []
                },

                subjectList : [],//散标列表
                creditorList : [],//债权转让列表

                subjectViewMoreBtn : true,
                creditorViewMoreBtn : true,

                //筛选
                subjectDataFromFilter : false,
                filterLayerShowState : false,
                filterRepaymentType : 0,
                filterLayerBottom : 'bottom:0rem',
                minMonth : 0,
                maxMonth : 0,
                minRate : 0,
                maxRate : 0,
                limitIndex : -1,
                rateIndex : -1,
                repaymentIndex : -1,
                rateClassSelect : [false, false, false],
                limitClassSelect : [false, false, false],
                repaymentClassSelect : [false,false, false],
                selectRateLimit : false,

                //风险等级信息
                riskCount  : 0,
                riskName   : '',
                riskStatus : '',
                riskEnable : false,
                riskLayerStatus : false,
                riskLayerContent : '',

                //投资超限 合规108条 风险测评弹框
                investOverstepLimitContent : '',
                investOverstepLimitLayerStatus : false,

                //浮层控制
                informationLayerContent : '',
                showLayerStatus : false,
                layerMaskStatus : false,
                userCashNotEnoughShow : false,//用户账户余额不足

                filterBtnPositonClass : '',



                containerBottom : '',//内容区底部距离

                loadingLayerStatus : false, //loading弹层状态

                //智能推荐相关
                autoInvestAmount : '',//智能推荐输入金额
                autoInvestLayerStep1 : false,
                autoInvestLayerStep2 : false,
                autoInvestLayerLoading : false,
                autoInvestJumping : false,
                layerInputMaskShow : false,
                autoSelectItem : {},//列表中选中
                autoRepmentType : 0,
                autoMatchResule : {},
                autoInvestMatchId : '',
                startTime:'',
                filterBtnBottom : '4.375rem',
                sfStatus:false,//标准弹框组件
                sfLeft:'',//标准弹框组件
                sfTitle:'',//标准弹框组件
                clickAutoInvestItem : true,

                showTipsStatus : false,
                minInvestAmount : 100,

                isShowAutoOver:false,
                isShowSubjectOver:false,
                isShowClaimsOver:false,

                isSubjectViewDisable:true,
                isSubjectViewLoading:true,
                reloadSubjectViewDataStatus:false,

                isClaimsViewDisable:true,
                isClaimsViewLoading:true,
                reloadClaimsViewDataStatus:false,
                configData : {
                    subject : '',
                    autoInvest : '',
                    deposit : '',
                    debtTransfer : ''
                },
                enLong:false,

                showSwitchTab : true,


                //定存相关
                timeDepositList : '',
                timeDepositLoanCount : 0,

                showNavSwitch : true,

                depositBannerShow : false,

                timeDepositLimitData : '',
                autoInvestLimitData : '',
                autoInvestRemainTime : {
                    'disposableList' : {},
                    'filp' : {},
                    'equalList' : {}
                },
                remainTimer : null,
                currentProductHasAddRate : 0,//1有;  0 没有
                userStatusNormal : false,
                claimTransList:[],
                isTimeOutyyx:false,
                isTimeOutzntj:false,
                isTimeOutsb:false,
                isTimeOutcl:false,
                isNoNet:true,
            }
        },
        filters : {
            formatNumber2(num){
                if(num*1<10000){
                    return '不足1万元';
                }else{
                    return parseInt((num/10000)*100)/100;
                }
            },
            unescapeHtml(html){
                var div = document.createElement('div');
                div.innerHTML = html;
                var str = div.innerHTML;
                return str;
            }
        },
        created:function () {
            utils.setCookie('orderId_success', '')
            var _this = this;
            this.tagType = this.$route.query.type;
            this.userInfo = utils.getUserInfo().info;
            this.showNavSwitch = (this.$route.query.showNavSwitch == undefined && this.$route.query.showNavSwitch != 0);
            //获取服务器时间：
            //console.log($.ajax({async : false}).getResponseHeader("Date"))


            //读取cookies中的版本号及设备号
            this.curDevice=utils.getCookie('curDevice');
            this.curVersion=utils.getCookie('curVersion');
            if(this.curVersion) this.curVersion = parseInt(this.curVersion.replace(/\./g,""));

            this.isLogin = utils.getIslogin();
            //通过hash定位当前标签页
            var hash = window.location.hash;
            if(hash) this.currentTag = hash.split('#')[1]*1;
            if(this.tagType) this.currentTag = this.tagType * 1;
            if(this.currentTag > 4) this.currentTag = 3;
            this.contentMoveLeft = -(this.currentTag-1)*100 + '%';


        },
        mounted:function(){
            var _this = this;
            this.getLoanListConfig();
          if(this.currentTag == 1){
              this.getTimeDepositList();
          }else if(this.currentTag == 2){
              //this.getAutoInfo();
              this.$set(this.$data.autoInvestConfigList, 'disposableList', [])
              this.$set(this.$data.autoInvestConfigList, 'equalList', [])
              this.$set(this.$data.autoInvestConfigList, 'filp', [])
              setTimeout(function(){
                  _this.getAutoInfo();
              },50)
          }else if(this.currentTag == 3){
              this.getSubjectList();
          }else if(this.currentTag==4){
              this.getClaimTransList();
          }
          this.containerBottomFn();

          this.$refs.sjiList.addEventListener('scroll', ()=>{
              var domHeight=this.$refs.sjiList.getElementsByTagName('ul')[0].clientHeight;
              var scrollTop=this.$refs.sjiList.scrollTop;
              var seeHeight=this.$refs.sjiList.clientHeight;
              if(domHeight-scrollTop<seeHeight*1+200){
                  if(!this.isSubjectViewDisable) return;
                  this.getSubjectList(true);
              }
          })


          this.$refs.ctfList.addEventListener('scroll', ()=>{
            var domHeight=this.$refs.ctfList.getElementsByTagName('ul')[0].clientHeight;
            var scrollTop=this.$refs.ctfList.scrollTop;
            var seeHeight=this.$refs.ctfList.clientHeight;
            if(domHeight-scrollTop<seeHeight*1+200){
              if(!this.isClaimsViewDisable) return;
              this.getClaimTransList(true);
            }
          })
        },
        update:function(){
            this.containerBottomFn();
        },
        methods: {
            toDepositDebtOnSale:function(){
                var _this = this;
                if(this.timeDepositLoanCount*1 == 0) return false;

                setTimeout(function(){
                    _this.utils.newWebView('/timeDepositDebtOnSale')
                },320)
            },
            setLabelPosition : function(nameLength , labelLength){
                var fontSize = window.innerWidth / 750 * 32;
                var pos = fontSize * ((nameLength-1)*2);
                return pos/32;
            },
            bannerJumpPage : function(url, tabName, linkType){
                var _this = this;
                if(url != ''){

                    setTimeout(function(){
                        _this.utils.newWebViewAll(url)
                    },200)
                }
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
            closeAdTips : function(type, tabName){

                this.$set(this.$data.configData[type], 'text_ad', '')
            },
            getLoanListConfig: function(){
                var _this = this;
                $.ajax({
                    url : 'https://cic.facebank.cn/api/getAppConfigByKey',
                    data : JSON.stringify({
                        configKey : 'loanlist_config_wap'
                    }),
                    async : false,
                    success : function(rss){
                        var rs = typeof rss == 'string' ? eval('('+ rss +')') : rss;
                        if(rs.statusCode*1 == 200){
                            if(rs.generalModelList){
                            var subject = rs.generalModelList.filter(function(item){
                                return item.product_type == '散标';
                            });
                            var autoInvest = rs.generalModelList.filter(function(item){
                                return item.product_type == '智能推荐';
                            });
                            var deposit = rs.generalModelList.filter(function(item){
                                return item.product_type == '定存';
                            });
                            var debtTransfer = rs.generalModelList.filter(function(item){
                                return item.product_type == '债转';
                            });

                            // //根据广告配置时间设置显示不显示
                            // if(deposit[0]&&deposit[0].start_time && deposit[0].end_time){
                            //     var deposits = deposit[0],
                            //         now = new Date().getTime(),
                            //         startTime = new Date(deposits.start_time.replace(/\-/g, '/')),
                            //         endTime = new Date(deposits.end_time.replace(/\-/g, '/'));
                            //     if(!(now > startTime && now < endTime)){
                            //         deposit[0].banner_img = null;
                            //     }
                            // }

                            _this.$set(_this.$data.configData, 'subject', (subject.length > 0 ? subject[0] : ''))
                            _this.$set(_this.$data.configData, 'autoInvest', (autoInvest.length > 0 ? autoInvest[0] : ''))
                            _this.$set(_this.$data.configData, 'deposit', (deposit.length > 0 ? deposit[0] : ''))
                            _this.$set(_this.$data.configData, 'debtTransfer', (debtTransfer.length > 0 ? debtTransfer[0] : ''))
                            }
                        }
                    }
                })
            },
            toAutomaticBidding : function(){
                var userInfo = utils.getUserInfo();
                this.isLogin = userInfo.isLogin;
                if (!this.isLogin) {
                    utils.toLogin('/loanList');
                }else{
                    utils.newWebView('/automaticBidding');
                }
            },
            showTips(type,msg, textAlign, isSa, producInfoType){
                if(producInfoType == '定存'){
                    this.$refs.tipLayer.showByParame({
                        title : '产品介绍',
                        content : msg,
                        textAlign : textAlign
                    })
                }else{
                    this.$refs.tipLayer.showLayer(type, msg, textAlign);
                }


            },
            showFirstInvest(){
                this.$refs.tipLayer.showByParame({
                    title : "首购返现规则说明",
                    content : '1. 首次购买90天以上(含)，180天以内的产品，可获出借金额的年化0.3%现金返现;<br />2. 首次购买180天以上(含)的产品，可获出借金额的年化0.5%现金返现;<br />3. 返现金额=出借金额×出借期限(天)/365×返现率;<br />或，返现金额=出借金额×出借期限(月)/12×返现率;<br />举例：老王出借1万元至180天的产品，那么老王可获得的返现金额为：10000×180/365×0.5%=24.66元;<br />4.返现金额将在您出借后，直接返还至您的账户余额中，可提现;<br />5.首购返现奖励可与卡券奖励叠加  <br />',
                    textAlign : 'left'
                });
              /*this.sfTitle="首购返现规则说明";
              this.sfLeft = '1. 首次购买90天以上(含)，180天以内的产品，可获出借金额的年化0.3%现金返现;<br />2. 首次购买180天以上(含)的产品，可获出借金额的年化0.5%现金返现;<br />3. 返现金额=出借金额×出借期限(天)/365×返现率;<br />或，返现金额=出借金额×出借期限(月)/12×返现率;<br />举例：老王出借1万元至180天的产品，那么老王可获得的返现金额为：10000×180/365×0.5%=24.66元;<br />4.返现金额将在您出借后，直接返还至您的账户余额中，可提现;<br />5.首购返现奖励可与卡券奖励叠加  <br />';
              this.sfStatus=true;*/
            },
            listTab (tagId, tabName){
                this.currentTag = tagId;
                window.location.hash = tagId;
                this.contentMoveLeft = -(tagId-1)*100 + '%';
                if(this.currentTag == 1){
                    if(this.timeDepositList.length == 0)
                    this.getTimeDepositList();
                }else if(this.currentTag == 2){
                    this.$refs.autoInvestLimit.stopTimer();
                    this.getAutoInfo();
                }else if(this.currentTag == 3){
                    if(this.subjectList.length == 0)
                    this.getSubjectList();
                }else if(this.currentTag == 4){
                  if(this.claimTransList.length == 0)
                    this.getClaimTransList();
                }



            },
            showLayer(type, noTitle){
                switch(type){
                    case 'equal' : {
                        this.showTips(1,'在还款期内<br />出借人每月收回同等数额的还款<br />（包括本金和利息）');

                        break;
                    }
                    case 'disposable' : {
                        this.showTips(1,'期限到期后<br />一次性收回所有的本金和利息');

                        break;
                    }
                    case 'filp' : {
                        this.showTips(1, '在还款期内<br />出借人每月（整期）收回同等数额的利息，到期一次性收回本金');

                        break;
                    }
                    default : {
                        this.showTips(noTitle ? 1 : 2,type);
                        break;
                    }
                }
                this.layerInputMaskShow = true;
            },
            //控制风险等级浮层
            showRiskLayer(font, isSubject){
                this.riskLayerContent = font;
                this.riskLayerStatus = true;
                this.layerInputMaskShow = true;

                if(this.currentTag == 3 || this.currentTag == 1) this.layerMaskStatus = true;

            },
            //关闭风险等级浮层
            hideRiskLayer(){
                this.riskLayerContent = '';
                this.riskLayerStatus = false;
                this.layerInputMaskShow = false;
                //this.layerMaskStatus=false;
                if(this.currentTag == 3 || this.currentTag == 1) this.layerMaskStatus = false;
            },
            retryInput(){
                this.investOverstepLimitContent = '';
                this.investOverstepLimitLayerStatus = false;
                this.layerInputMaskShow = false;
                //this.layerMaskStatus=false;
                this.autoInvestLayerStep1 = true;
                this.autoInvestLayerLoading = false;
                this.autoInvestAmount = '';
                if(this.currentTag == 3 || this.currentTag == 1) this.layerMaskStatus = false;
            },
            //计算内容区底部距离 ios系统
            containerBottomFn(){
                if(this.curDevice == 'ios' && this.curVersion > 274&&utils.getCookie('isShowAllWap')=='0'){
                    switch(window.innerHeight){
                        case 665 : {
                            this.containerBottom = (49/32) + 'rem';
                            break;
                        }
                        case 603 : {
                            this.containerBottom = (98/32) + 'rem';
                            break;
                        }
                        case 672 : {
                            this.containerBottom = (86/32) + 'rem';
                            break;
                        }
                        /*case 623 : {
                            this.containerBottom = (86/32) + 'rem';
                            break;
                        }*/
                        case 504 : {
                            if(window.innerWidth == 320){
                                this.containerBottom = (106/32) + 'rem';
                            }
                            //this.containerBottom = (86/32) + 'rem';
                            break;
                        }
                        default : {
                            this.containerBottom = '0rem';
                            this.filterBtnBottom = '1rem';
                        }
                    }
                }else if(this.curDevice == 'android' && this.curVersion > 274 && utils.getCookie('isShowAllWap')=='0'){
                    this.containerBottom = '0rem';
                    this.filterBtnBottom = '1rem';
                }
            },
            goToRecharge() {
              utils.newWebView("/rechargeUI?investamount=" + this.autoInvestAmount + "&cburl=%2floanList");
            },

            //散标筛选
            showFilterLayer(){
                this.filterLayerShowState = true;
            },
            hideFilterLayer(){
                this.filterLayerShowState = false;
            },
            toAutoInvestTabPage(){
                this.listTab(2);
            },
            filterAdLink(){
                this.hideFilterLayer();
                this.listTab(2);
            },
            touchMoveHandler : function (e) {
                e.preventDefault();
                e.stopPropagation();
            },
            selectFilterItem : function(type, e){
                var target = $(e.currentTarget),
                    section = this.$refs,
                    index = target.index(),
                    value = target.attr('data-value').split('|'),
                    otherValue = [0,0],
                    classTF = [false, false, false],
                    calssTF_repayment = [false, false, false];
                if(type == 'limit' || type == 'rate'){
                    if(target.hasClass('selected')){
                        classTF[index] = false;
                        this.limitIndex = -1;
                        this.rateIndex = -1;
                        this.minMonth = 0;
                        this.maxMonth = 0;
                        this.minRate = 0;
                        this.maxRate = 0;
                        this.selectRateLimit = false;
                    }else{
                        classTF[index] = true;
                        this.limitIndex = index;
                        this.rateIndex = index;
                        this.selectRateLimit = true;
                    }

                    this.rateClassSelect = classTF
                    this.limitClassSelect = classTF
                }else if(type == 'repayment'){
                    if(target.hasClass('selected')){
                        calssTF_repayment[index] = false;
                        value = 0;
                        this.repaymentIndex = -1;
                        this.filterType = value;
                    }else{
                        this.repaymentIndex = index;
                        calssTF_repayment[index] = true;
                        value = value[0]
                    }
                    this.repaymentClassSelect = calssTF_repayment;
                }

                switch(type){
                    case 'limit' : {
                        if(this.selectRateLimit){
                            this.minMonth = value[0];
                            this.maxMonth = value[1];
                            otherValue = $(section.filter_rate).find('li').eq(index).attr('data-value').split('|');
                            this.minRate = otherValue[0];
                            this.maxRate = otherValue[1];
                        }
                        break;
                    }
                    case 'rate' : {
                        if(this.selectRateLimit){
                            this.minRate = value[0];
                            this.maxRate = value[1];
                            otherValue = $(section.filter_limit).find('li').eq(index).attr('data-value').split('|');
                            this.minMonth = otherValue[0];
                            this.maxMonth = otherValue[1];
                        }
                        break;
                    }
                    case 'repayment' : {
                        this.filterRepaymentType = value;
                        break;
                    }
                }

                //保存筛选信息
                var filterData = this.minRate + '|' + this.maxRate + '|' + this.minMonth + '|' + this.maxMonth + '|' + this.filterRepaymentType + ',' + this.rateIndex + '|' + this.limitIndex + '|' + this.repaymentIndex;
                utils.setCookie('filterData', filterData,1);
                utils.setCookie('filterAddTime', new Date(),1);
            },
            resetFilter : function(){
                this.subjectDataFromFilter = false;
                this.minMonth = 0;
                this.maxMonth = 0;
                this.minRate = 0;
                this.maxRate = 0;
                this.filterType = 0;
                this.rateClassSelect = [false, false, false];
                this.limitClassSelect = [false, false, false];
                this.repaymentClassSelect = [false, false, false];
                var filterData = this.minRate + '|' + this.maxRate + '|' + this.minMonth + '|' + this.maxMonth + '|' + this.filterType + ',-1|-1|-1';
                utils.setCookie('filterData', filterData,1);
                utils.setCookie('filterAddTime', new Date(),1);
            },
            startFilter : function(){
                var _this = this;
                this.subjectDataFromFilter = true;
                this.subjectList = [];
                this.subjectPageNum = 1;
                this.isloadingShow=true;
                this.getSubjectList();
                window.removeEventListener('touchmove',_this.touchMoveHandler,false);
                window.removeEventListener('wheel',_this.touchMoveHandler,false);
            },
            getFilterData(callback){
                //获取已选择筛选信息
                var filterData = utils.getCookie('filterData');
                if(filterData){
                    this.subjectDataFromFilter = true;
                    var filterAddTime = utils.getCookie('filterAddTime');
                    var currentTime = new Date().getTime();
                    if(filterAddTime && filterAddTime != '[]'){
                        filterAddTime = new Date(filterAddTime).getTime();
                        if(currentTime - filterAddTime > 180000){
                            utils.setCookie('filterAddTime', '',1)
                            utils.setCookie('filterData', '',1)
                        }else{
                            var classTF = [false, false, false],
                                calssTF_repayment = [false, false],
                                filterDataAll = filterData.split(','),
                                filterData = filterDataAll[0].split('|'),
                                filterIndex = filterDataAll[1].split('|');
                            this.minMonth = filterData[2];
                            this.maxMonth = filterData[3];
                            this.minRate = filterData[0];
                            this.maxRate = filterData[1];
                            this.filterRepaymentType = filterData[4];


                            if(filterIndex[0] > -1){
                                classTF[filterIndex[0]] = true;
                            }
                            if(filterIndex[2] > -1){
                                calssTF_repayment[filterIndex[2]] = true;
                            }
                            this.rateClassSelect = classTF;
                            this.limitClassSelect = classTF;
                            this.repaymentClassSelect = calssTF_repayment;
                        }
                    }
                }
                if(typeof callback == 'function') callback();
            },
            //获取并检测用户风险等级
            checkRiskStatus(callback, isDeposit){
                var _this = this;
                if(!this.riskEnable){
                    $.ajax({
                        url : utils.AJAXDOMAINNAME+"/wap/user/riskEvaluationInformation",
                        data : '',
                        success : function(res){
                            if(res.code==1){
                                _this.riskCount=res.data.riskNum;
                                _this.riskName=res.data.riskRankName;
                                _this.riskStatus=res.data.isBlockInvest;
                                if(_this.riskCount=='0'&&_this.riskStatus=='1'){
                                    _this.riskEnable = false;
                                    _this.showRiskLayer('您未进行过风险测评，请进行完风险评测再进行出借。')
                                    if(isDeposit) callback(_this.riskEnable)
                                }else{
                                    _this.riskEnable = true;
                                    if(typeof callback == 'function') callback(_this.riskEnable);
                                }
                            }else{
                                _this.riskEnable = true;
                                if(typeof callback == 'function') callback(_this.riskEnable);
                                //_this.showLayer(res.message)
                            }
                        }
                    })
                }else{
                    _this.riskEnable = true;
                    if(typeof callback == 'function') callback(_this.riskEnable);
                }
            },

            //散标列表
            getSubjectList(isUpdata){
                this.isSubjectViewLoading=true;
                this.reloadSubjectViewDataStatus=false;
                this.isSubjectViewDisable=false;
                var _this = this;
                this.getFilterData(function(){
                    _this.hideFilterLayer();
                    if(!isUpdata) _this.loadingLayerStatus = true;
                    var data = {
                        pageSize : _this.subjectPageSize,
                        pageNum : _this.subjectPageNum,
                        maxMonth : _this.maxMonth,
                        minMonth : _this.minMonth,
                        maxRate : _this.maxRate,
                        minRate : _this.minRate,
                        repaymentType : _this.filterRepaymentType
                    };
                    $.ajax({
                      url : utils.AJAXDOMAINNAME+ '/wap/product/productList',
                        data : JSON.stringify(data),
                        complete : function(){
                            _this.loadingLayerStatus = false;
                            _this.isSubjectViewLoading=false;
                            if(_this.subjectList.length>=10){
                              _this.enLong=true;
                            }
                        },
                        success : function(rs){
                          _this.isNoNet=false;
                          _this.isTimeOutsb=false;
                           _this.isSubjectViewDisable=true;
                            if(!isUpdata) _this.loadingLayerStatus = false;
                            if(rs.code == '1'){
                                _this.subjectList.push.apply(_this.subjectList, rs.data.productList)
                                if (rs.data.productList.length > 0 && rs.data.productList.length == 10) {
                                    _this.subjectPageNum++;
                                }else{
                                    _this.isSubjectViewDisable=false;
                                }
                                _this.reloadSubjectViewDataStatus=false;
                                if(_this.subjectList.length>0){
                                  _this.isShowSubjectOver=false;
                                }else{
                                  _this.isShowSubjectOver=true;
                                }
                            }else{
                                _this.showLayer(rs.message)
                                // if(_this.subjectList.length==0){
                                //   _this.isShowSubjectOver=true;
                                // }
                            }

                        },
                        error:function(XMLHttpRequest, textStatus){
                          if(textStatus == 'error'){
                            _this.isNoNet=true;
                            _this.isTimeOutsb=false;
                          }else if(textStatus == 'timeout'){
                            _this.isTimeOutsb=true;
                            _this.isNoNet=false;
                          }
                            _this.reloadSubjectViewDataStatus=true;
                            // if(_this.subjectList.length==0){
                            //   _this.isShowSubjectOver=true;
                            // }
                        }
                    })
                })
            },

            autoInvestTimeCountDown(){
                var _this = this;
                window.clearInterval(_this.remainTimer)
                _this.remainTimer = setInterval(function(){
                    for(var k in _this.autoInvestRemainTime){
                        for(var j in _this.autoInvestRemainTime[k]){
                            var t = _this.autoInvestRemainTime[k][j]
                            _this.$set(_this.autoInvestRemainTime[k], j, t-1);
                        }
                    }
                },1000)
            },
            /*
             *智能推荐相关
             */
            getAutoInfo(callback){
                var _this = this;
                this.$refs.autoInvestLimit.stopTimer();
                this.loadingLayerStatus = true;
                this.autoInvestLimitData = '';
                $.ajax({
                    url : utils.AJAXDOMAINNAME+ '/wap/autoInvest/configList',
                    complete : function(){
                        _this.loadingLayerStatus = false;
                    },
                    success : function(res){
                        _this.isNoNet=false;
                        _this.isTimeOutzntj=false;
                        _this.loadingLayerStatus = false;
                        if(res.code==1){

                            _this.minInvestAmount = res.data.startAmount*1;
                            _this.userCash = res.data.cash ? res.data.cash : '0.00';
                            _this.loanCountOnSale = res.data.loanCountOnSale;
                            if(res.data.equalPrincalAndInterestList || res.data.normalList || res.data.firstInterestAndLatePrincipalList){
                                if(
                                    res.data.equalPrincalAndInterestList.length >0 ||
                                    res.data.normalList.length > 0 ||
                                    res.data.firstInterestAndLatePrincipalList.length > 0
                                ){
                                    var lastDisposableList = res.data.normalList ? res.data.normalList : [],
                                        lastFilp = res.data.firstInterestAndLatePrincipalList ? res.data.firstInterestAndLatePrincipalList : [],
                                        lastEqualList = res.data.equalPrincalAndInterestList ? res.data.equalPrincalAndInterestList : [];

                                    var timeArr = {};
                                    for(var i=0; i<lastDisposableList.length; i++){
                                        timeArr[lastDisposableList[i].configId] = lastDisposableList[i].activityRemainTime;
                                    }
                                    _this.$set(_this.$data.autoInvestRemainTime, 'disposableList', timeArr)

                                    var timeArr2 = {};
                                    for(var i=0; i<lastFilp.length; i++){
                                        timeArr2[lastFilp[i].configId] = lastFilp[i].activityRemainTime;
                                    }
                                    _this.$set(_this.$data.autoInvestRemainTime, 'filp', timeArr2)

                                    var timeArr3 = {};
                                    for(var i=0; i<lastEqualList.length; i++){
                                        timeArr3[lastEqualList[i].configId] = lastEqualList[i].activityRemainTime;
                                    }
                                    _this.$set(_this.$data.autoInvestRemainTime, 'equalList', timeArr3)
                                    _this.autoInvestTimeCountDown()
                                    var disposableList = lastDisposableList.filter(function(item){
                                        return item.remainAmount*1 > 0 && item.activityRate*1>0 && item.activityRemainTime*1>0 && item.top*1 == 1
                                    })[0]
                                    var filp = lastFilp.filter(function(item){
                                        return item.remainAmount*1 > 0 && item.activityRate*1>0 && item.activityRemainTime*1>0 && item.top*1 == 1
                                    })[0]
                                    var equalList = lastEqualList.filter(function(item){
                                        return item.remainAmount*1 > 0 && item.activityRate*1>0 && item.activityRemainTime*1>0 && item.top*1 == 1
                                    })[0]

                                    if(disposableList){
                                        disposableList['repaymentType'] = 2;
                                        disposableList['remainTime'] = 0;
                                        _this.autoInvestLimitData = disposableList
                                        lastDisposableList = lastDisposableList.filter(function(item){
                                            return item.configId != _this.autoInvestLimitData.configId;
                                        })
                                    }else if(equalList){
                                        equalList['repaymentType'] = 3;
                                        equalList['remainTime'] = 0;
                                        _this.autoInvestLimitData = equalList;
                                        lastEqualList = lastEqualList.filter(function(item){
                                            return item.configId != _this.autoInvestLimitData.configId;
                                        })
                                    }else if(filp){
                                        filp['repaymentType'] = 1;
                                        filp['remainTime'] = 0;
                                        _this.autoInvestLimitData = filp;
                                        lastFilp = lastFilp.filter(function(item){
                                            return item.configId != _this.autoInvestLimitData.configId;
                                        })
                                    }else{
                                        _this.autoInvestLimitData = '';
                                    }


                                    _this.$set(_this.$data.autoInvestConfigList, 'disposableList', lastDisposableList)
                                    _this.$set(_this.$data.autoInvestConfigList, 'filp', lastFilp)
                                    _this.$set(_this.$data.autoInvestConfigList, 'equalList', lastEqualList)
                                }
                            }
                            if(_this.autoInvestConfigList.equalList.length == 0 && _this.autoInvestConfigList.disposableList.length == 0&&_this.autoInvestConfigList.filp.length == 0){
                               _this.isShowAutoOver=true;
                            }
                            if(typeof callback == 'function') callback()
                         }else{
                             _this.showLayer(res.message)
                         }
                    },
                    error:function(XMLHttpRequest, textStatus){
                      if(textStatus == 'error'){
                        _this.isNoNet=true;
                        _this.isTimeOutzntj=false;
                      }else if(textStatus == 'timeout'){
                        if(_this.autoInvestConfigList.equalList.length == 0 && _this.autoInvestConfigList.disposableList.length == 0&&_this.autoInvestConfigList.filp.length == 0){
                           _this.isTimeOutzntj=true;
                        }
                        _this.isNoNet=false;
                      }
                    }
                })
            },
             //推荐标的
            //全投
            allInvest(){
                var _this = this;
                if(this.userCash*1 >= this.autoSelectItem.remainAmount*1){
                    this.autoInvestAmount = this.autoSelectItem.remainAmount*1;
                }else{
                    this.autoInvestAmount = this.userCash*1;
                }
                if(this.autoInvestAmount <= this.minInvestAmount) this.autoInvestAmount = this.minInvestAmount;

            },
            toAutoInvestMatchDebtOnSale(){
                utils.newWebView('/autoInvestMatchDebtOnSale')
            },

             //获取账户余额
            getUserCash(){
                var _this = this;
                var def = $.Deferred();
                $.ajax({
                  url : utils.AJAXDOMAINNAME+ '/wap/getAccountBalance',
                    async : false,
                    success : function(res){
                        if(res.code*1 == 1){
                            _this.userCash = res.data.accountBalance ? res.data.accountBalance : '0.00'
                        }else{
                            _this.showLayer(res.message)
                        }
                    }
                })
                return def.promise();
            },
            clearAutoSelectData : function(){
                this.autoSelectItem = {};
                this.autoRepmentType = 0;
                this.autoInvestAmount = '';
            },
            tosatFn(parame){
                var _this = this;
                this.$refs.tosat.tosatShow({
                    msg : parame.msg,
                    time : 2
                }, function(){
                    utils.newWebView(parame.path +'?cburl='+parame.cburl)
                    /*_this.$router.push({
                        path : parame.path,
                        query : {
                            cburl : parame.cburl
                        }
                    })*/
                })
            },
            recommendForMe(){
                var _this = this;
                this.canRecommend = false;
                var userInfo = utils.getUserInfo();
                this.isBindCard = userInfo.isBindCard;
                this.isIdValify = userInfo.isIdValify;
                if(!this.isIdValify){
                    this.tosatFn({
                        msg : '请先完成实名',
                        path: '/authentication',
                        cburl : '/loanList'
                    })
                    return;
                }
                if(!this.$refs.needActive.checkDepositoryStatus()){
                    _this.layerInputMaskShow = false;
                    return false
                };
                //##SET## 起投金额为1000上线时修改
                if(this.autoInvestAmount== null || this.autoInvestAmount == "" || this.autoInvestAmount == 0 || this.autoInvestAmount*1<this.minInvestAmount){
                    this.showLayer('起投金额最少'+ this.minInvestAmount +'元', true)
                    this.layerInputMaskShow = true;
                    return
                }
                if(parseFloat(this.autoInvestAmount, 10) > parseFloat(this.userCash, 10)){
                    this.userCashNotEnoughShow=true;
                    this.layerInputMaskShow = true;
                    return;
                }
                this.canRecommend = true;
                this.checkRiskStatus(function(){
                    _this.autoInvestLayerStep1 = false;
                    _this.autoInvestLayerLoading = true;
                    var datas = {
                        amount : _this.autoInvestAmount,
                        repaymentType : _this.autoRepmentType,
                        termUnit : _this.autoSelectItem.termUnit,
                        termCount : _this.autoSelectItem.termCount,
                        rate :_this.autoSelectItem.rate
                    }

                    $.ajax({
                        url : utils.AJAXDOMAINNAME+"/wap/autoInvest/matchLoanList",
                        data : JSON.stringify(datas),
                        complete : function(XMLHttpRequest, textStatus){
                            if(textStatus == 'error' || textStatus == 'timeout'){
                                _this.autoInvestLayerStep1 = true;
                                _this.autoInvestLayerStep2 = false;
                                _this.autoInvestLayerLoading = false;
                                _this.layerInputMaskShow = false;
                            }
                        },
                        success : function(res){
                            _this.autoInvestLayerLoading = false;
                            _this.layerInputMaskShow = false
                            if(res.code==1){
                                if(res.data.autoInvestMatchId){
                                    _this.autoMatchResule=res.data;
                                    _this.autoInvestMatchId= res.data.autoInvestMatchId;
                                    //投资金额与匹配金额相等时，直接跳转到投资确认页
                                    if(_this.autoMatchResule.realAmount*1==_this.autoInvestAmount*1){
                                       _this.autoInvestConfirm();
                                    }else{
                                      _this.autoInvestLayerStep2=true;
                                    }
                                }else{
                                    _this.autoInvestLayerStep2=false;
                                    _this.showLayer(res.message)
                                }
                            }else if(res.code == '-801'){
                                _this.autoInvestLayerStep2=false;
                                _this.layerMaskStatus = false;
                                _this.clearInputData();
                                _this.showLayer(res.message)
                            } else if (res.code == '-880' || res.code == '-881' || res.code == '-886') {
                                _this.riskLayerContent = res.message;
                                _this.riskLayerStatus = true;
                                _this.layerMaskStatus = true;
                                return;
                            } else if (res.code == '-906') {
                                _this.investOverstepLimitContent = res.message;
                                _this.investOverstepLimitLayerStatus = true;
                                _this.autoInvestLayerStep1 = true;
                                _this.autoInvestLayerLoading = false;
                                _this.layerMaskStatus = true;
                                return;
                            } else{
                                _this.autoInvestLayerStep2=false;
                                _this.layerMaskStatus = false;
                                _this.clearInputData();
                                _this.showLayer(res.message)
                            }
                        }
                    })
                })
            },
            closeLayerAndRefresh(){
                this.autoInvestLayerStep1 = false;
                this.autoInvestLayerStep2 = false;
                this.layerMaskStatus = false;
                this.layerInputMaskShow = false;
                this.clearAutoSelectData();
                this.getAutoInfo();
            },
            closeLayer(){
                this.layerInputMaskShow = false;
                this.showLayerStatus = false;
                this.userCashNotEnoughShow = false;
            },
            cancleAutoMatch(){
                var _this = this;
                $.ajax({
                    url : utils.AJAXDOMAINNAME+"/wap/autoInvest/cancelAutoInvestMatchConfirm",
                    data : '{"matchInvestId":"'+ _this.autoInvestMatchId +'"}',
                    success : function(res){}
                })
                this.clearInputData();
                this.closeLayerAndRefresh();
            },
            selectAutoInvestItem(id, repmentType, currentItem){
                var _this = this;

                if(!this.clickAutoInvestItem) return;
                this.clickAutoInvestItem = false;
                if(!this.userStatusNormal){
                    var userInfo = utils.getUserInfo();
                    this.isLogin = userInfo.isLogin;
                    if(userInfo.info.accountState=='350'){
                        this.showLayer("您的笑脸账号异常，请联系客服4008-900-766！");
                        _this.clickAutoInvestItem = true;
                        return;
                    }
                    if(userInfo.info.accountState=='300'){
                        this.showLayer("您的账户状态异常，请联系客服4008-900-766！");
                        _this.clickAutoInvestItem = true;
                        return;
                    }
                }
                if (!this.isLogin) {
                    utils.toLogin('/loanList');
                }else{
                    if(!_this.userStatusNormal){
                        if(!this.$refs.needActive.checkDepositoryStatus()){
                            this.clickAutoInvestItem = true;
                            return false
                        };
                    }
                    _this.userStatusNormal = true;
                    var dataArr= [], remainTime = 0;
                    if(repmentType == 1){
                        dataArr = this.autoInvestConfigList.filp;
                    }else if(repmentType == 2){
                        dataArr = this.autoInvestConfigList.disposableList;
                    }else if(repmentType == 3){
                        dataArr = this.autoInvestConfigList.equalList;
                    }
                    this.autoRepmentType = repmentType;
                    this.autoSelectItem = currentItem ? currentItem : dataArr.filter(function(item){
                        return item.configId === id;
                    })[0];
                    if(repmentType == 1){
                        remainTime = this.autoInvestRemainTime['filp'][this.autoSelectItem.configId];
                    }else if(repmentType == 2){
                        remainTime = this.autoInvestRemainTime['disposableList'][this.autoSelectItem.configId];
                    }else if(repmentType == 3){
                        remainTime = this.autoInvestRemainTime['equalList'][this.autoSelectItem.configId];
                    }
                    if(remainTime > 0) _this.currentProductHasAddRate = 1;
                    this.getUserCash();
                    this.autoInvestLayerStep1 = true;
                    this.layerMaskStatus = true;

                };
                setTimeout(function(){
                    _this.clickAutoInvestItem = true;
                },320)

            },
            clearInputData : function(){
                this.autoRepmentType = 0;
                this.autoSelectItem = '';
                this.autoInvestAmount = '';
            },

            autoInvestConfirm(){
                var bidType = this.filterRepaymentType
                this.layerAutoInvestResuleShow = false;
                this.closeLayer();
                this.autoSelectItem = {};
                this.autoRepmentType = 0;
                this.autoInvestAmount = '';
                this.autoInvestLayerStep1 = false;
                this.autoInvestLayerStep2 = false;
                this.layerMaskStatus = false;
                this.layerInputMaskShow = false;
                var _this = this;


                var tremDayCal = 0;
                if (_this.autoMatchResule.termUnit == '1') {
                    tremDayCal = _this.autoMatchResule.termCount;
                } else if (_this.autoMatchResule.termUnit == '3') {
                    tremDayCal = _this.autoMatchResule.termCount * 30;
                }
                var jumpUrl ="/autoInvestMatchConfirm?autoInvestMatchId="+_this.autoMatchResule.autoInvestMatchId+"&bidType="+this.autoRepmentType+"&realAmount="+_this.autoMatchResule.realAmount + '&tremDayCal=' + tremDayCal+'&haveAddRate='+_this.currentProductHasAddRate;

                _this.autoInvestJumping = true;
                _this.layerMaskStatus = true;
                if(this.curDevice == 'ios' && this.curVersion > 274){
                    this.getAutoInfo(function(){
                        _this.autoInvestJumping = false;
                        _this.layerMaskStatus = true;
                        utils.newWebView(jumpUrl)
                    });
                }else{
                    setTimeout(function(){
                        _this.autoInvestJumping = false;
                        _this.layerMaskStatus = true;
                        utils.newWebView(jumpUrl);
                    },1000)

                }
            },
            forcusThisInput(){
                //if(this.curDevice == 'android') this.filterLayerBottom = 'bottom:auto;top:0;'
                this.startTime = new Date().getTime();
            },
            blurThisInput(){
                //if(this.curDevice == 'android') this.filterLayerBottom = 'bottom:0;top:auto;'
                var endTime=(new Date().getTime()-this.startTime)/1000;

            },


            //定存相关
            getTimeDepositList(){
                var _this = this;
                _this.timeDepositList = [];
                _this.loadingLayerStatus = true;
                _this.utils.setCookie('timeDepositIdList', '', -1);
                $.ajax({
                    url : utils.AJAXDOMAINNAME+ '/wap/product/sdqProductList',
                    success : function(rs){
                        _this.loadingLayerStatus = false;
                        _this.isNoNet=false;
                        _this.isTimeOutyyx=false;
                        if(rs.code == '1'){
                            var timeDepositIdList = [];
                            for(var i in rs.data.productList){
                                timeDepositIdList.push(rs.data.productList[i].productId)
                            }

                            var limitTimeData = rs.data.productList.filter(function(item){
                                return item.remainAmount*1 > 0 && item.activityRate*1>0 && item.activityRemainTime*1>0 && item.top*1 == 1
                            })
                            var lastDataList = rs.data.productList;
                            if(limitTimeData.length > 0){
                                _this.timeDepositLimitData = limitTimeData[0];
                                lastDataList = rs.data.productList.filter(function(item){
                                    return item.productId != _this.timeDepositLimitData.productId;
                                })
                            }else{
                                _this.timeDepositLimitData = '';
                            }
                            _this.utils.setCookie('timeDepositIdList', timeDepositIdList.join(','))
                            _this.timeDepositList.push.apply(_this.timeDepositList, lastDataList)

                            _this.timeDepositLoanCount = rs.data.loanCount;
                        }else{
                            _this.showLayer(rs.message)

                        }

                    },
                    error:function(XMLHttpRequest, textStatus){
                      if(textStatus == 'error'){
                        _this.isNoNet=true;
                        _this.isTimeOutyyx=false;
                  		}else if(textStatus == 'timeout'){
                        _this.isTimeOutyyx=true;
                        _this.isNoNet=false;
                  		}
                        _this.loadingLayerStatus = false;
                        if(_this.subjectList.length==0){
                            _this.isShowSubjectOver=true;
                        }

                    }
                })
            },
          //转让债权列表
          getClaimTransList(isUpdata){
            if(!isUpdata) {
              this.loadingLayerStatus = true;
              this.$refs.loadingMdctf.allHide();
            }
            else{
              this.$refs.loadingMdctf.isLoadingShow();
            }
            this.isClaimsViewDisable=false;
            var _this = this;
              $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/product/orderTransferProductList?pageNum='+this.claimsPageNum+'&v='+Math.random(),
                type : 'GET',
                complete : function(){
                  _this.loadingLayerStatus = false;
                  _this.isClaimsViewLoading=false;

                },
                success : function(rs){
                  _this.isNoNet=false;
                  _this.isTimeOutcl=false;
                  _this.isClaimsViewDisable=true;
                  if(rs.code == '1'){
                    if(rs.data&&rs.data.length>0){
                      var ctlV=_this.claimTransList.concat(rs.data);
                      //去重
                      var am=[ctlV[0]];
                      for(var i=0;i<ctlV.length;i++){
                        var bool=false;
                        for(var j=0;j<am.length;j++){
                          if(am[j].productId==ctlV[i].productId){
                            bool=true;
                            break;
                          }
                        }
                        if(!bool){ am.push(ctlV[i]); }

                      }
                      _this.claimTransList=am;
                      _this.claimsPageNum++;

                    }else{
                      _this.isClaimsViewDisable=false;
                      _this.$refs.loadingMdctf.isSafeShow();

                    }
                    _this.reloadClaimsViewDataStatus=false;
                    if(_this.claimTransList.length>0){
                      _this.isShowClaimsOver=false;

                    }else{
                      _this.isShowClaimsOver=true;
                      _this.$refs.loadingMdctf.allHide();
                    }
                  }else{
                    _this.showLayer(rs.message)

                  }

                },
                error:function(XMLHttpRequest, textStatus){
                  if(textStatus == 'error'){
                    _this.isNoNet=true;
                    _this.isTimeOutcl=false;
                  }else if(textStatus == 'timeout'){
                    if(_this.claimTransList.length == 0){
                      _this.isTimeOutcl=true;
                    }else{
                      _this.reloadClaimsViewDataStatus=false;
                    }
                    _this.isNoNet=false;
                  }
                  // if(_this.claimTransList.length==0){
                  //   _this.isShowClaimsOver=true;
                  // }
                }
              })

          },
        },
        watch : {
          	autoInvestAmount : function(){
          		if(this.autoInvestAmount){
          			var val = this.autoInvestAmount+'';
          			val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
          			val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
          			val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
          			val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
          			if(val.indexOf(".")< 0 && val !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          			 val= parseFloat(val);
          			}
          			this.autoInvestAmount = val;
          		}
          	},
            showLayerStatus : function(value){
                this.layerInputMaskShow = value;
            },
            showTipsStatus : function(value){
                this.layerInputMaskShow = value;
            },
            // autoInvestConfigList:function(){
            //    if(this.autoInvestConfigList.equalList.length == 0 && this.autoInvestConfigList.disposableList.length == 0){
            //       this.isShowAutoOver=true;
            //    }
            // }
        }
    }
</script>
