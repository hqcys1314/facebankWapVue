import * as constants from './directRecordDetailConstants';
//import module from './directRecordDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directRecordDetail.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
