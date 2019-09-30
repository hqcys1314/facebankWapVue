import * as constants from './redbagConstants';
//import module from './redbag.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./redbag.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
