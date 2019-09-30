<template>
  <div class="orderList">
      <div class="switch_tab">
        <ul style="width:66.66%;margin:0 auto;">
          <li href="javascript:;" @click="switchTab(1)" :class="{'current' : tab==1}"><span>持有中({{orderCount}})</span><i></i></li>
          <li href="javascript:;" @click="switchTab(2)" :class="{'current' : tab==2}"><span>已完成({{orderCountOver}})</span><i></i></li>
        </ul>
      </div>
      <div class="order_list" ref="list_box">

          <ul>
              <li class="timeDeposit" v-for="item in getRecordListData">
                  <router-link :to="{ path: '/timeDepositRecordDetail', query: {orderId : item.orderId} }">
                      <div class="content">
                          <div class="title">
                              {{item.orderName}}
                              <span :class="'status status_' + item.orderState">{{orderTypeFont[item.orderState*1]}}</span>
                          </div>
                          <div class="items">
                              <p><span>{{utils.currency(item.investAmount)}}</span>出借本金(元)</p>

                              <p v-if="item.orderState*1 == 1"><span>{{item.remainDays}}</span>距锁定期解除</p>
                              <p v-if="item.orderState*1 == 2"><span>{{item.moreoverInterestRate*1 > 0 ? item.realRate : item.rate}}%</span>实际年化回报率</p>
                              <p v-if="item.orderState*1 == 5"><span>{{item.investTotalProfit}}</span>期待回报(元)</p>

                              <p v-if="item.orderState*1 == 1"><span>{{utils.currency(item.investTotalProfit || '0.00')}}</span>预期回报(元)</p>
                              <p v-if="item.orderState*1 == 2"><span class="over">{{utils.currency(item.realTotalProfit || '0.00')}}</span>实际总回报(元)</p>
                              <p v-if="item.orderState*1 == 5"><span>{{utils.currency(item.realTotalProfit || '0.00')}}</span>已到账金额(元)</p>
                          </div>
                      </div>
                  </router-link>
                  <div class="tips_area normal" v-if="item.orderState*1 == 1">出借成功，到期时间{{handlerDate(item.endInterestDate)}}</div>
                  <div class="tips_area" v-if="item.orderState*1 == 5">正在退出中，历史同期退出时间约3个工作日</div>
                  <div class="tips_area normal" v-if="item.orderState*1 == 2">本息已全部到账，实际退出完成日{{handlerDate(item.repaymentDate)}} <span class="icon icon_tips" @click="showDetailLayer(item)"></span></div>
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
      <footerButtonToLoanList v-if="!(getRecordListData.length == 0 && !fullScreenLoadingShow)&&!isNoNet&&!isTimeOut" text="继续出借"></footerButtonToLoanList>
      <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
      <div class="layer_style" id="orderLayer" v-if="orderDetailLayerShow">

          <div class="layer_content" style="text-align:left;line-height:1.5rem;">
              <div class="tips_title">
                  <div class="desc" v-if="currentOrderIsMoreRate">超预期完成，实际总回报(元)</div>
                  <div class="desc" v-else>符合预期，实际总回报(元)</div>
                  <div class="money">
                      {{utils.currency(currentOrder.realTotalProfit || '0.00')}}
                      <i v-if="currentOrderIsMoreRate"></i>
                  </div>
                  <div class="upTips" v-if="currentOrderIsMoreRate">比预期总回报{{utils.currency(currentOrder.investTotalProfit)}}元多赚了<span>{{utils.currency(currentOrder.moreoverInterest)}}</span>元，赞一个！</div>
                  <div class="isOver"></div>
              </div>
              <dl>
                  <dt>出借金额(元)</dt>
                  <dd>{{utils.currency(currentOrder.investAmount)}}</dd>
              </dl>
              <dl>
                  <dt>产品期限({{currentOrder.termUnit*1 == 1 ? '天' : currentOrder.termUnit*1 == 3 ? '月' : ''}})</dt>
                  <dd>{{currentOrder.termCount}}</dd>
              </dl>
              <dl>
                  <dt>实际年化回报率</dt>
                  <dd>{{currentOrderIsMoreRate ? currentOrder.rate : currentOrder.realRate}}%<span v-if="currentOrderIsMoreRate">+{{currentOrder.moreoverInterestRate}}%</span></dd>
              </dl>
          </div>
          <div class="layer_btn one">
              <a href="javascript:;" @click="closeDetailLayer()">我知道了</a>
          </div>
      </div>
      <div class="layerMask" v-show="orderDetailLayerShow"></div>
  </div>
</template>
<style src="assets/css/order.css"></style>
<style scoped="">
.order_list li .content .items{background:none;}
</style>
<script>
  import * as constants from './timeDepositRecordListConstants';
 // import subjectInvestRecordLi from '@/components/subjectInvestRecordLi';
