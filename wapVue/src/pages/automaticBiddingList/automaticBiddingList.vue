<template>
    <div id="automaticBiddingList" :class="{'whiteBack' : orderList.length == 0}" class="autoBiddingList" ref="list_box" v-cloak>
        <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
        <div ref="listArea">
            <section v-for="(item, index) in orderList" v-if="item.autoBiddingOrders.length > 0">
                <h2 v-if="isOpen && index == 0 && (new Date().getTime() - item.endTime*1) < 120000">开启时间 {{item.duration}}天<span>{{item.startTime | formatDate}} - 至今</span></h2>
                <h2 v-else>开启时间 {{item.duration}}天<span>{{item.startTime | formatDate}} - {{item.endTime | formatDate}}</span></h2>
                <dl v-for="li in item.autoBiddingOrders" @click="toDetail(li.orderId, li.creditId)">
                    <dt v-html="formatDate2(li.createTime)"></dt>
                    <dd>
                        <i class="iconfont icon-ic_rightarrow"></i>
                        <em>{{stateText[li.bizStatus/100]}}</em>
                        出借{{li.amount}}元
                    </dd>
                </dl>
            </section>
            <!-- <section>
                <h2>开启时间 1天<span>2018.10.21 - 2018.10.25</span></h2>
                <dl>
                    <dt>23<span>/12</span></dt>
                    <dd>
                        <i class="iconfont icon-ic_rightarrow"></i>
                        <em>计息中</em>
                        出借1200.00元
                    </dd>
                </dl>
            </section>
            <section>
                <h2>开启时间 1天<span>2018.10.21 - 2018.10.25</span></h2>
                <dl>
                    <dt>23<span>/12</span></dt>
                    <dd>
                        <i class="iconfont icon-ic_rightarrow"></i>
                        <em>计息中</em>
                        出借1200.00元
                    </dd>
                </dl>
            </section> -->
        </div>
        <empty v-if="orderList.length == 0 && !fullScreenLoadingShow" text="暂无记录"></empty>
        <div class="loadMoreData" v-if="orderList.length > 0">
            <span v-if="!reloadDataStatus && allDataLoaded && orderList.length > 0 && pageNum != 1" class="font">已到页面底部</span>
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
</template>
<style src="../automaticBidding/automaticBidding.css">
</style>
<script>
export default {
    name: 'automaticBiddingList',
    data(){
        return {
            isOpen : false,

            orderList : [],
            stateText : ['','系统出借中', '计息中', '已结清'],

            loadDataStatusOver : true,
            allDataLoaded : false,
            reloadDataStatus : false,
            fullScreenLoadingShow : true,

            downLoadAnimationStatus : false,
            netError : false,

            pageNum : 1,
            pageSize : 10,
        }
    },
    filters : {
        formatDate(val){
            var date = new Date(val),
                year = date.getFullYear(),
                month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
                day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate(),
                hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
                min = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
                sec = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getDate();
            //return year + '.' + month + '.' + day + ' ' + hours + ':' + min + ':' + sec;
            return year + '.' + month + '.' + day// + ' ' + hours + ':' + min + ':' + sec
        }
    },
    created:function(){
        this.isOpen = this.$route.query.open;
        this.getDataList();
    },
    mounted : function(){

        var _this = this,
            box = this.$refs.list_box,
            ul = this.$refs.listArea,
            boxHeight = box.innerHeight,
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
    methods:{
        formatDate2(val){
            var date = new Date(val*1),
                month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
                day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
            return day + '<span>/' + month + '</span>';
        },
        getDataList(){
            var _this = this;
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/autoBidding/getAutoBiddingOrders',
                data : JSON.stringify({
                    pageSize : _this.pageSize,
                    pageNum : _this.pageNum
                }),
                error : function(){
                    _this.loadDataStatusOver = true;
                    _this.reloadDataStatus = true;
                    _this.fullScreenLoadingShow = false;
                    _this.netError = true;
                },
                success : function(res){
                    _this.loadDataStatusOver = true;
                    _this.reloadDataStatus = false;
                    _this.fullScreenLoadingShow = false;

                    if(res.code*1 == 1){
                        _this.orderList = _this.orderList.concat(res.data);
                        var length = 0;
                        res.data.forEach(function(i, t){
                            length += (res.data[t].autoBiddingOrders ? res.data[t].autoBiddingOrders.length : 0);
                        })
                        if(length < 10 || length == 0){
                            _this.showLoadMore = false;
                            _this.allDataLoaded = true;
                        }else{
                            _this.showLoadMore = true;
                            _this.pageNum++;
                        }
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })
        },
        toDetail(orderId, creditId){
            this.$router.push({
                path : '/autoInvestRecordDetail',
                query : {
                    orderId : orderId,
                    creditId : creditId,
                    isOldSys : 0,
                    orderType : 'autoBidding'
                }
            })
        }
    }
}
</script>
