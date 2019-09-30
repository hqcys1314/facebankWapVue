<template>
  <div class="orderList" id="claimsTranRecordList">
      <div class="filter_bar">
          <a href="javascript:;" class="sort" :class="{'up': (sortAscDesc == 1 && sortType == 1), 'down': (sortAscDesc == 2 && sortType == 1)}" @click="changeSort(1)">出借时间</a>
          <a href="javascript:;" class="sort" :class="{'up': (sortAscDesc == 1 && sortType == 2), 'down': (sortAscDesc == 2 && sortType == 2)}" @click="changeSort(2)">结清时间</a>
          <a href="javascript:;" class="switch" :class="{'switch_change' : dataType == 2}" @click="switchData()">{{(dataType == 2) ? '已结清':'出借中'}}</a>
      </div>
      <div class="order_list" ref="list_box">
          <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
          <ul>
              <li v-for="item in getRecordListData">
                  <router-link :to="{ path: '/claimsTranRecordDetail', query: {orderId : item.orderId, creditId : item.creditId, isOldSys : item.isOldSys} }">
                      <div class="content" style="padding:1.375rem 1rem 1.125rem 0">
                          <div class="title">
                              {{item.orderName}}
                              <span class="status status_1">{{orderTypeFont[item.orderState]}}</span>
                          </div>
                          <div class="item_type">{{repaymentTypeFont[item.repaymentType]}}</div>
                          <div class="items">
                              <p><span>{{item.orderState * 1 == 0 ? '--' : item.investAmount}}</span>成功出借(元)</p>
                              <p><span>{{!item.hasRepayPrincipal?'--':item.hasRepayPrincipal}}</span>已收本金(元)</p>
                              <p><span>{{!item.hasRepayProfit?'--':item.hasRepayProfit}}</span>已收回报(元)</p>
                          </div>
                      </div>
                  </router-link>
              </li>
          </ul>
        <div class="empty_box" v-if="isNoNet">

        </div>
        <div class="empty_box" v-else-if="isTimeOut">
          <img style="width:11rem;" src="https://static.facebank.cn/static/wapFront/depository/img/noNet.png" alt="">
          <p class="strong" style="margin-top:1rem;">网络超时</p>
          <p style="margin-bottom:1rem;">请检查你的网络</p>
          <a href="#" class="btn_tpls">重试</a>
        </div>
        <div v-else-if="getRecordListData.length == 0 && !fullScreenLoadingShow" class="empty_box">
          <div class="img_box"><img src="//static.facebank.cn/static/wapFront/common/images/empty_record.png" /></div>
          <div class="font">暂无出借记录</div>
          <div class="btn_area">
            <a href="javascript:;" @click="utils.toLoanlist()" style="width:9rem" class="btn_tpls">去出借赚收益</a>
          </div>
        </div>

          <div class="loadMoreData" v-if="getRecordListData.length > 0">
              <span v-if="!reloadDataStatus && allDataLoaded && getRecordListData.length > 0 && pageNum != 1" class="font">已到页面底部</span>
              <div :style="'display:'+(!reloadDataStatus && pageNum > 1 && !loadDataStatusOver ? 'block' : 'none')">
                  <div class="animation" ref="loadMore"></div>
                  <div class="font">加载中...</div>
              </div>
              <div v-if="reloadDataStatus">
                  <span>加载失败，点击重试</span>
                  <span class="reload" @click="getDataList()"></span>
              </div>
          </div>
      </div>
  </div>
</template>
<style>
   #claimsTranRecordList .order_list{bottom:0;}
</style>
<!-- <style src="assets/wapFront/common/css/investRecordList.css"></style> -->
<style src="assets/css/order.css"></style>
<script>
  import * as constants from './claimsTranRecordListConstants';
