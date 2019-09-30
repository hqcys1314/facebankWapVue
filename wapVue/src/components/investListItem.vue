<template>
<li class="autoConfigLi">
    <div class="li_content">
        <div class="tags">
            <span></span>
            <span v-if="listItem.isEnableFirstAddCash=='1'">首购返现</span>
            <span v-if="listItem.activityRate*1 > 0 && listItem.activityRemainTime*1 > 0">限时加息</span>
            <span v-if="listItem.saleTags != null && listItem.saleTags.length > 0 && index<tagShowCount" v-for="(it, index) in listItem.saleTags">{{substrings(it, 4)}}</span>
        </div>
        <div class="infos">
          <p class="lv">
              <span>
                <span><strong>{{listItem.rate}}</strong></span><i>%</i>
                <span class="ar" v-if="listItem.activityRate*1 > 0">+<strong>{{listItem.activityRate}}</strong></span><i v-if="listItem.activityRate*1 > 0">%</i>
              </span>
              <i>借款合同约定年化利率</i>
          </p>
          <p class="p2">
              <span>
                <strong>{{listItem.termCount}}</strong>
                <font>{{listItem.termUnit==1 ? '天' : listItem.termUnit==3 ? '个月' : ''}}期限</font>
              </span>
              <i>可出借
                {{listItem.remainAmount | formatNumber2}}{{listItem.remainAmount*1 < 10000 ? '' : '万元'}}
              </i>
          </p>

        </div>
        <a href="javascript:;" :id="'btnInvest_'+listItem.rate" class="btn_invest"><span class="newMobile" style="display:none;"></span>出借</a>
    </div>
</li>

</template>
<script>
    export default {
      name: 'listItem',
      props: ['listItem'],
      data(){
          return {
              time : 0,
              timer : null,
              tagShowCount : 3,
          }
      },
      filters : {
          formatNumber2(num){
              if(num*1<10000){
                  return '不足1万元';
              }else{
                  var nums = new Number(num)
                  //num = nums.toLocaleString()
                  return parseInt((num/10000).toFixed(2)*100)/100;
              }
          }
      },
      mounted:function(){
          if(this.listItem.isEnableFirstAddCash=='1'){
              this.tagShowCount--;
          }
          if(this.listItem.activityRate*1 > 0 && this.listItem.activityRemainTime*1 > 0){
              this.tagShowCount--;
          }
      },
      methods:{
          //获取字符长度
          len : function(s){
              if(!s) return '';
              var l = 0;
              var a = s.split("");
              for (var i=0;i<a.length;i++) {
                  if (a[i].charCodeAt(0)<299){
                      l++;
                  }else{
                      l+=2;
                  }
              };
              return Math.ceil(l/2);
          },
          substrings(val, len){
              if(!val) return;
              var lastVal = this.len(val) > len ? (val.substring(0,len)) : val
              return lastVal;
          },
          selectItem(){

          }
      }
    }
</script>
<style scoped>
li.autoConfigLi{ display:block;margin-bottom:.3125rem;height:auto;overflow:hidden; background:#FFFFFF; position: relative;margin-left:1em;background:#F5F5F5;border:0;-webkit-tap-highlight-color:transparent;}
li.autoConfigLi .li_content{border:0;margin-bottom:1px;background:#FFFFFF;padding:1.125rem 1rem 1.065rem 0; position: relative;}
li.autoConfigLi .tags{display:block;height:auto;overflow:hidden;margin-bottom:.875rem;}
li.autoConfigLi .tags span{float:left;margin-right:.375rem;border-radius:.5rem;padding:0 .375rem;line-height:1rem;font-size:.625rem;color:#B88A2D;background:#FDF2E5;margin-right:.4375rem;}
li.autoConfigLi .box{display: block;padding:0;margin:0;}
li.autoConfigLi .btn_invest{width:3.375rem;display:block;line-height:1.625rem;font-size:.75rem; text-align:center;border:1px solid #F0484E;color:#F0484E; position: absolute;right:1rem;bottom:2rem;border-radius:1.08rem;}
li.autoConfigLi .btn_invest:active{background:#F0484E;color:#FFFFFF;}
li.autoConfigLi .infos{ display: block;;height:auto;overflow:hidden;}
li.autoConfigLi p{float:left;min-width:4.8125rem;}
li.autoConfigLi p span{ display: block;line-height:2rem;color:#848899;font-size:.6875rem;height: 2rem;margin-bottom:.1875rem;}
li.autoConfigLi p span span{display:inline-block;padding-top:.5rem;font-size:.875rem;}
li.autoConfigLi p strong{font-family:Arial, Microsoft YaHei;}
li.autoConfigLi p i{font-style: normal; display: block;font-size:.6875rem;line-height:1.5;color:#848999;}
li.autoConfigLi p span i{font-size:1rem;font-style:normal;line-height:1;color:#F0484E;display:inline-block;}
li.autoConfigLi .lv{width:10.375rem;float:left;}
li.autoConfigLi .lv span{color:#F0484E;}
li.autoConfigLi .lv span span{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.875rem;}
li.autoConfigLi .lv span span.ar{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.375rem;}
li.autoConfigLi .p2{padding-top:.5rem;}
li.autoConfigLi .p2 span{line-height:1.5rem;height:1.5rem;}
li.autoConfigLi .p2 strong{color: #2b313d;}
li.autoConfigLi .p2 span strong{font-size: 1.375rem;}
li.autoConfigLi .p2 font{color: #2b313d;}
li.autoConfigLi span.newMobile{width:2.3125rem;height:1rem; position: absolute;right:-.6875rem;top:-.6875rem;background:url("~assets/wapFront/invest/img/firstIcon.png") no-repeat center center/100% 100%;}
</style>
