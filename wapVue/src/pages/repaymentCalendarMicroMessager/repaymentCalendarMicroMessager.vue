<template>
  <div class="content" style="background:#eaeaea;">
    <!-- agoDayHide='1517483961' -->
    <!-- futureDayHide="1526054400" -->
    <div  @touchstart="_touchStart"  @touchend="_touchEndUp">
        <calendarMM @monthListLength="monthListLength" @changeShowWeekStatus="changeShowWeekStatus" ref="Calendars"   agoDayHide=1530115200  :isShowMonth="isShowMonthV"
        v-on:choseDay="clickDay"
        v-on:changeMonth="changeMonth"
        v-on:mrDateClick="mrDateClick"
        v-on:confirm="confirm"
        @setUpdateTime="setUpdateTime"
        @showWarning="showWarning"
        @dayInfoListChange="dayInfoListChange"
        @showHelpContent="showHelpContent"
                  @showLoadingView="showLoadingView"
                  @hideLoadingView="hideLoadingView"
                  @updateViewTop="updateViewTop"
                  @updateStateMoney="updateStateMoney"
        v-on:cancel="cancel"></calendarMM>
    </div>
    <informationLayer :title.sync="layerTitle" :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    <smileLoading  :showSmileLoading.sync="loadingStatus"></smileLoading>

    <layerWithImg :showLayerOut.sync="showWarningStatus" :showImgPathOut.sync="warningImgPath"></layerWithImg>
    <!--<div class="calContentPos" :style="'top:'+ calContentTop"  @touchstart="_touchStart"  @touchend="_touchEndDown" >-->
    <div class="calContentPos" :class="[{'mouthIs6Line' : mouthIs6Line}, {'calContentTop' : !mouthIs6Line && showWeek}]" @touchstart="_touchStart" @touchend="_touchEndDown">
        <calContent :isCctShow.sync="isCctShowD" :searchYear="searchYearV" :paybackList="paybackListV"
        :searchMonth="searchMonthV" :searchDay="searchDayV" :stateMoney="stateMoneyV"
        :isNextDay="isNextDay" :isNowDay="isNowDayV" :isToday="isToday" :desc="descV" :remainTime="paybackListV.remainTime">
        </calContent>
    </div>
     <div class="wapMc" v-show="wapMcStatus" style="top:14rem;"></div>
     <wapTkInvest v-bind:iswapTkShowInvest="wapTkStatusInvest" v-bind:pLeftInvest="pLeftInvest"
      v-bind:pTitleInvest="pTitleInvest" v-on:toLoanlist="utils.toAutoInvestMatchPage()"></wapTkInvest>


      <a href="javascript:history.go(-1)" v-if="showHeaderR" class="backBtn">后退</a>
      <div class="layer_style"  v-show="showTimeDeposiTipsLayer" v-cloak style="top:15%;">
          <a href="javascript:;" class="layer_close" @click="closeLayerSigle()"></a>
          <div class="layer_title">还款日历功能调整通知</div>
          <div class="layer_content alignLeft font24">
              <p>为避免误解，月月笑产品的订单在还款日历中所展示的“预计还款日”，由“<span class="colorType1">锁定期的最后一日</span>”调整为“<span class="colorType1">锁定期结束后的次日</span>”。</p>
              <p><img src="https://static.facebank.cn/static/wapFront/timeDeposit/layer_img.png" width="100%" /></p>
              <p>本次功能的变更，仅对月月笑订单在还款日历中的展示有影响，不会影响到月月笑的实际还款</p>
          </div>
          <div class="layer_btn one">
              <a href="javascript:;"  @click="closeLayerAll()" style="font-size:1rem;">我已知道，不再提醒</a>
          </div>
      </div>
      <div class="layerMask" v-show="showTimeDeposiTipsLayer" v-cloak></div>
  </div>
</template>
<style src="./repaymentCalendarMicroMessager.less" lang="less"></style>
<script>
import calendarMM from 'components/calendar/calendarMM';
import calContent from 'components/calendar/calContent';
import informationLayer from '@/components/informationLayer';
import loading from '@/components/loading';
import layerWithImg from '@/components/layerWithImg';
import {    utils,    globalVariable}from 'tools';
import timeUtil from 'components/calendar/timeUtil';
import wapTkInvest from 'components/wapTkInvest'

