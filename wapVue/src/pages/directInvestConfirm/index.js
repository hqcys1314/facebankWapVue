import * as constants from './directInvestConfirmConstants';
import module from './directInvestConfirm.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./directInvestConfirm.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
