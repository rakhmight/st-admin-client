<template>
     <v-dialog
        transition="dialog-top-transition"
        width="auto"
        v-model="dialog"
      >
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-list-item-title class="d-flex align-center">
                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-draw</v-icon>
                    <span class="menu-text">Get sign</span>
                </v-list-item-title>
            </v-list-item>
        </template>
        <template v-slot:default="{ isActive }">
          <div class="dialog">
            <v-toolbar
              color="var(--bg-special-color)"
            >
                <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                    <span class="text-h5" style="color: #fff">Get sign</span>
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
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    label="Administrator's password"
                    @click:append="show1 = !show1"
                    :error="adminPasswordError"
                ></v-text-field>
                <v-divider class="mb-5"></v-divider>
                <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="memberPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    label="Choised member's password"
                    @click:append="show1 = !show1"
                    :error="memberPasswordError"
                ></v-text-field>

                <div class="w-100 d-flex justify-center">
                    <v-btn
                    density="compact"
                    :color="blockBtn ? '#eee' : 'var(--main-color)'"
                    width="200"
                    @click="getSign()"
                    :disabled="blockBtn"
                    >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Get sign</span>
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
                v-if="error.errors.length"
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
                    <span style="color:#fff">Sign downloaded successfully</span>
                </v-alert>
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
        memberID: String
    },
    data(){
        return {
            dialog: false,
            show1: false,
            adminPassword: undefined,
            memberPassword: undefined,

            adminPasswordError:false,
            memberPasswordError:false,

            error:{
                errors:[],
                msg: undefined
            },
            success: false,
            loader: false,
            blockBtn: false
        }
    },
    computed: mapGetters(['getAuthParams', 'getMembersList']),
    watch:{
        adminPassword(){
            this.adminPasswordError = false
            let target = this.error.errors.indexOf('adminPassword')
            if(target!=-1){
                this.error.errors.splice(target, 1)
            }

            if(!this.error.errors.length){
                this.blockBtn = false
            }
        },
        memberPassword(){
            this.memberPasswordError = false
            let target = this.error.errors.indexOf('memberPassword')
            if(target!=-1){
                this.error.errors.splice(target, 1)
            }

            if(!this.error.errors.length){
                this.blockBtn = false
            }
        }
    },
    methods:{
        async getSign(){
            let errorsCounter = 0

            if(!this.adminPassword){
                errorsCounter++
                this.adminPasswordError = true
                this.error.errors.push('adminPassword')
            }
            if(!this.memberPassword){
                errorsCounter++
                this.memberPasswordError = true
                this.error.errors.push('memberPassword')
            }

            if(errorsCounter){
                this.blockBtn = true
                this.error.msg = 'Fill in all fields first'
                return
            }

            this.error.errors = []
            this.blockBtn = true
            this.loader = true

            await makeReq('http://localhost:4500/api/signs/get', 'POST', {
                ...this.getAuthParams,
                data:{
                    admin:{
                        id: this.getAuthParams.id,
                        password: this.adminPassword
                    },
                    member:{
                        id: this.memberID,
                        password: this.memberPassword
                    }
                }
            })
            .then(data=>{
                this.loader = false

                if(data.statusCode==200){
                    this.success = true

                    const sign = {...data.data}
                    const member = this.getMembersList.find(member=>member.id==this.memberID)
                    sign.fullName = `${member.bio.lastName} ${member.bio.firstName} ${member.bio.patronymic}`

                    downloadObjectAsJson(sign, `${this.memberID}-sign`)

                    setTimeout(()=>{
                        this.success = false
                        this.blockBtn = false
                        this.adminPassword = undefined
                        this.memberPassword = undefined
                        this.dialog = false
                        this.show1 = false
                        this.show2 = false
                    },3000)
                    //console.log(data.data);
                } else if(data.statusCode == 403){
                    if(data.des === 'admin password'){
                        this.error.errors.push('adminPassword')
                        this.adminPasswordError = true
                        this.error.msg = `Administrator's password is invalid`
                    } else if(data.des == 'member password'){
                        this.error.errors.push('memberPassword')
                        this.memberPasswordError = true
                        this.error.msg = `Member's password is invalid`
                    }

                    return
                }
            })
            .catch(err=>{
                console.log(err);
                console.log(1);
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
