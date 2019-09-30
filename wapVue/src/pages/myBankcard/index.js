import * as constants from './myBankcardConstants';


export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./myBankcard.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
