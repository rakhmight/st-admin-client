<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-autorenew</v-icon>
                      <span class="menu-text">Update</span>
                  </v-list-item-title>
            </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Update test</span>
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
            
            <v-file-input
                accept="application/json"
                show-size
                counter
                clearable
                label="Choise file"
                density="compact"
                variant="outlined"
                v-model="testFile"
                @change="handleTestUpload()"
                :error="testFileError.status"
                :error-messages="testFileError.msg"
                :loading="loadFile"
                color="var(--main-color)"
            ></v-file-input>

            <div class="w-100 d-flex justify-center mt-5">
                <v-btn
                    density="compact"
                    :color="blockSendBtn ? '#eee' : 'var(--main-color)'"
                    width="200"
                    @click="updateTest()"
                    :disabled="blockSendBtn"
                >
                <span :style="blockSendBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Update test</span>
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
                    <span style="color:#fff">Test updated successfully</span>
                </v-alert>
                <v-alert
                density="compact"
                color="var(--red-color)"
                class="d-flex flex-row align-center"
                v-if="error.value"
                >
                    <v-icon color="#fff" class="mr-1">mdi-alert-circle-outline</v-icon>
                    <span style="color:#fff">{{ error.msg }}</span>
                </v-alert>
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
    props:{
        test: Object,
        reRenderTests: Function
    },
    data(){
        return {
            dialog: false,
            testFileError: {
                status: false,
                msg: undefined
            },
            testFile: undefined,
            loadFile: false,
            testToSend: undefined,
            blockSendBtn: true,
            success: false,
            loader: false,
            error: {
                value: false,
                msg: undefined
            }
        }
    },
    computed: mapGetters(['getAuthParams', 'getAdminServerIP', 'getRole']),
    methods:{
        ...mapMutations(['replaceTestImages']),
        
        handleTestUpload(){
            this.blockSendBtn = true
            this.loadFile = true
            this.testFileError.status = false
            this.testFileError.msg = undefined

			let reader  = new FileReader()

            reader.addEventListener("load", function () {
                this.loadFile= false
                const test = JSON.parse(reader.result)
                // куча проверок
                if(test.author && typeof test.author == 'string' && test.fileDate && typeof test.fileDate == 'number' && test.history && typeof test.history == 'object' && test.id && typeof test.id == 'number' && test.params && typeof test.params == 'object' && test.questions && typeof test.questions == 'string' && test.signHash && typeof test.signHash == 'string' && test.testInfo && typeof test.testInfo == 'object' && test.testImage && typeof test.testImage == 'string'){
                    
                    if(test.testImage == this.test.id){
                        this.blockSendBtn = false
                        this.testToSend = test
                        return
                    } else {
                        this.testFileError.status = true
                        this.testFileError.msg = 'The file you are uploading does not apply to this test.'
                        return
                    }

                } else {
                console.log(test);
                    this.testFileError.status = true
                    this.testFileError.msg = 'Incorrect test format'
                    return
                }
			}.bind(this), false)

            if(this.testFile){
                if ( /\.(json)$/i.test( this.testFile[0].name ) ) {
					reader.readAsText(this.testFile[0])
				} else{
                    this.testFileError.status = true
                    this.testFileError.msg = 'Incorrect test format'
                    return
                }
            }
        },

        async updateTest(){
            this.blockSendBtn = true
            this.loader = true
            // отправка на сервер
            await makeReq(`${this.getAdminServerIP}/api/tests/${this.getRole == 3 ? 'admin-update' : 'update'}`, 'POST', {
                auth: {
                    ...this.getAuthParams
                },
                data:{
                    test: this.testToSend,
                    id: this.testToSend.testImage
                }
            })
            .then(data=>{
                if(data.statusCode == 200){
                    this.success = true
                    this.loader = false

                    // обновление стейта
                    this.replaceTestImages(data.data.test)
                    this.reRenderTests()

                    setTimeout(()=>{
                        this.testFile = undefined
                        this.testToSend = undefined
                        this.loadFile = false
                        this.success = false
                        this.dialog = false
                    },3000)
                } else if(data.statusCode == 403 && data.des == 'not permission'){
                    this.error.value=true
                    this.error.msg = 'You dont have permission to update this test'
                    this.loader = false
                } else if(data.statusCode == 403 && data.des == 'not exist'){
                    this.error.value=true
                    this.error.msg = 'No such test exists'
                    this.loader = false 
                }
            })
            // возможные ошибки?
        }
    },
    watch:{
        testFile(){
            this.error.value = false
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
