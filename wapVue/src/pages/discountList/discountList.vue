<template>
  <div class="discountList" v-cloak>
        <table cellpadding="0" cellspacing="0">
            <tr class="thead">
                <td>还款在途资金(元)</td>
                <td>在途天数</td>
                <td>贴息金额(元)</td>
                <td>赠送时间</td>
            </tr>
            <tr v-for="item in subsidyList">
                <td>{{item.amount}}</td>
                <td>{{item.days}}</td>
                <td>{{item.subsidyAmount}}</td>
                <td>{{item.time}}</td>
            </tr>
        </table>
        <div class="discountListMore sensors-btn"  v-show="showLoadMore" v-on:click="discountNextPage()"
        sensors-name="wap已到账贴息记录-查看更多">点击加载更多</div>
  </div>
</template>

<style lang="less" src="./discountList.less"></style>

<script>
  import * as constants from './discountListConstants';
  import {utils,Modal} from 'tools';
  export default {
    name: constants.NAME,
    data() {
      return {
        subsidyList:[],
        showLoadMore:false,
        pageNum:'1',
      }
    },
    created:function () {
      this.discountNextPage();
    },
    methods: {
       discountNextPage(){
         var _this = this;
         _this.showLoadMore = false;
         $.ajax({
             url : utils.AJAXDOMAINNAME+"/wap/credit/subsidyList",
             data:'{"pageNum":"'+_this.pageNum+'"}',
             success : function(res){
                 if(res.code==1){
                     _this.pageNum++;
                     if(res.data.subsidyList !=null){
                       res.data.subsidyList.map(function(item){
                           _this.subsidyList.push(item);
                       })
                       if(res.data.subsidyList.length*1 < 10){
                           _this.showLoadMore = false;
                       }else{
                           _this.showLoadMore = true;
                       }
                     }

                 }
             }

         })
       }
    },
    components: {}
  }
</script>
