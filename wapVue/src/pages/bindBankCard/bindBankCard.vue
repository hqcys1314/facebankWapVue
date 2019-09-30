<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2><a href="javascript:;" @click="utils.toIndex()" class="icon_close"></a>激活存管账户</h2>
        <h3 style="margin-bottom:.75rem;">{{userInfo.name}}，{{userInfo.idCardNo}}<br>激活新网银行存管账户，需要验证您在笑脸绑定的银行卡 </h3>
        <div class="input_box" style="border:0">
            <div class="item_name">您本人的银行卡号</div>
            <input name="bankCode" type="text" readonly class="number" ref="bankCodeInput" v-model="cardNo" @focus="()=>{this.inputFocusStatus_1 = true}" />
        </div>
        <div class="bankInfo" @click="showBanklayer" v-if="selectBank.bankId">
            <img :src="'//static.facebank.cn/static/wapFront/common/images/bankIconNew/'+ (bankTrans(selectBank.bankCode).imgName ? bankTrans(selectBank.bankCode).imgName : 'default') +'.png'" />
            {{selectBank.bankName}}限额：每笔{{selectBank.bankMaxLimitForOnce | formatAmount}}，每日{{selectBank.bankMaxLimitForDay | formatAmount}}
            <i class="iconfont icon-ic_rightarrow"></i>
        </div>
        <div class="bankInfo" @click="showBanklayer" v-else-if="selectBank == 'notSupport'">
            目前不支持该银行卡开通，建议点击查看支持银行并换卡
            <i class="iconfont icon-ic_rightarrow"></i>
        </div>
        <div class="bankTips" @click="showBanklayer" v-else>查看支持银行限额 &gt;</div>

        <div class="input_box" style="border:0">
            <div class="item_name" v-if="mobile!='' || inputFocusStatus_2">您此卡柜台开户时的手机号</div>
            <input name="mobile" type="text" readonly class="number" ref="mobileInput" maxlength="11" v-model="mobile" @focus="()=>{this.inputFocusStatus_2 = true}" @blur="()=>{this.inputFocusStatus_2 = false}" :placeholder="!inputFocusStatus_2 ? '您此卡柜台开户时的手机号' : ''"/>
        </div>
        <div class="blank"></div>
        <a href="javascript:;" class="btn_submit" @click="toActive">去激活存管账户</a>

        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus" btnFont="修改"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>
        <div class="bank_mask" v-show="bankLayerStatus">
            <div class="bank_list">
                <div class="title"><a href="javascript:;" class="close" @click="hideBanklayer">&nbsp;</a>银行列表</div>
                <ul class="list">
                    <li v-for="(item, index) in bankList">
                        <img :src="'//static.facebank.cn/static/wapFront/common/images/bankIconNew/'+ (bankTrans(item.bankCode).imgName ? bankTrans(item.bankCode).imgName : 'default') +'.png'" />
                        <div class="info">
                            <h2><span>每笔{{item.bankMaxLimitForOnce | formatAmount}}，每日{{item.bankMaxLimitForDay | formatAmount}}</span>{{item.bankName}}</h2>
                            <div class="remark" v-if="item.note">{{item.note}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="layer_style" v-show="showLayer" v-cloak>
            <div class="layer_content" style="text-align:left;padding:1.25rem 1.25rem;margin:0;">您同意授权笑脸金融平台调用您的电子签名认证证书完成下述协议的电子签署：<br />
                <a href="javascript:;" @click="showContract('register')">《笑脸金融平台用户注册协议》</a><br />
                <a href="javascript:;" @click="showContract('informationCatch')">《用户信息采集授权声明书》</a><br />
                <a href="javascript:;" @click="showContract('rechargeAndWith')">《快捷充值授权委托书》</a><br />
                <a href="javascript:;" @click="showContract('userAuthorize')">《用户授权委托书（电子签名、短信验证）》</a><br />
                <a href="javascript:;" @click="showContract('investorAuthorize')">《出借人授权委托书》</a>
            </div>
            <div class="layer_btn two">
                <a href="javascript:;" @click="closeLayer()">关闭</a>
                <a href="javascript:;" @click="toGateway()">确定</a>
            </div>
        </div>
        <div class="layerMask" v-show="layerMask" v-cloak></div>
        <layerAgreement ref="layerAgreement"></layerAgreement>

        <depositoryEntering ref="depositoryEntering" />
        <contactUs></contactUs>

    </div>
</template>
<style src="assets/css/formPage.css"></style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer';
import sunshineFooter from '@/components/sunshineFooter'
import {bankTrans} from 'tools';
export default {
    name: 'bindBankCard',
    components:{informationLayer, sunshineFooter},//这里注册
    data(){
        return{
            cardNo : '',
            mobile : '',
            code : '',
            inputFocus : false,

            bankList : [],
            bankTrans : {},
            selectBank : {},
            bankLayerStatus : false,

            submitStatus : true,

            informationLayerContent : '',
            showLayerStatus : false,


            countTime : 60,

            tosatContent : '',
            tosatShow : false,

            cburl : '',

            smsLayerTitle : '',
            smsError : false,
            smsErrorFont : '',

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,

            userInfo : '',

            showLayer : false,
            layerMask : false,
            canSendSms : true,
        }
    },
    filters :{
        formatAmount(val){
            if(!val) return 0;
            val = Number(val)
            if(val / 10000 >= 1){
                return parseInt((val/10000)*100)/100 + '万';
            }else if(val == 0){
                return val + '元';
            }else if(val / 10000 < 1){
                return val + ''
            }
        }
    },
    created:function () {
        var _this = this;
        this.bankTrans = bankTrans.bankTrans;
        this.getBankList();
        //获取用户基本信息
        $.ajax({
            url : this.utils.AJAXDOMAINNAME+"/wap/getUserRealInfo",
            async : false,
            success : function(res){
                if(res.code==1){
                   _this.userInfo=res.data;
                   _this.cardNo = res.data.bankCardNo.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");;
                   _this.mobile = res.data.bankMobile.replace(/\s/g, '').replace(/^(...)(....)/g, "$1 $2 ");
                   _this.selectBank = _this.filterBankInfo(res.data.bankCode);
                }
            }
        })
    },
    mounted:function(){
        var _this = this;
        if(this.userInfo.idCardNo == '' || this.userInfo.name == ''){
            this.$refs.tosat.tosatShow({
                msg : '请先完成实名',
                time : 2
            }, function(){
                _this.utils.newWebView('/authentication')
            })
        }
    },
    methods:{
        showContract(type, loanId){
            this.$refs.layerAgreement.showAgreement(type, loanId)
          },
        closeVerLayer(){
            this.showSmsVerification = false;
            this.clearCountDown();
            this.canSendSms = true;
        },
        showLayerFn(msg){
            this.informationLayerContent = msg;
            this.showLayerStatus = true;
        },
        filterBankInfo(code){
            var selectBank = '';
            var selectBank = this.bankList.filter(function(item){
                return item.bankCode == code;
            })
            if(selectBank.length == 0){
                selectBank = 'notSupport';
            }else{
                selectBank = selectBank[0]
            }
            return selectBank;
        },
        showBanklayer(){
            this.bankLayerStatus = true;
        },
        hideBanklayer(){
            this.bankLayerStatus = false;
        },
        //获取银行列表
        getBankList(){
            var _this = this;
            $.ajax({
              url : this.utils.AJAXDOMAINNAME+ '/wap/getBankList',
                async : false,
                success : function(rs){
                    if (rs.code*1 == 1) {
                        _this.bankList = rs.data.bankList;
                    }else{
                        _this.showLayerFn(rs.message)
                    }
                }
            })
        },

        closeLayer(){
            this.showLayer = false;
            this.layerMask = false;
        },
        toGateway(){
            var _this = this;
            this.showLayer = false;
            this.layerMask = false;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/v1/openBankAccount",
                success : function(rs){
                    if(rs.code*1 == 1){
                        _this.$refs.depositoryEntering.show();
                        setTimeout(()=>{
                            _this.$refs.depositoryEntering.close();
                            window.location.href=rs.data;
                        },2000)
                    }else{

                        _this.layerMask = false;
                        _this.showLayerFn(rs.message)
                    }
                }
            })
        },
        toActive(){
            this.showLayer = true;
            this.layerMask = true;
        }
    },
    watch : {
        cardNo : function(val){
            return val.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
        }
    }
}
</script>
