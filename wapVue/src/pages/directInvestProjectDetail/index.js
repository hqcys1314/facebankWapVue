import * as constants from './directInvestProjectDetailConstants';
//import module from './directInvestProjectDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directInvestProjectDetail.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
