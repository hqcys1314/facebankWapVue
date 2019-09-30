import * as constants from './autoInvestRecordDetailConstants';
//import module from './autoInvestRecordDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./autoInvestRecordDetail.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
