import * as constants from './setLoginPwdConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./setLoginPwd.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
