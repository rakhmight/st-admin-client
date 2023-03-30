<template>
    <div class="content">
        <div class="auth-server" v-if="authByAuthServer">
            <div class="form">
                <span class="text-h5 title-text">Данные получены</span>
                <v-divider class="mb-5 mt-3"></v-divider>
                <p>Данные для входа были получены. Вы можете <b>закрыть</b> это окно.</p>

                <div class="system">
                    <v-icon color="var(--main-color)" size="100">mdi-check-circle-outline</v-icon>
                </div>
            </div>
        </div>

        <div class="self-auth" v-else>
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
                    <p>Вы вошли c ролью <b>"роль"</b></p>
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
import makeReq from '@/services/makeReq'
import { mapMutations, mapGetters } from 'vuex'

export default {
    data(){
        return {
            authByAuthServer: false,
            status: 'process',
            statusDes: '',
            errorDes: 'Ошибка'
        }
    },
    computed: mapGetters(["getAuthState"]),
    methods:{
        ...mapMutations(['changeAuthState']),
    },
    mounted (){
        if(this.getAuthState){
            this.$router.push('/panel')
        }

        let urlParams = window
        .location
        .search
        .replace('?','')
        .split('&')
        .reduce(
            function(p,e){
                let a = e.split('=');
                p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );
        if(urlParams.authByAuthServer){
           localStorage.setItem('auth', JSON.stringify({
            id: urlParams.id,
            token: urlParams.token
           })) 
           this.authByAuthServer = true
        }

        if(!this.authByAuthServer){
            let authStore = localStorage.getItem('auth')
            if(authStore){
                authStore = JSON.parse(authStore)
                makeReq('https://localhost:3600/api/users/check', 'POST', {
                    data:{
                        ...authStore
                    }
                    
                })
                .then(data=>{
                    if(data.code == 'OK'){
                        this.changeAuthState(true)

                        // проверка прав на st-server
                        // отправка токена пользователя в st-server

                        this.status = 'success'
                        setTimeout(()=>{ 
                            this.$router.push('/panel')
                        },3000)
                    } else {
                        localStorage.removeItem('auth')
                        this.status = 'error'
                        this.errorDes = 'Не аутентифицированный пользователь'
                        setTimeout(()=>{
                            this.$router.push('/')
                        },10000)
                    }
                })
            }else{
                this.$router.push('/')
            }
        }
    }
}
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
