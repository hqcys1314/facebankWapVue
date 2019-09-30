<template>
      <div id="regularPlanRecord" v-cloak>
        <div class="listTab">
          <ul>
              <li  v-on:click="listTab(1)" class="sensors-btn" sensors-name="持有中">
                  <div v-bind:class="{'listTabOn': isA}">持有中</div></li>
              <li  v-on:click="listTab(2)" class="sensors-btn" sensors-name="已结清">
                  <div class="div1" v-bind:class="{'listTabOn': isB}">已结清</div>
              </li>
          </ul>
        </div>
        <div class="listShow1" v-show="isA">
            <empty text="暂无出借记录"></empty>
       </div>
       <div class="listShow2" v-show="isB">
           <empty v-if="finishGoodsList.length == 0" text="暂无出借记录"></empty>
         <div  v-for="order in finishGoodsList">
               <div class="plan">
                   <p class="p-title">
                       <span class="span-right" v-if="order.assetType==20"><img src="~assets/wapFront/invest/img/ic_guarantee@3x.png" class="yuhai-icon">安心互联网保险承保</span>
                       <span class="span3">{{order.productName}}</span>
                       <span class="span-icon" v-if="order.remark!=''">新手专享</span>
                   </p>
                   <p class="p-order">编号：{{order.fpOrderId}}<span class="span-date">结清日期:{{order.endInterestDate}}</span>
                   </p>
                   <div class="planLeft">
                       <ul>
                           <li>
                               <p class="p1 p-cl-red">{{order.rate|toFixed}}<span class="span-samll">%</span></p>
                               <p class="p2">年化利率</p>
                           </li>
                           <li>
                             <p class="p1 p-cl-red" v-if="order.termUnit == 1">{{order.termCount}}<span class="span-samll">天</span></p>
                             <p class="p1 p-cl-red" v-if="order.termUnit == 3">{{order.termCount}}<span class="span-samll">个月</span></p>
                             <p class="p2">期限</p>
                           </li>
                       </ul>
                   </div>
                   <div class="planRight">
                       <p class="p1"><span class="span-value">{{order.amount}}元</span>出借金额</p>
                       <p class="p2"><span class="span-value">{{order.allInterest}}元</span>预期回报
                         <img src="~assets/wapFront/common/img/tip_i.png" class="ic-tip-i" v-on:click="wanchengIc(order.fpOrderId,order.remark)">
                         </p>
                   </div>
                   <div class="clear"></div>
                   <p class="p-detail">
                       <a class="span-left border-left-line" v-bind:href="order.investContract">出借协议</a>
                       <router-link :to="{ path: '/claimsList', query: {orderStatus:order.bizStatus,orderId:order.fpOrderId} }">
                        <a class="span-left">债权明细</a>
                        </router-link>
                   </p>
               </div>


           </div>
         <div class="more" v-show="showLoadMore" v-on:click="finishOrderNextPage()">点击加载更多 >></div>
        </div>
        <div class="wapMc" v-show="wapMcTk"></div>
        <div class="wapPos"  v-show="oldUser">
          <div class="wapTip">
              <div class="div-value">
                 <p>借款利息
                      <span class="span-right"><font>{{oldTkList.basicInterest}}</font>元</span></p>
                 <p v-if="oldTkList.redPkgInterest != null && oldTkList.redPkgType == 1000">加息红包奖励({{oldTkList.redPkgRate }}%)
                       <span class="span-right"><font>{{oldTkList.redPkgInterest }}</font>元</span></p>
                 <p v-if="oldTkList.redPkgInterest != null && oldTkList.redPkgType == 1010">返现红包奖励
                       <span class="span-right"><font >{{oldTkList.redPkgInterest}}</font>元</span></p>
                 <p v-if="oldTkList.vipInterest != null && oldTkList.vipInterest > 0">ViP加息奖励({{oldTkList.vipRate }}%)
                       <span class="span-right"><font>{{oldTkList.vipInterest}}</font>元</span></p>
                 <p v-if="oldTkList.firstInterest != null && oldTkList.firstInterest > 0">首购加息奖励({{oldTkList.firstRate}}%)
                       <span class="span-right"><font>{{oldTkList.firstInterest }}</font>元</span></p>
               </div>
              <p class="p3" v-on:click="closeTk()">
                  知道了
              </p>
          </div>
        </div>
        <div class="wapPos" v-show="newUser">
            <div class="wapTip">
                <div class="p-title"><img src="//static.facebank.cn/static/wapFront/invest/img/ic_decorate@2x.png"></div>
                <div class="cash">
                    <span class="span1">{{newTkList.basicInterest}}</span><span class="span2">元</span>
                    <p>新手专享奖励</p>
                </div>
                <p class="p3" v-on:click="closeTk()">
                    知道了
                </p>
            </div>
        </div>
        <loading :show.sync="loadingLayerStatus"></loading>
      </div>
</template>

<style scoped src="./regularPlanRecord.css">
</style>
<script>
import {utils} from 'tools';
import loading from '@/components/loading';

    export default {
      name: 'regularPlanRecord',
      data () {
            return {
              finishGoodsList:[],

              pageSize:'10',
              holdCurrPage:'1',
              finishCurrPage:'1',
              wapMcTk:false,
              newUser:false,
              oldUser:false,
              newTkList:[],
              oldTkList:[],
              isA:true,
              isB:false,
              isLxShow:false,
              showLoadMore:false,

              loadingLayerStatus : false,
            }
        },
        components:{loading},//这里注册
        created:function () {
          this.finishOrderNextPage();
        },
        computed: {

        },
        methods: {
          //tab键切换
          listTab:function (num) {

              if (num == 1) {
                  this.isA=true;
                  this.isB=false;
              }
              else {
                  this.isA=false;
                  this.isB=true;

              }
          },
          finishOrderNextPage:function ()
            {
              var _this = this;
              _this.loadingLayerStatus = true;
              $.ajax({
                  url : utils.AJAXDOMAINNAME+"/wap/repaymentOrderNextPage",
                  data: '{"currPage":' + _this.finishCurrPage +'}',
                  error : function(){
                      _this.loadingLayerStatus = false;
                  },
                  success : function(res){
                      _this.loadingLayerStatus = false;
                      if(res.code==1){
                        _this.finishCurrPage++;
                         res.data.map(function(item){
                              _this.finishGoodsList.push(item);
                          })
                          if(_this.finishGoodsList!=[]&&_this.finishGoodsList!=''){
                            _this.isLxShow=false;
                          }
                          if(res.data.length*1 < 10){
                                    _this.showLoadMore = false;
                          }else{
                                    _this.showLoadMore = true;
                          }
                      }else {
                        _this.isLxShow=true;
                      }

                  }

              })

            },

             wanchengIc:function(orderId,rm){
                 if(rm!=''){
                     let list1=this.finishGoodsList.filter(item=>{
                       return item.fpOrderId==orderId;
                     })
                     this.newTkList=list1[0];
                     this.newUser=true;
                     this.wapMcTk=true;

                 }else {
                       let list2=this.finishGoodsList.filter(item=>{
                         return item.fpOrderId==orderId;
                       })
                       this.oldTkList=list2[0];
                       this.oldUser=true;
                       this.wapMcTk=true;

                 }
             },
             closeTk:function(){
                this.newUser=false;
                this.oldUser=false;
                 this.wapMcTk=false;
             }

           }
     }
</script>
