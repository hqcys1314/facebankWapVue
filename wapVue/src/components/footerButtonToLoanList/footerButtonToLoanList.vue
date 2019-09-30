<template>
    <div class="footer_button">
        <a href="javascript:;" @click="utils.toLoanlist()" class="btn_tpls">{{text}}</a>
    </div>
</template>
<script>
    export default {
      name: 'footerButtonToLoanList',
      props: ['text']
    }
</script>
<style scoped="scoped">
.footer_button{padding:1rem 0; position:fixed;width:100%; text-align:center;background:#FFFFFF;z-index:2;bottom:0;left:0;}
.footer_button a{margin-bottom:0;}
</style>
