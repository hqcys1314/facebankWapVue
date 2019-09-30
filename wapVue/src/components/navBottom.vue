<template>
    <section class="nav" v-show="isNavShow">
        <ul>
            <li>
                 <router-link to="/home">
                    <a v-bind:class="{'on':isOn1}">
                        <!-- <i class="iconfont" :class="{'icon-icon_home_line' : !isOn1, 'icon-icon_home' : isOn1}"></i> -->
                        <span class="icon home"></span>
                        <p>首页</p>
                    </a>
                  </router-link>
            </li>
            <li>
               <router-link to="/loanList">
                  <a v-bind:class="{'on':isOn2}" >
                      <!-- <i class="iconfont" :class="{'icon-icon_lend_line' : !isOn2, 'icon-icon_lend' : isOn2}"></i> -->
                      <span class="icon invest"></span>
                      <p>出借</p>
                  </a>
                </router-link>
            </li>
            <li>
              <a v-bind:class="{'on':isOn4}" @click="toDiscovery" >
                  <!-- <i class="iconfont" :class="{'icon-icon_lend_line' : !isOn2, 'icon-icon_lend' : isOn2}"></i> -->
                  <span class="icon discovery"></span>
                  <p>发现</p>
              </a>
            </li>
            <li>
               <router-link to="/account">
                  <a v-bind:class="{'on':isOn3}">
                      <!-- <i class="iconfont" :class="{'icon-icon_my_line' : !isOn3, 'icon-icon_my' : isOn3}"></i> -->
                      <span class="icon my"></span>
                      <p>我的</p>
                  </a>
                </router-link>
            </li>
            <!-- <li>
                <a :href='"https://cms"+utils.CMSSET+".facebank.cn/safe.html"'>
                  <i class="iconfont icon-icon_security_line"></i>
                  <p>安全保障</p>
                </a>
            </li> -->
        </ul>
        <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>
    </section>
</template>

<script>
import {utils,Modal} from 'tools';
  import toastMessage from '@/components/toastMessage.vue' //导入吐丝提示
export default {
  name: 'navBottom',
  components:{toastMessage},
  props: ['isOn1','isOn2','isOn3','isOn4'],
  data(){
    return{
      curVersionNum:'0',
      isNavShow:true,
      isTmShow:false,//是否展示吐司
      tTime:2000,//吐司时间
      tMsg:'',
    }
  },
  created:function () {
    //读取cookies中的版本号及设备号
    if(utils.getCookie('curDevice')=='ios'||utils.getCookie('curDevice')=='android'){
         this.curVersionNum=parseInt(utils.getCookie('curVersion').replace(/\./g,""));
    }
    if(this.curVersionNum&&this.curVersionNum*1>274&&utils.getCookie('isShowAllWap')=='0'){
       this.isNavShow=false;
    }else{
       this.isNavShow=true;
    }
  },
  methods:{
      toDiscovery(){
          //window.location.href="https://promo"+utils.URLSET+".facebank.cn/discovery"
          this.utils.newWebViewAll('https://cgw'+utils.URLSET+'.facebank.cn/promo/activity/discover/index')
      }
  },
  update:function () {
    //读取cookies中的版本号及设备号
    if(utils.getCookie('curDevice')=='ios'||utils.getCookie('curDevice')=='android'){
         this.curVersionNum=parseInt(utils.getCookie('curVersion').replace(/\./g,""));
    }
    if(this.curVersionNum&&this.curVersionNum*1>274&&utils.getCookie('isShowAllWap')=='0'){
       this.isNavShow=false;
    }else{
       this.isNavShow=true;
    }
  }
}

</script>
<style scoped>
    /*底部菜单栏*/
    .nav {
        position: fixed;    z-index: 4;
        bottom: -1rem;padding-bottom: 1rem;
        width: 100%;
        /* border-top: 1px #DFE3EB solid; */
        box-shadow: 0 0 6px rgba(157,160,166,.3);
        background-color: #ffffff;
        left: 0;
    }
    .nav ul {
        overflow: hidden;
        padding-top: 0.5rem;
    }
    .nav ul li {
        float: left;
        width: 25%;
        text-align: center;
    }
    .nav ul li a {
        display: block;
    }
    .nav ul li a i {
        font-size: 1.5rem;
        color: #9DA0A6 ;
    }
    .nav ul li a p {
        font-size: 0.6875rem;
        height:1.5rem;line-height:1.5rem;
    }
    /* .nav ul li a.on {
        color: #2C323D;
    } */
    .nav ul li a.on {
        //color: #F0484E;
        color: #2C323D;
    }
    .nav ul li a.on i {
        color: #2C323D;
    }
    .nav ul li a span.icon{width:1.625rem;height:1.625rem;display:block;margin:0 auto;background:no-repeat center center/100% 100%;}
    .nav ul li a span.home{background-image:url(~assets/images/nav_home_normal.png)}
    .nav ul li a.on span.home{background-image:url(~assets/images/nav_home.png)}
    .nav ul li a span.invest{background-image:url(~assets/images/nav_invest_normal.png)}
    .nav ul li a.on span.invest{background-image:url(~assets/images/nav_invest.png)}
    .nav ul li a span.my{background-image:url(~assets/images/nav_my_normal.png)}
    .nav ul li a.on span.my{background-image:url(~assets/images/nav_my.png)}
    .nav ul li a span.discovery{background-image:url(~assets/images/nav_discovery_normal.png)}
    .nav ul li a.on span.discovery{background-image:url(~assets/images/nav_discovery.png)}
</style>
