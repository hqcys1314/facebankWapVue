<template>
  <div class="repaymentCalendarDetail" ref="amdList">
      <div class="contentss" ref="contentss">
        <div class="rewardMoney">
          <p class="p3">
            <span class="span1">{{searchMonthV}}月{{searchDayV}}日</span>
          </p>
        </div>




        <div class="repayMoney">
           <p class="p-t">{{dayProcessDetail.orderName}}</p>
           <p class="p2" v-if="isNormal == 'true' || isNormal == true"><span class="span1">{{dayProcessDetail.infectRepayAmount| currency}}</span>  / {{dayProcessDetail.shouldRepayAmount| currency}}</p>
           <p class="p2" v-else="isNormal == 'false' || isNormal == false"><span class="span1">{{dayProcessDetail.infectRepayAmount| currency}}</span></p>
           <p class="p1" v-if="isNormal == 'true' || isNormal == true">已还金额(元) / 当日应还金额(元)</p>
           <p class="p1" v-else="isNormal == 'false' || isNormal == false">已还金额(元)</p>
        </div>


        <div class="repayDetail">
           <ul>
             <li v-if="dayProcessDetail.redpackageAmount*1>0">
                  <p class="p1" style="color:#2B313D">
                      <span class="span1">{{dayProcessDetail.redpackageRepayedAmount| currency}}  <em>/  {{dayProcessDetail.redpackageAmount| currency}}</em></span>
                      <span class="span3">红包加息</span>
                  </p>
                  <p class="p2">
                     <span class="span1">红包已还金额(元) / 红包当日应还金额(元)</span>
                  </p>
             </li>
             <li v-if="dayProcessDetail.activityPlanInterest*1>0">
                  <p class="p1" style="color:#2B313D">
                      <span class="span1">{{dayProcessDetail.activityRealInterest| currency}}  <em>/  {{dayProcessDetail.activityPlanInterest| currency}}</em></span>
                      <span class="span3">限时加息</span>
                  </p>
                  <p class="p2">
                     <span class="span1">限时加息已还金额(元) / 限时加息还款总额(元)</span>
                  </p>
             </li>

             <li v-if="dayProcessDetail.vipAmount*1>0">
                  <p class="p1" style="color:#2B313D">
                      <span class="span1">{{dayProcessDetail.vipRepayedAmount| currency}}  <em>/  {{dayProcessDetail.vipAmount| currency}}</em></span>
                      <span class="span3">VIP加息</span>
                  </p>
                  <p class="p2">
                     <span class="span1">VIP加息已还金额(元) / VIP加息当日应还金额(元)</span>
                  </p>
             </li>

             <li v-if="dayProcessDetail.firstInterestAmount*1>0">
                  <p class="p1" style="color:#2B313D">
                      <span class="span1">{{dayProcessDetail.firstInterestRepayedAmount| currency}}  <em>/  {{dayProcessDetail.firstInterestAmount| currency}}</em></span>
                      <span class="span3">首购加息</span>
                  </p>
                  <p class="p2">
                     <span class="span1">首购加息已还金额(元) / 首购加息当日应还金额(元)</span>
                  </p>
             </li>

             <li v-if="dayProcessDetail.platformInterestAmount*1>0">
                  <p class="p1" style="color:#2B313D">
                      <span class="span1">{{dayProcessDetail.platformInterestRepayedAmount| currency}}  <em>/  {{dayProcessDetail.platformInterestAmount| currency}}</em></span>
                      <span class="span3">平台加息</span>
                  </p>
                  <p class="p2">
                     <span class="span1">平台加息已还金额(元) / 平台加息当日应还金额(元)</span>
                  </p>
             </li>
           </ul>

        </div>
        <div class="amdList">
            <ul>
              <li v-for="(item,index) in dayProcessList">
                   <p class="p1" v-if="item.state=='100'" style="color:#2B313D">
                       <span class="span1">{{item.repayAmount }}元</span>
                       <span class="span2">待还款</span>
                   </p>
                   <p class="p1" v-if="item.state=='200'">
                       <span class="span1">{{item.repayAmount }}元</span>
                       <span class="span2" v-if="isNormal == 'true' || isNormal == true">已还款</span>
                       <span class="span2" v-else="isNormal == 'false' || isNormal == false">提前还款</span>

                   </p>
                   <p class="p2">
                      <span class="span1">债权编号{{item.id}}</span>
                     <span class="span2" v-if="item.state=='200'">{{item.repayDate}}</span>
                   </p>
              </li>
            </ul>
            <loadingMoreData  v-if="dayProcessList.length >= 10" style="margin-left:-4%;background:#F2F4F8;padding-top:1rem;" :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getDayProcessList"></loadingMoreData>
        </div>
    </div>
  </div>
