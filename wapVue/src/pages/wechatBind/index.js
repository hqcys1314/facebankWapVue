import * as constants from './wechatBindConstants';
//import module from './wechatBind.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./wechatBind.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
