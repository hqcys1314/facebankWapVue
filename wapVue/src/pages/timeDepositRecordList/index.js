import * as constants from './timeDepositRecordListConstants';
//import module from './subjectInvestRecordList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./timeDepositRecordList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
