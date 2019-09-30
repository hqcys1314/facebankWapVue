import * as constants from './timeDepositRecordDebtListConstants';
//import module from './subjectInvestRecordDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./timeDepositRecordDebtList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
