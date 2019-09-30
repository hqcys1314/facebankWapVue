import * as constants from './autoInvestRecordListConstants';
//import module from './claimsTranRecordList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./autoInvestRecordList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
