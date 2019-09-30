<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2><a href="javascript:;" @click="utils.toIndex()" class="right">跳过</a>实名认证 <span v-if="!cburl">2/3</span></h2>
        <h3>应国家相关要求，请协助完成实名认证</h3>
        <div class="input_box">
            <div class="item_name" v-if="realName!='' || inputFocusStatus_1">您的真实姓名</div>
            <input name="realName" type="text" v-model="realName" @focus="()=>{this.inputFocusStatus_1 = true}" @blur="()=>{this.inputFocusStatus_1 = false}" :placeholder="!inputFocusStatus_1 ? '您的真实姓名' : ''"/>
            <div class="clearText" v-if="realName!=''" @click="()=>{this.realName = ''}"></div>
        </div>
        <div class="input_box">
            <div class="item_name" v-if="idCardNum!='' || inputFocusStatus_2">您的身份证号</div>
            <input name="idCardNum" type="text" v-model="idCardNum" @focus="()=>{this.inputFocusStatus_2 = true}" @blur="()=>{this.inputFocusStatus_2 = false}" :placeholder="!inputFocusStatus_2 ? '您的身份证号' : ''"/>
            <div class="clearText" v-if="idCardNum.replace(/\s/ig,'')!=''" @click="()=>{this.idCardNum = ''}"></div>
        </div>
        <div class="blank"></div>
        <a href="javascript:;" class="btn_submit animation" :class="{'disabled' : !(realName != '' && idCardNum != '')}" @click="submit">实名</a>


        <sunshineFooter></sunshineFooter>
        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>
        <smileLoading  :showSmileLoading="isShowSmileLoading"></smileLoading>

    </div>
</template>
<style src="assets/css/formPage.css">
</style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'
import sunshineFooter from '@/components/sunshineFooter'

export default {
    name: 'authentication',
    components:{informationLayer, sunshineFooter},//这里注册
    data(){
        return{
            realName : '',
            idCardNum : '',

            submitStatus : true,

            informationLayerContent : '',
            showLayerStatus : false,

            btnDisabledStatus : true,

            cburl : '',

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,

            tosatContent : '',
            tosatShow : '',
            isShowSmileLoading:false,
        }
    },
    created:function () {
        this.cburl = this.$route.query.cburl;
    },
    mounted : function(){
        var _this = this;
        var userInfo = this.utils.getUserInfo();
        // if(userInfo.isIdValify){
        //     _this.$refs.tosat.tosatShow({
        //         msg : '您已完成实名',
        //         time : 2
        //     }, function(){
        //         _this.$router.replace({
        //             name : 'home'
        //         })
        //     })
        // };
    },
    methods:{
        showLayer(msg){
            this.informationLayerContent = msg;
            this.showLayerStatus = true;
        },
        submit(){
            this.isShowSmileLoading=true;
            if(!this.submitStatus) return;
            if(this.realName == '' || this.idCardNum == ''){
              this.isShowSmileLoading=false;
              return;
            }
            var _this = this;
            var idCardNum = this.idCardNum.replace(/\s/ig,'')
            if(idCardNum == '' || idCardNum.length != 18){
                 this.isShowSmileLoading=false;
                 this.showLayer('身份证号码填写有误');
                return;
            }
            this.submitStatus = false;

            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/idVerify",
                data : JSON.stringify({
                    idCard : idCardNum,
                    realName : _this.realName
                }),
                complete : function(){
                    _this.submitStatus = true;
                    _this.isShowSmileLoading=false;
                },
                success : function(res){
                    if(res.code == '1'){
                        var routerData = {};

                        setTimeout(()=>{
                            _this.$router.push({
                                name : 'depositoryOpen',
                                query : {
                                    cburl : (_this.cburl ? _this.cburl : ''),
                                    isRegister : (_this.$route.query.isRegister ? _this.$route.query.isRegister : '')
                                }
                            })
                        },1600)
                    }else{

                        _this.informationLayerContent = res.message;
                        _this.showLayerStatus = true;
                    }
                }
            })
        },
    },
    watch : {
        idCardNum: function(val){
            this.idCardNum = val.replace(/^(\d{6})(?=\d)/, '$& ').replace(/^(\d{6}\s\d{8})(?=\d)/, '$& ');
        }
    }
}
</script>
