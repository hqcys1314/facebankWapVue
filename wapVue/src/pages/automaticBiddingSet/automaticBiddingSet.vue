<template>
    <div id="automaticBiddingSet"  v-cloak>
        <div class="page_box" style="height:auto;overflow:hidden;">
            <div class="page_title">在以下选项中选择您的出借偏好 </div>
            <div class="page_desc">系统会根据您的出借偏好，自动为您出借符合条件的优选标的！</div>
            <div class="select_box" ref="configListScroll">
                <ul ref="configListBox" :style="'width:'+ ul_width + 'px'">
                    <li v-for="item in configList" @click="selectItem(item)" :ref="(currentSelectItem.termCount == item.termCount ? 'selectItem': '')" :class="{'selected' : currentSelectItem.termCount == item.termCount}">
                        <p>{{item.termCount}}个月</p>
                        <span>标的期限</span>
                        <!-- <em v-if="item.bccardRate">返{{item.bccardRate}}%</em>
                        <em v-else>推荐爆款</em> -->
                    </li>

                </ul>
            </div>
            <div class="select_info" v-if="currentSelectItem != '' && currentSelectItem.termCount">
                <p><span>等额本息</span>{{currentSelectItem.rate}}<em>%</em></p>
                <p class="p2">借款合同约定年化利率</p>
            </div>
            <div class="gift_info" v-if="(currentSelectItem != '' || (currentSelectItem.termCount*1) < 3) && ((vipInfo && vipInfo.vipRate) || currentSelectItem.bccardRate)">
                <p v-if="vipInfo && vipInfo.vipRate*1 > 0"><span>{{vipInfo.rankName}}加息 [+{{vipInfo.vipRate}}%]</span></p>
                <p v-if="currentSelectItem.bccardRate"><span>限时赠送：自动投标返现卡 [返{{currentSelectItem.bccardRate}}%]</span></p>
                <small v-if="currentSelectItem.bccardRate">返现卡有效期内，您的每一笔自动投标订单都将额外享受返现</small>
            </div>
        </div>
        <div class="autoBidding_desc">
            网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span>认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后</span>，并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。具体内容请详见：<a href="javascript:;" @click="$refs.layerAgreement.showAgreement('riskInfo', '',true)">《网络借贷风险揭示书》</a>
        </div>
        <div class="blank144"></div>
        <footer class="button_area">
            <a href="javascript:;" class="btn_tpls" :class="{'disabled' : btnDisabledStatus}" @click="showContractLayer()">开启自动投标</a>
        </footer>

        <div class="layer_style" v-show="showContractLayerStatus" v-cloak style="padding-top:0;top:15%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;">
          <div class="layer_content" style="text-align:left;padding:0;margin:1.25rem 1.15rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;">
              网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span style="color:#2b313d">认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后</span>，并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。具体内容请详见：<a href="javascript:;" @click="showContract('riskInfo')">《网络借贷风险揭示书》</a><br><br>
            您同意授权笑脸金融平台调用您的电子签名认证证书完成下述协议的电子签署：<br>
            <a href="javascript:;" @click="showContract('autoBiddingContract')">《出借人授权委托书》</a><br />
            <a href="javascript:;" @click="showContract('investorMoney')">《出借人资金来源合法承诺函》</a>
          </div>
          <div class="layer_btn two">
              <a href="javascript:;" @click="closeLayer()">关闭</a>
              <a href="javascript:;" @click="openAutomaticBidding()">确定</a>
          </div>
        </div>
        <div class="layerMask" v-show="showContractLayerStatus" v-cloak></div>


        <layerAgreement ref="layerAgreement"></layerAgreement>
        <tipLayer ref="tipLayer"></tipLayer>
        <tosat ref="tosat"></tosat>
    </div>
</template>
<style src="../automaticBidding/automaticBidding.css">
</style>
<script>
export default {
    name: 'automaticBiddingSet',
    data(){
        return {
            hasGift : false,
            btnDisabledStatus : true,
            showContractLayerStatus : false,
            currentSelectItem : '',
            currentModelId : '',

            configList : '',
            vipInfo : '',
            defaultModelId : '',

            tosatContent : '',
            showTosatLayerStatus : false,
            ul_width : '100%',
            canSubmit : true,
        }
    },
    created:function(){
        this.currentModelId = this.$route.query.termCount ? this.$route.query.termCount*1/30 : '';
        if(this.currentModelId){
            this.btnDisabledStatus = false;
        }
        var _this = this;
        setTimeout(()=>{
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/autoBidding/getModelConfig',
                async : false,
                success : function(res){
                    if(res.code*1 == 1){
                        _this.configList = res.data;
                        _this.ul_width = (6.65*(_this.configList.length))*(window.innerWidth/750*32)+5
                        //if(_this.currentModelId){
                        for(var i=0; i<_this.configList.length; i++){
                            if(_this.configList[i].isDefault*1 == 1){
                                _this.defaultModelId = _this.configList[i].termCount;
                            }
                        }
                        var configListFilter = _this.configList.filter(function(item){
                            return item.termCount*1 == _this.currentModelId
                        });
                        if(configListFilter.length > 0){
                            _this.currentSelectItem = configListFilter;
                        }else{
                            _this.currentSelectItem = _this.configList.filter(function(item){
                                return item.termCount == _this.defaultModelId
                            });
                        }

                        if(_this.currentSelectItem.length > 0){
                            _this.currentSelectItem = _this.currentSelectItem[0];
                        }else{
                            _this.currentSelectItem = {};
                        }
                        setTimeout(function(){
                            var child = _this.$refs.configListBox.children,
                                liArr = [],selected = [];
                            for(var i=0;i<child.length;i++){
                                if(child[i].className == 'selected'){
                                    var scrollLeft = (6.65*(i-1))*(window.innerWidth/750*32);
                                    $(_this.$refs.configListScroll).scrollLeft(scrollLeft)
                                    break;
                                }
                            }
                        },500)
                        //}
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            });
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/user/vipInfo',
                success : function(res){
                    if(res.code*1 == 1){
                        _this.vipInfo = res.data;
                    }
                }
            })
        },50)
    },
    mounted(){

    },
    methods:{
        showLayer(msg){
            this.$refs.tipLayer.showLayer(2, msg)
        },
        closeLayer(){
            this.showContractLayerStatus = false;
        },
        showContractLayer(){
            if(this.currentModelId == this.currentSelectItem.termCount){
                window.history.go(-1)
                return;
            }
            this.showContractLayerStatus = true;
        },
        showContract(type){
            this.$refs.layerAgreement.showAgreement(type)
        },
        selectItem(item){
            this.currentSelectItem = item;
            this.btnDisabledStatus = false;
        },
        openAutomaticBidding(){
            var _this = this;
            if(!this.canSubmit) return;
            _this.canSubmit = false;
            this.showContractLayerStatus = false;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/autoBidding/updateAutoBiddingConfig',
                data : JSON.stringify({
                    openStatus : 1,//0关闭、１开启
                    modelId : _this.currentSelectItem.modelId,
                    termCount : (_this.currentSelectItem.termCount*1) * 30
                }),
                success : function(res){
                    _this.canSubmit = true;
                    if(res.code*1 == 1){
                        _this.$refs.tipLayer.showLayer(1, '自动投标设置成功', '','','我知道了', function(){
                            _this.$router.replace({
                                path : 'automaticBidding'
                            })
                        });
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
        }
    },
    watch:{
        'currentSelectItem.termCount' (val){
            this.btnDisabledStatus = !val;
        }
    }
}
</script>
