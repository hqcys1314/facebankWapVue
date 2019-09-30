<template>
    <div v-if="utils.borwer().weixin">
        <div class="icons shareBtn" @click="showShareLayer">分享</div>

        <div class="share_page" :style="'z-index:'+ (showShareStatus ? '1000' : '-1') +';opacity:'+(showShareStatus ? '1' : '0')">
            <div class="layer_share" :style="'bottom:'+(showShareStatus ? '0' : '-100%')">
                <div class="layer_header">
                    <a href="javascript:;" class="close" @click="closeLayer()"></a>
                    <span>邀请好友</span>
                </div>
                <div class="layer_content">
                    <div class="share_tips">温馨提示:此分享仅做产品分享，无法建立合伙人关系.如需建立合伙人关系，请使用合伙人邀请</div>
                    <div class="talk">
                        <div class="face"><img src="//static.facebank.cn/static/wapFront/depository/img/face.png?v=1"></div>
                        <div class="talk_con">{{shareContents[currentContentId]}}</div>
                    </div>
                    <div class="switch_bar">
                        <a href="javascript:;" :class="{'current':currentContentId == 0}" @click="switchShareContent(0)">邀请亲人</a>
                        <a href="javascript:;" :class="{'current':currentContentId == 1}" @click="switchShareContent(1)">邀请好友</a>
                        <a href="javascript:;" :class="{'current':currentContentId == 2}" @click="switchShareContent(2)">邀请同学</a>
                    </div>
                </div>
                <div class="layer_btn">
                    <a href="javascript:;" @click="startShare" class="btn_tpls">发送邀请</a>
                </div>
            </div>
        </div>

        <div class="share_background" v-show="showShareBack" @click="showShareBack = false"></div>
    </div>
</template>
<script>
    export default {
      name: 'shareComponents',
      props: ['investCode', 'shareTitle', 'shareContent', 'isLogin'],
      data () {
          return {
              userLogined : false,
              showShareBack : false,
              showShareStatus : false,
              shareUrl : '',
              currentContentId : 0,
              shareContents : [
                  '我在这里笑享收益，推荐给你。虽然彼此陪伴的时间越来越少，但我希望你越来越好。',
                  '少一些来日方长，多一点后会有期，这个产品推荐给你，轻松赚钱。省下时间，不如相聚。',
                  '盒饭一起吃，床板一起睡，有钱一起赚！不求天天能相逢，只求月月好收益！'
              ],
              shareTitles : '我赚了！你快来！这是我发的，这个产品你看看！'
          }
      },
      created:function(){
          this.switchShareContent(this.currentContentId)
      },
      methods:{
          closeLayer(){
              this.showShareStatus = false;
          },
          showShareLayer(){
              if(this.userLogined || this.isLogin){
                  this.showShareStatus = true;
              }else{
                  this.showShareBack = true;
              }
          },
          switchShareContent(id){
              this.currentContentId = id;
              this.$emit('update:shareTitle', this.shareTitles)
              this.$emit('update:shareContent', this.shareContents[id])
          },
          startShare(){
              this.showShareBack = true;
              this.showShareStatus = false;
              this.$emit('updateShareData', '')
          },
          closeShareBack(){
              this.showShareBack = false;
          }
      },
      watch : {
          isLogin : function(val){
              this.userLogined = val;
          }
      }
    }
</script>
<style scoped>
.shareBtn{background:url(~assets/images/icon_share.png) no-repeat center center/1.125rem 1.125rem;}
.share_page{ display:block;width:100%;height:100%;left:0;bottom:100%;top:0; position: fixed;z-index:100;background:rgba(47,50,61,0.8);-webkit-transition:0.3s;-moz-transition:0.3s;-o-transition:0.3s;transition:0.3s; opacity: 0;}
.layer_share{display:block;width:100%; position: absolute;left:0;top:auto;bottom:-100px;background:#FFFFFF;-webkit-transition:0.3s;-moz-transition:0.3s;-o-transition:0.3s;transition:0.3s;}
.layer_share .layer_header{height:3.25rem;line-height:3.25rem; text-align: center;font-size:1rem;color:#2B313D; position:relative;top:0;}
.layer_share .layer_header span{display:block;margin:0 5rem;font-weight:bold;}
.layer_share .layer_header .close{width:3.25rem;height:3.25rem;display:block; float:left;background:url('//static.facebank.cn/static/wapFront/common/images/icon/icon_close2.png') no-repeat center center/1rem 1rem;}
.layer_share .layer_content{padding-top:1rem;height:auto;overflow:hidden;border-top:1px solid #DFE3EB;}
.layer_share .layer_content .share_tips{display:block;padding:.5rem .75rem;color:#848999;background:#F2F4F8;border-radius:.25rem;font-size:.6875rem;line-height:.875rem;margin:0 1rem;margin-bottom:1.125rem;}
.layer_share .talk{height:auto;overflow:hidden;padding-bottom:1rem;}
.layer_share .talk .face{width:2.75rem;height:2.75rem;margin-left:1rem;float:left;border-radius:3rem;background:#f2f4f8;overflow:hidden;}
.layer_share .talk .face img{width:100%;height:100%;}
.layer_share .talk .talk_con{background:#FFF6F6;margin-left:4.5rem;margin-right:1rem;box-shadow:0 0 0 1px #FCDBDC inset;border-radius:.375rem;;color:#B26E71;font-size:.875rem;line-height:1.25rem;padding:0.8125rem 1.125rem 1rem 1rem; position:relative;min-height:3.75rem;}
.layer_share .talk .talk_con:after{width:.75rem;height:.75rem; transform: rotate(-45deg);-webkit-transform: rotate(-45deg);background:#FFF6F6;border-top:1px solid #FCDBDC;border-left:1px solid #FCDBDC;content:' ';overflow:hidden; position: absolute;left:-.4rem;top:1rem;}
.layer_share .switch_bar{ display:block;height:auto;overflow:hidden;padding-left:1rem;padding-bottom:1rem;}
.layer_share .switch_bar a{width:6.625rem;height:2rem;float:left;line-height:2rem;display:block;border-radius:2rem; text-align:center;box-shadow:0 0 0 1px #BCC2CC inset;color:#848999;font-size:.875rem;margin-right:.75rem;}
.layer_share .switch_bar a.current{color:#F0484E;box-shadow:0 0 0 1px #F0484E inset;}
.layer_share .layer_btn .btn_tpls{width:auto;margin:0 1rem;margin-bottom:1.25rem;}
.share_background{width:100%;height:100%; position: absolute;left:0;z-index:101;top:0;background:url('//static.facebank.cn/static/wapFront/common/images/icon/share_bg.png') no-repeat 14rem 2rem/7.34375rem auto;background-color:rgba(0,0,0,.6);}
</style>
