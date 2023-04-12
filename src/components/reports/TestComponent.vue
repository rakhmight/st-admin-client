<template>
    <div class="wrapper-test">
        <div class="test">
          <p style="font-size:0.9em" class="text-main-color">{{ id }}</p>
        </div>
        <v-divider></v-divider>
    </div>
</template>

<script>
export default {
    props:{
        id:String
    }
}
</script>


<style scoped>
.test{
  padding: 10px;
}
.test:hover{
  background-color: #00000011;
  cursor: pointer;
}
</style>
