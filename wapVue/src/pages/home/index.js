import * as constants from './homeConstants';
import module from './home.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
