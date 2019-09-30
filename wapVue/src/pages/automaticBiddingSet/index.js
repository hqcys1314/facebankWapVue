import * as constants from './automaticBiddingSetConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./automaticBiddingSet.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
