<template>
  <div class="creditorBuyRecord" v-cloak>
      <div v-if="recordListData.length > 0">
         <div class="buy-list" v-for="item in recordListData">
      		<div class="right">￥{{toFixed(item.amount)}}</div>
      		<div class="left">
      			<p class="number">{{item.nickName}}</p>
      			<p class="date">{{item.investTime}}</p>
      		</div>
      	</div>
      	<div class="more" v-if="showMoreBtn" v-on:click="getRecordlist(true)">点击加载更多 >></div>
    </div>
    <empty v-else text="暂无记录"></empty>
    <loading :show.sync="showLoading"></loading>
  </div>
</template>

<style scoped>
body{background-color: #FFFFFF;}
.buy-list{margin-left: 5%;height: 2.5rem;padding: 1rem 0;border-bottom: 1px #DFE3EB solid;padding-right: 5%;}
.buy-list .left{float:left;}
.buy-list .left .number{font-size:0.938rem;}
.buy-list .left .date{font-size: 0.688rem;}
.buy-list .right{float:right;font-size:0.938rem;color:#f0484e;line-height: 2.5rem;height: 2.5rem;}
.more{margin: 2rem 0;text-align: center;background-color: #f5f5f5;color: #848999;font-size: 0.85rem;height: 2rem;line-height: 2rem;}
.empty{line-height:10rem;text-align:center;}
</style>

<script>
import * as constants from './creditorBuyRecordConstants';
import {utils} from 'tools';
import loading from '@/components/loading'
export default {
    name:
    constants.NAME,
    data() {
        return {
            recordListData: [],
            showMoreBtn: false,
            showLoading : false,
            pageNum: 1,
            pageSize: 10
        }
    },
    components: {loading},
    created: function() {
        this.translateId = this.$route.query.translateId;
        this.getRecordlist(false);
    },
    methods: {
        getRecordlist: function(updata) {
            var _this = this;
            if(!updata) _this.showLoading = true;
            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/translate/creditBuyRecordList',
                data: '{"transferId":"' + _this.translateId + '","pageSize":"' + _this.pageSize + '", "pageNum":"' + _this.pageNum + '"}',
                complete : function(){
                    _this.showLoading = false;
                },
                success: function(res) {
                    if(!updata) _this.showLoading = false;
                    if (res.code == 1) {
                        _this.recordListData.push.apply(_this.recordListData, res.data.orderList)
                        if (res.data.orderList.length > 0) {
                            _this.showMoreBtn = true;
                            _this.pageNum++;
                            if(res.data.orderList.length < 10) _this.showMoreBtn = false;
                        } else {
                            _this.showMoreBtn = false;
                        }
                    }
                }
            })
        },
        toFixed: function(number, digit) {
            var numbers = number || 0,
                digits = digit || 2;
            return Number(numbers).toFixed(digits);
        }
    }
}
</script>
