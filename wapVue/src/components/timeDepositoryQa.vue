<template>
    <div class="product_intro">
        <div class="article">

            <div class="cont">
                <p v-for="(item, index) in productQaList">
                    <i>{{index+1}}、{{item.question}}</i>{{item.answer}}<br>&nbsp;
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'timeDepositoryQa',
  props : ['productQaList'],
  data(){
    return {
        hasStatic : false
    }
  },
  created :function(){

  },
  mounted:function(){

  },
  methods:{

  }
}

</script>
<style scoped>
.product_intro{ display:block;padding-left:1rem;margin-top:.625rem;background:#FFFFFF;}
.product_intro h2{line-height:3.25rem;border-bottom:1px solid #DFE3EB;font-size:1rem;color:#2b313d;height:auto;overflow:hidden;}
.product_intro .article{color:#848999;font-size:.75rem;line-height:1.25rem;}
.product_intro .article .cont h3{display:block;width:auto; white-space: nowrap;line-height:1.25rem;font-size:.875rem;font-weight:bold;color:#2B313D;margin:1.25rem 0 1.125rem;padding-right:.9375rem;background:url(//static.facebank.cn/static/wapFront/common/img/title_line.gif) no-repeat bottom center/100% 100%;float:left;clear:both;}
.product_intro .article .cont{clear:both;display:block;padding-bottom:1.5625rem;border-bottom:1px solid #DFE3EB;padding-right:1rem;}
.product_intro .article .cont:first-child{padding:1.25rem 0;}
.product_intro .article .cont p{display:block;clear:both;}
.product_intro .article .cont p span{color:#F0484E}
.product_intro .article>.cont:last-child{border:0;}
.product_intro .article .cont p i{display:block;font-style:normal;color:#2B313D;font-weight:600;}
.product_intro .article .cont dl{height:auto;overflow:hidden;width:4.5rem;float:left; text-align:center;}
.product_intro .article .cont>dl:last-child{margin-bottom:0}
.product_intro .article .cont dl dt{display:block;height:2rem;margin-bottom:.5rem;}
.product_intro .article .cont dl dd{display:block;line-height:1.5;font-size:.75rem;}
.product_intro .article .cont dl dd span{display:block;font-weight:600;color:#2B313D}
.product_intro .article .cont dl:nth-child(2){float:right;}
.product_intro .article .cont dl:nth-child(3){float:none;width:auto;margin:0 4.5rem;}
.product_intro .article .clear{width:1px;height:1px;float:left;clear:both;overflow:hidden;;}
.product_intro .article>.cont p a{color:#F0484E}
</style>
