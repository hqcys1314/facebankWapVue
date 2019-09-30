import {utils,globalVariable} from'tools'

export default {
  //format日期
  dateFormat: function (date) {
      date = new Date(date)
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

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

  //计算N个自然月后的日期
  calMonthN(date,count){
        if(count*1>0){
               count--;
               date=this.getOtherMonth(date,'nextMonth');
               return this.calMonthN(date,count);
        }else{
               return date;
        }

  },
/**
 * 获取add个月的日期
 */
getAddMonth:function(date,add) {
    const timeArray = this.dateFormat(date).split('/')
    const year = timeArray[0]
    const month = timeArray[1]
    const day = timeArray[2]
    var year2 = year
    //加add个月
    var month2 = parseInt(month) + add
    if (month2 >= 13&&add>0) {
      year2 = parseInt(year2) + 1
      month2 = month2-12
    }else if(month2 <=0&&add<0){
        year2 = parseInt(year2) - 1
      month2 = month2+12
    }
    var day2 = day
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
    const t2 = year2 + '-' + month2 + '-' + day2
    return t2
},

  //计算两个日期之间的天数差
  dateDifference:function (sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
      var dateSpan,
          tempDate,
          iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays
  },
  //计算两个日期之间的月份差
	monthDifference:function (sDate1, sDate2){//sDate1和sDate2是2006-12-18格式
	  var day1 = new Date(sDate1);
		var day2 = new Date(sDate2);
		var month1 = day1.getMonth();
		var month2 = day2.getMonth();
		var year1 = day1.getFullYear();
		var year2 = day2.getFullYear();
		var monthDiff = month1-month2;
		//如果年份不同，需要在这基础上加上12个月，这样的话
		if(year1-year2!=0){
		  monthDiff = monthDiff + (year1-year2)*12
		}
		return Math.abs(monthDiff);
	},
  /*
 * 初始化参数，根据起息日，时长，第一期起息日，获取理论起息日、实际起息日、理论起息日与实际起息日之间时间差、实际起息日是否包含理论起息日、期数、真实最后还款日期
 */
initParams:function(startInterestDate,termCount,firstEndInterestDate){
  var result = new Array();
  //获取真实还款日上个月的当日，作为理论起息日
  var lastMonthStartInterest = this.getAddMonth(firstEndInterestDate,-1);
  result[0] = lastMonthStartInterest;
  result[1] = startInterestDate;
  //计算真实起息日与第一期还款日之间的日期差
  var realDayDiff = this.dateDifference(startInterestDate,firstEndInterestDate);
  //真实起息日与止息日之间的时间差
  var dayDiff = this.dateDifference(lastMonthStartInterest,firstEndInterestDate);
  //真实最后一天还款日
  var realLastDate = this.AddDays(startInterestDate,termCount);
  //第一期还款日与理论最后一期还款日之间的月份差，用来计算期数
  var monthDiff = this.monthDifference(lastMonthStartInterest,realLastDate);
  //理论最后一期还款日
  var planLastDate = this.getAddMonth(lastMonthStartInterest,monthDiff);
  if(new Date(planLastDate)<new Date(realLastDate)){
     monthDiff = monthDiff+1;
  }
  //是否包含起息日
  var bln = true;
  if(realDayDiff<dayDiff){
  bln = false;
  }
  //理论起息日与真实起息日之间时间差
  result[2] = this.dateDifference(lastMonthStartInterest,startInterestDate);
  result[3] = bln;//是否包含起息日
  result[4] = monthDiff;
  result[5] = realLastDate;//真实最后一天还款日
  return result;
},
/**
   * 获取dayIn天的日期
   */
AddDays:function(date,dayIn) {
  var myDate=new Date(new Date(date).getTime()+dayIn*24*60*60*1000);
  var year=myDate.getFullYear();
  var month=myDate.getMonth()+1;
  var day=myDate.getDate();
  var CurrentDate=year+"-";
  if(month>=10)
  {
    CurrentDate=CurrentDate+month+"-";
  }
  else
  {
    CurrentDate=CurrentDate+"0"+month+"-";
  }
  if(day>=10)
  {
    CurrentDate=CurrentDate+day;
  }
  else
  {
    CurrentDate=CurrentDate+"0"+day;
  }
  return CurrentDate;
},
PMT:function(rate,term,financeAmount){
      var v = (1 + (rate / 12));
      var t = (-(term / 12) * 12);
      var result = (financeAmount * (rate / 12)) / (1 - Math.pow(v, t));
      return result;
},
getPayPlan:function(intRate,payTimes,loanMoney,startInterestDate){
    var list = new Array();
    var mthMoney = this.PMT(intRate, payTimes, loanMoney).toFixed(2);
    if(loanMoney>0){
      var balance = loanMoney.toFixed(2);
    }else{
      var balance = loanMoney;
    }
    for(var i=0;i<payTimes;i++){
        var repaySchedule = new Array();
        repaySchedule[0] = i+1;//期数
        repaySchedule[1] = (balance*intRate/12).toFixed(2);//利息
        if(i == payTimes - 1){
          repaySchedule[2] = balance.toFixed(2);//本金
        }else{
          repaySchedule[2] = (mthMoney-repaySchedule[1]).toFixed(2);//本金
        }
        repaySchedule[3] = mthMoney;//本期还款金额
        repaySchedule[4] = (balance - repaySchedule[2]).toFixed(2);//剩余本金
        repaySchedule[5] = this.getAddMonth(new Date(startInterestDate),i+1);//当期还款日期,转化格式
        balance = balance - repaySchedule[2];
        list[i] = repaySchedule;
      }
      return list;
},
  //获取还款计划入口
  getRepayment:function (amount,borrowRate,startInterestDate,termCount,firstEndInterestDate){
    //初始化参数，理论起息日、起息日、理论起息日与真实起息日之间时间差、是否包含起息日、期数、最后一天还款日
    	  var params = this.initParams(startInterestDate,termCount,firstEndInterestDate);
    	  startInterestDate = params[0];//起息日换成新的理论起息日
    	  termCount = params[4];//期数换成新的期数
    	  //还款计划（期数、利息、本金、本期还款金额、剩余本金、还款日期）
    	  var rate = borrowRate/100;
    	  var list = this.getPayPlan(rate,termCount,amount,startInterestDate);

        var endInterestDate = list[list.length-1][5];
    	  var lastDays = this.dateDifference(params[5],endInterestDate);
    	  var cutInterest = list[list.length-1][2]*borrowRate*lastDays/(utils.DAYSET*100);
    	  var bln = params[3];//是否包含起息日
    	  for(var i=0;i<list.length;i++){
    	     var repayment = list[i];
    		 if(repayment[0]==1){
    		   //是否包含起息日
    		   if(params[3]&&params[2]>0){
    		     repayment[1]= (parseFloat(repayment[1])+amount*borrowRate*params[2]/(utils.DAYSET*100)).toFixed(2);
    		   }else{
    		     repayment[1]= (parseFloat(repayment[1])-amount*borrowRate*params[2]/(utils.DAYSET*100)).toFixed(2);
    		   }
    		 }else if(termCount == repayment[0]){//最后一期
    		   //利息减少金额=最后一期的本金*利率*日期差天数/100/365
    		   repayment[1] = (parseFloat(repayment[1])-cutInterest).toFixed(2);
            repayment[5] =params[5];
    		 }
    		 repayment[3] = (parseFloat(repayment[2])+parseFloat(repayment[1])).toFixed(2);
    		 list[i] = repayment;

    	  }
    	  return list;
  },
  //获取还款计划入口
  getProfit:function (amount,borrowRate,startInterestDate,termCount,firstEndInterestDate){
    //初始化参数，理论起息日、起息日、理论起息日与真实起息日之间时间差、是否包含起息日、期数、最后一天还款日
    	  var params = this.initParams(startInterestDate,termCount,firstEndInterestDate);
    	  startInterestDate = params[0];//起息日换成新的理论起息日
    	  termCount = params[4];//期数换成新的期数
    	  //还款计划（期数、利息、本金、本期还款金额、剩余本金、还款日期）
    	  var rate = borrowRate/100;
    	  var list = this.getPayPlan(rate,termCount,amount,startInterestDate);

        var endInterestDate = list[list.length-1][5];
    	  var lastDays = this.dateDifference(params[5],endInterestDate);
    	  var cutInterest = list[list.length-1][2]*borrowRate*lastDays/(utils.DAYSET*100);
    	  var bln = params[3];//是否包含起息日
        var profit=0;
    	  for(var i=0;i<list.length;i++){
    	     var repayment = list[i];
    		 if(repayment[0]==1){
    		   //是否包含起息日
    		   if(params[3]&&params[2]>0){
    		     repayment[1]= (parseFloat(repayment[1])+amount*borrowRate*params[2]/(utils.DAYSET*100)).toFixed(2);
    		   }else{
    		     repayment[1]= (parseFloat(repayment[1])-amount*borrowRate*params[2]/(utils.DAYSET*100)).toFixed(2);
    		   }
    		 }else if(termCount == repayment[0]){//最后一期
    		   //利息减少金额=最后一期的本金*利率*日期差天数/100/365
    		   repayment[1] = (parseFloat(repayment[1])-cutInterest).toFixed(2);
           repayment[5] =params[5];
    		 }
    		 repayment[3] = (parseFloat(repayment[2])+parseFloat(repayment[1])).toFixed(2);
    		 list[i] = repayment;
         profit=profit*1+repayment[1]*1;
    	  }
        return profit;
  },
}
