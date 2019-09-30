<template>
    <div class="items">
      <!-- <a :href='"https://cms"+utils.CMSSET+".facebank.cn/safe.html"'>
         <span>&nbsp;</span>安全保障
      </a> -->
      <a href="/riskWarnings">
        <span >&nbsp;</span>项目风险提示
       </a>
    </div>
</template>
<style>
.creditorDetail .items,
.directInvestDetail .items{ display:block;background:#FFFFFF;margin-bottom:.46875rem;}
.creditorDetail .items a,
.directInvestDetail .items a{ display:block;border-bottom:1px solid #EFF1F4;margin-left:1.25rem;height:3.3125rem;line-height:3.53;padding-right:.9375rem;font-size:.9375rem;}
.creditorDetail .items a span,
.directInvestDetail .items a span{float:right; display:block; white-space:nowrap;color:#848999;padding-right:1.375rem;background:url(~assets/wapFront/common/img/arrow_r.png) no-repeat center right/auto .8125rem; }
.creditorDetail .items a .bicon_warn,
.directInvestDetail .items a .bicon_warn{padding-right:1.78125rem;background:url(~assets/wapFront/common/img/bicon_warn.png) no-repeat right center/auto 1.25rem;}
</style>
<script>
    import {utils} from 'tools';
    export default {
      name: 'detailItemTips',
      data () {
          return {
              curVersion : '',
              curDevice : ''
          }
      },
      created:function(){
          this.curDevice = utils.getCookie('curDevice');
          this.curVersion = utils.getCookie('curVersion');
      }
    }
</script>
