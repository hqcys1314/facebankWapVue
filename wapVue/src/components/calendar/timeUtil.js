export default {
    //获取天
    formatDay(date) {
      date = new Date(date);
      return date.getDate();
    },
    formatMonth(date){
      date = new Date(date);
      return date.getMonth()*1+1;
    },
    formatYear(date){
      date = new Date(date);
      return date.getFullYear();
    },
    formatWeek(date){
      date = new Date(date);
      return date.getDay();
    },
    formatDate (year, month, day) {
      const y = year
      let m = month
      if (m < 10) m = `0${m}`
      let d = day
      if (d < 10) d = `0${d}`
      return `${y}-${m}-${d}`
    },
    //format日期
    dateFormat: function (date) {
        date = new Date(date)
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

    },
    //当某月的天数
    getDaysInOneMonth: function (date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const d = new Date(year, month, 0)
        return d.getDate()
    },
    //向前空几个
    getMonthweek: function (date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const dateFirstOne = new Date(year + '/' + month + '/1')
        return dateFirstOne.getDay() == 0 ? 0 : dateFirstOne.getDay()
    },
    /**
     * 获取当前日期上个月或者下个月
    */
    getOtherMonth: function (date, str = 'nextMonth') {
        const timeArray = this.dateFormat(date).split('/')
        const year = timeArray[0]
        const month = timeArray[1]
        const day = timeArray[2]
        let year2 = year
        let month2
        if (str === 'nextMonth') {
            month2 = parseInt(month) + 1
            if (month2 == 13) {
                year2 = parseInt(year2) + 1
                month2 = 1
            }
        } else {
            month2 = parseInt(month) - 1
            if (month2 == 0) {
                year2 = parseInt(year2) - 1
                month2 = 12
            }
        }
        let day2 = day
        const days2 = new Date(year2, month2, 0).getDate()
        if (day2 > days2) {
            day2 = days2
        }
        if (month2 < 10) {
            month2 = '0' + month2
        }
        if (day2 < 10) {
            day2 = '0' + day2
        }
        const t2 = year2 + '/' + month2 + '/' + day2
        return new Date(t2)
    },
    //上个月末尾的一些日期
    getLeftArr: function (date) {
        let arr = []
        const leftNum = this.getMonthweek(date)
        const num = this.getDaysInOneMonth(this.getOtherMonth(date, 'preMonth')) - leftNum + 1
        const preDate = this.getOtherMonth(date, 'preMonth')
        //上个月多少开始
        for (let i = 0; i < leftNum; i++) {
            const nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i)
            arr.push({
                id: num + i,
                date: nowTime,
                isToday: false,
                otherMonth: `preMonth`
            })
        }
        return arr
    },
    //下个月末尾的一些日期
    getRightArr: function (date) {
      // console.info('getRightArr',date.getFullYear() * 1,date.getMonth() * 1 + 1);
        let arr = [];
        // const nextDate = this.getOtherMonth(date, 'nextMonth');
      const nextDate = new Date(date.getFullYear() + '/' + (date.getMonth() * 1 + 1) + '/01');
        var cacheDate = new Date();
        cacheDate.setTime(nextDate.getTime()+this.getDaysFromYearAndMonth(nextDate.getFullYear(),nextDate.getMonth()*1+1)*24*60*60*1000)
        if (this.getMonthweek(cacheDate) == 0){
          return arr;
        }
        // console.info('getRightArr',cacheDate.getMonth() * 1 + 1);
        // console.info('getRightArr',this.getMonthweek(cacheDate));
        const _length = 7 - this.getMonthweek(cacheDate);
        for (let i = 0; i < _length; i++) {
            const nowTime = cacheDate.getFullYear() + '/' + (cacheDate.getMonth() + 1) + '/' + (i + 1);
            arr.push({
                id: i + 1,
                date: nowTime,
                isToday: false,
                otherMonth: `nextMonth`
            });
        }
        return arr;
    },

    //从指定的年月获取这个月上一个月的天数
    getPreMonthDayFromYearAndMonth:function (year,month) {
      if (!year || !month){
        return ;
      }
      var cacheDate = new Date(year + '/' + month +'/01');
      cacheDate.setTime(cacheDate.getTime() - 24 * 60 * 60 * 1000);
      return this.getDaysFromYearAndMonth(cacheDate.getFullYear(),cacheDate.getMonth() * 1+1);

    },
    //从指定的年月获取这个月下一个月的天数
    getNextMonthDayFromYearAndMonth:function (year,month) {
      if (!year || !month){
        return ;
      }
      var cacheDate = new Date(year + '/' + month + this.getDaysFromYearAndMonth(year,month));
      cacheDate.setTime(cacheDate.getTime() + 24 * 60 * 60 * 1000);
      return this.getDaysFromYearAndMonth(cacheDate.getFullYear(),cacheDate.getMonth() * 1+1);

    },
    //从指定的年月获取这个月的天数
    getDaysFromYearAndMonth:function (year,month) {
      if (year > 9999 || year<0 || month >12 || month < 1){
        return 0;
      }
      //二月特殊月
      if (month == 2){
        //闰年
        if ((year%4 == 0 && year % 100 != 0) || (year % 400 == 0)){
          return 29;
        }
        return 28;
      }
      return [0,31,30,31,30,31,30,31,31,30,31,30,31][month];
    },

    getNextMonthDateFromYearAndMonth:function (year,month) {
      if (!year || !month){
        return
      }
      var currentDays = this.getDaysFromYearAndMonth(year,month);
      var currentDate = new Date(year + '/' + month +'/'+currentDays);
      currentDate.setTime(currentDate.getTime()+24* 60 * 60 * 1000);
      return currentDate;
    },

    getPreMonthDateFromYearAndMonth:function (year,month) {
      if (!year || !month){
        return
      }
      var currentDate = new Date(year + '/' + month +'/'+'01');
      currentDate.setTime(currentDate.getTime()-24* 60 * 60 * 1000);
      return currentDate;
    },

    //获取某月的列表不包括上月和下月
    getMonthListNoOther: function (date) {
        let arr = [];
        const num = this.getDaysInOneMonth(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        let toDay = this.dateFormat(new Date())

        for (let i = 0; i < num; i++) {
            const nowTime = year + '/' + month + '/' + (i + 1)
            arr.push({
                id: i + 1,
                date: nowTime,
                isToday: toDay === nowTime,
                otherMonth: `nowMonth`
            })
        }
        return arr;
    },
    getWeekNoother:function(date){
      let arr = [];
      const ww = date.getDate();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let toDay = this.dateFormat(new Date())

      for (let i = ww; (i < ww+7)&&(this.getDaysInOneMonth(date)>i); i++) {
          const nowTime = year + '/' + month + '/' + (i + 1)
          arr.push({
              id: i + 1,
              date: nowTime,
              isToday: toDay === nowTime,
              otherMonth: `nowMonth`
          })
      }
      return arr;
    },
    //获取某月的列表 用于渲染
    getMonthList: function (date) {
        return [...this.getLeftArr(date), ...this.getMonthListNoOther(date), ...this.getRightArr(date)]
    },

    //获取某年月的第一周所在的周日历
    getWeekListByYearAndMonth:function (year,month) {
      var retArray = new Array();
      var preMonthDate = new Date(year + '/' + month + '/01');
      var leftArray = this.getLeftArr(preMonthDate);
      // console.info(leftArray);
      for (var i = 0;i<leftArray.length;i++){
        var obj = new Object();
        var date1 = new Date(leftArray[i].date.replace('-','/'));
        obj.date =  leftArray[i].date.replace('-','/');
        obj.otherMonth = 'preMonth';
        obj.id = date1.getDate();
        retArray.push(obj);
      }
      for (var i = 0; i< 7-leftArray.length;i++){
        var obj = new Object();
        obj.date = preMonthDate.getFullYear() + '/' + (preMonthDate.getMonth() * 1 + 1) +'/' + (i + 1);
        obj.id = i + 1;
        if ( i == 0){
          obj.chooseDay = true;
        }
        obj.otherMonth = 'nowMonth';
        retArray.push(obj);
      }
      return retArray;
    },

    //获取某年月日的第一周所在的周日历
    getWeekListByYearAndMonthAndDay:function (year,month,day) {
      // console.info('getWeekListByYearAndMonthAndDay:',year + '/' + month + '/' + day);
      var curDate = new Date(year + '/' + month + '/' + day);
      //此日期左边的日期数量
      var leftNum = curDate.getDay();
      //获取上个月的日期数量
      var preMonthDays = this.getPreMonthDayFromYearAndMonth(year,month);
      var currentDays = this.getDaysFromYearAndMonth(year,month);
      var preMonthDate = this.getPreMonthDateFromYearAndMonth(year,month);
      var nextMonthDate = this.getNextMonthDateFromYearAndMonth(year,month);
      var retItemArray = new Array();
      //左边的日期数组
      for (var i = leftNum ;i>0;i--){
        var obj = new Object();
        var cacheDay = day*1 - i;
        if (cacheDay <= 0){
           obj.date = preMonthDate.getFullYear() +'/' + (preMonthDate.getMonth() * 1 + 1) +'/' + (preMonthDays + cacheDay);
          obj.id = preMonthDays + cacheDay ;
        }else {
           obj.date = year + '/' + month + '/' + cacheDay;
           obj.id = cacheDay;
        }
        obj.chooseDay = false;
        obj.otherMonth = 'preMonth';
        retItemArray.push(obj);
      }
      //当前日期对象
      var curObj = new Object();
      curObj.date = year + '/' + month + '/' + day;
      curObj.chooseDay = true;
      curObj.id = day;
      retItemArray.push(curObj);
      curObj.otherMonth = 'nowMonth';
      //右边的日期数组

      var rightNum = 7 - leftNum - 1 ;
      for (var i = 0;i<rightNum ; i++){
        var obj = new Object();
        var cacheDay = day * 1 + i + 1;
        if(cacheDay > currentDays){
          obj.date = nextMonthDate.getFullYear() + '/' + (nextMonthDate.getMonth() * 1 + 1)+'/' + (cacheDay - currentDays);
          obj.id = cacheDay - currentDays;
        }else {
          obj.date = year + '/' + month + '/' + cacheDay;
          obj.id= cacheDay;
        }
        obj.chooseDay = false;
        obj.otherMonth = 'nextMonth';
        retItemArray.push(obj);
      }
      return retItemArray;
    },
}
