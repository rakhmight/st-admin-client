<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
console.log(process.env.VUE_APP_CLIENT_TOKEN)
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
