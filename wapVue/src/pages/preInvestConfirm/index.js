import * as constants from './preInvestConfirmConstants';
//import module from './preInvestConfirm.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./preInvestConfirm.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
