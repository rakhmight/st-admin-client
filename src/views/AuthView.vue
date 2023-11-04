<template>
  <div class="content">
    <div class="form" v-if="status== 'auth'">
      <span class="text-h5 title-text">AUTHORIZATION</span>
      <v-divider class="mb-5 mt-3"></v-divider>
      <!-- <p>Войдите с помощью сервера аутентификации системы Smart Academy. Нажмите на кнопку ниже и не закрывайте откроющееся окно пока не закончите вход.</p> -->

      <div class="mt-5 d-flex flex-column w-100" style="gap: 10px">
        <v-text-field
        label="Write your login here"
        variant="outlined"
        density="compact"
        :error="loginError.value"
        v-model="login"
        ></v-text-field>

        <v-text-field
        label="Write password here"
        variant="outlined"
        density="compact"
        :error="passwordError.value"
        v-model="password"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        @click:append="show = !show"
        ></v-text-field>
      </div>

      <div class="alerts mt-5 w-100">           
        <v-alert
        density="compact"
        color="var(--red-color)"
        class="d-flex flex-row align-center"
        v-if="error.value"
        >
            <v-icon color="#fff" class="mr-1">mdi-alert-circle</v-icon>
            <span style="color:#fff">{{ error.msg }}</span>
        </v-alert>

        <v-alert
        density="compact"
        color="var(--main-color)"
        class="d-flex flex-row align-center"
        v-if="success"
        >
            <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
            <span style="color:#fff">Successful authorization</span>
        </v-alert>
      </div>

      <div style="width: 100%; display: flex; justify-content: center;">
        <v-btn
        width="200"
        @click="auth()"
        :color="blockBtn ? '#eee' : 'var(--main-color)'"
        class="mt-3"
        :disabled="blockBtn"
        density="compact"
        >
          <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Enter</span>
          <v-progress-circular
          :width="1"
          size="15"
          color="var(--main-color)"
          indeterminate
          v-else
          ></v-progress-circular>
        </v-btn>
      </div>

      <div class="system">
        <div class="logo">
          <v-img src="@/assets/media/logo.svg" width="80" class="mr-2"></v-img>
        </div>
        <div class="title text-h5 text-left"><span class="title-text">SMART TESTING</span><br>SERVER ADMIN PANEL</div>
      </div>
    </div>

    <div class="self-auth">
      <div class="process d-flex flex-column align-center" v-if="status=='process'">
        <v-progress-circular
        :size="70"
        color="var(--main-color)"
        indeterminate
        ></v-progress-circular>
        <p class="mt-3">Вход в систему..</p>
      </div>

      <div class="success" v-if="status=='success'">
        <div class="form">
            <span class="text-h5 title-text">Успешный вход</span>
            <v-divider class="mb-5 mt-3"></v-divider>
            <p>Вы вошли c ролью <b>"{{ getRole==1 ? 'Автор тестов' : (getRole==2) ? 'Инспектор' : 'Администратор системы' }}"</b></p>
            <p>Сейчас вы перейдёте в панель управления системы.</p>

            <div class="system">
                <v-icon color="var(--main-color)" size="100">mdi-check-circle-outline</v-icon>
            </div>
        </div>
      </div>

      <div class="error" v-if="status=='error'">
        <div class="form">
            <span class="text-h5 text-red">Возникла ошибка</span>
            <v-divider class="mb-5 mt-3"></v-divider>
            <p>{{ errorDes }}</p>

            <div class="system">
                <v-icon color="red" size="100">mdi-alert-circle-outline</v-icon>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex'
import makeReq from '@/services/makeReq';

