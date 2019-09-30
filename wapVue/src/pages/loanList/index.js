import * as constants from './loanListConstants';
import module from './loanList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  parame : constants.PARAMES,
  component:module,
  //component: resolve => require(['./loanList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
