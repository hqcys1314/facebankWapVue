<template>
  <div id="redbag" v-cloak>
    <div class="head" v-if="showHeaderR">
        <a href="javascript:history.go(-1)">
            <img src="~assets/wapFront/common/img/jiantou.png">
        </a>
        我的红包<a :href="'https://cms'+utils.CMSSET+'.facebank.cn/redbaginstruc.html'" class="new1">使用说明</a>
    </div>

    <div v-if="redbagListResult.length*1>0">
       <div v-for="item in redbagListResult">
    			<div class="redPart redPart_1" v-if="item.bonusModel==2"  v-on:click="utils.toAutoInvestMatchPage()">
    			    <div class="rp_1">
    			        <p class="left">
    			            <span class="span1">{{item.bonusTitle}}</span>
    			            <span class="span2">+{{item.bonusValue}}<font>%</font></span>
    			        </p>
    			        <p class="right">
    			            <span class="span1">出借期限：≥{{item.bonusEnableDate}}天</span>
    			            <span class="span2" v-if="item.bonusEnableMoney>0">出借金额：&ge;
                         <font v-if="item.bonusEnableMoney>=10000">{{(item.bonusEnableMoney/10000)}}万</font>
                         <font v-if="item.bonusEnableMoney<10000">{{item.bonusEnableMoney}}元</font>
    			            </span>
                      <span class="span2" v-else>出借金额：无限制
                      </span>
                      <span class="span3">适用产品：
                               <span v-if="item.bonusEnableProduct.indexOf('1')>=0">散标</span>
                               <span v-if="item.bonusEnableProduct.indexOf('2')>=0"><font v-if="item.bonusEnableProduct.indexOf('1')>=0">/</font>智能推荐</span>
                     </span>

    			        </p>
    			    </div>
    			    <p class="p3">
    			        <img src="//static.facebank.cn/static/wapFront/myAccount/img/jiaxi_bian.png">
    			    </p>
    			    <p class="p4"><span class="span1">有限期：{{item.bonusValidity}}</span></p>
    			</div>

    			<div class="redPart redPart_2" v-if="item.bonusModel==1" v-on:click="utils.toAutoInvestMatchPage()">
    			    <div class="rp_1">
    			        <p class="left">
    			            <span class="span1">{{item.bonusTitle}}</span>
    			            <span class="span2">{{item.bonusValue}}<font>元</font></span>
    			        </p>
    			        <p class="right">
    			            <span class="span1">出借期限：≥{{item.bonusEnableDate}}天</span>
    			            <span class="span2" v-if="item.bonusEnableMoney>0">出借金额：&ge;
                          <font v-if="item.bonusEnableMoney>=10000">{{(item.bonusEnableMoney/10000)}}万</font>
                          <font v-if="item.bonusEnableMoney<10000">{{item.bonusEnableMoney}}元</font>
                      </span>
                      <span class="span2" v-else>出借金额：无限制
                      </span>
                      <span class="span3">适用产品：
                               <span v-if="item.bonusEnableProduct.indexOf('1')>=0">散标</span>
                               <span v-if="item.bonusEnableProduct.indexOf('2')>=0"><font v-if="item.bonusEnableProduct.indexOf('1')>=0">/</font>智能推荐</span>
                     </span>
    			        </p>
    			    </div>
    			    <p class="p3">
    			        <img src="//static.facebank.cn/static/wapFront/myAccount/img/fanx_bian.png">
    			    </p>
    			    <p class="p4"><span class="span1">有限期：{{item.bonusValidity}}</span></p>
    			</div>
    	</div>
   </div>
     <div  v-else>
         <div class="no_hb_1">
             <img src="//static.facebank.cn/static/wapFront/myAccount/img/no_hongbao.png">
         </div>
         <div class="no_hb_2">
             <p class="p1">当前没有可用红包哦</p>
             <p class="p2">特殊情况红包发送可能有所延迟</p>
         </div>
     </div>
  </div>
</template>
<style scoped src="./redbag.css">
</style>
<script>
    import {utils,globalVariable} from'tools'
    export default {
      name: 'redbag',
      data () {
            return {
                showHeaderR: true,
              redbagJsonUrl:'/wap/redpackage/list',
              redbagListResult:'',
              pageNum:'1',
              pageSize:'100',
            }
        },
        components:{},//这里注册
        created:function () {
            this.showHeaderR = !utils.getCookie('curDevice') ? true : false;
          var _this = this;
          $.ajax({
              url : utils.AJAXDOMAINNAME+"/wap/redpackage/list",
              data:'{"type":"0","pageNum":'+_this.pageNum+',"pageSize":'+_this.pageSize+'}',
              success : function(res){
                  if(res.code==1){
                     _this.redbagListResult=res.data.redPackageDtoList;
                  }
              }
          })

        },
        methods: {

        }
  }
</script>
