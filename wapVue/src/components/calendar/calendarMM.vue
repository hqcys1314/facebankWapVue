
<template>
    <div>
        <div class="topPos">
            <div class="wh_top_changge">
              <li @click="PreMonth(myDate,false)">
                <div class="wh_jiantou1 " :class="[{invaild:searchYearV == 2018 && searchMonthV == 4}]"></div>
              </li>
              <li class="wh_content_li" v-on:click="mrDateClick">{{dateTop}}</li>
              <li @click="NextMonth(myDate,false)">
                <div class="wh_jiantou2"></div>
              </li>
            </div>
            <div class="calDateTk" v-show="calDateTkShow">
                <div class="cont">
                   <ul>
                       <li v-for="yy in year" :class="{on:yy==searchYearV}" v-on:click="chooseYear(yy)">{{yy}}年</li>
                       <li>&nbsp;</li>
                   </ul>
                    <ul>
                       <li v-for="mm in month" :class="{on:mm==searchMonthV}" v-on:click="chooseMonth(mm)">{{mm}}月</li>
                    </ul>
                 </div>
                 <ul class="mrBtn">
                   <li v-on:click="cancel()">取消</li><li>&nbsp</li>
                   <li v-on:click="confirm()">确定</li>
                 </ul>
            </div>
        </div>
      <section class="wh_container" >
        <div class="wh_content_all" ref="ced">
          <div class="wh_example">
             <span class="spanAsk"><img src="~assets/wapFront/common/img/icon_help.png" @click="showHelpContent"></span>
             <span class="span1">&nbsp</span><span class="spanf">已还款</span>
             <span class="span2">&nbsp</span><span class="spanf">还款中</span>
             <span class="span3">&nbsp</span><span class="spanf">待还款</span>
          </div>
          <div class="wh_content">
            <div class="wh_content_item" v-for="tag in textTop">
              <div class="wh_top_tag">
                {{tag}}
              </div>
            </div>
          </div>
          <div class="wh_content">
            <div class="wh_content_item" v-for="(item,index) in list" @click="clickDay(item,index)">
               <div class="wh_item_date" v-bind:class="[{wh_other_dayhide:!isCurrentMonthItem(item)},
                   {wh_chose_finish: item.chooseDay&&setClassFinish(item)},
                   {wh_chose_ing:item.chooseDay&&setClassIng(item)},
                   {wh_chose_pre:item.chooseDay&&setClassPre(item)},
                   {wh_chose_com:item.chooseDay&&setClassCom(item)},
                   {wh_chose_no_repay:item.chooseDay&&setClassNoRepay(item)},
                   {cal_color_finish:setClassFinish(item)},
                   {cal_color_ing:setClassIng(item)},
                   {cal_color_pre:setClassPre(item)},
                   {cal_color_com:setClassCom(item)},
                   ]">
                   {{item.id}}
               </div>
            </div>
          </div>
          <div class="updateTime" v-if="isShowMonth">数据更新于{{updateTime}}</div>
        </div>
      </section>
    </div>
</template>
<style scoped src="./calendarMM.css">
</style>
<script>
import timeUtil from './timeUtil';
import {utils,globalVariable} from'tools'
import wapTkInvest from 'components/wapTkInvest'
import loading from '@/components/loading';

