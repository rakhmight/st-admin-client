<template>
  <v-app>
    <header-component v-if="!$route.meta.hideHeader" />

    <v-main style="background-color: var(--bg-color);">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent'

//console.log(process.env.VUE_APP_CLIENT_TOKEN)
export default {
  name: 'App',
  data: () => ({
    //
  }),
  components: {
    HeaderComponent
  }
}
</script>

<style>
.v-main{
  padding-top: 0;
}
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
    overflow-y: auto;
}

html{
    overflow-y: auto;
}

::-webkit-scrollbar {
    width: 6px; /* ширина для вертикального скролла */
    background-color: #b9b9b9;
}

/* ползунок скроллбара */
::-webkit-scrollbar-thumb {
    background-color: #0d5ace9a;
    border-radius: 1em;
}

/*=========================| VARS |===========================*/
:root {
  --main-color: #0d5fd8;
  --bg-special-color: #0c2242;
  --text-special-color: #7baef9;
  --bg-color: #D9E3E3;
  --red-color: #d53b12;
}
/*=============================================================*/

/*=========================| FONTS |===========================*/
@font-face {
    font-family: MontserratLight;
    src: url('@/assets/fonts/montserrat/Montserrat-Light.ttf');
}
@font-face {
    font-family: MontserratThin;
    src: url('@/assets/fonts/montserrat/Montserrat-Thin.ttf');
}
@font-face {
    font-family: MontserratExtraLight;
    src: url('@/assets/fonts/montserrat/Montserrat-ExtraLight.ttf');
}
@font-face {
    font-family: MontserratMedium;
    src: url('@/assets/fonts/montserrat/Montserrat-Medium.ttf');
}
@font-face {
    font-family: MontserratRegular;
    src: url('@/assets/fonts/montserrat/Montserrat-Regular.ttf');
}
@font-face {
    font-family: Hero-1;
    src: url('@/assets/fonts/ofont.ru_Hero.ttf');
}
/*=============================================================*/

.menu-text{
  font-size: 0.9em
}
.text-main-color{
  color: var(--main-color)
}
.text-special-color{
  color: var(--text-special-color)
}
.bg-color{
  background-color: var(--bg-color)
}
.bg-special-color{
  background-color: var(--bg-special-color)
}

.v-list-item--density-compact.v-list-item--one-line{
    min-height: 0;
}
.v-list{
    padding:0;
}
.v-list-item{
    cursor: pointer;
}
.v-list-item:hover{
    background-color: rgba(0, 0, 0, 0.162)
}

.lim-txt{
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
