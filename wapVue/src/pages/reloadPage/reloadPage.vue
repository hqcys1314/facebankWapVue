<template>

</template>
<script>
export default {
    created : function(){
        var _this = this;
        this.$router.replace({
            path : '/' + _this.$route.query.page,
            query : _this.$route.query
        })
    }
}
</script>
