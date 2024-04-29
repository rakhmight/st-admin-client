<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
           <v-list-item v-bind="props">
                <v-list-item-title class="d-flex align-center">
                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                    <span class="menu-text">Edit</span>
                </v-list-item-title>
           </v-list-item>
           
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Edit user's data: {{ user.bio.lastName }} {{ user.bio.firstName }} {{ user.bio.patronymic }}</span>
                   <v-btn
                   density="compact"
                   icon
                   @click="dialog=false"
                   >
                       <v-icon color="var(--red-color)" size="30">mdi-close-box</v-icon>
                   </v-btn>
               </div>
           </v-toolbar>
           <div class="dialog__content">
               <v-text-field
                   variant="outlined"
                   density="compact"
                   label="User first name"
                   v-model="firstName"
               ></v-text-field>
               
               <v-text-field
                   variant="outlined"
                   density="compact"
                   label="User last name"
                   v-model="lastName"
               ></v-text-field>

               <v-text-field
                   variant="outlined"
                   density="compact"
                   label="User patronymic"
                   v-model="patronymic"
               ></v-text-field>
               
               <v-text-field
                   variant="outlined"
                   density="compact"
                   label="User password"
                   v-model="password"
               ></v-text-field>

               <div class="w-100 d-flex justify-center">
                   <v-btn
                   density="compact"
                   :color="blockBtn ? '#eee' : 'var(--main-color)'"
                   width="200"
                   @click="editUserData()"
                   :disabled="blockBtn"
                   >
                   <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Edit</span>
                   <v-progress-circular
                   :width="1"
                   size="15"
                   color="var(--main-color)"
                   indeterminate
                   v-if="loader"
                   ></v-progress-circular>
                   </v-btn>
               </div>
           </div>

           <div class="alerts">
               <v-alert
               density="compact"
               color="var(--red-color)"
               class="d-flex flex-row align-center"
               v-if="error.status"
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
                   <span style="color:#fff">User's data updated successfully</span>
               </v-alert>
           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapGetters, mapMutations } from 'vuex'

export default {
    props: {
        user: Object
    },
   data(){
       return {
        firstName: undefined,
        lastName: undefined,
        patronymic: undefined,
        password: undefined,

        dialog: false,
        error:{
            msg: undefined,
            status: false
        },
        success: false,
        loader: false,
        blockBtn: false
       }
   },
   mounted(){
    this.firstName = this.user.bio.firstName
    this.lastName = this.user.bio.lastName
    this.patronymic = this.user.bio.patronymic
   },
   computed: mapGetters(['getAuthParams', 'getAuthServerIP']),
   methods:{
    ...mapMutations(['updateUserData', 'switchUsersDataSwitcher']),

    async editUserData(){
        try {
            if(this.firstName && this.lastName){
                this.loader = true
                this.blockBtn = true

                const userData = await makeReq(`${this.getAuthServerIP}/api/user/edit-user`, 'POST', {
                    auth:{
                        ...this.getAuthParams,
                        requesting: 'client'
                    },
                    data:{
                        userID: this.user.id,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        patronymic: this.patronymic,
                        password: this.password
                    }
                })

                if(userData){
                    console.log(userData);
                    if(userData.statusCode == 200){
                        this.loader = false
                        this.success = true
                        this.password = undefined
                        
                        this.updateUserData({
                            userID: this.user.id,
                            firstName: this.firstName,
                            lastName: this.lastName,
                            patronymic: this.patronymic,
                        })
                        this.switchUsersDataSwitcher()

                        setTimeout(() => {
                            this.success = false
                            this.blockBtn = false
                        }, 2000)
                    } else if(userData.statusCode == 404){
                        this.loader = false
                        this.blockBtn = false
                        this.error.value = true
                        this.error.msg = 'User not found'
                    }
                }
            }
        }
        catch(e){
            this.loader = false
            this.blockBtn = false
            this.error.value = true
            this.error.msg = 'Some problems with server'
        }
    }
   },
   watch: {
    firstName(){
        if(this.firstName){
            this.error.value = false
        }
    },
    lastName(){
        if(this.lastName){
            this.error.value = false
        }
    },
    patronymic(){
        if(this.patronymic){
            this.error.value = false
        }
    }
   }
}
</script>


<style scoped>
.dialog{
   width: 50vw;
   position: relative;
}
.dialog__content{
   padding: 20px;
   background-color: #fff;
}
.alerts{
   position: absolute;
   width: 100%;
   margin-top: 10px;
}
</style>
