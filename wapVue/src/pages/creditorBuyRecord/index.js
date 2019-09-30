import * as constants from './creditorBuyRecordConstants';
//import module from './creditorBuyRecord.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./creditorBuyRecord.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
