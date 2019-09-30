import * as constants from './regSuccessConstants';
//import module from './regSuccess.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./regSuccess.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
