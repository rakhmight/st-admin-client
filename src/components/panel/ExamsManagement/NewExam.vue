<template>
    <div class="content">
        <div class="form">
            <medium-title-component :title="'Add new exam'" />

            <div class="steps">
                <div
                class="step"
                :class="{ 'current-step': step==1 && !steps.first, 'step-complate': steps.first }"
                @click="step=1"
                ></div>

                <div
                class="step"
                :class="{ 'current-step': step==2 && !steps.second, 'step-complate': steps.second }"
                @click="step=2"
                ></div>

                <div
                class="step"
                :class="{ 'current-step': step==3 && !steps.third, 'step-complate': steps.third }"
                @click="step=3"
                ></div>

                <div
                class="step"
                :class="{ 'current-step': step==4 && !steps.fourth, 'step-complate': steps.fourth }"
                @click="step=4"
                ></div>
            </div>

            <div class="arrows d-flex flex-row justify-space-between">
                <div class="d-flex flex-row w-50" style="gap:30px">
                    <div>
                        <div class="d-flex align-center" style="gap:5px" v-if="step==1">
                            <v-icon size="19" color="var(--main-color)">mdi-calendar-clock</v-icon>
                            <span style="color: #444">Set the start date & time of the exam</span>
                        </div>
                        <div class="d-flex align-center" style="gap:5px" v-if="step==2">
                            <v-icon size="19" color="var(--main-color)">mdi-file-document-multiple-outline</v-icon>
                            <span style="color: #444">Select tests for the exam</span>
                        </div>
                        <div class="d-flex align-center" style="gap:5px" v-if="step==3">
                            <v-icon size="19" color="var(--main-color)">mdi-account-group-outline</v-icon>
                            <span style="color: #444">Specify persons to be examined (<b>{{ this.users.length }}</b> users choised)</span>
                        </div>
                        <div class="d-flex align-center" style="gap:5px" v-if="step==4">
                            <v-icon size="19" color="var(--main-color)">mdi-flash-outline</v-icon>
                            <span style="color: #444">Customize exam options</span>
                        </div>
                    </div>

                </div>
                
                <div class="d-flex flex-row w-25 justify-space-between">
                    <div v-if="step==1"></div>
                    <v-icon
                    color="#555"
                    @click="step--"
                    v-if="step>1"
                    >
                        mdi-arrow-left
                    </v-icon>
                    <v-icon
                    color="#555"
                    @click="step++"
                    v-if="step<4"
                    >
                    mdi-arrow-right
                    </v-icon>
                </div>
            </div>

            <div class="form__steps">
                <v-window v-model="step">
                    <v-window-item :value="1">
                        <date-step :switchStartFormat="switchStartFormat" :installDateData="installDateData" :examDateParams="examDateParams" />
                    </v-window-item>

                    <v-window-item :value="2">
                        <tests-step :choisingTest="choisingTest" :changeChoisedSubject="changeChoisedSubject" :switchChoisedSubject="switchChoisedSubject" />
                    </v-window-item>

                    <v-window-item :value="3">
                        <users-step :usersManagement="usersManagement" :users="users" :choisingUser="choisingUser" :reRenderSingle="reRenderSingle" />
                    </v-window-item>

                    <v-window-item :value="4">
                        <params-step :complex="complex" :paramsManagement="paramsManagement" :switchTests="switchTests"/>
                    </v-window-item>
                </v-window>
            </div>

            <div class="d-flex align-center justify-center">
                <v-btn
                density="compact"
                :color="!steps.first || !steps.second || !steps.third || !steps.fourth ? '#eee' : 'var(--main-color)'"
                :disabled="!steps.first || !steps.second || !steps.third || !steps.fourth"
                @click="approveExam"
                >
                
                <span :style="!steps.first || !steps.second || !steps.third || !steps.fourth ? 'color: #777' : 'color:#fff'" v-if="!loader">schedule an exam</span>
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

<script>
import MediumTitleComponent from '@/components/MediumTitleComponent';
import DateStep from '@/components/panel/ExamsManagement/steps/DateStep'
import TestsStep from '@/components/panel/ExamsManagement/steps/TestsStep'
import UsersStep from '@/components/panel/ExamsManagement/steps/UsersStep'
import ParamsStep from '@/components/panel/ExamsManagement/steps/ParamsStep'
import { mapGetters } from 'vuex';
import makeReq from '@/services/makeReq';

