<template>
  <div id="directRecordList">
  	<div class="directRecordList" v-cloak>
        <div class="switch_tab">
            <ul>
  		<li v-on:click="listTab(2)" v-bind:class="{current : tabIndex_2}"
      class="sensors-btn" sensors-name="直投列表_直投列表_持有中">持有中</li>
  		<li v-on:click="listTab(1)" v-bind:class="{current : tabIndex_1}"
      class="sensors-btn" sensors-name="直投列表_直投列表_已结清">已结清</li>
  	  </ul>
  </div>
  	  <div class="data_list" v-show="tabIndex_2">
  		  <ul v-if="getUserInvestSeparateRecordList.length > 0" id="directRecordList_1">
  			  <direct-record-list-li v-for="(item, index) in getUserInvestSeparateRecordList" :key="index" v-bind:list-item="item" />
  		  </ul>
          <empty v-if="loadListSuccess2 && getUserInvestSeparateRecordList.length == 0" text="暂无出借记录"></empty>
  		  <div class="more sensors-btn" v-on:click="getRecordList()" v-show="showLoadMore"
         sensors-name="直投列表_查看直投项目_持有中-点击加载更多">点击加载更多 >></div>
  	  </div>
  	  <div class="data_list" v-show="tabIndex_1">
    		  <a class="grapTips" v-on:click="goOldDirectRecord()" >查看历史直投项目</a>
    		  <ul v-if="getUserInvestSeparateRecordListOver.length > 0"  id="directRecordList_2">
    			  <direct-record-list-li v-for="(item, index) in getUserInvestSeparateRecordListOver" :key="index" v-bind:list-item="item" />
    		  </ul>
              <empty v-if="loadListSuccess3 && getUserInvestSeparateRecordListOver.length == 0" text="暂无出借记录"></empty>
  		  <div class="more sensors-btn" v-on:click="getRecordListOver()" v-show="showLoadMoreOver"
        sensors-name="直投列表_查看直投项目_已结清-点击加载更多">点击加载更多 >></div>
    	  </div>

  	</div>
    <smileLoading  :showSmileLoading.sync="loadingLayerStatus"></smileLoading>

  </div>
</template>

<style scoped src="./directRecordList.css">
</style>

<script>
import * as constants from './directRecordListConstants';
import directRecordListLi from '@/components/directRecordListLi';
import loading from '@/components/loading';
import {utils,globalVariable} from'tools'

export default {
  name: constants.NAME,
  data () {
    return {
      tabIndex_1 : false,
  	tabIndex_2 : true,

  	getUserInvestSeparateRecordListUrl : '/wap/getUserInvestSeparateRecordList',
  	getUserInvestSeparateRecordList : [],

  	getUserInvestSeparateRecordListOver : [],
  	orderType : "2",
  	pageSize : "10",
  	pageNum : 1,
  	pageNumOver : 1,
  	showLoadMore: false,
	loadListSuccess2 : false,
	loadListSuccess3 : false,
  	showLoadMoreOver: false,

    loadingLayerStatus : false,
    }
  },
  components:{directRecordListLi, loading},//这里注册
  created:function () {
   var hash = window.location.hash;
   if(hash){
     if(hash == '#2'){
       this.tabIndex_1=false;
             this.tabIndex_2=true;
     }else if(hash == '#1'){
       this.tabIndex_1=true;
             this.tabIndex_2=false;
     }
   }
   this.getRecordList();
   this.getRecordListOver();
  },
  computed: {

  },
  methods: {
    //tab键切换
    listTab (num) {
      if (num == 1) {
        this.tabIndex_1=true;
        this.tabIndex_2=false;
        window.location.hash='1'
          }
      else {
        this.tabIndex_1=false;
        this.tabIndex_2=true;
        window.location.hash='2'
        }
        this.pageNum = 1;
        this.pageNumOver= 1;
    },
    getRecordList(){
      var _this = this;
        _this.loadingLayerStatus = true;
  		$.ajax({
  			url : utils.AJAXDOMAINNAME+_this.getUserInvestSeparateRecordListUrl,
  			data : '{"type":3,"orderType":2,"pageNum":'+_this.pageNum+'}',
            error : function(){
                _this.loadingLayerStatus = false;
            },
  			success : function(res){
                _this.loadingLayerStatus = false;
  				_this.loadListSuccess2 = true;
  				if(res.code==1){
  					res.data.recordList.map(function(item){
  	                    _this.getUserInvestSeparateRecordList.push(item)
  	                })
  	              if(res.data.recordList.length > 0 && res.data.recordList.length == 10){
  	                _this.pageNum++;
  	                _this.showLoadMore = true;
  	              }else if(res.data.recordList.length < 10){
  	                _this.showLoadMore = false;
  	              }
  				}
  			}
  		})

    },
    getRecordListOver : function(){
		var _this = this;
        _this.loadingLayerStatus = true;
		$.ajax({
			url : utils.AJAXDOMAINNAME+ _this.getUserInvestSeparateRecordListUrl,
			data : '{"type":3,"orderType":1,"pageNum":'+_this.pageNumOver+'}',
            error : function(){
                _this.loadingLayerStatus = false;
            },
			success : function(res){
                _this.loadingLayerStatus = false;
				_this.loadListSuccess3 = true;
				if(res.code==1){
					res.data.recordList.map(function(item){
						item.orderState = 2;
	                    _this.getUserInvestSeparateRecordListOver.push(item)
	                })
	              if(res.data.recordList.length > 0 && res.data.recordList.length == 10){
	                _this.pageNumOver++;
	                _this.showLoadMoreOver = true;
	              }else if(res.data.recordList.length < 10){
	                _this.showLoadMoreOver = false;
	              }
				}
			}
		})
    },
    goOldDirectRecord:function(){
    	 window.location.href="/oldDirectRecord";
    }
  }
}

</script>
