<template v-if="getAuthState">
    <h1>Settings</h1>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(["getAuthState"]),
  mounted() {
    if(!this.getAuthState){
        this.$router.push('/')
    }
  }
}
</script>
