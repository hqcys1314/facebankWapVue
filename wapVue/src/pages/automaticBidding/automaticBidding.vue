<template>
    <div id="automaticBidding">
        <div class="autoBidding_card">
            <div class="item_name">余额自动投标累计回报(元)</div>
            <p class="p1" v-if="!userInfo.hasAutoBiddingInvest">尚未开启</p>
            <p class="p1" v-else-if="isOpen && configData.autoBiddingTotalInterest * 1 == 0">暂无回报</p>
            <p class="p1" v-else>{{configData.autoBiddingTotalInterest || '0.00'}}</p>

            <div class="item_name">当前在投本金(元)</div>
            <p class="p2" v-if="configData && configData.currentAutoBiddingPrincipal * 1 > 0">{{configData.currentAutoBiddingPrincipal || '0.00'}}</p>
            <p class="p2" v-else-if="userInfo.hasAutoBiddingInvest && configData.currentAutoBiddingPrincipal * 1 == 0">0.00</p>
            <p class="p2" v-else>--</p>
        </div>
        <div class="autoBidding_session">
            <router-link class="item" :to="{ path: '/automaticBiddingList', query: {open: (isOpen ? 1 : 0)}}">
                <p>
                    <span>自动投标记录</span>
                    <i class="iconfont icon-ic_rightarrow"></i>
                    <em class="font">{{configData && configData.autoBiddingRecordsCount *1 > 0 ? configData.autoBiddingRecordsCount : '0'}}</em>
                </p>
            </router-link>
        </div>
        <div class="autoBidding_session">
            <a href="javascript:;" class="item">
                <p>
                    <span>自动投标开关</span>
                    <span class="switch_el" :class="{'open':isOpen}" @touchend="switchSetting"></span>
                </p>
            </a>
            <a href="javascript:;" @click="()=>{this.userLikeLayerStatus = true;}" class="item" v-if="isOpen && configData">
                <p>
                    <span>标的期限</span>
                    <span class="selected">{{parseInt(configData.termCount / 30)}}个月 | {{configData.currentRate}}%</span>
                </p>
            </a>
            <a href="javascript:;" class="item" v-if="isOpen && ((vipInfo.vipRate || configData.bccardRate) || ((configData.termCount*1)/30) < 3)">
                <p>
                    <span>自动投标奖励</span>
                </p>
                <ul class="giftList">
                    <li v-if="vipInfo.vipRate*1 > 0" @click="showTips('member', {termCount : '3个月', rate : vipInfo.vipRate, memberName : vipInfo.rankName})">
                        <img class="icon" src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/vipicon.png" />
                        <div class="infos">
                            <span>{{vipInfo.vipRate}}%<span class="jt">&nbsp;</span></span>
                            <em>{{configData.rankName}}加息</em>
                        </div>
                    </li>
                    <li v-if="configData.bccardRate*1 > 0" @click="showTips('card', formatDate(configData.bccardStartTime) + ' - ' + formatDate(configData.bccardEndTime))">
                        <div class="limitDate">限时<!-- {{configData.bccardType*1 == 3 ? '无限' : '限时'}} --></div>
                        <img class="icon" src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/backAmountIcon.png" />
                        <div class="infos">
                            <span>{{configData.bccardRate}}%<span class="jt">&nbsp;</span></span>
                            <em>自动投标返现卡</em>
                        </div>
                    </li>
                </ul>
            </a>
        </div>
        <div v-if="configData && configData.currentAutoBiddingPrincipal*1 > 0 && configData.autoBiddingRecordsCount *1 > 0">
            <div class="hasOrder" v-if="!isOpen && configData && configData.countBeforeEndDate * 1 > 0">截至今日，预计最后一期出借资金撤出时间为{{configData.countBeforeEndDate}}天后。</div>
            <div class="hasOrder" v-if="!isOpen && configData && configData.countBeforeEndDate * 1 == 0">截至今日24时，预计出借资金将全部撤出。部分债权还款，由于银行结算时间等原因，最迟在下一工作日到账。</div>
        </div>

        <div class="autoBidding_desc" v-if="isOpen && configData">
            提示：<br />
            <p>1、自动出借标的期限为<span>{{parseInt(configData.termCount / 30)}}个月</span>，还款方式为<span>等额本息</span>，借款合同约定年化利率为<span>{{configData.currentRate}}%</span>；</p>
            <p>2、每日系统会对所有开启自动投标的用户，依次循环匹配标的。每日待撮合标的售罄则匹配停止；</p>
            <p v-if="vipInfo.vipRate*1 > 0">3、您所有出借至<span>3个月及以上</span>期限的自动投标订单都将享受{{vipInfo.rankName}}加息<span>[+{{vipInfo.vipRate}}%]</span>；</p>
            <p v-if="configData.bccardRate*1 > 0">{{vipInfo.vipRate*1 > 0 ? 4 : 3}}、返现卡有效期内，您的每一笔自动投标订单都将额外享受“自动投标专用返现卡”的返现<span>[返{{configData.bccardRate}}%]</span>。</p>
        </div>



        <div class="layer_bottom" v-if="closeAutoBiddingLayer">
            <div class="layer_content">
                <h2 class="layer_title">关闭自动投标<a href="javascript:;" class="close" @click="closeThisLayer()"></a></h2>
                <div class="moveBox" :style="'margin-left:'+contentMoveLeft">
                    <div class="content">
                        <p>
                            <span>请您确认关闭余额自动投标</span>
                            关闭自动投标后，您将退出自动投标队列。您在笑脸平台的账户余额不再自动匹配标的。<small v-if="configData.bccardRate">同时，您的“自动投标专用返现卡<em>[返{{configData.bccardRate}}%]</em>”将随之失效。</small>
                        </p>
                        <p>
                            <span>小建议</span>
                            如果您只是想更改出借标的的期望期限，您可以重新设置自动投标的期限，这将不会影响您在自动投标队列中的位置。
                        </p>
                    </div>
                    <div class="content">
                        <p>
                            <span>请您确认关闭余额自动投标</span>
                            关闭自动投标后，您笑脸账户中的所有回款金额都不再参与自动投标。建议时刻关注账户余额变动，标的回款后请记得合理安排资金，避免资金闲置！
                        </p>
                        <p>
                            <span>我的自动投标数据</span>
                            当前我的自动投标在投本金共计<em>{{configData.currentAutoBiddingPrincipal}}元</em>，自动投标未结清订单将按照其债权的还款计划进行还款<small v-if="configData.countBeforeEndDate*1 > 0">，预计最后一期出借资金撤出时间为<em>{{configData.countBeforeEndDate}}天</em>后</small>。
                        </p>
                    </div>
                </div>
                <div class="btn_area">
                    <a href="javascript:;" v-if="currentLayerContentTag == 1" @click="toSecondLayer()" class="btn_tpls2 short">关闭自动投标</a>
                    <router-link v-if="currentLayerContentTag == 1" class="btn_tpls short" :to="{ name: 'automaticBiddingSet', query : {termCount : configData.termCount}}">重新设置</router-link>
                    <a href="javascript:;" v-if="currentLayerContentTag == 2" class="btn_tpls" @click="confirmClose()">确定关闭自动投标</a>
                </div>
            </div>

        </div>
        <div class="invite_mask" v-if="inviteLayerStatus">
            <div class="invite_layer">
                <div class="name">尊敬的{{userInfo.userRealName ? userInfo.userRealName : userInfo.mobile}}{{userInfo.userGender*1 == 1 ? '先生' : '女士'}}</div>
                <a href="javascript:;" @click="toOpen" class="btn_tpls btn_tpls3">免费开启</a>
                <a href="javascript:;" @click="closeInviteLayer()" class="layer_close"></a>
            </div>
        </div>

        <div class="layer_style" v-show="cantOpenLayerStatus" v-cloak>
            <div class="layer_content" style="text-align:left">尊敬的{{userInfo.userRealName ? userInfo.userRealName : userInfo.mobile}}{{userInfo.userGender*1 == 1 ? '先生' : '女士'}}:<br>自动投标服务仅对总资产在5000元以上的用户开放。</div>
            <div class="layer_btn two">
                <a href="javascript:;" @click="closeLayer()">关闭</a>
                <a href="/autoInvestIntro/index.html">了解更多</a>
            </div>
        </div>
        <div class="layerMask" v-show="cantOpenLayerStatus" v-cloak></div>

        <div class="layer_style" v-show="userNotAccountIdTipsLayer" v-cloak>
            <div class="layer_content">{{userStatusTipsFont}}</div>
            <div class="layer_btn one">
                <a href="javascript:;" @click="openDepository()">{{userTipsLayerBtnName}}</a>
            </div>
        </div>
        <div class="layerMask" v-show="userNotAccountIdTipsLayer" v-cloak></div>


        <div class="layer_style" v-show="userLikeLayerStatus" v-cloak>
            <h2 class="layer_title">我的自动投标偏好</h2>
            <div class="layer_content" style="text-align:left">自动出借标的期限为{{parseInt(configData.termCount / 30)}}个月，还款方式为等额本息，借款合同约定年化利率为{{configData.currentRate}}%。每日系统会对所有开启自动投标的用户，依次循环匹配标的。每日待撮合标的售罄则匹配停止。</div>
            <div class="layer_btn two">
                <a href="javascript:;" @click="toConfirm()">修改</a>
                <a href="javascript:;" @click="()=>{this.userLikeLayerStatus = false;}">关闭</a>
            </div>
        </div>
        <div class="layerMask" v-show="userLikeLayerStatus" v-cloak></div>
        <tipLayer ref="tipLayer"></tipLayer>
        <a  href="/autoInvestIntro/index.html" class="help_tips" :class="{'bottom':!isOpen, 'static' : isOpen}">什么是自动投标？</a>
        <!-- <contactUs v-if="configData && configData.termCount && !isOpen"></contactUs> -->
        <services showItem="online, feedback" sourceType="automatic-bidding-set" :pos="configData && configData.termCount && isOpen ? 'static' : 'bottom'"></services>
        <tosat ref="tosat"></tosat>
    </div>
