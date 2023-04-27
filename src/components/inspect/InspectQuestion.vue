<template>
    <div>
        <div
        class="test"
        :class="`question_${question.id}`"
        :id="question.id"
        >
            <div class="test__header d-flex flex-row justify-space-between mb-2" style="position: relative; font-size: 0.9em;">
                <div class="d-flex flex-row align-center">
                    <v-icon size="16" color="#888" class="mr-1">mdi-pound</v-icon>
                    <p style="color: #888" class="mr-5">{{ serialNumber }} (п/п) | {{ question.id }} (ID)</p>

                    <!-- Icon -->
                    <inspect-type-icons :type="question.type" :questionID="question.id" :questions="questions"/>

                </div>
                <div class="d-flex flex-row align-center">
                    <v-icon size="16" color="#888" class="mr-1">mdi-clock-time-eight-outline</v-icon>
                    <p style="color: #888">Last modified: {{ question.lastModified.date }} {{ question.lastModified.time }}</p>
                </div>
            </div>

            <v-divider style="opacity: 1;" color="#bbb"></v-divider>

            <div class="test__question-box mt-3 mb-6">
                <!-- Вопрос, картинка, параметры темы, балла, сложности -->
                <div class="mb-6">
                    <p>Question:</p>
                    <div class="d-flex flex-row align-start">
                        <v-icon class="mr-2 mt-2" :color="question.questionCtx ? '#0d5fd8' : ''" size="20">mdi-help-circle-outline</v-icon>

                        <div style="width: 100%; gap:15px" class="d-flex flex-column">
                            <div class="d-flex flex-row" style="width: 100%" v-if="testParams.languagesSettings.languages.indexOf('custom')!=-1">
                                <div class="questionCtx" v-if="question.questionCtx.custom">{{ question.questionCtx.custom }}</div>
                                <div class="questionCtxEmpty" v-else>Not filled</div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img
                                    v-bind="attrs"
                                    v-on="on"
                                    src="@/assets/media/global.png"
                                    width="30"
                                    height="30"
                                    class="mt-2 ml-2"
                                    v-if="testParams.languagesSettings.languages.length>1"
                                    ></v-img>
                                </template>
                                    <span>Question field in <b><u>foreign</u></b> language</span>
                                </v-tooltip>
                            </div>

                            <div class="d-flex flex-row" style="width: 100%" v-if="testParams.languagesSettings.languages.indexOf('ru')!=-1">
                                <div class="questionCtx" v-if="question.questionCtx.ru">{{ question.questionCtx.ru }}</div>
                                <div class="questionCtxEmpty" v-else>!!!!</div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img
                                    v-bind="attrs"
                                    v-on="on"
                                    src="@/assets/media/russia.png"
                                    width="30"
                                    height="30"
                                    class="mt-2 ml-2"
                                    v-if="testParams.languagesSettings.languages.length>1"
                                    ></v-img>
                                </template>
                                <span>Поле вопроса на <b><u>русском</u></b> языке</span>
                                </v-tooltip>
                            </div>

                            <div class="d-flex flex-row" style="width: 100%" v-if="testParams.languagesSettings.languages.indexOf('eng')!=-1">
                                <div class="questionCtx" v-if="question.questionCtx.eng">{{ question.questionCtx.eng }}</div>
                                <div class="questionCtxEmpty" v-else>Not filled</div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img
                                    v-bind="attrs"
                                    v-on="on"
                                    src="@/assets/media/united-states.png"
                                    width="30"
                                    height="30"
                                    class="mt-2 ml-2"
                                    v-if="testParams.languagesSettings.languages.length>1"
                                    ></v-img>
                                </template>
                                    <span>Question field in <b><u>english</u></b> language</span>
                                </v-tooltip>
                            </div>

                            <div class="d-flex flex-row" style="width: 100%" v-if="testParams.languagesSettings.languages.indexOf('uz_l')!=-1">
                                <div class="questionCtx" v-if="question.questionCtx.uz_l">{{ question.questionCtx.uz_l }}</div>
                                <div class="questionCtxEmpty" v-else>To'ldirilmagan</div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img
                                    v-bind="attrs"
                                    v-on="on"
                                    src="@/assets/media/uzbekistan.png"
                                    width="30"
                                    height="30"
                                    class="mt-2 ml-2"
                                    v-if="testParams.languagesSettings.languages.length>1"
                                    ></v-img>
                                </template>
                                    <span><b><u>O'zbek</u></b> tilida savollar qutisi (lotincha)</span>
                                </v-tooltip>
                            </div>

                            <div class="d-flex flex-row" style="width: 100%" v-if="testParams.languagesSettings.languages.indexOf('uz_k')!=-1">
                                <div class="questionCtx" v-if="question.questionCtx.uz_k">{{ question.questionCtx.uz_k }}</div>
                                <div class="questionCtxEmpty" v-else>Тўлдирилмаган</div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img
                                    v-bind="attrs"
                                    v-on="on"
                                    src="@/assets/media/uzbekistan.png"
                                    width="30"
                                    height="30"
                                    class="mt-2 ml-2"
                                    v-if="testParams.languagesSettings.languages.length>1"
                                    ></v-img>
                                </template>
                                    <span><b><u>Ўзбек</u></b> тилида саволлар қутиси (кирилча)</span>
                                </v-tooltip>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="d-flex flex-row justify-space-between">
                    <div>
                        <div class="d-flex flex-row mb-3 align-center">
                            <v-icon class="mr-2" :color="question.theme ? '#0d5fd8' : ''" size="20">mdi-alpha-t-box-outline</v-icon>
                            <div>
                                Theme:
                                <span style="color:#0d5fd8" v-if="question.theme">{{ getQuestionTheme(question.theme) }}</span>
                                <span style="color:#888" v-else>(!!!!)</span>
                            </div>
                        </div>

                        <div class="d-flex flex-row mb-3 align-center" v-if="testParams.considerDifficulty">
                            <v-icon class="mr-2" :color="question.difficulty ? '#0d5fd8' : ''" size="20">mdi-chart-line</v-icon>
                            <div>
                                Difficulty:
                                <span style="color:#0d5fd8" v-if="question.difficulty && question.difficulty==1">easy</span>
                                <span style="color:#0d5fd8" v-if="question.difficulty && question.difficulty==2">medium</span>
                                <span style="color:#0d5fd8" v-if="question.difficulty && question.difficulty==3">hard</span>
                                <span style="color:#888" v-if="!question.difficulty">(not choised)</span>
                            </div>
                        </div>

                        <div class="d-flex flex-row mb-3 align-center" v-if="testParams.ballSystem">
                            <v-icon class="mr-2" :color="question.ball ? '#0d5fd8' : ''" size="20">mdi-circle-double</v-icon>
                            <div>
                                Ball:
                                <span style="color:#0d5fd8">{{ question.ball }}</span>
                            </div>
                        </div>
                        
                        <div class="d-flex flex-row align-center" v-if="question.type=='question-with-images'"> 
                            <v-icon class="mr-2" :color="question.imagePreview ? '#0d5fd8' : ''" size="20">mdi-camera</v-icon>
                            <div>
                                Image:
                                <span></span>
                            </div>
                        </div>
                    </div>

                    <div v-if="question.type=='question-with-images'">
                        <div v-if="question.imagePreview">
                            <v-img
                            width="400"
                            :src="question.imagePreview"
                            contain
                            transition="scale-transition"
                            ></v-img>
                        </div>
                        <!-- Изображение, или: -->
                        <div class="imgEmpty" v-else>
                            <v-img
                            width="150"
                            src="@/assets/media/spider-web.png"
                            contain
                            transition="scale-transition"
                            ></v-img>
                        </div>
                    </div>
                </div>
            </div>

            <v-divider style="opacity: 1;" color="#bbb"></v-divider>

            <div class="test__answers-box mt-5" v-if="question.type!='question-with-field'">
                
                <!-- Обычные ответы, ответы с изображениями -->
                <div
                v-for="(answer, i) in question.answers"
                :key="i"
                class="d-flex flex-column align-center"
                style="width:100%"
                >
                    <div style="width:100%" class="d-flex flex-row">
                        <v-divider color="#888" vertical style="opacity: 1;" class="mr-2"></v-divider>
                        <div class="d-flex flex-row align-start" style="width:100%">
                            <v-icon class="mt-2 mr-2" :color="answer.isCurrect ? '#51c551' : '#777'" size="20">mdi-lightbulb</v-icon>

                            <div class="d-flex flex-column" style="width: 100%; gap:15px">
                                <div style="position: relative;" v-if="testParams.languagesSettings.languages.indexOf('custom')!=-1">
                                    <div class="answerCtx" v-if="answer.answerCtx.custom && !answer.isCurrect">{{ answer.answerCtx.custom }}</div>
                                    <div class="answerCtx" v-if="answer.answerCtx.custom && answer.isCurrect" style="border: 2px solid #51c551">{{ answer.answerCtx.custom }}</div>
                                    <div class="answerCtxEmpty" v-if="!answer.answerCtx.custom">Not filled</div>
                                    <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-img
                                        v-bind="attrs"
                                        v-on="on"
                                        v-if="testParams.languagesSettings.languages.length>1"
                                        src="@/assets/media/global.png"
                                        width="22"
                                        height="22"
                                        class="mt-2"
                                        style="position:absolute; top:-18px;right:-10px"
                                        ></v-img>
                                    </template>
                                        <span>Answer field in <b><u>foreign</u></b> language</span>
                                    </v-tooltip>
                                </div>

                                <div style="position: relative;" v-if="testParams.languagesSettings.languages.indexOf('ru')!=-1">
                                    <div class="answerCtx" v-if="answer.answerCtx.ru && !answer.isCurrect">{{ answer.answerCtx.ru }}</div>
                                    <div class="answerCtx" v-if="answer.answerCtx.ru && answer.isCurrect" style="border: 2px solid #51c551">{{ answer.answerCtx.ru }}</div>
                                    <div class="answerCtxEmpty" v-if="!answer.answerCtx.ru">!!!!!</div>
                                    <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-img
                                        v-bind="attrs"
                                        v-on="on"
                                        v-if="testParams.languagesSettings.languages.length>1"
                                        src="@/assets/media/russia.png"
                                        width="22"
                                        height="22"
                                        class="mt-2"
                                        style="position:absolute; top:-18px;right:-10px"
                                        ></v-img>
                                    </template>
                                        <span>Поле ответа на <b><u>русском</u></b> языке</span>
                                    </v-tooltip>
                                </div>

                                <div style="position: relative;" v-if="testParams.languagesSettings.languages.indexOf('eng')!=-1">
                                    <div class="answerCtx" v-if="answer.answerCtx.eng && !answer.isCurrect">{{ answer.answerCtx.eng }}</div>
                                    <div class="answerCtx" v-if="answer.answerCtx.eng && answer.isCurrect" style="border: 2px solid #51c551">{{ answer.answerCtx.eng }}</div>
                                    <div class="answerCtxEmpty" v-if="!answer.answerCtx.eng">Not filled</div>
                                    <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-img
                                        v-bind="attrs"
                                        v-on="on"
                                        v-if="testParams.languagesSettings.languages.length>1"
                                        src="@/assets/media/united-states.png"
                                        width="22"
                                        height="22"
                                        class="mt-2"
                                        style="position:absolute; top:-18px;right:-10px"
                                        ></v-img>
                                    </template>
                                        <span>Answer field in <b><u>english</u></b> language</span>
                                    </v-tooltip>
                                </div>

                                <div style="position: relative;" v-if="testParams.languagesSettings.languages.indexOf('uz_l')!=-1">
                                    <div class="answerCtx" v-if="answer.answerCtx.uz_l && !answer.isCurrect">{{ answer.answerCtx.uz_l }}</div>
                                    <div class="answerCtx" v-if="answer.answerCtx.uz_l && answer.isCurrect" style="border: 2px solid #51c551">{{ answer.answerCtx.uz_l }}</div>
                                    <div class="answerCtxEmpty" v-if="!answer.answerCtx.uz_l">To'ldirilmagan</div>
                                    <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-img
                                        v-bind="attrs"
                                        v-on="on"
                                        v-if="testParams.languagesSettings.languages.length>1"
                                        src="@/assets/media/uzbekistan.png"
                                        width="22"
                                        height="22"
                                        class="mt-2"
                                        style="position:absolute; top:-18px;right:-10px"
                                        ></v-img>
                                    </template>
                                        <span><b><u>O'zbek</u></b> tilida javoblar qutisi (lotincha)</span>
                                    </v-tooltip>
                                </div>

                                <div style="position: relative;" v-if="testParams.languagesSettings.languages.indexOf('uz_k')!=-1">
                                    <div class="answerCtx" v-if="answer.answerCtx.uz_k && !answer.isCurrect">{{ answer.answerCtx.uz_k }}</div>
                                    <div class="answerCtx" v-if="answer.answerCtx.uz_k && answer.isCurrect" style="border: 2px solid #51c551">{{ answer.answerCtx.uz_k }}</div>
                                    <div class="answerCtxEmpty" v-if="!answer.answerCtx.uz_k">Тўлдирилмаган</div>
                                    <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-img
                                        v-bind="attrs"
                                        v-on="on"
                                        v-if="testParams.languagesSettings.languages.length>1"
                                        src="@/assets/media/uzbekistan.png"
                                        width="22"
                                        height="22"
                                        class="mt-2"
                                        style="position:absolute; top:-18px;right:-10px"
                                        ></v-img>
                                    </template>
                                        <span><b><u>Ўзбек</u></b> тилида жавоблар қутиси (кирилча)</span>
                                    </v-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="question.type=='question-with-images'">
                        <v-img
                        v-if="answer.imagePreview"
                        width="200"
                        :src="answer.imagePreview"
                        contain
                        transition="scale-transition"
                        class="mt-3"
                        ></v-img>
                        <div class="imgEmpty mt-3" v-else>
                            <v-img
                            width="150"
                            src="@/assets/media/spider-web.png"
                            contain
                            transition="scale-transition"
                            ></v-img>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-3 d-flex flex-column justify-center" v-else style="position: relative;">
                <!-- Картинка с областью выделения -->
                <div class="d-flex flex-row mb-2 align-center">
                    <v-icon class="mr-2" :color="question.imagePreview ? '#0d5fd8' : ''" size="20">mdi-focus-field</v-icon>
                    <div>
                        Acceptable response error radius:
                        <span style="color:#0d5fd8">{{ question.answer[0].fault }}</span>
                        <span v-if="!question.imagePreview" style="color:#888"> (image not installed)</span>
                        <span v-if="question.imagePreview && !question.answer[1].x" style="color:#888"> (coordinates not set)</span>
                    </div>
                </div>
                <div v-if="question.imagePreview">
                    <v-img
                    width="955"
                    height="540"
                    contain
                    v-bind:src="question.imagePreview"
                    :class="`img_${question.id}`"
                    style="border: 3px solid #0d5fd8;margin:0 auto; position: relative;"
                    />
                </div>

                <div class="fieldEmpty" v-else>
                    <v-img
                    width="500"
                    height="300"
                    contain
                    src="@/assets/media/spider-web.png"
                    />
                </div>
            </div>
        </div>

        <div class="remark d-flex">
            <v-icon size="20" color="var(--red-color)" class="mt-3 mr-4">mdi-marker</v-icon>
            <v-textarea
            v-if="showRemark"
            density="compact"
            label="Describe the remark"
            variant="outlined"
            rows="2"
            color="var(--red-color)"
            v-model="remarkCtx"
            :disabled="blockAllBtns"
            ></v-textarea>
            <v-icon v-if="showRemark" size="20" color="var(--red-color)" class="mt-3 ml-2" @click="cancelRemark()">mdi-close</v-icon>
            <v-btn
            v-if="!showRemark"
            class="mt-2"
            color="var(--red-color)"
            density="compact"
            @click="showRemark=true"
            :disabled="blockAllBtns"
            >
            <span style="color: #fff">Write the remark</span>
            </v-btn>
        </div>
    </div>
