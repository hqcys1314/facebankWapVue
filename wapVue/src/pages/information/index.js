import * as constants from './informationConstants';


export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./information.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
