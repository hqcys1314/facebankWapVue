import * as constants from './oldDirectRecordConstants';
//import module from './oldDirectRecord.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./oldDirectRecord.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
