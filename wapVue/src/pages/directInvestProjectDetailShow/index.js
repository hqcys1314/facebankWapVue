import * as constants from './directInvestProjectDetailShowConstants';
//import module from './directInvestProjectDetailShow.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directInvestProjectDetailShow.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
