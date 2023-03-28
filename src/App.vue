<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
//console.log(process.env.VUE_APP_CLIENT_TOKEN)
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>

<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body{
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    position: relative;
}

html{
    overflow: hidden;
}

/*=========================| VARS |===========================*/
:root {
  --main-color: #0d5fd8;
  --bg-special-color: #0c2242;
  --text-special-color: #7baef9;
  --bg-color: #D9E3E3;
}
/*=============================================================*/
</style>
