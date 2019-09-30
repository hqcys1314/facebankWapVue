import * as constants from './orderTransactionRecordConstants';
//import module from './transactionRecord.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./orderTransactionRecord.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
