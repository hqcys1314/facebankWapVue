
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource  from 'vue-resource'
import * as HomeConstants from '../pages/home/homeConstants';
import * as loanListConstants from '../pages/loanList/loanListConstants';

import {utils, currency, Modal,globalVariable} from 'tools';
import * as pages from '../pages';
Vue.use(VueResource);
Vue.use(VueRouter);

const routes = [];
const routePaths = [];

for (const key in pages) {
  // 存放所有的路径
  routePaths.push(pages[key].path);
  // let ss='../pages/' + pages[key].name+'/'+pages[key].name + '.vue';
  // if(pages[key].path!='/home'&&pages[key].path!=''){
  //   pages[key].component=(resolve=>require([`${ss}`], resolve))(ss);
  // }
  // 组装路由
  routes.push(pages[key]);
  //console.log(pages[key].component);

}
// 404页面配置，一定要放在最后
const Other = {
  path: '*',
  redirect: {
    name: HomeConstants.NAME
  },
  children:[
         { path: '*/*', redirect:{
           name: HomeConstants.NAME
         }
     }
    ]
};
routePaths.push(Other.path);
routes.push(Other);
const router = new VueRouter({
  mode: 'history',
  routes
});

// 不在路径列表中的请求重定向到首页
router.beforeEach((to, from, next) => {

  //ios系统，开启全wap后，title为笑脸金融
    if(utils.getCookie('curDevice')=='ios'&&utils.getCookie('isShowAllWap')=='1'){
        utils.setDocumentTitle('笑脸金融');
    }else{
        utils.setDocumentTitle(to.meta.title || '笑脸金融');
    }

    var isLogin='';
    //isLogin=utils.isLogin();
    if(utils.getCookie("mic_sessionid")&&utils.getCookie("mic_sessionid")!=''&&utils.getCookie("mic_sessionid")!=null){
      isLogin=true;
    }else{
      isLogin=utils.isLogin();
    }

    //app端登录时,调取java快捷登录
    if(!isLogin&&utils.getCookie("appQuickToken")&&utils.getCookie("appQuickToken")!=''&&utils.getCookie("appQuickToken")!=null){
      // utils.setCookieAll('mic_sessionid', '',-1);
      // utils.setCookie('mic_sessionid', '',-1);

      utils.setCookieAll('appQuickToken', utils.getCookie("appQuickToken"));

      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/user/appQuickLogin",
          dataType : 'JSON',
          async : false,
          type : 'POST',
          processData :true,
          contentType : 'application/json',
          success : function(res){
            utils.setCookieAll('appQuickToken', '',-1);
            utils.setCookie('appQuickToken', '',-1);
            if(res.code==1){
              if(utils.getCookie("mic_sessionid")&&utils.getCookie("mic_sessionid")!=''&&utils.getCookie("mic_sessionid")!=null){

                 next();

              }else {

                  utils.toastFuc('网络请求错误，请稍候重试');
                  utils.toLogin();
                  // next({
                  //      path: '/regOrlogin'
                  //     }
                  // );
              }
            }else{

              utils.toastFuc('网络请求错误，请稍候重试');
              utils.toLogin();
              // next({
              //      path: '/regOrlogin'
              //     }
              // );
            }
          },
          error: function(XMLHttpRequest, textStatus){
            utils.setCookieAll('appQuickToken', '',-1);
            utils.setCookie('appQuickToken', '',-1);
            if(textStatus == 'error'){
              utils.toastFuc('网络请求错误，请稍候重试');
            }else if(textStatus == 'timeout'){
              utils.toastFuc('网络请求超时，请稍候重试');
            }
          }
      })
    }
    //php登录时,调取java快捷登录
    else if(!isLogin&&utils.getCookie("certifi_key")&&utils.getCookie("certifi_key")!=''&&utils.getCookie("certifi_key")!=null){
     $.ajax({
         url : utils.AJAXDOMAINNAME+"/wap/quickLogin",
         dataType : 'JSON',
         type : 'POST',
         processData :true,
         contentType : 'application/json',
         success : function(res){
           utils.setCookieAll('certifi_key', '',-1);
           if(res.code==1){
             if(utils.getCookie("mic_sessionid")&&utils.getCookie("mic_sessionid")!=''&&utils.getCookie("mic_sessionid")!=null){
                next();
             }else {
                utils.toLogin();
               // next({
               //      path: '/regOrlogin'
               //     }
               // );
             }
           }else{

              utils.toLogin();
             // next({
             //      path: '/regOrlogin'
             //     }
             // );
           }
         },
         error: function(){
           utils.setCookieAll('certifi_key', '',-1);
         }
     })
   }
   else{//1java未登录 php未登录   3java已登录 php未登录
     //首先判断是否是微信里登录
     if(to.path=='/home'||to.path=='/account'||to.path=='/repaymentCalendarMicroMessager'){
         //读取微信openId
         if(to.query.weChatOpenId!=null&&to.query.weChatOpenId!=''){
           utils.setCookieAll('mic_sessionid', '',-1);
           utils.setCookieAll('_key', '',-1);
           utils.setCookieAll('certifi_key', '',-1);
           utils.setCookieAll('appQuickToken', '',-1);
           utils.setCookieAll('SESSION', '', -1);
           utils.setCookieAll('mic-ticket', '', -1);

           // 保存微信token到 cookie
           utils.setCookie('wechatOpenId', to.query.weChatOpenId)
           utils.setCookieAll('wechatOpenId', to.query.weChatOpenId)
           //获取微信openId,调session
            $.ajax({
                url : utils.AJAXDOMAINNAME+"/wap/wechatQuickLogin",
                data : '{"wechatOpenId":"'+to.query.weChatOpenId+'"}',
                success : function(res){
                  if (to.meta.requireAuth){
                    if(utils.getCookie("mic_sessionid")&&utils.getCookie("mic_sessionid")!=''&&utils.getCookie("mic_sessionid")!=null){
                        next({
                             path: to.path,
                             query: {weChatOpenId:''}
                            }
                        );
                    }else{
                      next({
                           path: '/regOrlogin',
                          }
                      );
                    }
                  }else{
                      next({
                           path: to.path,
                           query: {weChatOpenId:''}
                          }
                      );
                  }
                  if(res.code === '1'){ // 微信登录返回成功保存 微信昵称和头像
                      utils.setCookie('_WeChatNickName',escape(res.data.nickname));
                      utils.setCookieAll('_WeChatNickName',escape(res.data.nickname));
                      utils.setCookie('_WeChatHeadImgLink',res.data.headimgurl);
                  }else{
                      utils.setCookie('_WeChatNickName', '');
                      utils.setCookieAll('_WeChatNickName', '');
                      utils.setCookie('_WeChatHeadImgLink', '');
                  }
                }
            })
            return
         }
     }
     // 判断页面是否需要登录
     if (to.meta.requireAuth) {
         // java已登录,跳转到下一个页面
         if(utils.getCookie("mic_sessionid")&&utils.getCookie("mic_sessionid")!=''&&utils.getCookie("mic_sessionid")!=null){

             next();
         }
         // java未登录,跳转到登录页面
         else{

             utils.toLogin();
             // next({
             //      path: '/regOrlogin',
             //      query: {redirect: to.fullPath}
             //     }
             // );
         }
     } else {
         next();
     }
   }

});


export default router;
