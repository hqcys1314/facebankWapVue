<template>
  <div class="repaymentCalendaTransDetail" ref="rctList">
      <div class="contentss" ref="contentss">
        <div class="rewardMoney">
          <p class="p3">
            <span class="span1">{{searchMonthV}}月{{searchDayV}}日</span>
          </p>
        </div>


        <div class="repayMoney">
           <p class="p-t">{{dayProcessDetail.orderName}}</p>
           <p class="p2""><span class="span1">{{transTotal| currency}}</span>  </p>
           <p class="p1">债转获得金额(元)</p>
        </div>
        <div class="amdList">
            <ul>
              <li v-for="(item,index) in dayProcessList">
                   <p class="p1" style="color:#2B313D">
                       <span class="span1">{{item.amount }}元</span>
                       <span class="span2">{{item.state}}</span>
                   </p>

                   <p class="p2">
                      <span class="span1">债权编号-{{item.creditNum}}</span>
                     <span class="span2">{{item.createDate}}</span>
                   </p>
              </li>
            </ul>
            <loadingMoreData  v-if="dayProcessList.length >= 10" style="margin-left:-4%;background:#F2F4F8;padding-top:1rem;" :isLoading="isLoading" :reloadDataStatus="reloadDataStatus" :enLong="enLong" v-on:getresultData="getDayProcessList"></loadingMoreData>
        </div>
    </div>
  </div>
</template>
  <style scoped src="./repaymentCalendaTransDetail.less" lang="less"></style>

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

      isLoading:true,
      reloadDataStatus:false,
      isDisable:true,
      enLong:false,
    };
  },
  created:function () {
     this.searchDayV=this.$route.query.searchDay;
     this.searchMonthV=this.$route.query.searchMonth;
     this.searchYearV=this.$route.query.searchYear;
     this.orderId=this.$route.query.orderId;
     this.transTotal=this.$route.query.transTotal;
     this.getDayProcessList();
     this.getDayProcessDetail();
  },
  mounted() {
    this.$refs.rctList.addEventListener('scroll', ()=>{
        var domHeight=this.$refs.contentss.clientHeight;
        var scrollTop=this.$refs.rctList.scrollTop;
        var seeHeight=this.$refs.rctList.clientHeight;
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

      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/repayCalendar/transferOrder/creditList?orderId="+_this.orderId,
          type:'get',
          complete:function(){
             _this.isLoading=false;
             if(_this.dayProcessList.length>=10){
               _this.enLong=true;
             }
          },
          success : function(res){
              _this.isDisable=true;
              if(res.code==1){
                if(res.data){
                  res.data.map(function(item){
                       _this.dayProcessList.push(item);
                   })
                   _this.reloadDataStatus=false;
                   if (res.data.length > 0 && res.data.length == 10) {
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