</template>

<script>
import { getTheme } from '@/plugins/getInfo'
import { mapGetters } from 'vuex'
import InspectTypeIcons from '@/components/inspect/InspectTypeIcons'

export default {
    props:{
        question: Object,
        testParams: Object,
        serialNumber: Number,
        questions: Array,
        makeRemark: Function,
        blockAllBtns: Boolean
    },
    data(){
        return {
            showRemark: false,
            remarkCtx: undefined
        }
    },
    computed: mapGetters(['getSubjects']),
    components:{
        InspectTypeIcons
    },
    mounted() {
        if(this.question.type=='question-with-field' && this.question.imagePreview){
            let target = document.querySelector(`.img_${this.question.id}`)

            if(this.question.answer.length==2){
                if(this.question.answer[1] && this.question.answer[1].x){
                    let field = document.createElement('div')
                    field.classList.add(`target-${this.question.id}`)
                    field.style.padding = this.question.answer[0].fault+'px'
                    field.style.backgroundColor = 'red'
                    field.style.opacity = '0.5'
                    field.style.position = 'absolute'
                    field.style.zIndex = 10
                    field.style.left = this.question.answer[1].x-this.question.answer[0].fault+'px'
                    field.style.top =  this.question.answer[1].y-this.question.answer[0].fault+'px'

                    target.appendChild(field)
                }
            }else{
                this.question.answer.filter(el=>{
                    if(el.hasOwnProperty('x') && el.x){
                        let field = document.createElement('div')
                        field.classList.add(`target-${this.question.id}`)
                        field.style.padding = this.question.answer[0].fault+'px'
                        field.style.backgroundColor = 'red'
                        field.style.opacity = '0.5'
                        field.style.position = 'absolute'
                        field.style.zIndex = 10
                        field.style.left = el.x-this.question.answer[0].fault+'px'
                        field.style.top =  el.y-this.question.answer[0].fault+'px'

                        target.appendChild(field)
                    }
                })
            }
        }
    },
    methods:{
        getCurrentQuestion(question){
            if(this.testParams.languagesSettings.languages[0] == 'ru'){
                return question.ru
            } else if(this.testParams.languagesSettings.languages[0] == 'eng'){
                return question.eng
            } else if(this.testParams.languagesSettings.languages[0] == 'uz_l'){
                return question.uz_l
            } else if(this.testParams.languagesSettings.languages[0] == 'uz_k'){
                return question.uz_k
            } else if(this.testParams.languagesSettings.languages[0] == 'custom'){
                return question.custom
            }
        },

        getQuestionTheme(id){
            return getTheme(this.testParams.subject, id, this.getSubjects)
        },

        cancelRemark(){
            this.remarkCtx = undefined
            this.showRemark = false
        }
    },
    watch:{
        remarkCtx(){
            this.makeRemark(this.question.id, this.remarkCtx, 'question')
        }
    }
}
</script>

<style scoped>
.remark{
    padding: 15px;
    background-color: aliceblue;
    border-radius: 0 0 5px 5px;
}
.test{
    background-color: aliceblue;
    border-radius: 5px 5px 0 0;
    padding: 15px;
    box-shadow: 0px 0px 5px 5px #4444441c;
    scroll-margin-top:90px;
    height:fit-content;
}

.questionCtx{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #888;
    width: 100%;
}
.questionCtxEmpty{
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    border: 1px solid #888;
    color: #888;
}

.imgEmpty{
    border: 1px solid #888;
    width: 200px;
    height: 200px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.test__answers-box{
    display: grid;
    grid-template-columns: repeat(auto-fill, 47%);
    justify-content: space-between;
    gap: 30px;
    width: 100%;
}
.answerCtx{
    padding:10px;
    border-radius: 5px;
    border: 1px solid #888;
    width: 100%;
}
.answerCtxEmpty{
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    border: 1px solid #888;
    color: #888;
}

.fieldEmpty{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    width: 955px;
    height: 540px;
    border: 1px solid #888;
    color: #888;
    margin: 0 auto;
}
</style>