import orderDynamicDetail from '@/components/orderDynamicDetail';
  export default {
    name: constants.NAME,
    data() {
      return {
          tab : 1,
          getRecordListData : [],
          pageNum : 1,

          dataType : 1,
          loadDataStatusOver : true,
          allDataLoaded : false,
          reloadDataStatus : false,

          downLoadAnimationStatus : false,
          netError : false,

          currentOrder : '',
          currentOrderIsMoreRate : false,
          orderDetailLayerShow : false,
          sortType : 1,
          sortAscDesc : 2,
          sortInvestingAscDesc : 1,
          sortOverAscDesc : 1,
          fullScreenLoadingShow : true,
          listTips : '',

          curOrderRank : 0,
          orderCount : 0,
          orderCountOver : 0,

          orderTypeFont: ['系统出借中', '持有中', '已完成', '流标', '提前还款', '退出中'],
          repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],//固定账单日要求展示位等额本息

          ajax : '',
          isTimeOut:false,
          isNoNet:true,
      }
    },
    created:function () {
        var _this = this;
        var hash = window.location.hash;
        setTimeout(function(){
            if(hash.indexOf('#') > -1){
                _this.switchTab(hash.split('#')[1] ? hash.split('#')[1] : 0);
            }else{
                _this.switchTab(1)
            }
        },100)
            //_this.getDataList();


    	//this.getRecordListOver();
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
        switchTab(tab){
            this.tab = tab;
            this.getRecordListData = [];
            this.allDataLoaded = false;
            if(typeof this.ajax.abort == 'function') this.ajax.abort();
            if(this.tab == 2){
                this.dataType = 2;
                this.fullScreenLoadingShow = true;
                this.pageNum = 1;
                this.getDataList();
                window.location.hash="2"

            }else{
                this.dataType = 1;
                this.fullScreenLoadingShow = true;
                this.pageNum = 1;
                this.getDataList();
                window.location.hash="1"

            }
        },
        // switchData : function(){
        //     this.dataType = (this.dataType == 2 ? 1 : 2);
        //     this.sortAscDesc = 2;
        //     this.sortType = 1;
        //     this.allDataLoaded = false;
        //     this.pageNum = 1;
        //     this.getRecordListData = [];
        //     this.fullScreenLoadingShow = true;
        //     this.getDataList();
        // },
        handlerDate : function(date){
            var d = date.split('(')[0];
            return d.replace('-', '年').replace('-', '月') + '日';
        },
        changeSort:function(sortType){
            var _this = this;
            _this.sortAscDesc = (_this.sortAscDesc == 1 ? 2 : 1);
            _this.sortType = sortType;
            _this.pageNum = 1;
            _this.getRecordListData = [];
            _this.fullScreenLoadingShow = true;
            _this.getDataList();

        },
        showDetailLayer : function(item){
            this.orderDetailLayerShow = true;
            this.currentOrder = item;
            this.currentOrderIsMoreRate = item.moreoverInterestRate*1 > 0 && item.moreoverInterest*1;
        },
        closeDetailLayer:function(){
            this.orderDetailLayerShow = false;
            this.currentOrder = '';
        },
        getDataList : function(){
            var _this = this;
            var api = '';
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
    		this.ajax = $.ajax({
    			  url : this.utils.AJAXDOMAINNAME+ '/wap/order/sdqOrderList',
                  data : JSON.stringify({
                      //kind : 3,//等于3代表定存订单
                      type : _this.dataType, //1持有中 2已结清
                      pageNum : _this.pageNum,
                      orderByType : 2,//1-asc 顺序 2-desc 逆序
                      orderByClause : 1 //1-起息日,2-止息日
                  }),
                  error : function(XMLHttpRequest, textStatus){
                      _this.loadDataStatusOver = true;
                      _this.reloadDataStatus = true;
                      _this.fullScreenLoadingShow = false;
                      _this.netError = true;
                      if(textStatus == 'error'){
                        _this.isNoNet=true;
                        _this.isTimeOut=false;
                      }else if(textStatus == 'timeout'){
                        _this.isTimeOut=true;
                        _this.isNoNet=false;
                      }

                  },
    			  success : function(res){
                      _this.isNoNet=false;
                      _this.isTimeOut=false;
                      _this.loadDataStatusOver = true;
                      _this.reloadDataStatus = false;
                      _this.fullScreenLoadingShow = false;
                      if(res.code*1==1){
                          if(_this.pageNum == 1) {
                              _this.orderCount = res.data.orderCount || 0;
                              _this.orderCountOver = res.data.finishOrderCount || 0;
                          }
                          _this.getRecordListData = _this.getRecordListData.concat(res.data.list);
                          if((res.data.list.length*1 < 10 || res.data.list.length*1 == 0)){
                              _this.showLoadMore = false;
                              _this.allDataLoaded = true;
      	                  }else{
                            _this.showLoadMore = true;
                            _this.pageNum++;
                          }
    				  }
    			  }
    		})
        }
    }
  }
</script>
