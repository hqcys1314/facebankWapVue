<template>
  <div id="productOrderList">
      <div v-if="orderList.length > 0">
        <div class="buy-list" v-for="items in orderList" >
            <div class="right">￥{{items.amount | amount}}</div>
            <div class="left"><p class="number">{{items.nickName}}</p><p class="date">{{items.investTime}}</p></div>
        </div>
        <div class="more" v-show="showloadMore" v-on:click="getList(true)">
          点击加载更多 >>
        </div>
    </div>
    <empty v-else text="暂无购买记录"></empty>
    <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>

  </div>
</template>

<style scoped src="./productOrderList.css">
</style>
<script>
import loading from '@/components/loading'
import {utils} from 'tools';

export default {
  name: 'productOrderList',
  data () {
        return {
          pageSize:'10',
          pageNum : 1,
          productId:'',
          orderList:[],
          showloadMore : true,
          loadingLayerStatus : false,
        }
    },
    filters : {
        formatAmount(val){
            return val.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
        }
    },
    components:{loading},//这里注册
    created:function () {
        this.productId = this.$route.query.productId;
        this.getList();
    },
    methods: {
      //点击查看更多
      getList: function (isUpdata) {
          var _this = this;
          if(!isUpdata) _this.loadingLayerStatus = true;
          var data = {
              pageSize : _this.pageSize,
              pageNum : _this.pageNum,
              productId : _this.productId
          };
          $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/product/productBuyRecordList',
              data : JSON.stringify(data),
              complete : function(){
                  _this.loadingLayerStatus = false;
              },
              success : function(rs){
                  if(!isUpdata) _this.loadingLayerStatus = false;
                  if(rs.code == '1'){
                      if(rs.data.orderList.length > 0){
                          _this.orderList.push.apply(_this.orderList, rs.data.orderList)
                          _this.pageNum++;
                          if(rs.data.orderList.length < 10) _this.showloadMore = false;
                      }else{
                          _this.showloadMore = false;
                      }
                  }
              }
          })
      },
    }
}
</script>
