<template>
    <div class="form__step" v-if="complex.length">

        <div class="d-flex flex-column" style="gap: 10px" v-if="subjectPotentialParams.length">
            <div v-for="exam in subjectPotentialParams" :key="exam.subject">
                <div
                v-if="!exam.isUsed"
                class="d-flex align-center"
                style="gap: 15px"
                >
                    <span style="color: var(--main-color)">• {{ getSubjectName(exam.subject) }}</span>
                    <v-btn
                    density="compact"
                    color="var(--main-color)"
                    @click="useSubjectParams(exam.subject)"
                    :disabled="switchPotentialParams"
                    >
                    <span style="color: #fff">Use previous params</span>
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Параметры процесса экзаменации -->
        <div class="params" v-if="!switchPotentialParams">
            <div class="params__header d-flex">
                <div class="d-flex flex-row align-center" style="padding: 3px 10px; background-color: var(--bg-special-color);">
                    <v-icon size="16" color="#fff">mdi-step-forward</v-icon>
                    <span class="ml-1" style="font-weight: 500; color: #fff">Examination process params</span>
                </div>
            </div>
            <div class="params__body mt-3">

                <!-- Общее время экзамена -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Exam time:</span>
                    </div>

                    <!--  -->
                    <exam-time-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.examTime : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Время на 1 вопрос -->
                <!-- <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Time for a question:</span>
                    </div>

                    <question-time-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    />
                </div>

                <v-divider></v-divider> -->

                <!-- Возможность смены ответа -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Possibility to change the answer:</span>
                    </div>

                    <change-answer-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.changeAnswerPossibility : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Ограничить языки -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Language restrictions:</span>
                    </div>

                    <languages-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.languages : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Балльная система -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Ball system:</span>
                    </div>

                    <ball-system-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :difficultyExist="difficultyExist"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.ballSystem : undefined"
                    />
                </div>
            </div>
        </div>
        
        <v-divider thickness="5" color="var(--bg-special-color)" style="opacity: 0.4" v-if="!switchPotentialParams"></v-divider>
        
        <!-- Параметры билетов -->
        <div class="params" v-if="!switchPotentialParams">
            <div class="params__header d-flex">
                <div class="d-flex flex-row align-center" style="padding: 3px 10px; background-color: var(--bg-special-color);">
                    <v-icon size="16" color="#fff">mdi-step-forward</v-icon>
                    <span class="ml-1" style="font-weight: 500; color: #fff">Tickets params</span>
                </div>
            </div>
            <div class="params__body mt-3">

                <!-- Количество билетов -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Number of tickets:</span>
                    </div>

                    <tickets-count-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.ticketsCount : undefined"
                    />
                </div>

                <!-- Количество вопросов в билете -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Number of questions in the ticket:</span>
                    </div>

                    <questions-count-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :changeQuestionsCount="changeQuestionsCount"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.questionsCount : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Лимитированное количество ответов -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Limit the number of answers per question:</span>
                    </div>

                    <answers-count-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.answersCount : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Ограничить темы -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Exam themes restrictions:</span>
                    </div>

                    <themes-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :switchDifficultyExist="switchDifficultyExist"
                    :changeChoisedThemes="changeChoisedThemes"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.themes : undefined"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Сколько вопросов д.б. в 1 билете по темам -- Если нет сложности в тестах --> 
                <div class="rows" v-if="!difficultyExist">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Themes distribution:</span>
                    </div>

                    <questions-by-themes-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :questionsCount="questionsCount"
                    :choisedThemes="choisedThemes"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.themesRanking : undefined"
                    />
                </div>

                <div class="rows" v-if="difficultyExist">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Themes distribution (by difficulty):</span>
                    </div>

                    <!--  -->
                    <questions-by-themes-and-difficulty-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :questionsCount="questionsCount"
                    :choisedThemes="choisedThemes"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.themesRanking : undefined"
                    />
                </div>

                <!-- Сколько вопросов д.б. в 1 билете по сложности #и по теме -->
                <!-- <div class="rows" v-if="difficultyExist">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Difficulty distribution:</span>
                    </div>

                    <questions-by-difficulty-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchTests="switchTests"
                    :questionsCount="questionsCount"
                    :switchDifficultyExist="switchDifficultyExist"
                    />
                </div> -->
            </div>
        </div>

        <v-divider thickness="5" color="var(--bg-special-color)" style="opacity: 0.4" v-if="complex.length>1 && !switchPotentialParams"></v-divider>
        
        <!-- Параметры комплексного экзамена -->
        <div class="params" v-if="complex.length>1 && !switchPotentialParams">
            <div class="params__header d-flex">
                <div class="d-flex flex-row align-center" style="padding: 3px 10px; background-color: var(--bg-special-color);">
                    <v-icon size="16" color="#fff">mdi-step-forward</v-icon>
                    <span class="ml-1" style="font-weight: 500; color: #fff">Complex exam params</span>
                </div>
            </div>
            <div class="params__body mt-3">

                <!-- Включение следующего экзамена: автом. (время в сек) или по команде админа -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Starting the next exam:</span>
                    </div>

                    <exams-interval-param
                    :paramsManagement="paramsManagement"
                    :switchTests="switchTests"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Очерёдность (drag&drop) -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Exam order:</span>
                    </div>

                    <exams-order-param
                    :paramsManagement="paramsManagement"
                    :switchTests="switchTests"
                    :complex="complex"
                    />
                </div>

                <v-divider></v-divider>

                <!-- Показать результаты в конце либо после каждого -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Results display:</span>
                    </div>

                    <complex-results-param
                    :paramsManagement="paramsManagement"
                    :switchTests="switchTests"
                    />
                </div>
            </div>
        </div>
        
        <v-divider thickness="5" color="var(--bg-special-color)" style="opacity: 0.4" v-if="!switchPotentialParams"></v-divider>

        <!-- Параметры результатов экзамена -->
        <div class="params" v-if="!switchPotentialParams">
            <div class="params__header d-flex">
                <div class="d-flex flex-row align-center" style="padding: 3px 10px; background-color: var(--bg-special-color);">
                    <v-icon size="16" color="#fff">mdi-step-forward</v-icon>
                    <span class="ml-1" style="font-weight: 500; color: #fff">Results params</span>
                </div>
            </div>
            <div class="params__body mt-3">

                <!-- Отображать результат или нет -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Show the results to the examinee:</span>
                    </div>

                    <show-results-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :switchShowingResults="switchShowingResults"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.showResults : undefined"
                    />

                </div>

                <v-divider v-if="showResults.length"></v-divider>

                <!-- Время отображения результата -->
                <div class="rows" v-if="showResults.length">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Display time:</span>
                    </div>

                    <result-display-time-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :showResults="showResults"
                    :switchResultShowing="switchResultShowing"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.resultDisplayTime : undefined"
                    />
                </div>

                <v-divider v-if="showResults.length"></v-divider>

                <!-- Что отображать в результате -->
                <div class="rows" v-if="showResults.length">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Parameters displayed as a result:</span>
                    </div>

                    <displayed-result-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :showResults="showResults"
                    :switchResultShowing="switchResultShowing"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.displayedResultParams : undefined"
                    />
                </div>

                <!-- Оценочная система (%) -->
                <div class="rows">
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Evaluation system:</span>
                    </div>

                    <evaluation-system-param
                    v-if="complex.length"
                    v-for="(exam, i) in complex"
                    :key="i"
                    :exam="exam"
                    :paramsManagement="paramsManagement"
                    :complex="complex"
                    :potentialParam="usedPotentialParams.find(item => item.subject == exam.subject) ? usedPotentialParams.find(item => item.subject == exam.subject).params.evaluationSystem : undefined"
                    />
                </div>
            </div>
        </div>

        <div
        v-if="switchPotentialParams"
        class="d-flex flex-column align-center justify-center"
        style="width: 100%; height: 40vh"
        >
            <v-progress-circular model-value="20" indeterminate :size="60" width="2" color="var(--main-color)"></v-progress-circular>
            <p class="mt-4" style="color:#444; font-size: 0.9rem;">Data injecting..</p>
        </div>
    </div>

    <div v-else>
        <data-empty :text="'Choise tests first'" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExamTimeParam from '@/components/panel/ExamsManagement/params/ExamTimeParam.vue'
