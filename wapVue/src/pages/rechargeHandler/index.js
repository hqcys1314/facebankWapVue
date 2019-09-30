import * as constants from './rechargeHandlerConstants';
//import module from './rechargeHandler.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./rechargeHandler.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
