import * as constants from './claimsTranInvestCreditorListConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsTranInvestCreditorList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
