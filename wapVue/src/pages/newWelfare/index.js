import * as constants from './newWelfareConstants';
//import module from './newWelfare.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./newWelfare.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