export default {
    data(){
        return {
            steps: {
                first: false,
                second: false,
                third: false,
                fourth: false
            },
            step: 1,
            loader: false,
            switchTests: false,

            // Date step
            startFormat: undefined,
            examDateParams:{
                start:{
                    date: undefined,
                    time: undefined,
                    byCommand: false,
                },
                end:{
                    date: undefined,
                    time: undefined,
                    byCommand: false,
                }
            },
            usersParams:{
                students:{
                    fullTime: [],
                    inAbsentia: [],
                    magistracy: []
                },
                enrollees:{
                    fullTime: [],
                    inAbsentia: [],
                    magistracy: []
                },
                teachers: [],
                employees: []
            },

            // Test step
            //tests: [],
            complex:[],

            // Users step
            users: [],
            reRenderSingle: false,

            // Params step
            params:{
                complex: {}
            },

            switchChoisedSubject: false
        }
    },
    computed: mapGetters(['getUsersList', 'getTestImages', 'getAdminServerIP', 'getAuthParams']),
    methods:{
        changeChoisedSubject(subjects){
            this.complex.forEach(exam=>{
                let counter = 0
                subjects.forEach(subject=>{
                    if(exam.subject==subject){
                        counter++
                    }
                })
                if(counter==0){
                    const index = this.complex.indexOf(exam)
                    this.complex.splice(index, 1)
                }
            })
            this.switchChoisedSubject = !this.switchChoisedSubject

            console.log(this.complex);
            if(!this.complex.length){
                this.steps.second = false
                this.steps.fourth = false
            }
        },

        switchStartFormat(format){
            this.startFormat = format
        },
        
        installDateData(type, value){
            if(type=='startDate'){
                this.examDateParams.start.date = value
            }else if(type=='startTime'){
                this.examDateParams.start.time = value
            } else if(type=='startByCommand'){
                this.examDateParams.start.byCommand = value
            } else if(type=='endDate'){
                this.examDateParams.end.date = value
            }else if(type=='endTime'){
                this.examDateParams.end.time = value
            } else if(type=='endByCommand'){
                this.examDateParams.end.byCommand = value
            }
        },

        examTimeParamsChecker(){
            if(this.examDateParams.start.date && this.examDateParams.start.time && !this.examDateParams.start.byCommand && this.examDateParams.end.date && this.examDateParams.end.time && !this.examDateParams.end.byCommand
            || !this.examDateParams.start.date && !this.examDateParams.start.time && this.examDateParams.start.byCommand && !this.examDateParams.end.date && !this.examDateParams.end.time && this.examDateParams.end.byCommand
            || !this.examDateParams.start.date && !this.examDateParams.start.time && this.examDateParams.start.byCommand && this.examDateParams.end.date && this.examDateParams.end.time && !this.examDateParams.end.byCommand
            || this.examDateParams.start.date && this.examDateParams.start.time && !this.examDateParams.start.byCommand && !this.examDateParams.end.date && !this.examDateParams.end.time && this.examDateParams.end.byCommand
            ){
                this.steps.first = true
            } else {
                this.steps.first = false
            }
        },

        choisingTest(type, value){
            if(type=='add'){
                //if(this.users.indexOf(value)==-1){
                    //this.tests.push(value)
                //}
                if(this.complex.find(exam=>exam.subject==value.info.params.subject)){
                    const target = this.complex.find(exam=>exam.subject==value.info.params.subject)
                    const index = this.complex.indexOf(target)
                    this.complex[index].tests.push(value.fileName)
                } else {
                    this.complex.push({
                        subject: value.info.params.subject,
                        tests: [value.fileName],
                        params: {}
                    })
                }
            } else if(type=='remove'){
                const target = this.complex.find(exam=>exam.subject==value.info.params.subject)
                const index = this.complex.indexOf(target)
                const index2 = this.complex[index].tests.indexOf(value.fileName)
                this.complex[index].tests.splice(index2, 1)
                if(!this.complex[index].tests.length){
                    this.complex.splice(index, 1)
                }
            }
            this.switchTests = !this.switchTests

            if(this.complex.length){
                this.steps.second = true
            } else {
                this.steps.second = false
            }
        },

        usersManagement(type, options, value){
            if(type=='group'){
                if(options.role=='student' && options.educationForm=='full-time'){
                    this.usersParams.students.fullTime = value
                }
                if(options.role=='student' && options.educationForm=='in-absentia'){
                    this.usersParams.students.inAbsentia = value
                }
                if(options.role=='student' && options.educationForm=='magistracy'){
                    this.usersParams.students.magistracy = value
                }
                if(options.role=='enrollee' && options.educationForm=='full-time'){
                    this.usersParams.enrollees.fullTime = value
                }
                if(options.role=='enrollee' && options.educationForm=='in-absentia'){
                    this.usersParams.enrollees.inAbsentia = value
                }
                if(options.role=='enrollee' && options.educationForm=='magistracy'){
                    this.usersParams.enrollees.magistracy = value
                }
                
                if(options.role=='employee'){
                    this.usersParams.employees = value
                }
                if(options.role=='teacher'){
                    this.usersParams.teachers = value
                }

                this.usersCouting()
            } else if(type=='single'){

            }
            
        },

        usersCouting(){
            this.users = []

            this.getUsersList.forEach(user => {
                if(this.usersParams.students.fullTime.length){
                    this.usersParams.students.fullTime.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.students.inAbsentia.length){
                    this.usersParams.students.inAbsentia.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.students.magistracy.length){
                    this.usersParams.students.magistracy.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.fullTime.length){
                    this.usersParams.enrollees.fullTime.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.inAbsentia.length){
                    this.usersParams.enrollees.inAbsentia.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.magistracy.length){
                    this.usersParams.enrollees.magistracy.forEach(element=>{
                        if(user.roleProperties.group==element){
                            this.users.push(user.id)
                        }
                    })
                }
                
                if(this.usersParams.employees.length){
                    this.usersParams.employees.forEach(element=>{
                        if(user.roleProperties.department==element){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.teachers.length){
                    this.usersParams.teachers.forEach(element=>{
                        if(user.roleProperties.department==element){
                            this.users.push(user.id)
                        }
                    })
                }

            });

            //console.log(this.users);
            this.reRenderSingle = true
            setTimeout(()=>{
                this.reRenderSingle = false
            },200)

            if(this.users.length){
                this.steps.third = true
            } else {
                this.steps.third = false
            }
        },

        choisingUser(type, value){
            if(type=='add'){
                this.users.push(value)
            } else if(type=='remove'){
                const index = this.users.indexOf(value)
                this.users.splice(index, 1)
            }
            
            if(this.users.length){
                this.steps.third = true
            } else {
                this.steps.third = false
            }
            
            //console.log(this.users)
        },

        finallyStepChecker(){
            let paramsCount = 13 * this.complex.length
            let i = 0

            if(this.complex.length>1){
                paramsCount=paramsCount+3

                for(let param in this.params.complex){
                    if(this.params.complex[param] || this.params.complex[param]===null){
                        i++
                    }
                }
            }

            this.complex.forEach(exam=>{
                if(exam.params.showResults){
                    paramsCount += 2
                }

                let testsWithDifficulty = 0
                exam.tests.forEach(test=>{
                    const target = this.getTestImages.find(image=>image.fileName==test)
                    if(target.info.params.considerDifficulty){
                        testsWithDifficulty++
                    }
                })

                if(testsWithDifficulty!=exam.tests.length){
                    paramsCount--
                }

                for(let param in exam.params){
                    if(exam.params[param] || exam.params[param] === null || exam.params[param] === false){
                        i++
                    }
                }
            })

            if(paramsCount == i && paramsCount!=0){
                this.steps.fourth = true
                console.log(true, `${i}/${paramsCount}`);
            } else {
                console.log(false, `${i}/${paramsCount}`);
                this.steps.fourth = false
            }
        },

        paramsManagement(subject, type, param){
            if(subject){
                const target = this.complex.find(item=>item.subject==subject)
                const index = this.complex.indexOf(target)

                if(type == 'exam-time'){
                    this.complex[index].params.examTime = param
                } else if(type=='question-time'){
                    this.complex[index].params.questionTime = param
                } else if(type=='change-answer'){
                    this.complex[index].params.changeAnswerPossibility = param
                } else if(type=='exam-languages'){
                    this.complex[index].params.languages = param
                } else if(type=='exam-ball-system'){
                    this.complex[index].params.ballSystem = param
                } else if(type=='tickets-count'){
                    this.complex[index].params.ticketsCount = param
                } else if(type=='questions-count'){
                    this.complex[index].params.questionsCount = param
                } else if(type=='answers-count'){
                    this.complex[index].params.answersCount = param
                } else if(type=='themes'){
                    this.complex[index].params.themes = param
                } else if(type=='themes-ranking'){
                    this.complex[index].params.themesRanking = param
                } else if(type=='difficulty-ranking'){
                    this.complex[index].params.difficultyRanking = param
                } else if(type=='remove-difficulty-ranking'){
                    delete this.complex[index].params.difficultyRanking
                } else if(type == 'show-results'){
                    this.complex[index].params.showResults = param
                } else if(type == 'result-display-time'){
                    this.complex[index].params.resultDisplayTime = param
                } else if(type == 'clear-results'){
                    delete this.complex[index].params.resultDisplayTime
                    delete this.complex[index].params.displayedResultParams
                } else if(type == 'displayed-result-params'){
                    this.complex[index].params.displayedResultParams = param
                } else if(type == 'evaluation-system'){
                    this.complex[index].params.evaluationSystem = param
                }
            } else {
                if(type == 'exams-interval'){
                    this.params.complex.examsInterval = param
                } else if(type == 'exams-order'){
                    this.params.complex.examsOrder = param
                } else if(type == 'complex-results'){
                    this.params.complex.complexResults = param
                } else if(type == 'clear-complex'){
                    this.params.complex = null
                } else if(type == 'init-complex'){
                    this.params.complex = {}
                }
            }

            console.log({
                complex: this.complex,
                users: this.users,
                examDateParams: this.examDateParams,
                params: this.params
            });
            this.finallyStepChecker()
        },

        approveExam(){
            const data = {
                complex: this.complex,
                params: this.params,
                users: this.users,
                date: this.examDateParams
            }

            console.log(data);

            makeReq(`${this.getAdminServerIP}/api/exam/established`, 'POST', {
                ...this.getAuthParams,
                data
            })
        }
    },
    watch:{
        startFormat(){
            if(this.startFormat=='byCommand'){
                this.steps.first = true
                this.examDateParams = {
                    start:{
                        date: undefined,
                        time: undefined,
                        byCommand: true,
                    },
                    end:{
                        date: undefined,
                        time: undefined,
                        byCommand: true,
                    }
                }
            } else {
                this.examTimeParamsChecker()
            }
        },

        'examDateParams.start.date'(){
            this.examTimeParamsChecker()
        },
        'examDateParams.start.time'(){
            this.examTimeParamsChecker()
        },
        'examDateParams.start.byCommand'(){
            if(this.examDateParams.start.byCommand){
                this.examDateParams.start.date = undefined
                this.examDateParams.start.time = undefined
            }
            this.examTimeParamsChecker()
        },
        'examDateParams.end.date'(){
            this.examTimeParamsChecker()
        },
        'examDateParams.end.time'(){
            this.examTimeParamsChecker()
        },
        'examDateParams.end.byCommand'(){
            if(this.examDateParams.end.byCommand){
                this.examDateParams.end.date = undefined
                this.examDateParams.end.time = undefined
            }
            this.examTimeParamsChecker()
        },
    },
    components:{
        MediumTitleComponent,
        DateStep,
        TestsStep,
        UsersStep,
        ParamsStep
    }
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 6px; /* ширина для вертикального скролла */
    background-color: #b9b9b9;
}
.content{
    width: 100%;
}
.form{
    padding: 15px;
    background-color: #fff;
    width: 100%;
    border-radius: 5px;
    position: relative;
    min-height: 76vh;
    max-height: 76vh;
    display: grid;
    grid-template-rows: 37px 24px 1fr 24px;
    gap:20px;
}
.form__steps{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.steps{
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 7px;
    top: 27px;
    right: 15px;
}
.step{
    padding: 3px 20px;
    border-radius: 5px;
    background-color: #6e6e6e;
    cursor: pointer;
}
.step-complate{
    background-color: var(--main-color);
}
.current-step{
    /* background-color: rgb(177, 177, 177) */
    opacity: 0.7;
}
</style>
