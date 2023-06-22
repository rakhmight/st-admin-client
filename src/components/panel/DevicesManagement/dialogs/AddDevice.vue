<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
            <v-btn
            color="var(--main-color)"
            v-bind="props"
            height="25"
            >
                <v-icon color="#fff" size="19">mdi-plus</v-icon>
                <span style="color: #fff" class="ml-1">Add device</span>
            </v-btn>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Add new device</span>
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

                <div style="width: 100%;">
                    <v-text-field
                    v-if="mode=='init'"
                    variant="outlined"
                    density="compact"
                    v-model="password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    label="Enter password"
                    @click:append="show = !show"
                    :error="passwordError.value"
                    :error-messages="passwordError.msg"
                    ></v-text-field>

                    <div class="d-flex justify-center" v-if="mode=='code'">
                        <div class="d-flex flex-row align-center">
                            <v-icon size="20" color="var(--main-color)">mdi-key-variant</v-icon>
                            <span class="ml-2 text-h6">Binding code:</span>
                        </div>
                    </div>
                </div>

                <div style="width: 100%; gap:20px" class="d-flex flex-column align-center justify-center pt-5 pb-5" v-if="mode=='code'">
                    <div style="padding: 10px 20px; background-color: #dedede; color: var(--main-color); border-radius: 5px;">
                        <span style="letter-spacing: 5px; font-size: 1.5em;">{{ code }}</span>
                    </div>

                    <div class="d-flex flex-row align-center">
                        <v-icon color="warning" size="19">mdi-alert</v-icon>
                        <span class="ml-1">You will not be able to receive this code again. Be careful</span>
                    </div>
                </div>

                <div class="w-100 d-flex justify-center" v-if="mode=='init'">
                    <v-btn
                        density="compact"
                        :color="blockBtn ? '#eee' : 'var(--main-color)'"
                        width="200"
                        @click="addDevice()"
                        :disabled="blockBtn"
                    >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Add device</span>
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
         </div>
       </template>
     </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import makeReq from '@/services/makeReq'

export default {
    data(){
        return {
            dialog: false,
            blockBtn: true,
            loader: false,
            show: false,
            password: undefined,
            passwordError:{
                value: false,
                msg: undefined
            },
            code: 'LALA5',
            mode: 'init' // 'code'
        }
    },
    computed: mapGetters(['getAuthParams', 'getDevices', 'getAdminServerIP']),
    methods:{
        ...mapMutations(['updateDevicesList']),
        async addDevice(){
            if(!this.password){
                this.passwordError.value = true
                this.passwordError.msg = 'Enter password'
                return
            }
            
            this.loader = true
            this.blockBtn = true

            await makeReq(`${this.getAdminServerIP}/api/devices/add`, 'POST', {
                auth:{
                    ...this.getAuthParams,
                },
                data:{
                    password: this.password
                }
            })
            .then((data)=>{
                if(data.statusCode==200){
                    this.code = data.data.code
                    this.loader = false
                    this.blockBtn = false
                    this.password = undefined
                    this.mode = 'code'
                    this.updateDevicesList(data.data.device)

                } else if(data.statusCode==403){
                    this.passwordError.value = true
                    this.passwordError.msg = 'Invalid password'
                    this.loader = false
                    this.blockBtn = false
                    return
                }
            })
        }
    },
    watch:{
        password(){
            if(this.password){
                this.passwordError.value = false
                this.passwordError.msg = undefined
                this.blockBtn = false
            } else {
                this.blockBtn = true
            }
        },

        dialog(){
            if(!this.dialog){
                this.code = undefined
                this.mode = 'init'
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
</style>
