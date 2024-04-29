<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
           <v-list-item v-bind="props">
               <v-list-item-title class="d-flex align-center">
                   <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-account-edit</v-icon>
                   <span class="menu-text">Change user status (to 'waiting')</span>
               </v-list-item-title>
           </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Change user status for {{ getUserName() }}</span>
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
                   v-model="adminPassword"
                   :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                   :type="showPassword ? 'text' : 'password'"
                   label="Administrator's password"
                   @click:append="showPassword = !showPassword"
                   :error="adminPasswordError.status"
               ></v-text-field>

               <div class="w-100 d-flex justify-center">
                   <v-btn
                   density="compact"
                   :color="blockBtn ? '#eee' : 'var(--main-color)'"
                   width="200"
                   @click="changeStatus()"
                   :disabled="blockBtn"
                   >
                   <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Change status</span>
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
               v-if="adminPasswordError.status"
               >
                   <v-icon color="#fff" class="mr-1">mdi-alert-circle</v-icon>
                   <span style="color:#fff">{{ adminPasswordError.msg }}</span>
               </v-alert>

               <v-alert
               density="compact"
               color="var(--main-color)"
               class="d-flex flex-row align-center"
               v-if="success"
               >
                   <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                   <span style="color:#fff">User status changed successfully</span>
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
        user: Object,
        getUserName: Function,
        stopTimer: Function
    },
   data(){
       return {
            dialog: false,
            showPassword: false,
            adminPassword: undefined,
            adminPasswordError:{
                msg: undefined,
                status: false
            },
            success: false,
            loader: false,
            blockBtn: false
       }
   },
   computed: mapGetters(['getAuthParams', 'getAuthServerIP', 'getCurrentExam', 'getAdminServerIP']),
   watch:{
       adminPassword(){
           this.adminPasswordError.status = false
           if(!this.adminPasswordError.status){
               this.blockBtn = false
           }
       },
   },
   methods:{
        ...mapMutations(['updateExamineeStatus', 'updateCurrentExamineeStatus', 'switchCurrentExamSwitcher']),

        async changeStatus(){

            if(!this.adminPassword){
                this.adminPasswordError.status = true
                this.adminPasswordError.msg = "Enter the current administrator's password"
                return
            }

            this.blockBtn = true
            this.loader = true

            

           await makeReq(`${this.getAuthServerIP}/api/user/validate`, 'POST', {
                auth: {
                    ...this.getAuthParams,
                    checkedID: this.getAuthParams.id,
                    password: this.adminPassword,
                    requesting: 'client'
                }
           })
           .then(async (data)=>{
               this.loader = false

               if(data.statusCode==200){                
                   const updateStatusUser = await makeReq(`${this.getAdminServerIP}/api/exams/examinee-status-update`, 'POST', {
                        auth: {
                            ...this.getAuthParams,
                        },
                        data:{
                            userID: this.user.id,
                            examID: this.getCurrentExam.id,
                            status: 'waiting'
                        }
                    })

                    if(updateStatusUser.statusCode == 200){
                        this.success = true   
                        this.updateExamineeStatus({ examID: this.getCurrentExam.id, userID: this.user.id, type: 'reset' })
                        this.updateCurrentExamineeStatus({ userID: this.user.id, type: 'reset' })
                        this.switchCurrentExamSwitcher()
                        this.stopTimer()

                        setTimeout(()=>{
                            this.success = false
                            this.blockBtn = false
                            this.adminPassword = undefined
                            this.dialog = false
                            this.showPassword = false
                        },3000)
                    } else {
                        this.blockBtn = false
                        this.adminPasswordError.status = true
                        this.adminPasswordError.msg = "Some problems on serve-side"
                    }
               } else if(data.statusCode == 403){
                    this.adminPasswordError.status = true
                    this.adminPasswordError.msg = "Wrong password"
                    return
               } else if(data.statusCode == 404){
                    this.adminPasswordError.status = true
                    this.adminPasswordError.msg = "Administrator not found"
                    return
               }
           })
           .catch(err=>{
               console.error(err);
           })
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