</template>
<style src="./automaticBidding.css">
</style>
<script>
export default {
    name: 'automaticBidding',
    data(){
        return{
            isOpen : false,
            changeIsOpenStatus : true,
            closeAutoBiddingLayer : false,
            inviteLayerStatus : false,
            configData : '',

            userInfo : '',
            userCash : '',
            userNotAccountIdTipsLayer : false,
            userStatusTipsFont : '',
            userTipsLayerBtnName : '',
            userLikeLayerStatus : false,

            contentMoveLeft : '',
            currentLayerContentTag : 1,
            vipInfo : {},
            cantOpenLayerStatus : false,

            tosatContent : '',
            showTosatLayerStatus : false,
        }
    },
    created:function(){

    },
    mounted : function(){

        var _this = this;
        var userInfo = _this.utils.getUserInfo();
        setTimeout(()=>{
            var userInfo = _this.utils.getUserInfo();
            _this.userInfo = userInfo.info;
            if(!userInfo.xhrData.success) {
                _this.$refs.tosat.tosatShow({
                    msg: userInfo.xhrData.message,
                    time: 2
                });
                return false;
            }
            $.ajax({
              url : _this.utils.AJAXDOMAINNAME+ '/wap/getUserAccountCashInfo',
                async : false,
                success : function(res){
                    if(res.code*1 == 1){
                        _this.userCash = res.data.totalAssert*1;
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })

            if(_this.userInfo.accountState*1==100){
               _this.userStatusTipsFont = '您尚未开通银行存管账户';
               _this.userTipsLayerBtnName = '去开通';
               _this.userNotAccountIdTipsLayer = true;
            }else if(_this.userInfo.accountState*1==150 || _this.userInfo.accountState*1==160){
               _this.userStatusTipsFont = '您尚未激活银行存管账户';
               _this.userTipsLayerBtnName = '去激活';
               _this.userNotAccountIdTipsLayer = true;
            }else if(_this.userInfo.hasAutoBiddingInvest){
                _this.isOpen = _this.userInfo.userAutoBiddingState;
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/autoBidding/currentAutoBiddingConfig',
                    success : function(res){
                        if(res.code*1 == 1){
                            _this.configData = res.data;
                        }else{
                            _this.showLayer(res.message)
                        }
                    }
                })
                $.ajax({
                    url : _this.utils.AJAXDOMAINNAME+ '/wap/user/vipInfo',
                    success : function(res){
                        if(res.code*1 == 1){
                            _this.vipInfo = res.data ? res.data : {};
                        }
                    }
                })
            }else if(!_this.userInfo.hasAutoBiddingInvest && _this.userCash >= 5000){
                _this.inviteLayerStatus = true;
            }else if(_this.userCash < 5000){
                _this.cantOpenLayerStatus = true;
            }
        },100)
    },
    methods:{
        checkAccountState() {
            if (this.userInfo.accountState == '350') {
                this.showLayer('您的笑脸账号异常，请联系客服4008-900-766！')
                return false;
            };
            if (this.userInfo.accountState == '300') {
                this.showLayer('您的账户状态异常，请联系客服4008-900-766！')
                return false;
            };
            return true;
        },
        checkAuthentication() {
            var _this = this;
            if (this.userInfo.hasIdValify == '0') {
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
        openDepository() {

            var _this = this;
            this.userNotAccountIdTipsLayer = false;
            if (!this.checkAccountState()) return;
            if (!this.checkAuthentication()) return;
            if(this.userInfo.accountState*1 == 150){//四要素
                _this.$router.push({
                    name: 'bindBankCard'
                })
            }else if(this.userInfo.accountState*1 == 160 || this.userInfo.accountState*1 == 100){
               //二要素 160账户更换过手机号或者解绑过银行卡等   100未开户
               _this.$router.push({
                   name: 'depositoryOpen'
               })
            }
        },
        formatDate(val){
            return val.substring(0,10).replace(/-/g, '.');
        },
        closeLayer(){
            this.cantOpenLayerStatus = false;
        },
        closeInviteLayer(){
            this.inviteLayerStatus = false;
        },
        closeThisLayer(){
            this.closeAutoBiddingLayer = false;
            this.changeIsOpenStatus = true;
            this.currentLayerContentTag = 1;
            this.changeLayerContentMove();
        },
        changeLayerContentMove(){
            this.contentMoveLeft = -(this.currentLayerContentTag-1)*100 + '%';
        },
        toSecondLayer(){
            this.currentLayerContentTag = 2;
            this.changeLayerContentMove();
        },
        toOpen(){
            var _this = this;
            this.inviteLayerStatus = false;
            setTimeout(()=>{
                this.$router.push({
                    name : 'automaticBiddingSet'
                })
            },200)
        },
        toConfirm(){
            this.userLikeLayerStatus = false;
            this.$router.push({
                name : 'automaticBiddingSet',
                query : {
                    termCount : this.configData.termCount
                }
            })
        },
        confirmClose(){
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/autoBidding/updateAutoBiddingConfig',
                data : JSON.stringify({
                    openStatus : 0, //0关闭、１开启
                    termCount : _this.configData.termCount
                }),
                async : false,
                success : function(res){
                    if(res.code*1 == 1){
                        _this.isOpen = false;
                        _this.changeIsOpenStatus = true;
                        _this.closeThisLayer();
                    }else if(res.code*1 == -911){
                        _this.$refs.tosat.tosatShow({
                            msg: res.message,
                            time: 2
                        });
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })

        },
        switchSetting(){
            var _this = this;
            setTimeout(function(){
                if(_this.userInfo.hasAutoBiddingInvest || (!_this.userInfo.hasAutoBiddingInvest && _this.userCash >= 5000)){
                    if(_this.changeIsOpenStatus){
                        _this.changeIsOpenStatus = false;
                        if(_this.isOpen){
                                _this.currentLayerContentTag = 1;
                                _this.closeAutoBiddingLayer = true;

                        }else{
                            _this.$router.push({
                                name : 'automaticBiddingSet'
                            })
                        }
                    }
                }else if(_this.userCash < 5000){
                    _this.cantOpenLayerStatus = true;
                }
            },320)
        },
        showLayer(msg){
            this.$refs.tipLayer.showLayer(2, msg)
        },
        showTips(type, data){
            if(type == 'member'){
                this.$refs.tipLayer.showByParame({
                    title : data.memberName + '加息',
                    content : '您是笑脸平台'+ data.memberName +'，您所有出借至'+ data.termCount +'及以上期限的自动投标订单都将享受'+ data.memberName +'加息[+'+ data.rate +'%]',
                    textAlign : 'left',
                    textColor : '#848899'
                })
            }else if(type == 'card'){
                this.$refs.tipLayer.showByParame({
                    title : '自动投标专享返现卡',
                    content : '该返现卡为“自动投标专享返现卡”，不可用于智能推荐或散标<br>有效期：'+ data +'<br>备注：关闭自动投标时(或修改自动投标期限时)该卡自动失效',
                    textAlign : 'left',
                    textColor : '#848899'
                })
            }
        }
    }
}
</script>
