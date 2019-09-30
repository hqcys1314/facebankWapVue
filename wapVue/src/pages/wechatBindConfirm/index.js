import * as constants from './wechatBindConfirmConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./wechatBindConfirm.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
