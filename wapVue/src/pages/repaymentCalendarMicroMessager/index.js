import * as constants from './repaymentCalendarMicroMessagerConstants';
//import module from './repaymentCalendarMicroMessager.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./repaymentCalendarMicroMessager.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
