<template>
  <div class="content">
    <div class="form">
      <span class="text-h5 title-text">АВТОРИЗАЦИЯ</span>
      <v-divider class="mb-5 mt-3"></v-divider>
      <p>Войдите с помощью сервера аутентификации системы Smart Academy. Нажмите на кнопку ниже и не закрывайте откроющееся окно пока не закончите вход.</p>
      <v-btn @click="redirect" color="var(--main-color)" class="mt-5">
        <span style="color: #fff">Войти</span>
      </v-btn>

      <div class="system">
        <div class="logo">
          <v-img src="@/assets/media/logo.svg" width="80" class="mr-2"></v-img>
        </div>
        <div class="title text-h5 text-left"><span class="title-text">SMART TESTING</span><br>SERVER ADMIN PANEL</div>
      </div>
    </div>
    <!-- <a href="https://localhost:3600/redirect?system=st-server">Войти</a> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'AuthView',
  computed: mapGetters(["getAuthState"]),
  methods:{
    redirect(){
      let popup = window.open('https://localhost:3600/redirect?reqSystem=SmartTesting', 'redirectTab', "popup, location=false, width=900, height=600")

      let interval = setInterval(()=>{
        if(popup.closed){
          let authStore = localStorage.getItem('auth')
          if(authStore){
            location.reload()
          }
          clearInterval(interval);
        }
      },1000)
    }
  },
  mounted() {
    if(this.getAuthState){
        this.$router.push('/panel')
    }

    let authStore = localStorage.getItem('auth')
    if(authStore){
        this.$router.push('/auth')
    }
  }
});
</script>

<style scoped>
.content{
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  width: 550px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.609);
  display: flex;
  flex-direction: column;
  padding: 30px;
  justify-content: center;
  text-align: center;
  position: relative;
}

.title-text{
  color: var(--main-color);
}

.system{
  position: absolute;
  top: -100px;
  left:0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
