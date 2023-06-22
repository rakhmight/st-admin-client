<template>
    <div class="content">
        <title-component :title="'Send for check'" />

        <div class="wrapper" style="position: relative;">
            <div class="form">
                <div class="form__title mb-5">
                    <span class="text-h5">Upload your work</span>
                    <v-divider class="mt-1"></v-divider>
                </div>
                <div class="form__content">
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
                        :color="blockSendBtn ? '#eee': 'var(--main-color)'"
                        width="200"
                        :disabled="blockSendBtn"
                        @click="sendForCheck()"
                        >
                        <span :style="blockSendBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Send</span>
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
                    <span style="color:#fff">Test sent for review</span>
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

<script>
import TitleComponent from '@/components/TitleComponent';
import { mapGetters, mapMutations} from 'vuex';
import makeReq from '@/services/makeReq';

export default {
    props:{
        switchReRender: Function
    },
    data(){
        return {
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
    components:{
        TitleComponent
    },
    computed: mapGetters(['getAuthParams', 'getTestImages', 'getAdminServerIP']),
    methods:{
        ...mapMutations(['updateTestImages']),
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
                if(test.id && typeof test.id=='number' && test.author && typeof test.author=='string' && test.params && typeof test.params=='object' && test.questions && typeof test.questions=='string' && test.history && typeof test.history=='object' && !test.testImage){
                    this.blockSendBtn = false
                    this.testToSend = test
                    return
                } else {
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

        async sendForCheck(){
            this.loader = true
            this.blockSendBtn = true
            await makeReq(`${this.getAdminServerIP}/api/tests/upload`, 'POST',{
                auth:{
                    ...this.getAuthParams
                },
                data: this.testToSend
            })
            .then(data=>{
                if(data.statusCode==200){
                    // update state
                    this.updateTestImages({
                        author: this.testToSend.author,
                        fileName: data.data.fileName,
                        history: this.testToSend.history,
                        info: {
                            testInfo: this.testToSend.testInfo,
                            params: this.testToSend.params
                        },
                        status: {
                            value: 'under-review', step: 1, rejected: undefined
                        },
                        _id: data.data._id
                    })
                    // re-render
                    this.switchReRender()

                    this.success = true
                    setTimeout(()=>{
                        this.blockSendBtn = true
                        this.success = false
                        this.testToSend = undefined
                        this.testFile = undefined
                        this.loader = false
                    },3000)
                } else if(data.statusCode == 201){
                    this.error.value=true
                    this.error.msg = 'You are trying to load an already existing test'
                    this.loader = false
                }
            })
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
