import * as constants from './subjectInvestRecordListConstants';
//import module from './subjectInvestRecordList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./subjectInvestRecordList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
