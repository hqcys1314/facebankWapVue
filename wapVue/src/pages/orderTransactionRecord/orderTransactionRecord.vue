<template>
    <div>
        <div class="listBox" ref="list_box">

            <ul ref="listArea">
                <li v-for="item in listData">
                    <div class="infos">
                        <p class="title"><span :class="{'add' : item.inOut == '1', 'reduce' : item.inOut == '-' }">{{item.inOut == '1' ? '+' : '-'}}{{utils.currency(item.amount)}}</span>{{item.journalType}}</p>
                        <p class="desc" v-if="item.journalDesc">{{item.journalDesc}}</p>
                        <p class="date"><span>未匹配资金 {{(item.orderBalance+'') == '-.-' ? '-.-' : utils.currency(item.orderBalance)}}</span>{{item.createTime}}</p>
                    </div>
                </li>
            </ul>
            <div v-if="fullScreenLoadingShow" class="loading"></div>
            <div v-else-if="!fullScreenLoadingShow && listData.length == 0 && loadDataStatusOver" class="empty_box">
                <div class="img_box"><img src="//static.facebank.cn/static/wapFront/common/images/empty_record.png" /></div>
                <div class="font">暂无资金流水</div>
            </div>
            <div class="loadMoreData" v-if="listData.length > 0">
                <span v-if="!reloadDataStatus && allDataLoaded && listData.length > 0 && listData.length > 20" class="font">安全可靠有底线</span>
                <div :style="'display:'+(!reloadDataStatus && start != 0 && !loadDataStatusOver ? 'block' : 'none')">
                    <div class="animation" ref="loadMore"></div>
                    <div class="font">加载中...</div>
                </div>
                <div v-if="reloadDataStatus">
                    <span>加载失败，点击重试</span>
                    <span class="reload" @click="getDataList()"></span>
                </div>
            </div>
        </div>

        <!--统一提示层-->
        <tipLayer ref="tipLayer"></tipLayer>
    </div>
</template>

<style scoped src="./orderTransactionRecord.css">
</style>
<script>
export default {
    name: 'transactionRecord',
    data () {
        return {
            orderId : '',
            listData : [],
            pageNum : 1,

            loadDataStatusOver : true,
            allDataLoaded : false,
            reloadDataStatus : false,

            downLoadAnimationStatus : false,
            netError : false,

            fullScreenLoadingShow : true,
            start : 0,
            runAjaxList : ''
        }
    },
    components:{},//这里注册
    created:function () {
        var _this = this;
        this.orderId = this.$route.query.orderId;
        setTimeout(()=>{
            _this.getDataList();
        },50)
    },
    mounted : function(){
        var _this = this,
            box = this.$refs.list_box,
            ul = this.$refs.listArea,
            boxHeight = box.innerHeight,
            scrollTop=0,
            innerHeight = 0;
        this.$refs.list_box.addEventListener('scroll', function(e){
            if(_this.loadDataStatusOver && !_this.allDataLoaded && _this.listData.length > 0 && !_this.netError){
                boxHeight = box.offsetHeight;
                innerHeight = ul.clientHeight;
                scrollTop = parseInt(this.scrollTop);
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
        getDataList(){
            var _this = this;
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
            this.runAjaxList = $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/order/sdqOrderJournalList',
                data : JSON.stringify({
                    orderId : _this.orderId,
                    pageNum : _this.pageNum,
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
                        if(res.data){
                            _this.listData = _this.listData.concat(res.data);
                            if(res.data.length > 0){
                                _this.start = res.data[res.data.length-1].journalId;
                            }
                            if((res.data.length < 10 || res.data.length == 0)){
                                _this.showLoadMore = false;
                                _this.allDataLoaded = true;
                            }else{
                                _this.showLoadMore = true;
                                _this.pageNum++;
                            }
                        }
                    }else{
                        _this.$refs.tipLayer.showLayer(1, res.message);
                    }
                }
            })
        }
    }
}

</script>