export default {
  props: {
    agoDayHide: { type: String, default: `0` },
    futureDayHide: { type: String, default: `2554387200` },
  },
  props:['isShowMonth'],
  data() {
    return {
      textTop: [ '日','一', '二', '三', '四', '五', '六'],
      myDate: [],
      list: [],
      listWeek:[],
      historyChose: [],
      dateTop: '',
      updateTime:'',
      year:[2020,2019,2018],
      month:[4,5,6,7,8,9,10,11,12],
      searchYear:'',
      searchMonth:'',
      searchYearV:'',
      searchMonthV:'',
      searchDay:'',
      searchWeek:'',
      calDateTkShow:false,
      cacheColorList:[],
      loadingLayerStatus:false, //loading弹层状态
      colorList:[],
      cacheMonthList:new Map(),
      isUpdateList:false,
    };
  },

  created() {
    this.myDate = new Date();
    this.searchMonth=timeUtil.formatMonth(this.myDate);
    this.searchYear=timeUtil.formatYear(this.myDate);
    this.searchMonthV=timeUtil.formatMonth(this.myDate);
    this.searchYearV=timeUtil.formatYear(this.myDate);
    this.searchWeek=timeUtil.formatWeek(this.myDate);
    var cookieCache = utils.getCookie('CacheCalendarDate');
    if (cookieCache && cookieCache != ''){
        var cacheDate = new Date(cookieCache);
      this.searchMonth=timeUtil.formatMonth(cacheDate);
      this.searchYear=timeUtil.formatYear(cacheDate);
      this.searchMonthV=timeUtil.formatMonth(cacheDate);
      this.searchYearV=timeUtil.formatYear(cacheDate);
      this.searchWeek=timeUtil.formatWeek(cacheDate);
      this.myDate = cacheDate;
      // this.getColorListByDate(cookieCache);
      this.$emit("updateSelectData",this.myDate.getFullYear() + '/' + (this.myDate.getMonth() * 1 + 1 + '/' + this.myDate.getDate()));
      this.getList(cacheDate,cookieCache);
      var preMonth = timeUtil.getPreMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      var nextMonth = timeUtil.getNextMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.getColorListByDate(nextMonth.getFullYear()+'/'+(nextMonth.getMonth() * 1 + 1)+"/01");
      this.getColorListByDate(preMonth.getFullYear()+'/'+(preMonth.getMonth() * 1 + 1)+"/01");
      utils.setCookie('CacheCalendarDate','');
    }else {
        this.ChoseMonth(this.myDate,false);
    }

  },


  components:{loading},//这里注册

  methods: {
    getColorList:function(callback){
      var _this = this;
      if (this.cacheMonthList.has(_this.searchYear+'-'+_this.searchMonth)){
        return;
      }

      _this.$emit("showLoadingView");
      setTimeout(function(){
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/repayCalendar/daysList",
          data : '{"year":"'+_this.searchYear+'","month":"'+_this.searchMonth+'"}',
          async:false,
          complete:function () {
            _this.$emit("hideLoadingView");
          },
          success : function(res){
              if(res.code==1){
                  _this.updateTime=res.data.updateTime;
                  _this.addCacheDayList(_this.searchYear+'-'+_this.searchMonth,res.data.dayInfoList);
                _this.$emit('setUpdateTime',res.data.updateTime);
                _this.updateParentsDataList();
                _this.updateMonthView();
                if (res.data.isShowRepayCalendarEntrance == '0'){
                  _this.$emit("showWarning");
                }
                // _this.getList();

              }
          }
      })
      },300)
    },

    showHelpContent:function () {
      this.$emit('showHelpContent');
    },

    updateParentsDataList:function () {
      this.$emit('dayInfoListChange', this.cacheMonthList.get(this.searchYear+'-'+this.searchMonth));
    },

    addCacheDayList:function (key,list) {
      this.cacheMonthList.set(key,list);
    },

    getColorListByDate:function(date){
      var cacheDate = new Date(date);
      if (this.cacheMonthList.has(cacheDate.getFullYear()+'-'+(cacheDate.getMonth() * 1 + 1))){
        return;
      }
      var _this = this;
      //获取提现中列表
//      _this.loadingLayerStatus=true;
      _this.$emit("showLoadingView");
      setTimeout(function(){
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/repayCalendar/daysList",
          data : '{"year":"'+cacheDate.getFullYear()+'","month":"'+(cacheDate.getMonth()* 1 + 1)+'"}',
          async:false,
          complete:function () {
//            _this.loadingLayerStatus=false;
            _this.$emit("hideLoadingView");
          },
          success : function(res){
//              _this.loadingLayerStatus=false;
              if(res.code==1){
                _this.addCacheDayList(cacheDate.getFullYear()+'-'+(cacheDate.getMonth()* 1 + 1),res.data.dayInfoList);
                _this.$emit('setUpdateTime',res.data.updateTime);
                _this.$emit('updateStateMoney');
                _this.updateWeekView();
                _this.updateMonthView();
                if (res.data.isShowRepayCalendarEntrance == '0'){
                  _this.$emit("showWarning");
                }
              }
          }
      })
      },300)
    },
    mrDateClick:function(){
      this.calDateTkShow=true;
      this.$emit('mrDateClick');
    },

    chooseYear:function (year) {
      this.searchYearV = year;
      if (year * 1 == 2018){
          this.month = [4,5,6,7,8,9,10,11,12];
      }else {
          this.month = [1,2,3,4,5,6,7,8,9,10,11,12];
      }
    },
    chooseMonth:function (month) {
      this.searchMonthV=month;
    },
    confirm(){
      if(this.searchMonth*1<10){
        this.dateTop=this.searchYearV+'-0'+this.searchMonthV;
      }else{
        this.dateTop=this.searchYearV+'-'+this.searchMonthV;
      }
      this.ChoseMonth(this.dateTop);
      this.calDateTkShow=false;
      this.$emit('confirm');
      this.$emit('dayInfoListChange', this.cacheMonthList.get(this.searchYear + '-' + this.searchMonth));
    },
    cancel(){
      this.calDateTkShow=false;
      this.$emit('cancel');
    },
    // state: 0,待还款;1,还款中;2, 已还款 3;无还款
    setClassFinish(scl){

      var retItem = this.findItemFromList(scl);
      if (retItem){
        return retItem.state*1 == 2?true:false;
      }else {
        return false;
      }


    },
    setClassIng(scl){
      var retItem = this.findItemFromList(scl);
      if (retItem){
        return retItem.state*1 == 1?true:false;
      }else {
        return false;
      }

    },
    setClassPre(scl){
//      console.info('scl:',scl)
      var retItem = this.findItemFromList(scl);
//      console.info(retItem.date,retItem.state);
      if (retItem){
        return retItem.state*1 == 0?true:false;
      }else {
        return false;
      }

    },
    setClassCom(scl){
      var retItem = this.findItemFromList(scl);
      if (retItem){
        return retItem.state*1 == 3;
      }else {
        return false;
      }

    },

    setClassNoRepay(scl){
      var retItem = this.findItemFromList(scl);
      if (retItem){
        return retItem.state*1 == 3?true:false;
      }else {
        return false;
      }
    },

    isCurrentMonthItem(scl){
      var retItem = scl.date;
      var date = new Date(retItem);
      if (this.searchYear*1 == date.getFullYear() && this.searchMonth*1 == (date.getMonth()*1 + 1)){
        // console.info("isTrue",retItem);
        return true;
      }
      // console.info("isFalse",retItem);
      return false;
    },

    //选中某日
    clickDay: function (item, index) {
      this.myDate = new Date(item.date);
      this.getList(this.myDate,item.date);
      this.updateWeekView(item.date);
    },

    choseWeekDay:function (date) {
      this.updateWeekListWithDate(new Date(date.replace('-','/')),'current');

    },


    //选中某月
    ChoseMonth: function (date, isChosedDay = true) {
      if (!this.isShowMonth){
//        console.info(date);
        this.updateWeekListWithDate(new Date((date+'/01').replace('-','/')),'current');
        return;
      }

      if (date){
        date = timeUtil.dateFormat(date);
        this.myDate = new Date(date);
      }

//      console.info('choseMonth :',date)
      this.$emit('changeMonth', timeUtil.dateFormat(date),isChosedDay);
      if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
      } else {
          this.getList(this.myDate);
      }
      //获取上下月的列表
      var preMonth = timeUtil.getPreMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      var nextMonth = timeUtil.getNextMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.getColorListByDate(preMonth.getFullYear()+'/'+(preMonth.getMonth() * 1 + 1)+"/01");
      this.getColorListByDate(nextMonth.getFullYear()+'/'+(nextMonth.getMonth() * 1 + 1)+"/01");
      this.updateMonthView();
      this.searchYearV = this.searchYear;
      this.searchMonthV = this.searchMonth;

    },
    PreMonth: function (date, isChosedDay = true) {
//      console.info('this.myDate',this.myDate.getMonth() * 1 + 1);
      if(this.searchYearV == 2018 && this.searchMonthV == 4){
        return;
      }
      //周日历情况下切换上个月的周
      if (!this.isShowMonth){
        this.updateWeekListWithDate(date,'pre');
        return;
      }

      this.myDate = timeUtil.getPreMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.myDate = new Date(this.myDate.getFullYear() + '/' + (this.myDate.getMonth()*1 + 1)+"/01");
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      this.getList(this.myDate,timeUtil.dateFormat(this.myDate),true);
      var preMonth = timeUtil.getPreMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.getColorListByDate(preMonth.getFullYear()+'/'+(preMonth.getMonth() * 1 + 1)+"/01");
      this.$emit('dayInfoListChange', this.cacheMonthList.get(this.searchYear + '-' + this.searchMonth));
      this.searchYearV = this.searchYear;
      this.searchMonthV = this.searchMonth;
    },

    selectWeekDate:function (date) {

    },

    //通过日期更新周日历
    updateWeekListWithDate:function (date,stateStr) {

      var retArray = new Array();
      if (stateStr == 'next'){
        date = timeUtil.getNextMonthDateFromYearAndMonth(date.getFullYear(),date.getMonth() * 1 + 1);
        retArray = timeUtil.getWeekListByYearAndMonth(date.getFullYear(),date.getMonth() * 1 + 1);
      }else if(stateStr == 'pre') {
        //获取上个月时间 即目标时间
        var preMonthDate = timeUtil.getPreMonthDateFromYearAndMonth(date.getFullYear(),date.getMonth() * 1 + 1);
        date= preMonthDate;
        //获取上上个月时间
        retArray = timeUtil.getWeekListByYearAndMonth(preMonthDate.getFullYear(),preMonthDate.getMonth() * 1 + 1);
      }else {
        this.getColorListByDate(date.getFullYear()+'/' + (date.getMonth() * 1 + 1) + '/01');
        retArray = timeUtil.getWeekListByYearAndMonthAndDay(date.getFullYear(),date.getMonth() * 1 + 1,date.getDate());
      }
      this.listWeek = retArray;
      this.myDate = new Date( date.getFullYear() + '/' + (date.getMonth() * 1 + 1) +'/01');
      this.searchMonth = date.getMonth() * 1 + 1;
      this.searchYear = date.getFullYear();
      this.searchDay = 1;
      if (stateStr != 'next' && stateStr != 'pre'){
        this.myDate = date;
        this.searchDay = date.getDate();
      }


      //获取上下月的列表
      var preMonth = timeUtil.getPreMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      var nextMonth = timeUtil.getNextMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.getColorListByDate(preMonth.getFullYear()+'/'+(preMonth.getMonth() * 1 + 1)+"/01");
      this.getColorListByDate(nextMonth.getFullYear()+'/'+(nextMonth.getMonth() * 1 + 1)+"/01");
      this.updateTopYearAndMonth();
    },

    updateWeekView:function (date) {
        var newArray = new Array();
        for (var i = 0;i<this.listWeek.length;i++){
          var item = this.listWeek[i];
          if (date){
            if (item.date.replace('-','/') == date.replace('/','/')){
              item.chooseDay = true;
            }else {
              item.chooseDay = false;
            }
          }
          newArray.push(item);
        }
        this.listWeek = newArray;
    },
    updateMonthView:function () {
        var newArray = new Array();
        for (var i = 0;i<this.list.length;i++){
          var item = this.list[i];
          var itemDate = new Date(item.date);
          if (this.myDate.getFullYear() == itemDate.getFullYear() && this.myDate.getMonth() == itemDate.getMonth()){
            item.otherMonth = 'nowMonth';
          }else {
            item.otherMonth = 'nextMonth';
          }
          newArray.push(item);
        }
        this.list = newArray;

        this.$emit('monthListLength', this.list.length)
    },

    //月份按钮切换
    NextMonth: function (date, isChosedDay = true) {
//      console.info("nextMonth----",date);
    //周日历情况下切换下个月的周
      if (!this.isShowMonth){

        this.updateWeekListWithDate(date,'next');
        return;
      }
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getNextMonthDateFromYearAndMonth(this.myDate.getFullYear(), this.myDate.getMonth() * 1 + 1);
      this.myDate = new Date(this.myDate.getFullYear() + '/' + (this.myDate.getMonth() * 1 + 1)+'/01');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      this.getList(this.myDate,timeUtil.dateFormat(this.myDate),true);
      var nextMonth = timeUtil.getNextMonthDateFromYearAndMonth(this.myDate.getFullYear(),this.myDate.getMonth() * 1 + 1);
      this.getColorListByDate(nextMonth.getFullYear()+'/'+(nextMonth.getMonth() * 1 + 1)+"/01");
      this.$emit('dayInfoListChange', this.cacheMonthList.get(this.searchYear + '-' + this.searchMonth));
      this.searchYearV = this.searchYear;
      this.searchMonthV = this.searchMonth;
      this.searchDayV = '01';
    },

    findItemFromList:function (item) {
      if (!item){
        return
      }
      var cacheDate = new Date(item.date.replace('-','/'));
      var cacheRet = this.cacheMonthList.get(cacheDate.getFullYear()+'-'+(cacheDate.getMonth()*1+1));
      for (var i = 0;cacheRet && i<cacheRet.length;i++){
        var cacheItem = cacheRet[i];
        cacheItem.date = cacheItem.date.replace('-','/');
        if (cacheItem.date == item.date){
          return cacheItem;
        }
      }
    },
    findItemFromDate:function (date) {
      if (!date){
        return
      }
      var cacheDate = new Date(date.replace('-','/'));
      var cacheRet = this.cacheMonthList.get(cacheDate.getFullYear()+'-'+(cacheDate.getMonth()*1+1));
      for (var i = 0;cacheRet && i<cacheRet.length;i++){
        var cacheItem = cacheRet[i];
        cacheItem.date = cacheItem.date.replace('-','/');
        if (cacheItem.date == date){
          return cacheItem;
        }
      }
    },

    //展示上一周
    preWeek:function () {
      var cacheList = this.listWeek;
      var firstDay = cacheList[0].id;
      var lastDay = cacheList[6].id;
      var firstDate = new Date(cacheList[0].date);
      //上个月的天数
      var preDaysCount = timeUtil.getPreMonthDayFromYearAndMonth(this.searchYear,this.searchMonth);
      var preMonthDate = timeUtil.getPreMonthDateFromYearAndMonth(this.searchYear,this.searchMonth);
      var lastDate = new Date(cacheList[6].date);
      var retArray = new Array();
      this.searchYear = firstDate.getFullYear();
      this.searchMonth = firstDate.getMonth() * 1 + 1;
      if (firstDay <8){
        if (this.searchYearV == 2018 && this.searchMonthV == 4){
          return;
        }
          this.getColorListByDate(preMonthDate.getFullYear()+"/"+(preMonthDate.getMonth() * 1 + 1)+"/01");
          this.searchYear = preMonthDate.getFullYear();
          this.searchMonth = preMonthDate.getMonth() * 1 + 1;

      }
      for(var i = 6;i>=0;i--){
        var obj = new Object;
        var cacheId = firstDay - i  - 1;
        if (cacheId <= 0){//计算到上个月时
          cacheId = cacheId + preDaysCount;
          obj.date = preMonthDate.getFullYear() + '/' + (preMonthDate.getMonth()*1 + 1) + '/' + cacheId;
          //小于2018年4月 不予跳转
          if (this.searchYearV == 2018 && this.searchMonthV == 4){
            return;
          }
        }else {
          obj.date = firstDate.getFullYear() + '/' + (firstDate.getMonth() * 1 + 1) + '/' + cacheId;
          obj.otherMonth = 'nowMonth';
        }
        //临界值 当刚好切换至上个月的周日历 当前完全属于下个月的周日历的 1，2，3，4，5，6，7
        if (i == 0 && cacheId == preDaysCount){
          this.getList(new Date(preMonthDate.getFullYear()+'/'+(preMonthDate.getMonth() * 1 + 1)+'/'+preDaysCount))
          this.searchYear = preMonthDate.getFullYear();
          this.searchMonth = preMonthDate.getMonth() * 1 + 1;
        }
        if (i == 6){
          this.searchDay = cacheId;
          obj.chooseDay = true;
        }
        obj.id = cacheId;
        retArray.push(obj);
      }
      this.myDate = new Date(this.searchYear+'/'+this.searchMonth+'/'+this.searchDay);
      this.listWeek = retArray;
//      this.$emit("choseDay",this.searchYear+'/'+this.searchMonth+'/'+this.searchDay);
      this.updateTopYearAndMonth();
    },

    //展示下一周
    nextWeek:function () {
      //取当前周  确认当前周的最后一天是否小于 当前月最大天数-7 如果大于 说明下一周周日历跨月  跨月时 当前仍然展示当前月 取当前周日历最后一个元素的年月当做当前年月
      //并且按照结果周日历的首元素作为默认选中行
      var cacheList = this.listWeek;
      var currentFirstWeekItem = this.listWeek[i];
      var lastDay = cacheList[6].id;
      var lastDate = new Date(cacheList[6].date);
      var daysCount = timeUtil.getDaysFromYearAndMonth(this.searchYear,this.searchMonth);
      var retArray = new Array();
      //最后一项周日历的年月
      var cacheYear = lastDate.getFullYear();
      var cacheMonth = lastDate.getMonth()* 1+1;

      //下个月日期
      var nextMonthDate = timeUtil.getNextMonthDateFromYearAndMonth(cacheYear,cacheMonth);
      this.searchMonth = lastDate.getMonth()*1+1;
      this.searchYear = lastDate.getFullYear();
      if (lastDay > daysCount - 7){//包含下个月 必须切换月
        this.getColorListByDate(nextMonthDate.getFullYear()+"/"+(nextMonthDate.getMonth()*1+1)+"/01");
      }
      for (var i = 0;i< 7;i++){
          var obj = new Object;
          var cacheId = lastDay + i + 1;
          if (cacheId > daysCount){//计算到下个月时
            cacheId = cacheId - daysCount;
            obj.date = nextMonthDate.getFullYear() + '/' + (nextMonthDate.getMonth()* 1 + 1) + '/' + cacheId;
          }else {
            obj.otherMonth = 'nowMonth';
            obj.date = lastDate.getFullYear() + '/' + (lastDate.getMonth()*1+1) + '/' + cacheId;
          }
          //临界值 当刚好切换至下个月的周日历 完全属于下个月的周日历的 1，2，3，4，5，6，7
          if (i == 0 && cacheId == 1){
            this.searchYear = nextMonthDate.getFullYear();
            this.searchMonth = nextMonthDate.getMonth() * 1 + 1;
            this.myDate = new Date(this.searchYear+'/'+this.searchMonth+'/'+this.searchDay);
            this.getList(new Date(this.searchYear+'/'+this.searchMonth+'/'+'01'));
          }
          if (i == 0){
            this.searchDay = cacheId;
            obj.chooseDay = true;
          }
          obj.id = cacheId;
          retArray.push(obj);
      }
      this.myDate = new Date(this.searchYear+'/'+this.searchMonth+'/'+this.searchDay);
      this.listWeek = retArray;
      this.updateTopYearAndMonth();
    },

    updateTopYearAndMonth(){
//      console.info('updateTopYearAndMonth',this.searchYear + '-' + this.searchMonth+'-' + this.searchDay);
      this.searchYearV = this.searchYear;
      this.searchMonthV = this.searchMonth;
      if (this.searchMonth*1 < 10){
        this.dateTop = this.searchYear + '-0' + this.searchMonth;
        this.searchMonthV = '0'+this.searchMonth;
      }else {
        this.dateTop = this.searchYear + '-' + this.searchMonth;
      }
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      this.$emit('dayInfoListChange', this.cacheMonthList.get(this.searchYear + '-' + this.searchMonth));
      this.getList(this.myDate,this.searchYear+'/'+this.searchMonth+'/'+this.searchDay);

    },

    getList: function (date, chooseDay) {
//      console.info('getList-chooseDay:',chooseDay);
      if(date.getMonth()*1>8){
        this.dateTop = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }else{
        this.dateTop = `${date.getFullYear()}-0${date.getMonth() + 1}`;
      }
      let arr = timeUtil.getMonthList(this.myDate);
      for (let i = 0; i < arr.length; i++) {
        let k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;

        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (chooseDay && chooseDay == nowTime) {
          this.$emit('choseDay', nowTime);
          k.chooseDay = true;
        } else {
          k.chooseDay = false;
        }
      }
      this.searchDay=timeUtil.formatDay(this.myDate);
      this.searchMonth=timeUtil.formatMonth(this.myDate);
      this.searchYear=timeUtil.formatYear(this.myDate);
      this.searchWeek=timeUtil.formatWeek(this.myDate);
      this.getColorList();
      this.list = arr;
      this.$emit('updateViewTop');
      this.$emit('monthListLength', this.list.length)
    },

    updateViewList:function () {
      var arr = this.list;
      this.list = arr;
      this.$emit('monthListLength', this.list.length)
    },


    updateParentsCurrentDayInfoList:function () {
      return this.updateParentsDataList();
    },

    getListWeek: function (chooseDay){
        this.listWeek=new Array();
        if (this.searchWeek === 0) {
          this.searchWeek = 7;
        };
        var cacheWeek = timeUtil.formatWeek(chooseDay);
        var cacheDate = new Date(chooseDay);
        var daysCount = timeUtil.getDaysFromYearAndMonth(this.searchYear,this.searchMonth);
        var preMonthDaysCount = timeUtil.getPreMonthDayFromYearAndMonth(this.searchYear,this.searchMonth);
        var preMonthDate = timeUtil.getPreMonthDateFromYearAndMonth(this.searchYear,this.searchMonth);
        var nextMonthDate = timeUtil.getNextMonthDateFromYearAndMonth(this.searchYear,this.searchMonth);
        for (let i = cacheWeek - 1; i >= 0; i -= 1) {
          let d=new Object();
           d.id=cacheDate.getDate()*1 - i-1;
          if (cacheDate.getDate() == d.id){
            d.chooseDay = true;
          }else {
            d.chooseDay = false;
          }
          if (d.id <= 0){
              d.id = preMonthDaysCount + d.id;
              d.otherMonth = 'preMonth';
              d.date = preMonthDate.getFullYear() + '/' + (preMonthDate.getMonth() * 1 + 1 )+'/'+d.id;
          }else {
            d.otherMonth='nowMonth';
            d.date = this.searchYear+'/'+this.searchMonth + '/' + d.id;
          }

          this.listWeek.push(d);
        }
        for (let i = 1; i <= 7 - cacheWeek; i += 1) {
          let d=new Object();
           d.id=cacheDate.getDate()*1 + i-1;
           if (d.id > daysCount){
             d.id = d.id - daysCount;
             d.date = nextMonthDate.getFullYear()+'/'+(nextMonthDate.getMonth()*1+1 )+ '/' + d.id;
           }else {
             d.otherMonth='nowMonth';
             d.date = this.searchYear+'/'+this.searchMonth + '/' + d.id;
           }
          if (cacheDate.getDate() == d.id){
            d.chooseDay = true;
          }else {
            d.chooseDay = false;
          }
           this.listWeek.push(d);
        }
        this.updateMonthView();
    },
  },
  mounted() {
    //alert(this.$refs.ced.clientHeight);
  },
  watch: {
    agoDayHide(val, oldVal) {
      this.agoDayHide = parseInt(val);
      this.getList(this.myDate);
    },
    futureDayHide(val, oldVal) {
      this.futureDayHide = parseInt(val);
      this.getList(this.myDate);
  },
  list(val){
      this.$emit('monthListLength', this.list.length)
      this.$emit('changeShowWeekStatus', !this.isShowMonth)
      if(this.isShowMonth){
          this.$emit('monthListLength', this.list.length)
      }else{
          this.$emit('monthListLength', 0)
      }
  },
    isShowMonth(val){
        this.$emit('changeShowWeekStatus', !val)
        if(val){
            this.$emit('monthListLength', this.list.length)
        }else{
            this.$emit('monthListLength', 0)
        }

    }
  }
};
</script>
