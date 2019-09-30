import * as constants from './repaymentCalendaTransDetailConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./repaymentCalendaTransDetail.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