</template>
<style scoped src="./repaymentCalendarDetail.less" lang="less"></style>
<script>
import {utils,globalVariable} from'tools'

export default {
  data() {
    return {
      isCctShowD:true,
      dayProcessList:[],
      searchYearV:'',
      searchMonthV:'',
      searchDayV:'',
      pageNum:'1',
      orderId:'',
      dayProcessDetail:'',
      isNormal:'true',

      isLoading:true,
      reloadDataStatus:false,
      isShowAmdlist:true,
      isDisable:true,
      enLong:false,
    };
  },
  created:function () {
     this.searchDayV=this.$route.query.searchDay;
     this.searchMonthV=this.$route.query.searchMonth;
     this.searchYearV=this.$route.query.searchYear;
     this.orderId=this.$route.query.orderId;
     this.isNormal = this.$route.query.isNormal;
     this.getDayProcessList();
     this.getDayProcessDetail();
  },
  mounted() {
    this.$refs.amdList.addEventListener('scroll', ()=>{
        var domHeight=this.$refs.contentss.clientHeight;
        var scrollTop=this.$refs.amdList.scrollTop;
        var seeHeight=this.$refs.amdList.clientHeight;
        if(domHeight-scrollTop<seeHeight*1+200){
            if(!this.isDisable) return;
            this.getDayProcessList();
        }
    })
  },
  methods: {
    getDayProcessList(){
      this.isLoading=true;
      this.reloadDataStatus=false;
      this.isDisable=false;
      var _this = this;
      var aimUrl = "dayProcessList";
      if (this.isNormal == 'false'||this.isNormal == false){
        aimUrl = "prePayDayProcessList";
      }
      //获取提现中列表
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/repayCalendar/"+aimUrl,
          data : '{"year":"'+_this.searchYearV+'","month":"'+_this.searchMonthV
          +'","day":"'+_this.searchDayV+'","pageNum":"'+_this.pageNum+'","orderId":"'+_this.orderId+'"}',
          complete:function(){
             _this.isLoading=false;
             if(_this.dayProcessList.length>=10){
               _this.enLong=true;
             }
          },
          success : function(res){
              _this.isDisable=true;
              if(res.code==1){
                if(res.data.repayProcessItemList){
                  res.data.repayProcessItemList.map(function(item){
                       _this.dayProcessList.push(item);
                   })
                   _this.reloadDataStatus=false;
                   if (res.data.repayProcessItemList.length > 0 && res.data.repayProcessItemList.length == 10) {
                       _this.pageNum++;
                   }else{
                       _this.isDisable=false;
                   }
                }
              }else{
                _this.reloadDataStatus=true;
              }

          },
          error:function(){
              _this.reloadDataStatus=true;
          }
      })
    },
    getDayProcessDetail(){
      var _this = this;
      var aimUrl = "dayProcessDetail";
      if ((this.isNormal == 'false'||this.isNormal == false)){
        aimUrl = "prePayDayProcessDetail";
      }
      //获取提现中列表
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/repayCalendar/"+aimUrl,
          data : '{"year":"'+_this.searchYearV+'","month":"'+_this.searchMonthV
          +'","day":"'+_this.searchDayV+'","pageNum":"'+_this.pageNum+'","orderId":"'+_this.orderId+'"}',
          success : function(res){
              if(res.code==1){
                  _this.dayProcessDetail=res.data;
              }
          }
      })
    },
  },

};
</script>
