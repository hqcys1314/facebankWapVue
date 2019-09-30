import * as constants from './autoInvestMatchSuccessConstants';
import module from './autoInvestMatchSuccess.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./autoInvestMatchSuccess.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
