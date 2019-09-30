<template>
<div class="page" :style="'top:'+pageTop">
    <div class="top">
      <img src="//static.facebank.cn/static/wapFront/myAccount/img/changeMobile/index.png" width="100%" alt="更换手机号">
    </div>
    <div class="infos">
        当前登录手机号
        <div class="mobile">{{userInfo.mobile}}</div>
    </div>
    <a href="javascript:;" v-on:click="checkUserStatus" class="btn_tpl">更换手机号</a>
    <div class="desc">更换手机号后，新手机号将用于您登录笑脸平台<br>和接收笑脸消息提醒</div>

    <!--统一提示层-->
    <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
</div>
</template>
<style scoped src="./changeMobile.css"></style>
<style scoped>
.headIos{z-index:2;}
</style>
<script>
import * as constants from './changeMobileConstants';
import informationLayer from '@/components/informationLayer'
import {utils,Modal} from 'tools';

export default {
    name: constants.NAME,
    data() {
        return {
            userInfo : {},
            informationLayerContent : '',
            showLayerStatus : false,
            pageTop : '0',
        }
    },
    created:function () {
        this.userInfo = utils.getUserInfo().info;
        if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'){
           this.pageTop = '2.6875rem'
       }else{
           this.pageTop = '0'
       }
    },
    methods: {
        showLayer(msg){
            this.informationLayermsgContent = msg
            this.showLayerStatus = true;

        },
        checkUserStatus(){
            // if((this.userInfo.idNo == '' || this.userInfo.idNo == null || this.userInfo.idNo.indexOf('****') == -1) && this.userInfo.userHasSetPassword*1 == 0){
            //     this.showLayer('')
            // }else{
            //     this.$router.push({
            //         name : 'changeMobileSms',
            //         params : {
            //             mobile : this.userInfo.mobile
            //         }
            //     })
            // }
            this.$router.push({
                path: 'changeMobileSms',
                query: {
                    step: '1-1'
                }
            })
        }
    },
    components: {informationLayer}
}
</script>