export default defineComponent({
  name: 'AuthView',
  computed: mapGetters(['getAuthState', 'getRole', 'getAuthServerIP', 'getAuthParams', 'getAdminServerIP']),
  data(){
    return {
      status: undefined,

      // Auth
      login: undefined,
      password: undefined,

      show: false,
      blockBtn: true,
      success: false,
      error: {
        value: false,
        msg: undefined
      },
      loginError: {
        value: false
      },
      passwordError: {
        value: false
      },
      loader: false,
      ///

      // Check
      errorDes: undefined
    }
  },
  methods:{

    ...mapMutations(['setAuthParams', 'changeAuthState', 'setRole', 'setUserData', 'setUsersList', 'setDepartments', 'setSubjects', 'setExams', 'setTestImages', 'setDevices']),

    async auth(){
      this.error.value = false
      this.blockBtn = true
      this.loader = true
      await makeReq(`${this.getAuthServerIP}/api/user/signin`, 'POST', {
        auth: {
          login: this.login,
          password: this.password
        }
      })
      .then((data)=>{
        this.loader = false

        if(data.statusCode == 200){
          this.success = true

          // сохранение в LS
          localStorage.setItem('auth', JSON.stringify({
            id: data.data.authData.id,
            token: data.data.authData.token.key
          }))

          // Auth params state
          // this.setAuthParams({
          //   id: data.data.authData.id,
          //   token: data.data.authData.token.key
          // })
          
          // this.changeAuthState(true)
          // this.setRole(data.data.userData.permission)
          // this.setUserData(data.data.userData)

          // this.getDatas()

          setTimeout(() => {
            this.login = undefined
            this.password = undefined
            this.success = false

            location.reload()

            // console.log(this.getRole);
            // if(this.getRole == 3){
            //   this.$router.push('/panel')
            // } else if (this.getRole < 3){
            //   this.$router.push('/box')
            // }
          }, 3000)

        } else if(data.statusCode == 404){
          this.loginError.value = true
          this.passwordError.value = true
          this.error.value = true
          this.error.msg = 'Invalid password or login'

          setTimeout(()=>{
            this.error.value = false
            this.error.msg = undefined
          },3000)
        }
      })
      .catch(error => {
        console.error(error)
        this.error.value = true
        this.error.msg = 'Authorization server not responding'
        this.loader = false
      })

    },

    async getDatas(){
      
      // get users list
      await makeReq(`${this.getAuthServerIP}/api/user/get`, 'POST', {
        auth:{
          ...this.getAuthParams,
          requesting: 'client'
        }
      })
      .then(data=>{
        if(data.statusCode == 200){
          this.setUsersList(data.data.usersList.reverse())
        }
      })
      .catch(error=>{
        console.error(error)
        this.status = 'error'
        this.errorDes = 'Temporary problems on the ST Auth server'
        return
      })

      if(this.getRole == 3){
        // get departments list
        await makeReq(`${this.getAdminServerIP}/api/departments/get`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setDepartments(data.data.departments.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

        // get subjects list
        await makeReq(`${this.getAdminServerIP}/api/subjects/get`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setSubjects(data.data.subjects.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

        // get exams list
        await makeReq(`${this.getAdminServerIP}/api/exams/getexams`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setExams(data.data.examsImages.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

        // get tests images list
        await makeReq(`${this.getAdminServerIP}/api/tests/get`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setTestImages(data.data.testsImages.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

        // get devices list
        await makeReq(`${this.getAdminServerIP}/api/devices/get`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setDevices(data.data.devices.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

      } else if(this.getRole == 2){

        // get subjects images list
        await makeReq(`${this.getAdminServerIP}/api/subjects/getauthorthemes`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setSubjects(data.data.subjects.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })
        
        // get tests images list
        await makeReq(`${this.getAdminServerIP}/api/tests/getinspectortests`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setTestImages(data.data.testImages.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

      } else if(this.getRole == 1){
        
        // get tests list
        await makeReq(`${this.getAdminServerIP}/api/tests/getauthortests`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setTestImages(data.data.testsImages.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

        // get subjects images list
        await makeReq(`${this.getAdminServerIP}/api/subjects/getauthorthemes`, 'POST', {
          auth: {
            ...this.getAuthParams
          }
        })
        .then(data=>{
          if(data.statusCode == 200){
            this.setSubjects(data.data.subjects.reverse())
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Temporary problems on the ST Admin server'
          return
        })

      }
    }
  },
  mounted() {
    if(this.getAuthState){
      if (this.getRole==3) {
        this.$router.push('/panel')
      } else if (this.getRole < 3) {
        this.$router.push('/box')
      }
    }

    let authStore = localStorage.getItem('auth')
    if(authStore){
      authStore = JSON.parse(authStore)

      if(authStore.id && typeof authStore.id == 'string' && authStore.token && typeof authStore.token == 'string'){
        this.status = 'process'

        this.setAuthParams({...authStore})
        makeReq(`${this.getAuthServerIP}/api/user/check`, 'POST', {
          auth:{
            ...this.getAuthParams,
            requesting: 'client'
          }
        })
        .then(async (data)=>{
          if(data.statusCode == 200){
            // сохранение в state userData
            this.setUserData(data.data.userData)

            if(data.data.userData.permission >= 1){
              this.changeAuthState(true)
              this.setRole(data.data.userData.permission)
                                
              this.status = 'success'
              
              this.getDatas()

              setTimeout(()=>{
                if(data.data.userData.permission == 3){
                    this.$router.push('/panel')
                } else if (data.data.userData.permission < 3){
                    this.$router.push('/box')
                }
              },3000)
            } else{
                this.status = 'error'
                this.errorDes = 'You are not authorized to use this system'
                return
            }

          } else {
            localStorage.removeItem('auth')
            this.setAuthParams({id: null, token:null})
            this.status = 'error'
            this.errorDes = 'Unauthenticated user'
            setTimeout(()=>{
              this.status = 'auth'
            },5000)
          }
        })
        .catch(error=>{
          console.error(error)
          this.status = 'error'
          this.errorDes = 'Authorization server not responding or there was a failure'
        })

      } else {
        this.status = 'auth'
      }
    } else {
      this.status = 'auth'
    }
  },
  watch:{
    login(){
      if(this.login && this.password){
        this.blockBtn = false
      } else {
        this.blockBtn = true
      }

      if(this.login){
        this.loginError.value = false
        this.passwordError.value = false
      }
    },

    password(){
      if(this.password && this.login){
        this.blockBtn = false
      } else {
        this.blockBtn = true
      }

      if(this.password){
        this.passwordError.value = false
        this.loginError.value = false
      }
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
  flex-direction: column;
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

.alerts {
  width: 550px;
  position: absolute;
  bottom: -60px;
  left: 0;
}

.title-text{
  color: var(--main-color);
}

.system{
  position: absolute;
  top: -110px;
  left:0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