export default {
    data() {
        return {
            showHeaderR:true,
            isHasShowWarning: false,
            isCctShowD: true,
            paybackListV: '',
            searchYearV: '',
            searchMonthV: '',
            searchDayV: '',
            stateMoneyV: '1',
            // state: 0,待还款;1,还款中;2, 已还款 3;无还款
            isShowMonthV: true,
            wapMcStatus: false,
            wapTkStatusInvest: false,
            pLeftInvest: '',
            pTitleInvest: '',
            currentShowDate: '',
            currentDataIndex: -1,
            currentDayInfoList: {},
            currentSelectDay: '',
            userBaseInfo: '',
            isNextDay: false,
            updateTime: new Date().getFullYear() + '/' + (new Date().getMonth() * 1 + 1) + new Date().getDate(),
            cacheDayDetailMap: new Map(),
            showLayerStatus: false,
            informationLayerContent: '',
            layerTitle: '常见问题',
            showWarningStatus: false,
            warningImgPath: '/static/imgVar/fixing.png',
            loadingStatus: false,
            calContentTop: '27rem',
            mouthIs6Line: false,
            showWeek: false,
            isNowDayV:false,
            descV:'因银行结算原因，部分债权回款，最迟在下一个工作日到账,实际到账时间可能跨天!',//文案
            isToday : false, //是否今天

            showTimeDeposiTipsLayer : false,
            useId:'',
        };
    },
    created: function() {
        this.showHeaderR = (utils.getCookie('curDevice') == 'ios' && utils.getCookie('curVersion') == '2.7.5');
        this.loadingStatus=true;
        this.useId=utils.getUserInfo().encryptUserId;
    },
    updated() {
        //window.scroll(0, 0);
    },
    mounted() {
        var _this = this;

        $.ajax({
            url: utils.AJAXDOMAINNAME + "/wap/repayCalendar/updateLastTime",
            success: function(res) {}
        })
        //    this.calContentTop=this.$refs.Calendar.$el.clientHeight+'px';
    },
    components: {
        calendarMM,
        calContent,
        wapTkInvest,
        informationLayer,
        layerWithImg,
        loading
    },
    watch: {

        isShowMonthV: function(val) {
            this.isShowMonthV = val;
        },
        searchMonthV: function(val) {
            this.searchMonthV = val;
        },

        searchYearV: function(val) {
            this.searchYearV = val;
        },
    },
    methods: {
        closeLayerSigle(){
            this.showTimeDeposiTipsLayer  = false;
        },
        closeLayerAll(){
            this.showTimeDeposiTipsLayer  = false;
            this.utils.setCookie('showTimeDeposiTipsLayer'+this.useId, '1');
        },
        monthListLength(val) {
            this.mouthIs6Line = (val == 35);
        },
        changeShowWeekStatus(val) {
            this.showWeek = val;
        },
        showHelpContent() {
            this.showLayerStatus = true;
            this.layerTitle = '常见问题';
            this.informationLayerContent = '1. 刚购买的产品，在日历上没有显示？<br />' + '由于您刚购买的产品，还未满标，无法精确地计算出还款日期，需要等产品计息后才会在日历上显示。<br />' + '2.	我只购买了一款产品，为什么日历上一个月的还款有两天？<br />' + '由于您购买的智能推荐，起息后有多个债权，起息时间不一致，因此一个智能推荐的订单，会在月内分几天还款。<br />' + '3. 为什么预计还款日是今天，但今天没还款？<br />' + '因为银行结算等原因，您的债权可能会在下一个工作日还款到账。<br />' + '4.	还款日历的开始时间为什么是18年4月？<br /> ' + '为方便数据统计，还款日历的初始时间设定为18年4月。<br /> ' + '5. 为什么还款日历上的日期有还款，流水上没有？<br />' + '还款日历都是根据【约定还款的日期】展示日期的，而不是流水上【实际发生还款】的时间，由于银行结算等原因发生的还款跨天，不会在新的日期更新还款记录。<br />' + '6. 为什么还款日历上有的日期只有红包的还款记录？<br />' + '某些产品由于流标、提前还款等原因，没有债权还款了，但红包仍会在每期给您还款。<br />' + '7. 为什么有一个产品的债权在同一天还了好多期？<br />' + '当债权在还款日发生了提前还款，那么该日的提前还款部分会记录该债权剩余期（不包含当期）的所有金额，而当期还款会记录在应还的部分里。';
        },

        updateViewTop() {
            //      this.calContentTop=this.$refs.Calendar.$el.clientHeight+'px';
        },

        showWarning() {
            //如果当前弹窗不处于弹出状态 并且 没有展示过
            if (!this.showWarningStatus && !this.isHasShowWarning) {
                this.showWarningStatus = true;
                this.isHasShowWarning = true;
            }
        },

        setUpdateTime(val) {
            this.updateTime = val;
        },

        showLoadingView() {
            if (!this.loadingStatus) {
                this.loadingStatus = true;
            }
        },

        hideLoadingView() {
            this.loadingStatus = false;
        },

        updateStateMoney() {
            if (this.$refs.Calendars) {
                var curentItem = this.$refs.Calendars.findItemFromDate(this.searchYearV + '/' + this.searchMonthV + '/' + this.searchDayV);
                if (curentItem) {
                    this.stateMoneyV = curentItem.state;
                }
            }
        },

        clickDay(data) {
            this.loadingStatus = true;
            if (this.userBaseInfo == '') {
                this.userBaseInfo = utils.getUserInfo();
            }
            var userInfo = this.userBaseInfo;
            if (!this.userBaseInfo.isLogin) {
                this.$router.push({
                    path: '/regOrlogin',
                    query: {}
                });
                return;
            }

            //是否是当天
            // var nowDay=timeUtil.dateFormat(new Date());
            // if(nowDay==data){
            //   this.isNowDayV=true;
            // }else{
            //   this.isNowDayV=false;
            // }
            var cacheKeyItem = new Object();
            cacheKeyItem.date = data;
            this.$nextTick(function() {
                var curentItem = this.$refs.Calendars.findItemFromList(cacheKeyItem);
                if (curentItem) {
                    this.stateMoneyV = curentItem.state;
                }
            });
            this.updateSelectData(data);
            this.isCctShowD = false;
            //如果缓存中包含查询的这一天  直接取本地缓存数据
            var key = this.searchYearV + '-' + this.searchMonthV + '-' + this.searchDayV;
            if (this.cacheDayDetailMap.has(key)) {
                var cacheData = this.cacheDayDetailMap.get(key);
                if (cacheData) {
                    this.paybackListV = cacheData;
                    if (cacheData.isCompensatory) {
                        if (cacheData.isCompensatory == '1') {
                            this.isNextDay = true;
                        } else {
                            this.isNextDay = false;
                        }
                    }
                    if(cacheData.isOverDay){
                      //0,24点以前   1,24点以后
                      if (cacheData.isOverDay == '1'){
                        this.isNowDayV = false;
                      }else {
                        this.isNowDayV = true;
                      }
                    }
                    this.descV=cacheData.desc;
                    this.loadingStatus = false;
                    return;
                }
            }
            var _this = this;
          var today = new Date();
          //获取提现中列表
            $.ajax({
                url: utils.AJAXDOMAINNAME + "/wap/repayCalendar/dayDetail",
                data: '{"year":"' + _this.searchYearV + '","month":"' + _this.searchMonthV + '","day":"' + _this.searchDayV + '"}',
                complete: function() {
                    _this.loadingStatus = false;
                },
                success: function(res) {
                    if (res.code == 1) {
                        _this.cacheDayDetailMap.set(key, res.data);
                        _this.paybackListV = res.data;
                        _this.isCctShowD = false;
                        var repaymentItemList = _this.paybackListV.repaymentItemList;
                        if(repaymentItemList && repaymentItemList.length > 0){
                            for(var i=0;i<repaymentItemList.length; i++){
                                if(repaymentItemList[i].assetType*1 == 100){
                                  if(_this.utils.getCookie('showTimeDeposiTipsLayer'+_this.useId) != '1'&&(repaymentItemList[i].investDate*1<=2019073110)){
                                      _this.showTimeDeposiTipsLayer = true;
                                  }
                                    break;
                                }
                            }
                        }
                        if (res.data && res.data.isCompensatory) {
                            if (res.data.isCompensatory == '1') {
                                _this.isNextDay = true;
                            } else {
                                _this.isNextDay = false;
                            }
                        }
                        if(res.data && res.data.isOverDay){
                          //0,24点以前   1,24点以后
                          if (res.data.isOverDay == '1'){
                            _this.isNowDayV = false;
                          }else {
                            _this.isNowDayV = true;
                          }
                        }
                        if(res.data){
                          _this.descV=res.data.desc;
                          _this.isToday = _this.searchDayV == today.getDate();
                        }
                        if (_this.$refs.Calendars) {
                            _this.$refs.Calendars.updateMonthView();
                        }
                    }
                }
            })
        },

        updateSelectData(data) {
            this.currentSelectDay = data;
            this.currentShowDate = data;
            this.searchDayV = timeUtil.formatDay(data);
            this.searchMonthV = timeUtil.formatMonth(data);
            this.searchYearV = timeUtil.formatYear(data);
        },

        //更换年月
        changeMonth(data, isChoose) {
            this.currentShowDate = data;
            this.isCctShowD = false;
            if ((isChoose == false || isChoose == 'false')) {
                this.isCctShowD = true;
            }
            this.wapMcStatus = false;
            this.searchDay = '';
            this.searchMonthV = timeUtil.formatMonth(data);
            this.searchYearV = timeUtil.formatYear(data);
        },
        demo() {
            this.$refs.Calendar.ChoseMonth('2018-12-12'); //跳到12月12日选中12月12日
        },
        mrDateClick() {
            this.wapMcStatus = true;
        },
        confirm() {
            this.wapMcStatus = false;
        },
        cancel() {
            this.wapMcStatus = false;
        },
        format(date, index) {
            date = new Date(date);
            return`$ {
                date.getFullYear()
            } - $ {
                date.getMonth() + 1
            } - $ {
                index
            }`;
        },
        _touchStart: function(ev) {
            ev = ev || event;
            if (ev.touches.length == 1) {
                // 手指按下的时候记录按下的位置
                this.startX = ev.touches[0].clientX;
                this.startY = ev.touches[0].clientY;
            }
        },

        _touchEndUp: function(ev) {
            var offset = 70;
            if (event.changedTouches.length == 1) {
                this.zIndex = "z-index:" + -1 + "rem";
                // 手指移动结束后的水平位置
                let endX = event.changedTouches[0].clientX;
                // 触摸开始与结束,手指移动的距离
                this.disX = this.startX - endX;
                if (this.isShowMonthV) { //展示月日历时 展示上下月
                    //距离1.dX<10,向左滑动   2.dX>10向右滑动  3.-10=<dX<=10不滑动
                    if (this.disX * 1 > offset) {
                        this.$refs.Calendars.NextMonth();
                    } else if (this.disX * 1 < -offset) {
                        this.$refs.Calendars.PreMonth();
                    }
                } else { //展示周日历时 展示上下周
                    if (this.disX * 1 > offset) {
                        this.$refs.Calendars.nextWeek();
                        //                          this.isCctShowD = true;
                    } else if (this.disX * 1 < -offset) {
                        this.$refs.Calendars.preWeek();
                        //                         this.isCctShowD = true;
                    }
                }
                //this.calContentTop=this.$refs.Calendar.$el.clientHeight+'px';
            }
        },
        _touchEndDown: function(ev) {
            var offset = 120;
            if (event.changedTouches.length == 1) {
                //this.startX = 0;
                this.zIndex = "z-index:" + -1 + "rem";
                // 手指移动结束后的水平位置
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                // 触摸开始与结束,手指移动的距离
                this.disX = this.startX - endX;
                this.disY = this.startY - endY;
                //距离1.dY<10,向左滑动   2.dY>10向右滑动  3.-10=<dY<=10不滑动
                var isSelectCurrentMonthDay = false;
                if (this.currentShowDate) {
                    var cacheDate = new Date(this.currentShowDate);
                    var year = cacheDate.getFullYear();
                    var month = cacheDate.getMonth() * 1 + 1;
                    var day = this.searchDayV;
                    //当前月是否为选中的日期所在月
                    if (year == this.searchYearV && month == this.searchMonthV) {
                        this.$refs.Calendars.updateParentsCurrentDayInfoList();
                        if (this.currentDayInfoList) {
                            //遍历源数组 判断是否选中日存在还款情况
                            for (var i = 0; i < this.currentDayInfoList.length; i++) {
                                var item = this.currentDayInfoList[i];
                                if (item) {
                                    var originDate = new Date(item.date);
                                    //匹配至当日
                                    if (originDate.getDate() == this.searchDayV && originDate.getMonth() * 1 + 1 == this.searchMonthV && originDate.getFullYear() == this.searchYearV) {
                                        if (item.state != '3') {
                                            isSelectCurrentMonthDay = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                /*if (this.disY * 1 > offset && isSelectCurrentMonthDay) {
                    this.isShowMonthV = false;
                    this.$refs.Calendars.getListWeek(this.searchYearV + '/' + this.searchMonthV + '/' + this.searchDayV);

                } else if (this.disY * 1 < -offset) {
                    this.isShowMonthV = true;
                    //                        this.$refs.Calendar.getListWeek(this.searchYearV+'/'+this.searchMonthV+'/'+this.searchDayV);
                    this.$refs.Calendars.updateMonthView();
                }*/
                //距离1.dX<10,向左滑动   2.dX>10向右滑动  3.-10=<dX<=10不滑动
                //当前有选中日期 并且 是展示月日历时 左右切换上下还款日
                if (this.isShowMonthV) {
                    if (this.currentSelectDay) {
                        if (this.disX * 1 > offset) {
                            var retDate = this.selectRepaymentDateFrom(this.currentSelectDay, true);
                            if (retDate) {
                                this.$refs.Calendars.ChoseMonth(retDate);
                            }
                        } else if (this.disX * 1 < -offset) {
                            var retDate = this.selectRepaymentDateFrom(this.currentSelectDay, false);
                            if (retDate) {
                                this.$refs.Calendars.ChoseMonth(retDate);
                            }
                        }
                    }
                } else { //如果展示周日历 左右切换上下周
                    if (this.disX * 1 > offset) {
                        var retDate = this.selectRepaymentDateFrom(this.currentSelectDay, true);
                        if (retDate) {
                            this.$refs.Calendars.choseWeekDay(retDate);
                        }
                    } else if (this.disX * 1 < -offset) {
                        var retDate = this.selectRepaymentDateFrom(this.currentSelectDay, false);
                        if (retDate) {
                            this.$refs.Calendars.choseWeekDay(retDate);
                        }
                    }
                }
            }
        },
        dayInfoListChange(data) {
            this.currentDayInfoList = data;
        },
        //查询上下一个还款日
        selectRepaymentDateFrom(data, isAfter) {
            if (data && this.currentDayInfoList) {
                var originDate = new Date(data);
                //下一还款日
                if (isAfter) {
                    var flag = false;
                    for (var i = 0; i < this.currentDayInfoList.length; i++) {
                        var item = this.currentDayInfoList[i];
                        var cacheDate = new Date(item.date);
                        if (cacheDate.getFullYear() == originDate.getFullYear() && cacheDate.getMonth() == originDate.getMonth() && cacheDate.getDate() == originDate.getDate()) {
                            flag = true;
                            continue;
                        }
                        if (flag) {
                            if (item.state != '3') {
                                return item.date;
                            }
                        }
                    }
                } else { //上一还款日
                    var flag = false;
                    for (var i = this.currentDayInfoList.length - 1; i >= 0; i--) {
                        var item = this.currentDayInfoList[i];
                        var cacheDate = new Date(item.date);
                        if (cacheDate.getFullYear() == originDate.getFullYear() && cacheDate.getMonth() == originDate.getMonth() && cacheDate.getDate() == originDate.getDate()) {
                            flag = true;
                            continue;
                        }
                        if (flag) {
                            if (item.state != '3') {
                                return item.date;
                            }
                        }
                    }
                }
            }
        }
    },

    };
</script>
