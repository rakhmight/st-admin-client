<template>
<div>
  
        <v-navigation-drawer
        v-model="drawer"
        temporary
      >
    
        <div class="d-flex flex-row pt-1 pb-1" style="background: var(--main-color)">
            <v-btn icon="mdi-menu" style="color: #fff" @click="drawer = !drawer" variant="text"></v-btn>
            <div class="w-100 d-flex align-center"><h3 style="text-align:center;color:#fff; font-family: MontserratThin; font-weight: 400">Smart Testing</h3></div>
        </div>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-account" title="Profile" value="profile"></v-list-item>
          <v-list-item prepend-icon="mdi-post-outline" title="Blog" value="blog"></v-list-item>
          <v-list-item prepend-icon="mdi-history" title="History" value="history"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Admin panel" value="panel" v-if="isAdmin"></v-list-item>
        <v-divider></v-divider>
        <h3 class="mt-3 mb-1">Navigation</h3>

          <v-list-item @click="navigateTo('/')">
            <div class="d-flex flex-row align-center pt-1 pb-1">
                <div width="45"><v-img src="@/assets/media/logo.svg" height="27" width="27"></v-img></div>
                <p class="w-100 ml-2">Smart Testing</p>
            </div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      
    <v-app-bar
      color="var(--main-color)"
      density="compact"
      height="70"
    >
        <template v-slot:prepend>
          <v-app-bar-nav-icon style="color: #fff" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

      <v-app-bar-title style="color: #fff" class="d-flex flex-row">
          <div class="d-flex flex-row align-center">
              <div style="height: 40px" class="d-flex align-center">
                  <v-img src="@/assets/media/logo.svg" width="70"></v-img>
              </div>
              <h3 style="color:#fff; font-family: MontserratThin" class="mr-1">Smart Testing</h3>
          </div>
      </v-app-bar-title>

        <v-menu
        offset-y
        max-width="120"
        center
        >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
        >
          <v-icon
          size="25"
          color="#fff"
          >mdi-translate</v-icon>
        </v-btn>
      </template>

      <v-list
      >
        <v-btn
        size="small"
        width="100%"
        :color="'#eaeaea'" 
        v-for="(lang, i) in langs"
        :key="i"
        >
          <span style="color: #0167FF">{{lang.lang}}</span>
        </v-btn>
      </v-list>
    </v-menu>

      <v-btn class="text-none" stacked>
      <v-badge content="2" color="#d3291d">
          <v-icon color="#fff">mdi-bell-outline</v-icon>
      </v-badge>
      </v-btn>

     <v-menu
    offset-y
    max-width="400"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="#eaeaea"
          v-bind="props"
          min-width="120"
          small
        >
          <v-img
            class="shrink mr-3"
            contain
            src="@/assets/media/account.png"
            transition="scale-transition"
            width="25"
          />
          <span style="color:#fff">User</span>
          <v-icon class="ml-1" size="25">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-tooltip text="SmartAcademy system account settings">
          <template v-slot:activator="{ props }">
            <v-btn
            v-bind="props"
            size="small"
            @click="$router.push('/settings')"
            width="100%"
            class="d-flex justify-start"
            >
              <v-icon size="18" color="#888" class="mr-1">mdi-cog</v-icon>
              <span style="color:#000">Settings</span>
            </v-btn>
          </template>
        </v-tooltip>
        
        <v-divider></v-divider>
        <v-tooltip text="Quit of SmartTesting system">
          <template v-slot:activator="{ props }">
            <v-btn
            v-bind="props"
            size="small"
            @click="quit"
            width="100%"
            class="d-flex justify-start"
            >
              <v-icon size="18" color="#d3291d" class="mr-1">mdi-door</v-icon>
              <span style="color:#d3291d">Quit ST</span>
            </v-btn>
          </template>
        </v-tooltip>
          
        <v-divider></v-divider>
        <v-tooltip text="Log out of SmartAcademy system">
          <template v-slot:activator="{ props }">
            <v-btn
            v-bind="props"
            size="small"
            @click="logout"
            width="100%"
            class="d-flex justify-start"
            >
              <v-icon size="18" color="#d3291d" class="mr-1">mdi-door</v-icon>
              <span style="color:#d3291d">Log out of SA</span>
            </v-btn>
          </template>
        </v-tooltip>
      </v-list>
    </v-menu>
    </v-app-bar>
</div>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapMutations } from 'vuex'

export default {
    data(){
        return{
             drawer: null,
             langs: [{lang: 'русский', short: 'ru'},{lang: "o'zbek", short: 'uz_l'}, {lang: "ўзбек", short: 'uz_k'},{lang: 'english', short: 'eng'}],
             isAdmin: true
        }
    },
    methods:{
      ...mapMutations(['changeAuthState']),
      async logout(){
        let store = localStorage.getItem('auth')

        if(store){
          store = JSON.parse(store)

          await makeReq('https://localhost:3600/api/users/logout', 'POST', {data:{...store}})
          .then(data=>{
            // if(data.code == 'OK'){
            // } else{
            // }
            // редирект и удаление из LS
            this.changeAuthState(false)
            localStorage.removeItem('auth')
            this.$router.push('/')
          })
        }else{
          // редирект
            this.$router.push('/')
        }
      },

      quit(){
        localStorage.removeItem('auth')
        this.changeAuthState(false)
        this.$router.push('/')
      }
    }
}
</script>


<style scoped>
header{
    font-family: MontserratRegular, sans-serif;
    color: #fff;
}
#app > div > div > div > header{
    position: absolute;
}

.v-toolbar-title.v-app-bar-title{
    margin:0
}

.v-list{
    padding: 0;
}

.v-navigation-drawer.v-navigation-drawer--left{
    border: none
}
</style>
