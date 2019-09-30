import * as constants from './transactionRecordConstants';
//import module from './transactionRecord.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./transactionRecord.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
