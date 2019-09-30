<template>
  <div id="pwdManage">
      <div class="menu_item">
          <a class="item" @click="toChangePass">
              <p>
                  <span>修改登录密码</span>
                  <i class="iconfont icon-ic_rightarrow arrow2"></i>
              </p>
          </a>
      </div>
  </div>
</template>
<style scoped src="assets/wapFront/information/css/information.css">
</style>
<script>
export default {
    name: 'pwdManage',
    methods : {
        toChangePass(){
            var _this = this;
            setTimeout(()=>{
                this.$router.push({
                    path : '/alertLoginPwd'
                })
            },250)
        }
    }
}
</script>
