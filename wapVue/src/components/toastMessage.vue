<template>
  <div v-show="istoastMessageShow" class="toastMessage">
          <span v-html="message"></span>
  </div>
</template>
<script>
    export default {
      name: 'toastMessage',
      props: ['istoastMessageShow','message','toastTime'],
    }
</script>
<style>

        @keyframes toastDh {
            0% {
            transform: opacity(0);
            }
            20% {
            transform: opacity(1);
            }
            100% {
            transform: opacity(0);
            }
        }
        @-webkit-keyframes toastDh {
            0% {
              -webkit-transform: opacity(0);
            }
            20% {
              -webkit-transform: opacity(1);
            }
            100% {
              -webkit-transform: opacity(0);
            }
          }
          @-moz-keyframes toastDh {
            0% {
              -moz-transform: opacity(0);
            }
            20% {
              -moz-transform: opacity(1);
            }
            100% {
              -moz-transform: opacity(0);
            }
          }
          @-ms-keyframes toastDh {
            0% {
              -ms-transform: opacity(0);
            }
            20% {
              -ms-transform: opacity(1);
            }
            100% {
              -ms-transform: opacity(0);
            }
          }
          @-o-keyframes toastDh {
            0% {
              -o-transform: opacity(0);
            }
            20% {
              -o-transform: opacity(1);
            }
            100% {
              -o-transform: opacity(0);
            }
          }
          .toastMessage{position:fixed;top:30%;z-index:99;left:50%;
            margin-left:-7.5rem;background-color:#2b313d;color:white;
            font-size:0.875rem;width:13rem;text-align:center;padding:0.5rem 1rem;
            border-radius:20px;box-shadow: 0px 0px 5px #2b313d}

           .toastDonghua{
               animation: toastDh 5s ;
               -moz-animation: toastDh 5s;
               -o-animation: toastDh 5s;
               -ms-animation: toastDh 5s;
               -webkit-animation: toastDh 5s;
            }
</style>
