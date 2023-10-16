<template>

    <div class="wrapper" style="position: relative;">
        <div class="form">
            <div class="form__title mb-5">
                <span class="text-h5">Upload file with members (.xlsx)</span>
                <v-divider class="mt-1"></v-divider>
            </div>
            <div class="form__content">
                <v-file-input
                accept="application/xlsx"
                show-size
                counter
                clearable
                label="Choise file"
                density="compact"
                variant="outlined"
                v-model="file"
                @change="handleUpload()"
                :error="fileError.status"
                :error-messages="fileError.msg"
                :loading="loadFile"
                color="var(--main-color)"
                ></v-file-input>

                <div class="w-100 d-flex justify-center mt-5">
                    <v-btn
                    density="compact"
                    :color="blockSendBtn ? '#eee': 'var(--main-color)'"
                    width="200"
                    :disabled="blockSendBtn"
                    @click="sendMembersList()"
                    >
                    <span :style="blockSendBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Upload</span>
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

        <div style="position: absolute; width: 600px;bottom:170px">
            <v-alert
            density="compact"
            color="var(--main-color)"
            class="d-flex flex-row align-center"
            v-if="success"
            >
                <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                <span style="color:#fff">New members added</span>
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
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import * as XLSX from 'xlsx'
import makeReq from '@/services/makeReq';

export default {
    data(){
        return {
            fileError: {
                status: false,
                msg: undefined
            },
            file: undefined,
            loadFile: false,
            listToSend: undefined,
            blockSendBtn: true,
            success: false,
            loader: false,
            error: {
                value: false,
                msg: undefined
            }
        }
    },
    computed: mapGetters(['getAuthParams', 'getAuthServerIP']),
    methods:{
        ...mapMutations(['multipleUpdateUsersList']),
        
        handleUpload(){
            this.blockSendBtn = true
            this.loadFile = true
            this.fileError.status = false
            this.fileError.msg = undefined

			let reader = new FileReader()

            reader.addEventListener("load", function () {
                this.loadFile= false
                
                var data = reader.result;
                const out = XLSX.read(data, { type: 'binary' })
                let rowObject = XLSX.utils.sheet_to_row_object_array(out.Sheets[out.SheetNames[0]])
                console.log(rowObject);
                this.listToSend = rowObject

                this.blockSendBtn = false
        
			}.bind(this), false)

            if(this.file){
                if ( /\.(xlsx)$/i.test( this.file[0].name ) ) {
					reader.readAsBinaryString(this.file[0])
				} else{
                    this.fileError.status = true
                    this.fileError.msg = 'Incorrect file format'
                    return
                }
            }
        },

        async sendMembersList() {
            this.loader = true
            this.blockSendBtn = true
           await makeReq(`${this.getAuthServerIP}/api/user/multipleadd`, 'POST', {
                auth: {
                    requesting: 'client',
                    ...this.getAuthParams
                },
                data:{
                    users: this.listToSend
                }
           })
           .then(data=>{
                console.log(data)
                this.loader = false
                this.listToSend = undefined
                this.file = undefined
                this.loadFile = false
                if(data.statusCode==200){
                    this.multipleUpdateUsersList(data.data.users)
                    this.success = true

                    setTimeout(()=>{
                        this.success = false
                        this.blockSendBtn = false
                    },3000)
                }
                else{
                    this.blockSendBtn = false
                    this.error.value = true
                    this.error.msg = 'Server is crashing'
                }
           })
           .catch( error => console.error(error) )
        }
    }
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center
}
.form{
    padding: 15px;
    background-color: #fff;
    border-radius: 5px;
    width: 600px;
}
</style>