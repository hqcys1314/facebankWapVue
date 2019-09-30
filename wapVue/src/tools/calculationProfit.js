export {default as utils} from './utils';
import {cal} from'tools'

function currency(number) {
    return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
function calEqual(rate, amount, proInfo) {
    var monthRate = rate / 1200;
    var monthMoney = amount * monthRate * Math.pow(1 + monthRate, proInfo.termCount) / (Math.pow(1 + monthRate, proInfo.termCount) - 1)

    var rateValue = (monthMoney * proInfo.termCount - amount).toFixed(2);
    return rateValue;
}
function calStep60Ajax(rate, amount, proInfo) {
    var _this = this;
    var data = '{';
    if (proInfo.repaymentType == 4) {
        data += '"termUnit":"' + proInfo.termUnit + '"';
        data += ',"termCount":"' + proInfo.termCount + '"';
        data += ',"amount":"' + amount + '"';
        data += ',"dateDiff":"' + proInfo.dateDiff + '"';
        data += ',"allDateDiff":"' + proInfo.allDateDiff + '"';
        data += ',"repaymentType":"' + proInfo.repaymentType + '"';
        data += ',"fixDate":"' + proInfo.fixDate + '"';
        data += ',"rate":"' + rate + '"';
    } else {
        data += '"termUnit":"' + proInfo.termUnit + '"';
        data += ',"termCount":"' + proInfo.termCount + '"';
        data += ',"amount":"' + amount + '"';
        data += ',"dateDiff":"' + proInfo.dateDiff + '"';
        data += ',"allDateDiff":"' + proInfo.allDateDiff + '"';
        data += ',"repaymentType":"' + proInfo.repaymentType + '"';
        data += ',"rate":"' + rate + '"';
    }
    data += '}';
    var val = 0;
    $.ajax({
        url: utils.AJAXDOMAINNAME+ (proInfo.repaymentType == 4 ? '/userInvestInterestCalS': '/userInvestInterestCal'),
        data: data,
        async: false,
        success: function(rs) {
            var data = JSON.parse(rs.data)
            val = data.interest
        }
    })
    return val;
}
function calEqual60(rate, proInfo, amount, type, stype) {
    var couponProfit = 0;
    if (proInfo.termUnit == 3 && proInfo.assetType == 60 && (proInfo.repaymentType == 3 || proInfo.repaymentType == 4)) {
        if (type == 2 && stype == 1) {
            couponProfit = rates;
        }else{
            couponProfit = this.calStep60Ajax(rates);
        }
        return Number(couponProfit) ;
    }
}
//
/*
    rates : 利率
    proInfo : 商品信息
    amount : 投资金额
    type : 1-返现卡 2-红包
    stype :
        if(type == 1){
            1 : 定额卡，
            2 : 次卡
            3 : 无限卡
        }else if(type == 2){
            1 : 返现红包
            2 : 加息红包
        }
*/
export default function(rates, proInfo, amount, type, stype,nowDay,firstRepaymentDate){
    let couponProfit = 0;
    let rate = (type*1 == 1) ? (rates/10) : rates;

    if (proInfo.termUnit == 1) {//按天
      if(proInfo.repaymentType==5){
        if(type == 2 && stype == 1){
            couponProfit = rate;
        }else{
            couponProfit=cal.getProfit(amount,rate,nowDay,proInfo.termCount,firstRepaymentDate);
        }
      }else{
        //红包利息
        if(type == 2 && stype == 1){
            couponProfit = rate;
        }else{
            couponProfit = (amount * proInfo.termCount * rate / (365*100)).toFixed(2);
        }
      }

    }else if (proInfo.termUnit == 3) {//按月
        if (proInfo.repaymentType == 4 && proInfo.assetType == 60) {
            this.calEqual60(rates, proInfo, amount, type, stype);
        } else if (proInfo.repaymentType == 3) {//等额本息计算
            if (proInfo.assetType == 60) {
                couponProfit = calEqual60(rate, amount, proInfo);
            }else{
                if (type == 2 && stype == 1) {
                    couponProfit = rate;
                } else {
                    couponProfit = calEqual(rate, amount, proInfo);
                }
            }
        }else if(proInfo.repaymentType == 1){
            if(type == 2 && stype == 1){
                couponProfit = rate;
            }else{
                couponProfit = (amount * (rate/100) / 12) * (proInfo.termCount*1);
            }
        } else{
            if(type == 2 && stype == 1){
                couponProfit = rate;
            }else{
                couponProfit = (amount * (proInfo.termCount*1) * rate / 1200).toFixed(2);
            }
        }
    }
    return currency(Number(couponProfit));
};
