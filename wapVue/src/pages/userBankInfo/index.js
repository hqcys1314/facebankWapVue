import * as constants from './userBankInfoConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./userBankInfo.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
