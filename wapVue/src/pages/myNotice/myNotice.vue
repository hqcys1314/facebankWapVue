<template>
  <div class="myNotice" id="myNotice"  v-cloak>
          <div class="mrDatecChoose" v-on:click="mrDateClick">
            {{dateTop}}<img src="/static/imgVar/downSJ.png">
          </div>
          <div class="mrDatecTk" v-show="mrDateTkShow">
              <div class="cont">
                 <ul>
                    <li v-for="yy in year" :class="{on:yy==searchYear}" v-on:click="chooseDate(yy,searchMonth)">{{yy}}年</li>
                 </ul>
                  <ul>
                     <li v-for="mm in month" :class="{on:mm==searchMonth}" v-on:click="chooseDate(searchYear,mm)">{{mm}}月</li>
                  </ul>
               </div>
               <ul class="mrBtn">
                <li v-on:click="cancel()">取消</li><li>&nbsp</li>
                <li><input name="changeDate" type="button" value="确定" v-bind:disabled="cdIsdisable"  v-on:click="changeDate()"></li>
              </ul>
          </div>
          <div class="myNoticeContent" v-show="!hasNotice">
              <!-- 出借人 出借用户 -->
              <div class="list" v-for="item in myNoticeList" >
                   <p class="p1" v-if="item.contractType=='1'">起息通知：您出借的标的{{item.relationId}}已起息，来源于{{item.productName}}.点击查看<a v-on:click="gotoUrl(item.pdfURL)">出借协议</a></p>
                   <p class="p1" v-if="item.contractType=='2'">放款通知：您借款的标的{{item.relationId}}已放款.点击查看<a v-on:click="gotoUrl(item.pdfURL)">出借协议</a></p>
                   <p class="p1" v-if="item.contractType=='3'">转让通知：您的转让标的{{item.relationId}}，已生成转让协议。{{item.relationId}}为转让标ID，转让协议为该转让ID的债权转让协议。点击查看<a v-on:click="gotoUrl(item.pdfURL)">转让协议</a></p>
                   <p class="p1" v-if="item.contractType=='4'">签约通知：您已成功开通银行存管账户，已成功签约<a v-on:click="gotoUrl(item.pdfURL)">{{item.contractTitle}}</a></p>
                   <p class="p1" v-if="item.contractType=='5'">签约通知：您已出借成功，已成功签约<a v-on:click="gotoUrl(item.pdfURL)">{{item.contractTitle}}</a></p>
                   <p class="p2">{{item.createTime}}</p>
              </div>
          </div>
         <div v-show="hasNotice" >
          <empty text="当前没有站内通知哦"></empty>
        </div>
  </div>
</template>

<style scoped src="./myNotice.less" lang="less"></style>

<script>
  import * as constants from './myNoticeConstants';
  import {utils} from 'tools';

  export default {
    name: constants.NAME,
    data() {
      return {
         hasNotice:false,
         myNoticeList:'',
         curDevice:'',
         curVersion:'',
         curVersionNum:0,
         searchYear:'2018',
         searchMonth:'5',
         year:[2018,2019],
         month:[1,2,3,4,5,6,7,8,9,10,11,12],
         cdIsdisable:false,
         mrDateTkShow:false,
      }
    },
    created:function () {
        var time = new Date();
        this.searchYear = time.getFullYear();
        this.searchMonth = time.getMonth()+1;
        if(this.searchMonth*1<10){
          this.dateTop=this.searchYear+'-0'+this.searchMonth;
        }else{
          this.dateTop=this.searchYear+'-'+this.searchMonth;
        }
        //读取cookies中的版本号及设备号
        this.curDevice=utils.getCookie('curDevice');
        this.curVersion=utils.getCookie('curVersion');
        if(this.curVersion) this.curVersionNum = parseInt(this.curVersion.replace(/\./g,""));
        var _this = this;
        $.ajax({
            url : utils.AJAXDOMAINNAME+"/wap/getUserAllContract",
            data:'{"year":"'+_this.searchYear+'","month":"'+_this.searchMonth+'"}',
            success : function(res){
              _this.cdIsdisable=false;
              _this.mrDateTkShow=false;
              if(res.code==1){
                _this.myNoticeList = res.data.contractList;
                if(_this.myNoticeList==null){
                  _this.hasNotice=true;
                }else{
                  if(_this.myNoticeList.length*1>0){
                    _this.hasNotice=false;
                  }else{
                    _this.hasNotice=true;
                  }
                }
              }
            },
            error:function(){
              _this.hasNotice=true;
            }
          })
      },
      methods: {
        mrDateClick:function(){
          this.mrDateTkShow=true;
          this.wapMcStatus=true;
        },
        chooseDate:function(year,month){
            this.searchYear=year;
            this.searchMonth=month;
        },
        cancel(){
          this.wapMcStatus=false;
          this.mrDateTkShow=false;
         },
        changeDate:function ()
          {
            this.cdIsdisable=true;
            if(this.searchMonth*1<10){
              this.dateTop=this.searchYear+'-0'+this.searchMonth;
            }else{
              this.dateTop=this.searchYear+'-'+this.searchMonth;
            }
            var _this = this;
            $.ajax({
                url : utils.AJAXDOMAINNAME+"/wap/getUserAllContract",
                data:'{"year":"'+_this.searchYear+'","month":"'+_this.searchMonth+'"}',
                success : function(res){
                  _this.cdIsdisable=false;
                  _this.mrDateTkShow=false;
                  if(res.code==1){
                    _this.myNoticeList = res.data.contractList;
                    if(_this.myNoticeList==null){
                      _this.hasNotice=true;
                    }else{
                      if(_this.myNoticeList.length*1>0){
                        _this.hasNotice=false;
                      }else{
                        _this.hasNotice=true;
                      }
                    }
                  }
                },
                error:function(){
                  _this.hasNotice=true;
                }
              })
        },
    	  gotoUrl:function(url){

    		  if(this.curDevice == 'android' && this.curVersionNum > 274){
    			  var urls = "{'str_webPdfUrl':'" + url + "'}";
                  android.jsInterfaceToActNew("Activity_PdfWeb",urls);
    	      }else{
    	    	  window.location.href=url;
    	      }
    	  }
      },
    mounted(){

    },
  }
</script>
