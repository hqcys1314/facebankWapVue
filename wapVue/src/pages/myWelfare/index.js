import * as constants from './myWelfareConstants';
//import module from './myWelfare.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./myWelfare.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
