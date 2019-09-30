import * as constants from './rechargeUIConstants';
import module from './rechargeUI.vue';
export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./rechargeUI.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