import QuestionTimeParam from '@/components/panel/ExamsManagement/params/QuestionTimeParam.vue'
import ChangeAnswerParam from '@/components/panel/ExamsManagement/params/ChangeAnswerParam.vue'
import LanguagesParam from '@/components/panel/ExamsManagement/params/LanguagesParam.vue'
import BallSystemParam from '@/components/panel/ExamsManagement/params/BallSystemParam.vue'
import QuestionsCountParam from '@/components/panel/ExamsManagement/params/QuestionsCountParam.vue'
import TicketsCountParam from '@/components/panel/ExamsManagement/params/TicketsCountParam.vue'
import AnswersCountParam from '@/components/panel/ExamsManagement/params/AnswersCountParam.vue'
import ThemesParam from '@/components/panel/ExamsManagement/params/ThemesParam.vue'
import QuestionsByThemesParam from '@/components/panel/ExamsManagement/params/QuestionsByThemesParam.vue'
import QuestionsByDifficultyParam from '@/components/panel/ExamsManagement/params/QuestionsByDifficultyParam.vue'
import ExamsIntervalParam from '@/components/panel/ExamsManagement/params/ExamsIntervalParam.vue'
import ExamsOrderParam from '@/components/panel/ExamsManagement/params/ExamsOrderParam.vue'
import ComplexResultsParam from '@/components/panel/ExamsManagement/params/ComplexResultsParam.vue'
import ShowResultsParam from '@/components/panel/ExamsManagement/params/ShowResultsParam.vue'
import ResultDisplayTimeParam from '@/components/panel/ExamsManagement/params/ResultDisplayTimeParam.vue'
import DisplayedResultParam from '@/components/panel/ExamsManagement/params/DisplayedResultParam.vue'
import EvaluationSystemParam from '@/components/panel/ExamsManagement/params/EvaluationSystemParam.vue'
import DataEmpty from '@/components/DataEmpty.vue'
import QuestionsByThemesAndDifficultyParam from '../params/QuestionsByThemesAndDifficultyParam.vue'

