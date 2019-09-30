import * as constants from './myNoticeConstants';
//import module from './myNotice.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./myNotice.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
