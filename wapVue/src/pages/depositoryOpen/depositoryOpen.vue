<template>
    <div id="formPage" v-cloak class="whiteBack">
        <div class="absolute_content">
            <h2><a href="javascript:;" @click="utils.toIndex()" class="icon_close"></a>{{typeFont}}存管账户 3/3</h2>
            <h4>{{userBaseInfoResult.name}}，{{userBaseInfoResult.idCardNo}}</h4>
            <section>{{typeFont}}新网银行存管账户需绑定银行卡，资金出入存管账户通过该银行卡完成，目前支持银行及充值限额如下： </section>
            <div class="bank_list bank_list2">
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
        <div class="btn_area type2">
            <a href="javascript:;" class="btn_submit" @click="active">去{{typeFont}}存管账户</a>
        </div>

        <depositoryEntering ref="depositoryEntering" />


        <div class="layer_style" id="allContractLayer" v-show="showLayer" v-cloak>
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

        <!--统一提示层-->
        <informationLayer :title="'提示'" :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <tosat ref="tosat"></tosat>
    </div>
</template>
<style src="assets/css/formPage.css"></style>
<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'
import {bankTrans} from 'tools';
export default {
    name: 'depositoryOpen',
    components:{informationLayer},//这里注册
    data(){
        return{
            userBaseInfoResult:"",

            bankList : [],
            bankTrans : {},
            showLayer : false,
            layerMask : false,
            typeFont : '',

            informationLayerContent : '',
            showLayerStatus : false,
        }
    },
    filters :{
        formatAmount(val){
            if(!val) return 0;
            val = Number(val)
            if(val / 10000 >= 1){
                return parseInt((val/10000)*100)/100 + '万';
                //return val / 10000 + '万'
            }else if(val / 10000 < 1){
                return val + ''
            }
        }
    },
    created:function () {
        var _this = this;
        var userInfos = this.utils.getUserInfo();
        if(userInfos.info.accountState == '150' || userInfos.info.accountState == '160'){
            this.typeFont = '激活';
        }else{
            this.typeFont = '开通';
        }
        $.ajax({
            url : this.utils.AJAXDOMAINNAME+"/wap/getUserRealInfo",
            success : function(res){
                if(res.code==1){
                   _this.userBaseInfoResult=res.data;
                }
            }
        })
        this.bankTrans = bankTrans.bankTrans;
        this.getBankList();
    },
    mounted : function(){
        var _this = this;
        if(this.userBaseInfoResult.idCardNo == '' || this.userBaseInfoResult.name == ''){
            this.$refs.tosat.tosatShow({
                msg : '请先完成实名',
                time : 2
            }, function(){
                _this.utils.newWebView('/authentication')
            })
            return false;
        }
    },
    methods:{
        showContract(type, loanId){
            this.$refs.layerAgreement.showAgreement(type, loanId)
        },
        closeLayer(){
            this.showLayer = false;
            this.layerMask = false;
        },
        //获取银行列表
        getBankList(){
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/getBankList',
                success : function(rs){
                    if (rs.code*1 == 1) {
                        _this.bankList = rs.data.bankList;
                    }else{
                        _this.informationLayerContent = rs.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
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

                        _this.$refs.depositoryEntering.close();
                        _this.layerMask = false;
                        _this.informationLayerContent = rs.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
        },
        active(){
            this.showLayer = true;
            this.layerMask = true;
        }
    }
}
</script>
