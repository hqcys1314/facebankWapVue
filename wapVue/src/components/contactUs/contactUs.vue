<template>
    <div class="contactUs" :class="{'static' : hasStatic}">
        <div class="item">
            <span class="icon tel"></span>
            <a href="tel:4008-900-766">4008-900-766</a>
            <p>（工作日8:00-20:00）</p>
        </div>
        <div class="item">
            <span class="icon weixin"></span>
            <a :href="'https://cms'+utils.CMSSET+'.facebank.cn/weixin_kf.html'">
                “笑脸平台”
                <p>（微信中搜索关注）</p>
            </a>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'contactUs',
        props : ['float'],
        data(){
            return {
                hasStatic : false,
            }
        },
        created : function(){
            if(this.float != 'no'){
                this.resizeCountUs();
            }else{
                this.hasStatic = true;
            }
        },
        mounted : function(){
            var _this = this;
            window.addEventListener('resize', function(){
                if(_this.float != 'no'){
                    _this.resizeCountUs()
                }else{
                    this.hasStatic = true;
                }
            }, false)
        },
        methods : {
            resizeCountUs : function(){
                var winHeight = window.innerHeight;
                //alert(winHeight+'|'+36.5 * (window.innerWidth / 750 * 32))
                //if(window.location.pathname == '/bindBankCard' || window.location.pathname == '/rechargeUI' || window.location.pathname == '/withdraw'){
                    this.hasStatic = true;
                    if(winHeight < 37.5 * (window.innerWidth / 750 * 32)){
                        this.hasStatic = true;
                    }else{
                        this.hasStatic = false;
                    }
                //}
            }
        }
    }
</script>
<style>
.contactUs{ display:block; position:absolute;width:19.625rem;margin-left:-9.8125rem;height:3.59375rem;bottom:1.75rem;left:50%;border:1px solid #DFE3EB;border-radius: 1000px;}
.contactUs.static{ position: static;margin:2rem auto;margin-bottom:1.8125rem}
.contactUs .icon{width:1.5625rem;height:1.5625rem;left:50%;margin-left:-.78125rem;position:absolute;top:-1.53125rem;background-repeat: no-repeat; background-position: center center;background-color:#FFFFFF;}
.contactUs .icon.weixin{background-image:url("~assets/wapFront/depository/icon_weixin.png");background-size:.875rem auto;}
.contactUs .icon.tel{background-image:url("~assets/wapFront/depository/icon_tel.png");background-size:.875rem auto;}
.contactUs .item{width:49%;height:2.03125rem;float:left; position: relative;margin-top:.75rem;padding-top:0.21875rem;border-right:1px solid #DFE3EB;line-height:1rem;font-size:.75rem;color:#F0484E; text-align:center;}
.contactUs .item a{color:#F0484E;}
.contactUs .item:last-child{border-right:0;}
.contactUs .item p{ display:bold;color:#848999;font-size:.625rem;}
</style>
