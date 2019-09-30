<template>
    <div id="homeBanner" class="swiper-container" v-bind:style="{height:heightVal}">
        <div class="swiper-wrapper">
            <!-- <a class="swiper-slide swiperClick" :swiperClick-Link='str.image_link' v-for="(str,index) in listImg"
            :style="{ backgroundImage: 'url(' + str.image_url + ')'}"></a> -->
            <!-- <a class="swiper-slide swiperClick" @click='toLink(str.image_link, str.bannertitle, (index+1))' v-for="(str,index) in listImg"
            :style="{ backgroundImage: 'url(' + str.image_url + ')'}"></a> -->
            <a class="swiper-slide swiperClick" :data-jumpurl="str.image_link" :data-bannertitle="str.bannertitle" :data-rankindex="(index+1)" v-for="(str,index) in listImg"
            :style="{ backgroundImage: 'url(' + str.image_url + ')'}"></a>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
</template>

<script>
    import {utils} from'tools';
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    export default {
        props: ['listImg','heightVal'],
        mounted(){
          /*$(document).on("click",'.swiperClick',function(){
             utils.newWebViewAll($(this).attr('swiperClick-Link'));
         })*/
        },
        updated() {
            var _this = this;
            var swiper = new Swiper('.swiper-container', {
                initialSlide :0,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                loop: true,
                speed: 600,
                autoplay: 3000,
                autoplayDisableOnInteraction:false,
            });
            swiper.on('click', function(event){
                let url = event.clickedSlide.dataset.jumpurl, // jumpurl是在swiper-slide中动态绑定的data-jumpUrl属性，值是从后台获取的跳转链接
                    title = event.clickedSlide.dataset.bannertitle,
                    rankindex = event.clickedSlide.dataset.rankindex;
                _this.toLink(url, title, rankindex)
            })
        },
        methods:{
            toLink : function(link, title, index){
                var _this = this;

                setTimeout(()=>{
                    _this.utils.newWebViewAll(link)
                },100)
            }
        }
    }
</script>

<style lang="less">
    #homeBanner.swiper-container {
        width: 100%;
        height: 5rem;

        .swiper-wrapper {
            width: 100%;
            height: 4.25rem;
        }
        .swiper-slide {
            background-position: center;
            background-size: cover;
            width: 100%;
            height: 4.25rem;overflow:hidden;
            img {
                width: 100%;
                height: 4.25rem;
            }
        }
        .swiper-pagination-bullets,
        .swiper-pagination-custom,
        .swiper-pagination-fraction{
            height:0.25rem;bottom:0;
        }
        .swiper-pagination-bullet {
            width:0.25rem;
            height: 0.25rem;
            display: inline-block;
            background: #2B313C;
            margin:0 .18rem !important;
            vertical-align: top;
        }
    }
</style>
