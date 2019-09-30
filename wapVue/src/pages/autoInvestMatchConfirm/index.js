import * as constants from './autoInvestMatchConfirmConstants';
import module from './autoInvestMatchConfirm.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./autoInvestMatchConfirm.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
