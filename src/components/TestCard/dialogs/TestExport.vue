<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-list-item-title>
                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-upload</v-icon>
                    <span class="menu-text">Export</span>
                </v-list-item-title>
            </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Export test</span>
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
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                label="Enter password"
                @click:append="show = !show"
                :error="passwordError.value"
                :error-messages="passwordError.msg"
            ></v-text-field>

            <div class="w-100 d-flex justify-center">
                <v-btn
                    density="compact"
                    :color="blockBtn ? '#eee' : 'var(--main-color)'"
                    width="200"
                    @click="exportTest()"
                    :disabled="blockBtn"
                >
                <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Export test</span>
                <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                    v-else
                ></v-progress-circular>
                </v-btn>
            </div>

            <div class="alerts">
                <v-alert
                    density="compact"
                    color="var(--main-color)"
                    class="d-flex flex-row align-center mt-5"
                    v-if="success"
                >
                    <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                    <span style="color:#fff">Test downloaded successfully</span>
                </v-alert>
            </div>

           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapGetters } from 'vuex'
import downloadObjectAsJson from '@/plugins/downloadObjectAsJson'

export default {
    props:{
        test: Object
    },
    data(){
        return {
            dialog: false,
            show: false,
            password: undefined,
            passwordError:{
                value: false,
                msg: undefined
            },
            blockBtn: false,
            loader: false,
            success: false
        }
    },
    computed: mapGetters(['getAuthParams', 'getAdminServerIP']),
    methods: {
        async exportTest(){
            if(!this.password){
                this.passwordError.value = true
                this.passwordError.msg = 'Enter password'
                return
            }
            
            this.loader = true
            this.blockBtn = true

            await makeReq(`${this.getAdminServerIP}/api/test/export`, 'POST', {
                ...this.getAuthParams,
                data:{
                    password: this.password,
                    test: this.test._id
                }
            })
            .then((data)=>{
                if(data.statusCode==200){
                    const test = data.data.test

                    downloadObjectAsJson(test, `test-${test.params.subject}-${test.fileDate}`)

                    this.loader = false
                    this.blockBtn = false
                    this.password = undefined
                    this.dialog = false

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
