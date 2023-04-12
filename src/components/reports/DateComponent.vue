<template>
    <div class="date-nav__container">
        <div class="date-nav__fulldate ml-7 d-flex justify-start"><p style="font-size:0.9em">General</p></div>
        <div class="date-nav__date"><v-icon size="18" color="#737373">mdi-pin-outline</v-icon></div>
    </div>
</template>

<style scoped>
.date-nav__container{
  cursor: pointer;
  padding: 15px;
  position: relative;
}
.date-nav__container::before{
  display:block;
  position: absolute;
  left: 20px;
  top: 0;
  content: '';
  height: 100%;
  border-left: 1px solid #737373;
}
.date-nav__container:hover{
  background: #00000011;
}
.date-nav__date{
  position: absolute;
  top:25%;
  left:7px;
  width:25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: #D9E3E3;
  border: 1px solid #737373
}
</style>
