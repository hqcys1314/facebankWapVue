import * as constants from './changeBankcardConstants';
//import module from './changeBankcard.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./changeBankcard.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
