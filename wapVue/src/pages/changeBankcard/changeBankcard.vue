<template>
  <div class="changeBankcard">
    <!-- <div class="cbk-tip" v-if="showDownBar">
          <img class="a1" src="~assets/wapFront/common/img/logo.png" alt="">
          <span class="a2">下载笑脸APP</span>
          <span class="a3">在线提交申请资料，方便快捷</span>
          <img class="a4" src="~assets/wapFront/common/img/x.png" alt="" @click="()=>{this.showDownBar = false;}">
    </div> -->
    <!-- <div class="cbk-con" :class="{'cbk-con-top' : showDownBar}"> -->
    <div class="cbk-con">
       <div class="title">
          <span class="span1">更换银行卡</span><router-link :to="{ name: 'cardList', query: {f: 'changeBankcard'} }">支持的银行及充值限额 <img src="~assets/wapFront/common/img/deepR.png"></router-link>
       </div>
       <div class="center">
         <p class="p1">亲爱的用户：</p>
         <p>为了确保您的资金安全，更换银行卡请到app进行提交!<br /><br /></p>
         <p>先下载app[<a href="//a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile">点这里下载app</a>]，并使用您的账号进行登录；<br /><br /></p>
         <p>登录后，进入app的 [我的]-[设置]-[银行存管账户]<br /><br /></p>
         <p>-[更换银行卡]  即可在线更换银行卡<br /><br /></p>
         <p>变更更便利，更快捷!<br /><br /></p>
         <p>笑脸平台客服: <a href="tel:4008900766">4008-900-766</a><br /><br /></p>
       </div>

       <footer class="button_area">
           <a href="//a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile" class="btn_tpls">下载APP，变更银行卡</a>
       </footer>
       <!-- <footer class="button_area">
           <a href="javascript:;" class="btn_tpls" @click="toChangeBindCard" :class="{'disabled' : disabled}">下载APP，变更银行卡<span v-if="time >= 0">({{time}}s)</span></a>
       </footer> -->

       <!--统一提示层-->
       <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
       <needActive ref="needActive"></needActive>
       <depositoryEntering ref="depositoryEntering" />
    </div>
  </div>
</template>

<style lang="less" src="./changeBankcard.less"></style>

<script>
  import * as constants from './changeBankcardConstants';
  import informationLayer from '@/components/informationLayer';
  export default {
    name: constants.NAME,
    data() {
      return {
          time : 15,
          disabled : true,
          clickStatus : false,
          informationLayerContent : '',
          showLayerStatus : false,

          showDownBar : true,
      }
    },
    components:{informationLayer},//这里注册
    created:function () {
        var curDevice=this.utils.getCookie('curDevice'),
            isShowAllWap=this.utils.getCookie('isShowAllWap');
        if((curDevice == 'android' || curDevice == 'ios') && isShowAllWap == '1') this.showDownBar = false;
        var _this = this;
        var timer= setInterval(()=>{
            _this.time--;
            if(_this.time < 0){
                window.clearInterval(timer);
                _this.clickStatus = true;
                _this.disabled = false;
            }
        },1000)

        $.ajax({
            url: this.utils.AJAXDOMAINNAME + "/wap/getUserBindCard",
            success: function(res) {
                if (res.code * 1 == 1) {
                    _this.bankInfo = res.data;
                } else {
                    _this.informationLayerContent = res.message;
                    _this.showLayerStatus = true;
                }
            }
        })
    },
    mounted: function(){
        this.$refs.needActive.checkDepositoryStatus();
    },
    methods: {
        toChangeBindCard : function(){
            var _this = this;
            if(!this.$refs.needActive.checkDepositoryStatus()) return false;
            if(!this.clickStatus) return;
            if(this.bankInfo.cardStatus == '2'){
                this.$router.replace({
                    name : 'changeSuccess',
                    query : {
                        type : 'changeBank'
                    }
                })
            };
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/changeBindBank",
                data : JSON.stringify({
                    idCardFrontImg : '',
                    idCardBackImg : '',
                    personBankCardImg : ''
                }),
                error : function(){
                    _this.clickStatus = true;
                },
                success : function(rs){
                    _this.clickStatus = true;
                    if(rs.code*1 == 1){
                        _this.$refs.depositoryEntering.show();
                        setTimeout(function() {
                            _this.$refs.depositoryEntering.close();
                            window.location.href = rs.data.url;
                        },2000)
                    }else{
                        _this.informationLayerContent = rs.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
        }
    },
  }
</script>
