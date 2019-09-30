<template>
    <div class="whiteBack" id="depository">
        <div class="top">
            <div class="xw_logo"><img src="//static.facebank.cn/static/wapFront/depository/img/xwLogoBig.png"></div>
            <div class="xw_status_font">新网银行资金存管中</div>
            <div class="menu_item">
                <a class="item" href="javascript:;" @click="changePW">
                    <p>
                        <span>重置存管交易密码</span>
                        <i class="iconfont icon-ic_rightarrow"></i>
                    </p>
                </a>
            </div>
        </div>
        <div class="menu_item">
            <a class="item" href="javascript:;" @click="changeBankCard">
                <p>
                    <span>更换银行卡</span>
                    <i class="iconfont icon-ic_rightarrow"></i>
                    <em class="font_1">{{userBankInfo.bankName}}(尾号{{userBankInfo.cardNo && userBankInfo.cardNo.substr(-4)}})</em>
                </p>
            </a>
            <a class="item" href="javascript:;" @click="changeMobile">
                <p>
                    <span>更换银行预留手机号</span>
                    <i class="iconfont icon-ic_rightarrow"></i>
                    <em class="font_1">{{userBankInfo.mobile}}</em>
                </p>
            </a>
        </div>
        <!--统一提示层-->
        <informationLayer :title="'提示'" :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <needActive :userInfo.sync="userInfo" ref="needActive"></needActive>
    </div>
</template>
<style scoped src="./depository.css">
</style>
<script>
import informationLayer from '@/components/informationLayer'
export default {
    name: 'depository',
    components:{informationLayer},//这里注册
    data () {
        return {
            userBankInfo : '',
            userInfo : {},
            informationLayerContent : '',
            showLayerStatus : false,
        }
    },
    created:function () {

        var _this = this;

        $.ajax({
            url : this.utils.AJAXDOMAINNAME+"/wap/getUserBaseInfo",
            async : false,
            success : function(res){
                if(res.code==1){
                   _this.userInfo=res.data;
                }
            }
        })
        $.ajax({
            url : this.utils.AJAXDOMAINNAME+"/wap/getUserBindCard",
            success : function(res){
                if(res.code==1){
                  _this.userBankInfo = res.data;
                }
            }
        })

    },
    mounted: function(){
        this.$refs.needActive.checkDepositoryStatus();
    },
    methods: {
        changePW(){
            if(!this.$refs.needActive.checkDepositoryStatus()) return false;
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/changeBindBankPass",
                success : function(rs){
                    if(rs.code*1 == 1){
                        window.location.href=rs.data.url;
                    }else{
                        _this.informationLayerContent = rs.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
        },
        changeBankCard(){
            if(!this.$refs.needActive.checkDepositoryStatus()) return false;
            setTimeout(()=>{
                this.$router.push({
                    name : 'userBankInfo'
                })
            },320)
        },
        changeMobile(){
            if(!this.$refs.needActive.checkDepositoryStatus()) return false;
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/changeBindBankPhone",
                success : function(rs){
                    if(rs.code*1 == 1){
                        window.location.href=rs.data.url;
                    }else{
                        _this.informationLayerContent = rs.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
        }
    }
}
</script>
