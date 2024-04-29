<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
        
            <v-list-item  v-bind="props">
                <v-list-item-title class="d-flex align-center">
                    <v-icon size="18" class="mr-1" color="#eb6517">mdi-keyboard-return</v-icon>
                    <span class="menu-text" style="color: #eb6517">Return</span>
                </v-list-item-title>
            </v-list-item>

       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Return test</span>
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
                    @click="returnTest()"
                    :disabled="blockBtn"
                >
                <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Return test</span>
                <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                    v-else
                ></v-progress-circular>
                </v-btn>
            </div>

            <div class="alerts mt-5">
                <v-alert
                    density="compact"
                    color="var(--main-color)"
                    class="d-flex flex-row align-center"
                    v-if="success"
                >
                    <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                    <span style="color:#fff">Test has returned successfully</span>
                </v-alert>

                <v-alert
                density="compact"
                color="var(--red-color)"
                class="d-flex flex-row align-center"
                v-if="error.status"
                >
                    <v-icon color="#fff" class="mr-1">mdi-alert-circle</v-icon>
                    <span style="color:#fff">{{ error.msg }}</span>
                </v-alert>
            </div>

           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq';
import { mapGetters, mapMutations } from 'vuex';

export default {
    props:{
        test: Object
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
            blockBtn: false,
            loader: false,
            success: false,
            error: {
                status: false,
                msg: undefined,
            }
        }
    },
    computed: mapGetters(['getAuthParams', 'getAdminServerIP']),
    methods:{
        ...mapMutations(['changeTestImage', 'switchTestsDataSwitcher']),

        async returnTest(){
            this.blockBtn = true
            this.loader = true

            await makeReq(`${this.getAdminServerIP}/api/tests/return`, 'POST', {
                auth: {  
                    ...this.getAuthParams,
                },
                data: {
                    admin:{
                        id: this.getAuthParams.id,
                        password: this.adminPassword
                    },
                    id: this.test.id
                }
            })
            .then(data=>{
                if(data.statusCode==200){
                    this.success = true
                    this.loader = false
                    
                    console.log(data);
                    this.changeTestImage({ operation: 'return', id: this.test.id, status: 'rejected' })
                    this.switchTestsDataSwitcher()

                    setTimeout(()=>{
                        this.blockBtn = false
                        this.success = false
                        this.adminPassword = undefined
                        this.dialog = false
                        this.showPassword = false
                    }, 3000)
                }else if(data.statusCode==404 || data.statusCode==403 || data.statusCode==400 || data.statusCode==500){
                    this.loader = false
                    this.blockBtn = false
                    this.error.status = true
                    this.error.msg = data.message
                    
                    setTimeout(()=>{
                        this.error.status = false
                    }, 3000)
                }
            })
            .catch(error => {
                console.error(error)
                
                this.loader = false
                this.blockBtn = false
                this.error.status = true
                this.error.msg = error.message
                
                setTimeout(()=>{
                    this.error.status = false
                }, 3000)
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
</style>
