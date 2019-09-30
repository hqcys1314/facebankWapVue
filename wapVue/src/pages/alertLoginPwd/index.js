import * as constants from './alertLoginPwdConstants';
//import module from './alertLoginPwd.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./alertLoginPwd.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
