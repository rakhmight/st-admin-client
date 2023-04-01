<template>
    <v-container style="margin-top: 54px">
        <h1>Reports</h1>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(["getAuthState"]),
  mounted(){
    if(!this.getAuthState){
        this.$router.push('/')
    }
  }
}
</script>
