import * as constants from './timeDepositConfirmConstants';
import module from './timeDepositConfirm.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./directInvestDetail.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
