import * as constants from './depositoryOpenConstants';
import module from './depositoryOpen.vue';
export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./depositoryOpen.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
