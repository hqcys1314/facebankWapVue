import * as constants from './pwdManageConstants';
//import module from './pwdManage.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./pwdManage.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