import orderDynamicDetail from '@/components/orderDynamicDetail';
  export default {
    name: constants.NAME,
    data() {
      return {
        getRecordListData : [],
        pageNum : 1,

        dataType : 1,
        loadDataStatusOver : true,
        allDataLoaded : false,
        reloadDataStatus : false,

        downLoadAnimationStatus : false,
        netError : false,

        curOrderRank : 0,
        sortType : 1,
        sortAscDesc : 2,
        fullScreenLoadingShow : true,
        listTips : '',

        orderTypeFont : ['系统出借中', '计息中', '已结清'],
        repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],
        isTimeOut:false,
        isNoNet:true,
      }
    },
    created:function () {
        this.getDataList();
    },
    mounted : function(){

        var _this = this,
            box = this.$refs.list_box,
            ul = box.getElementsByTagName('ul')[0],
            boxHeight = 0,
            scrollTop=0,
            innerHeight = 0;
        this.$refs.list_box.addEventListener('scroll', function(e){
            if(_this.loadDataStatusOver && !_this.allDataLoaded && !_this.netError){
                boxHeight = box.offsetHeight;
                innerHeight = ul.clientHeight;
                scrollTop = parseInt(this.scrollTop);
                //if(boxHeight - (innerHeight - scrollTop) < 200){
                if( (innerHeight - scrollTop)-200 <= boxHeight){
                    _this.getDataList();
                    if(!_this.downLoadAnimationStatus){
                        lottie.loadAnimation({
                            container: _this.$refs.loadMore, // the dom element that will contain the animation
                            renderer: 'svg',
                            loop: true,
                            autoplay: true,
                            path: '/static/js/down_loading.json' // the path to the animation json
                        });
                        _this.downLoadAnimationStatus = true;
                    }
                    _this.loadDataStatusOver = false;
                }
            }
        })
    },
    methods: {

        switchData : function(){
            this.dataType = (this.dataType == 2 ? 1 : 2);
            this.sortAscDesc = 2;
            this.allDataLoaded = false;
            this.pageNum = 1;
            this.getRecordListData = [];
            this.fullScreenLoadingShow = true;
            this.getDataList();

        },
        changeSort:function(sortType){
            this.sortAscDesc = (this.sortAscDesc == 1 ? 2 : 1);
            this.sortType = sortType;
            this.pageNum = 1;
            this.getRecordListData = [];
            this.fullScreenLoadingShow = true;
            this.getDataList();
        },

        getDataList : function(){
            var _this = this;
            var api = '';
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
          var routeParame = {
            type : _this.dataType,
            pageNum : _this.pageNum,
            orderByType : _this.sortAscDesc,
            orderByClause : _this.sortType
          }
          var querys = [];
          for(var k in routeParame){
            querys.push(k+'='+routeParame[k])
          }

          $.ajax({
    			        url : this.utils.AJAXDOMAINNAME+ '/wap/order/transferOrders?'+querys.join('&'),
                  type:'get',
                  error : function(){
                    if(textStatus == 'error'){
                      _this.isNoNet=true;
                      _this.isTimeOut=false;
                    }else if(textStatus == 'timeout'){
                      _this.isTimeOut=true;
                      _this.isNoNet=false;
                    }

                    _this.loadDataStatusOver = true;
                    _this.reloadDataStatus = true;
                    _this.fullScreenLoadingShow = false;
                    _this.netError = true;
                  },
    			       success : function(res){
                   _this.isTimeOut=false;
                   _this.isNoNet=false;
                   _this.loadDataStatusOver = true;
                   _this.reloadDataStatus = false;
                   _this.fullScreenLoadingShow = false;
    				          if(res.code*1==1&&res.data){
                        _this.getRecordListData = _this.getRecordListData.concat(res.data);
                        if((res.data.length*1==0)){
                          _this.showLoadMore = false;
                          _this.allDataLoaded = true;
                        }else{
                          _this.showLoadMore = true;
                          _this.pageNum++;
                        }
                      }else{

                        _this.showLoadMore = false;
                        _this.allDataLoaded = true;
                      }

    			  }
    		})
        }
    },
    // watch : {
    //     sortType : function(val){
    //         this.sortAscDesc = 1;
    //     }
    // },
    //components: {autoInvestRecordLi}
    components: {orderDynamicDetail}
  }
</script>
