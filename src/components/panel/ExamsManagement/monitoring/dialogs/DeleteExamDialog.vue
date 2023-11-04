<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props: menu }">
            <v-tooltip>
                <template v-slot:activator="{ props: tooltip }">
                    <v-btn
                    v-bind="mergeProps(menu, tooltip)"
                    icon
                    variant="text"
                    density="compact"
                    color="var(--red-color)"
                    >
                        <v-icon size="22px">mdi-delete-outline</v-icon>
                    </v-btn>
                </template>
                <span>Delete exam</span>
            </v-tooltip>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Delete exam: {{ examID }}</span>
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
                   :color="blockBtn ? '#eee' : 'var(--red-color)'"
                   width="200"
                   @click="deleteExam()"
                   :disabled="blockBtn"
                   >
                   <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Delete exam</span>
                   <v-progress-circular
                   :width="1"
                   size="15"
                   color="var(--main-color)"
                   indeterminate
                   v-else
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
                   <span style="color:#fff">Exam deleted successfully</span>
               </v-alert>
           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapGetters, mapMutations } from 'vuex'
import { mergeProps } from 'vue'

export default {
    props:{
        examID: String,
        isComplex: Boolean,
        changeTab: Function
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
   computed: mapGetters(['getAuthParams', 'getAuthServerIP', 'getAdminServerIP']),
   watch:{
       adminPassword(){
           this.adminPasswordError.status = false
           if(!this.adminPasswordError.status){
               this.blockBtn = false
           }
       },
   },
   methods:{
    mergeProps,
    ...mapMutations(['setCurrentExam', 'deleteFromExamList']),

    async deleteExam(){

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

                    await makeReq(`${this.getAdminServerIP}/api/exams/delete`, 'POST', {
                        auth: {
                            ...this.getAuthParams,
                        },
                        data: {
                            examID: this.examID,
                            params: {
                                isComplex: this.isComplex
                            }
                        }
                    })
                    .then(data => {
                        if(data.statusCode == 200) {
                            this.success = true

                            console.log('OK');
                            this.changeTab('monitoring')
                            this.deleteFromExamList(this.examID)
                            this.setCurrentExam(undefined)

                            setTimeout(()=>{
                                this.success = false
                                this.blockBtn = false
                                this.adminPassword = undefined
                                this.dialog = false
                                this.showPassword = false
                            },3000)
                        } else if(data.statusCode == 400) {
                            this.adminPasswordError.status = true
                            this.adminPasswordError.msg = "Bad request"
                            console.log(403);
                            return
                        } else {
                            this.adminPasswordError.status = true
                            this.adminPasswordError.msg = "Some problems with server"
                            console.log(500);
                        }
                    })
                    .catch(err=>{
                        console.error(err);
                    })

               } else if(data.statusCode == 403){
                    this.adminPasswordError.status = true
                    this.adminPasswordError.msg = "Wrong password"
                    console.log(403);
                    return
               } else if(data.statusCode == 404){
                    this.adminPasswordError.status = true
                    this.adminPasswordError.msg = "Administrator not found"
                    console.log(404);
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
