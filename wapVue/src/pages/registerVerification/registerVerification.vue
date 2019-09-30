<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2>输入验证码{{isNewUser ? ' - 注册' : ' - 登录'}}</h2>
        <h3>验证码已发送到{{mobile}}手机号，请注意查收</h3>
        <smsCodeInput :code.sync="code" length="6" :focus.sync="inputFocus" @inputEnd="submit()"></smsCodeInput>
        <div class="small_tips" v-if="countTime < 60"><span>{{countTime}}</span>s后重新发送<!-- 或 语音接收--></div>
        <div class="small_tips" v-else><a href="javascript:;" @click="sendSmsCode">重新发送</a></div>

        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus" @resendSmsCode="sendSmsCode"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow"></tosat>
        <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>
      <tipLayer ref="tipLayer"></tipLayer>

    </div>
</template>
<style src="assets/css/formPage.css">
</style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'

import smsCodeInput from '@/components/smsCodeInput';

export default {
    name: 'loginByVerification',
    components:{informationLayer, smsCodeInput},//这里注册
    data(){
        return{
            mobile : '',
            code : '',
            countTime : 60,
            inputFocus : true,

            showLayerStatus : false,
            informationLayerContent : '',

            timer : null,

            tosatContent : '',
            tosatShow : false,
            isNewUser : false,
            loadingLayerStatus:false,
        }
    },
    created:function () {
        var _this = this;
        this.mobile = this.$route.query.mobile;
        this.isNewUser = this.$route.query.isRegister*1 == 1;
        this.sendSmsCode();
    },
    mounted:function(){
        this.inputFocus = true;
    },
    methods:{
        showTosat(msg){
            this.tosatContent = msg;
            this.tosatShow = true;
        },
        countDown(){
            var _this = this;
            _this.timer = setInterval(()=>{
                if(_this.countTime <= 0){
                    _this.clearCountDown()
                }else{
                    _this.countTime--;
                }
            },1000)
        },
        clearCountDown(){
            this.code = '';
            this.countTime = 60;
            window.clearInterval(this.timer)
        },
        sendSmsCode(){
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME + '/wap/getLoginSmsCode',
                data : JSON.stringify({
                    mobile : _this.mobile,
                    wechatOpenId : this.utils.getCookie('wechatOpenId')
                }),
                error : function(XMLHttpRequest, textStatus) {
                    if(textStatus == 'error'){
                      _this.utils.toastFuc('网络请求错误，请稍候重试');
                    }else if(textStatus == 'timeout'){
                      _this.utils.toastFuc('网络请求超时，请稍候重试');
                    }
                    _this.code = '';
                    _this.clearCountDown();

                },
                success : function(rs){
                    if(rs.code*1 == 1){
                        _this.countDown();
                        _this.inputFocus = true;
                    }else if(rs.code=='-700'){
                      _this.code = '';
                      _this.clearCountDown();
                      _this.$refs.tipLayer.showByParame({
                        title : '提示',
                        content : rs.message,
                        btnArr : [
                          {
                            text : '拨打电话',
                            style: 'color:#F0484E',
                            fn : function(){
                              window.location.href="tel:4008900766";
                            }
                          },
                          {
                            text : '我知道了',
                            fn : function(){
                              _this.$refs.tipLayer.closeLayer();
                            }
                          }
                        ]
                      })
                    }else{
                        _this.informationLayerContent = rs.message
                        _this.showLayerStatus = true;
                        _this.code = '';
                        _this.clearCountDown();
                    }
                }
            })
        },
        submit(){
            this.loadingLayerStatus=true;
            var platformV= this.utils.getPlatform();
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME + '/wap/loginBySmsCode',
                data : JSON.stringify({
                    mobile : _this.mobile,
                    smsCode : _this.code,
                    imgToken : '',
                    loginPwd : '',
                    platform : platformV,
                    wechatOpenId : this.utils.getCookie('wechatOpenId')
                }),
                complete(){
                    _this.loadingLayerStatus=false;
                },
                error : function(XMLHttpRequest, textStatus){
                    if(textStatus == 'error'){
                      _this.utils.toastFuc('网络请求错误，请稍候重试');
                    }else if(textStatus == 'timeout'){
                      _this.utils.toastFuc('网络请求超时，请稍候重试');
                    }
                    _this.code = '';
                    _this.clearCountDown();

                },
                success : function(rs){
                    if(rs.code*1 == 1){
                        if(rs.data.wechatUserInfo && rs.data.wechatUserInfo.nickname){ // nickname 存在就保存 微信用户昵称和头像
                            _this.utils.setCookieAll('_WeChatNickName',escape(rs.data.wechatUserInfo.nickname));
                            _this.utils.setCookie('_WeChatNickName',escape(rs.data.wechatUserInfo.nickname));
                            _this.utils.setCookie('_WeChatHeadImgLink',rs.data.wechatUserInfo.headimgurl);

                        }
                        if(rs.data.isRegister == '1'){
                            _this.$router.push({name: 'authentication', query : {isRegister : 1}});
                        }else{
                            _this.$router.push({name: 'account'});
                        }

                    }else if(rs.code == '-865' || rs.code == '-864'){
                        _this.inputFocus = false;
                        _this.showTosat(rs.message);
                        _this.code = '';
                    }else if(rs.code=='-700'){
                      _this.inputFocus = false;
                      _this.code = '';
                      _this.clearCountDown();
                      _this.$refs.tipLayer.showByParame({
                        title : '提示',
                        content : rs.message,
                        btnArr : [
                          {
                            text : '拨打电话',
                            style: 'color:#F0484E',
                            fn : function(){
                              window.location.href="tel:4008900766";
                            }
                          },
                          {
                            text : '我知道了',
                            fn : function(){
                              _this.$refs.tipLayer.closeLayer();
                            }
                          }
                        ]
                      })
                    }
                    else{
                        _this.inputFocus = false;
                        _this.informationLayerContent = rs.message
                        _this.showLayerStatus = true;
                        _this.code = '';
                        _this.clearCountDown();
                    }
                }
            })
        }
    }
}
</script>
