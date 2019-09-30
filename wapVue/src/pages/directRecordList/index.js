import * as constants from './directRecordListConstants';
//import module from './directRecordList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directRecordList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
