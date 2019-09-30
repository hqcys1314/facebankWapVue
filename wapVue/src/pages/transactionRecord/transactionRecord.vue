<template>
    <div>
        <ul class="switch_box">
            <li @click="switchItem(0, '全部')" :class="{'current' : currentTag == 0}">全部</li>
            <li @click="switchItem(1, '充值')" :class="{'current' : currentTag == 1}">充值</li>
            <li @click="switchItem(2, '提现')" :class="{'current' : currentTag == 2}">提现</li>
            <li @click="switchItem(3, '出借')" :class="{'current' : currentTag == 3}">出借</li>
            <li @click="switchItem(4, '回款')" :class="{'current' : currentTag == 4}">回款</li>
            <li @click="switchItem(5, '奖励')" :class="{'current' : currentTag == 5}">奖励</li>
            <span class="line" :style="'left:' + (16.66*(currentTag)) + '%'"></span>
        </ul>
        <div class="totalBox">
            <p v-if="currentTag == 0">{{selectDays > 0 ? selectDays + '天内' : '今天'}}共计{{counts}}条交易流水</p>
            <p v-else>共计{{counts}}笔，共计{{utils.formatThousandth(utils.formatThousandthFixed(statistics ? statistics : '0'))}}元</p>
            <div class="menu_title" @click="showFilterDate()"><span>{{selectDays > 0 ? selectDays + '天内' : '今天'}}</span><span class="arrow"></span></div>
        </div>
        <div class="filter_layer" v-if="showFilterLayer">
            <h2 @click="showFilterDate()"><div class="menu_title"><span>{{selectDays > 0 ? selectDays + '天内' : '今天'}}</span><span class="arrow"></span></div></h2>
            <a href="javascript:;" @click="selectDate(0)" :class="{'current' : selectDays == 0}">今天</a>
            <a href="javascript:;" @click="selectDate(3)" :class="{'current' : selectDays == 3}">3天内</a>
            <a href="javascript:;" @click="selectDate(30)" :class="{'current' : selectDays == 30}">30天内</a>
            <a href="javascript:;" @click="selectDate(90)" :class="{'current' : selectDays == 90}">90天内</a>
            <a href="javascript:;" @click="selectDate(180)" :class="{'current' : selectDays == 180}">180天内</a>
            <a href="javascript:;" @click="selectDate(365)" :class="{'current' : selectDays == 365}">365天内</a>
        </div>

        <div class="listBox" ref="list_box">

            <ul ref="listArea">
                <li v-for="item in listData">
                    <div class="icon_box"><transRec :journalTypeId="item.journalTypeId" :colorCode="item.colorCode"></transRec></div>
                    <div class="infos">
                        <p class="title"><span :class="{'add' : item.type == '+', 'reduce' : item.type == '-' }">{{item.type}}{{utils.formatThousandth(utils.formatThousandthFixed(item.journalAmount))}}</span>{{item.title}}</p>
                        <p class="desc" v-if="item.remark">{{item.remark}}</p>
                        <p class="date"><span>余额 {{(item.balance+'') == '-.-' ? '-.-' : utils.formatThousandth(utils.formatThousandthFixed(item.balance))}}</span>{{item.createDate}}</p>
                    </div>
                </li>
            </ul>
            <div v-if="fullScreenLoadingShow" class="loading"></div>
            <div v-else-if="fullScreenLoadingShow" class="loading"></div>
            <div v-else-if="!fullScreenLoadingShow && listData.length == 0 && loadDataStatusOver" class="empty_box">
                <div class="img_box"><img src="//static.facebank.cn/static/wapFront/common/images/empty_record.png" /></div>
                <div class="font">暂无资金流水</div>
                <div class="btn_area">
                    <a href="javascrpt:;" v-if="currentTag == 3" @click="toLoanlist()" class="btn_tpls" style="width:9rem;">立即出借赚收益</a>
                    <router-link v-if="currentTag == 1" :to="{ name: 'rechargeUI' }" class="btn_tpls" style="width:9rem;">去充值</router-link>
                </div>
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

<style scoped src="./transactionRecord.css">
</style>
<script>
import transRec from 'components/transRec'

export default {
    name: 'transactionRecord',
    data () {
        return {
            currentTag : 0,
            listData : [],
            dataType : 0,
            selectDays : 30,
            showFilterLayer : false,

            loadDataStatusOver : true,
            allDataLoaded : false,
            reloadDataStatus : false,

            downLoadAnimationStatus : false,
            netError : false,

            fullScreenLoadingShow : true,
            start : 0,
            runAjaxCount : '',
            runAjaxList : '',

            counts : 0,
            statistics : 0,

            colorCodeValueAndStyle : '',
            journalTypeFont : ['全部','充值','提现','出借','回款','奖励']
        }
    },
    components:{transRec},//这里注册
    created:function () {
        var _this = this;

        var typeFont = this.journalTypeFont[this.currentTag];


        setTimeout(()=>{
            _this.getDataList();
            _this.getCount();
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
        toLoanlist : function(){
            this.utils.toLoanlist()
        },
        switchItem(val, tagName){
            this.currentTag = val;
            this.dataType = val*100;
            this.listData = [];
            this.fullScreenLoadingShow = true;
            this.start = 0;
            this.loadDataStatusOver = false;
            this.reloadDataStatus = false;
            this.allDataLoaded = false;
            this.fullScreenLoadingShow = true;

            var typeFont = this.journalTypeFont[this.currentTag];


            if(this.runAjaxCount) this.runAjaxCount.abort();
            if(this.runAjaxList) this.runAjaxList.abort();
            this.getDataList();
            this.getCount();
        },
        showFilterDate(){
            this.showFilterLayer = !this.showFilterLayer;
        },
        selectDate(val){
            this.selectDays = val;
            this.showFilterLayer = false;
            this.listData = [];
            this.start = 0;
            this.loadDataStatusOver = false;
            this.reloadDataStatus = false;
            this.allDataLoaded = false;
            this.fullScreenLoadingShow = true;
            var typeFont = this.journalTypeFont[this.currentTag];

            if(this.runAjaxCount) this.runAjaxCount.abort();
            if(this.runAjaxList) this.runAjaxList.abort();
            this.getDataList();
            this.getCount();
        },
        getCount(){
            var _this = this;
            this.runAjaxCount = $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/getUserJournalStatistics',
                data : JSON.stringify({
                    type : _this.dataType,
                    days : _this.selectDays,
                }),
                success : function(res){
                    if(res.code*1 == 1){
                        if(res.data){
                            _this.counts = res.data.counts ? res.data.counts+'' : 0+'';
                            _this.statistics = res.data.statistics ? res.data.statistics+'' : 0+'';
                        }
                    }else{
                        _this.$refs.tipLayer.showLayer(1, res.message);
                        // _this.showLayer(res.message)
                    }
                }
            })
        },
        getDataList(){
            var _this = this;
            this.reloadDataStatus = false;
            this.loadDataStatusOver = false;
            this.netError = false;
            this.runAjaxList = $.ajax({
                url : this.utils.AJAXDOMAINNAME+ '/wap/getUserJournal',
                data : JSON.stringify({
                    type : _this.dataType,
                    days : _this.selectDays,
                    start : _this.start
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
                            if((res.data.length < 20 || res.data.length == 0)){
                                _this.showLoadMore = false;
                                _this.allDataLoaded = true;
                            }else{
                                _this.showLoadMore = true;
                            }
                        }
                    }else{
                        _this.$refs.tipLayer.showLayer(1, res.message);
                        //_this.showLayer(res.message)
                    }
                }
            })
        }
    }
}

</script>
