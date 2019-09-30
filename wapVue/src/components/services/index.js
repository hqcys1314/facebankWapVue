import servicesTpl from './services.vue';

export default {
    install : function(Vue){
        Vue.component('services', servicesTpl);
    }
}