import { getSubject } from '@/plugins/getInfo'

export default {
    props:{
        complex: Array,
        paramsManagement: Function,
        switchTests: Boolean,
        usedPotentialParams: Array,
        useSubjectParams: Function,
        switchPotentialParams: Boolean,
        subjectPotentialParams: Array
    },
    components:{
        ExamTimeParam,
        QuestionTimeParam,
        ChangeAnswerParam,
        LanguagesParam,
        BallSystemParam,
        QuestionsCountParam,
        TicketsCountParam,
        AnswersCountParam,
        ThemesParam,
        QuestionsByThemesParam,
        QuestionsByDifficultyParam,
        ExamsIntervalParam,
        ExamsOrderParam,
        ComplexResultsParam,
        ShowResultsParam,
        ResultDisplayTimeParam,
        DisplayedResultParam,
        EvaluationSystemParam,
        DataEmpty,
        QuestionsByThemesAndDifficultyParam
    },
    computed: mapGetters(['getSubjects' ,'getTestImages']),
    data(){
        return {
            // Optionaly
            questionsCount: undefined,
            //difficultyExist: false,
            showResults: [],
            switchResultShowing: false,

            difficultyExist: false,
            choisedThemes: []
        }
    },
    watch:{
        switchTests(){
            //this.checkDifficultyExist()
            
            // синхронизация визуала с параметрами

            if(this.complex.length>1){
                this.paramsManagement(undefined, 'init-complex')
            } else {
                this.paramsManagement(undefined, 'clear-complex')
            }
        }
    },
    methods:{
        
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        changeChoisedThemes(subject, value){
            this.paramsManagement(subject, 'themes', value)

            if(value) this.choisedThemes = value
            else this.choisedThemes = []
        },
        changeQuestionsCount(count){
            this.questionsCount = count
        },

        switchDifficultyExist(value, subject){
            this.difficultyExist = value
            this.paramsManagement(subject, 'difficulty-exist', value)
        },

        switchShowingResults(type, subject){
            if(type=='add'){
                this.showResults.push(subject)
            } else if(type=='remove'){
                const index = this.showResults.indexOf(subject)
                this.showResults.splice(index, 1)
                this.paramsManagement(subject, 'clear-results')
            }

            this.switchResultShowing = !this.switchResultShowing
        }
    },
    // mounted(){
    //     this.checkDifficultyExist()
    // }
}
</script>


<style scoped>
.form__step{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-top: 20px;
    padding: 20px;
    background-color: rgb(238, 244, 250)
}

.rows{
    width:100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.params__body{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>

<style>
.columns{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    align-items: start;
}
</style>