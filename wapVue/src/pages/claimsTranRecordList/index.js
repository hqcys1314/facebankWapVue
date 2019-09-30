import * as constants from './claimsTranRecordListConstants';
//import module from './claimsTranRecordList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsTranRecordList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
