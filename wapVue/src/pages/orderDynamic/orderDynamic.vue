<template>
  <div class="investRecordDetail">
      <!--出借动态-->
      <div class="dynamic_box" ref="list_box">
          <ul>
              <div class="item_box" v-for="item in dynamicData">
                  <div class="item_dl style4">
                      <div class="item_title"><span>{{item.businessTimeDesc}}</span>{{item.subTitle}}</div>
                      <orderDynamicDetail :rankData.sync="rankData" :items="item"></orderDynamicDetail>
                  </div>
              </div>
          </ul>
          <!-- <div class="item_box">
            <div class="item_dl style4">
                <div class="item_title"><span>2018-08-09 11:00</span>出借金额1000元</div>
                <ul class="line">本次出借本金18,900元，累计回报89,90元<br>你已打败全国xxxx名理财君！继续加油哦～</ul>
                <ul>
                    <li>出借产品：智能推荐</li>
                    <li>出借期限：3个月</li>
                    <li>年化利率：6.8%</li>
                    <li>出借金额：10,000元</li>
                </ul>
                <div class="tips_area other">因1,235在第1期借款方提前已结清，实收利息比预期减少0.89元</div>
            </div>
          </div> -->

          <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
          <empty v-if="dynamicData.length == 0 && !fullScreenLoadingShow" text="暂无动态记录"></empty>
          <div class="loadMoreData" v-if="dynamicData.length > 0 && !allDataLoaded">
              <div :style="'display:'+(!reloadDataStatus && pageNum > 1 && !loadDataStatusOver ? 'block' : 'none')">
                  <div class="animation" ref="loadMore"></div>
                  <div class="font">加载中...</div>
              </div>
              <div v-if="reloadDataStatus">
                  <span>加载失败，点击重试</span>
                  <span class="reload" @click="getDataList()"></span>
              </div>
          </div>

          <div v-if="recommendData && orderType != 'autoBidding'">
              <h6>再来一笔吧</h6>
              <div class="order_info">
                  <p>
                      <span>{{recommendData.rate}}<em>%</em></span>
                      <i>年化利率</i>
                  </p>
                  <p>
                      <span>{{recommendData.termCount}}<em>{{recommendData.termUnit==1 ? '天' : recommendData.termUnit==3 ? '个月' : ''}}</em></span>
                      <i>期限</i>
                  </p>
                  <p>
                      <span>{{recommendData.remainAmount | formatNumber2}}<em>{{recommendData.remainAmount*1 < 10000 ? '' : '万元'}}</em></span>
                      <i>预计可投金额</i>
                  </p>
                  <a href="javascript:;" class="btns" @click="utils.toLoanlist()">出借</a>
              </div>
          </div>
      </div>
      <!--统一提示层-->
      <tipLayer ref="tipLayer"></tipLayer>
  </div>
</template>

<style src="assets/wapFront/common/css/investRecordDetail.css"></style>

<script>
import * as constants from './orderDynamicConstants';
import orderDynamicDetail from '@/components/orderDynamicDetail';
export default {
    name: constants.NAME,
    data() {
        return {
            dynamicData : [],
            rankData : '',
            pageNum : 1,

            recommendData : '',
            fullScreenLoadingShow : true,
            allDataLoaded : false,
            loadDataStatusOver : false,
            reloadDataStatus : false,

            downLoadAnimationStatus : false,
            netError : false,

            orderType : '',
        }
    },
    filters : {
        formatNumber2(num){
            if(num*1<10000){
                return '不足1万元';
            }else{
                var nums = new Number(num)
                //num = nums.toLocaleString()
                return parseInt((num/10000).toFixed(2)*100)/100;
            }
        }
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
    created: function() {
        var _this = this;
        this.orderType = this.$route.query.orderType;
        _this.getDataList();

        $.ajax({
              url : this.utils.AJAXDOMAINNAME+ '/wap/getRecommendProduct',
              data : JSON.stringify({
                  orderId : _this.$route.query.orderId
              }),
              success : function(res){
                  _this.recommendData = res.data;
              }
        })
    },
    methods: {
        getDataList(){
            var _this = this;
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
            $.ajax({
                  url : this.utils.AJAXDOMAINNAME+ '/wap/getNewOrderReports',
                  data : JSON.stringify({
                      orderId : _this.$route.query.orderId,
                      pageNum : _this.pageNum,
                  }),
                  error : function(){
                      _this.fullScreenLoadingShow = false;
                      _this.loadDataStatusOver = true;
                      _this.reloadDataStatus = true;
                      _this.netError = true;
                  },
                  success : function(res){
                      _this.fullScreenLoadingShow = false;
                      _this.loadDataStatusOver = true;
                      _this.reloadDataStatus = false;
                      if(res.code*1==1){
                          _this.rankData = res.data.ranking;
                          if(res.data.orderReportList && res.data.orderReportList.length > 0){
                              _this.dynamicData = _this.dynamicData.concat(res.data.orderReportList);
                              _this.pageNum++;
                          }else{
                              _this.allDataLoaded = true;
                          }
                      }else{
                          _this.allDataLoaded = true;
                          _this.$refs.tipLayer.showLayer(1, res.message);
                      }
                  }
            })
        }
    },
    components: {orderDynamicDetail}
}
</script>
