import * as constants from './timeDepositRecordDetailConstants';
//import module from './subjectInvestRecordDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./timeDepositRecordDetail.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
