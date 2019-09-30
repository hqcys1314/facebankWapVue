import * as constants from './directRecordDebtDetailOldConstants';
//import module from './directRecordDebtDetailOld.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directRecordDebtDetailOld.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
