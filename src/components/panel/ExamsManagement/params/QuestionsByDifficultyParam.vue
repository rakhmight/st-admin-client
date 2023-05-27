<template>          
    <div class="columns mt-8" v-if="difficultyExist">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="difficultyDistributionRadio"
            >
                <v-radio
                    label="auto"
                    :value="false"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="manually"
                    :value="true"
                ></v-radio>
            </v-radio-group>
        </div>

        <div v-if="difficultyDistributionRadio">
            <div class="d-flex flex-row align-center">
                <v-icon size="18" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                <span class="ml-1">Total questions: <b>{{ questionsCountTemp }}</b></span>
            </div>

            <v-divider></v-divider>

            <div class="mt-3 d-flex flex-column" style="gap:15px">
                <difficulty-sub
                v-for="(difficulty, i) in difficultys"
                :key="i"
                :difficulty="difficulty"
                :questionsCount="questionsCountTemp"
                :questionsByDifficultyMngt="questionsByDifficultyMngt"
                :switchQuestions="switchQuestions"
                :switchTests="switchTests"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSubject } from '@/plugins/getInfo'
import DifficultySub from '@/components/panel/ExamsManagement/params/DifficultySub.vue'

export default {
    props:{
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        questionsCount: Number,
        switchTests: Boolean
    },
    components:{
        DifficultySub
    },
    data(){
        return {
            difficultyDistributionRadio: undefined,
            difficultyRanking: [],

            switchQuestions: false,
            questionsCountTemp: undefined,
            difficultys: [1,2,3],
            difficultyExist: false
        }
    },
    watch:{
        difficultyDistributionRadio(){
            if(this.difficultyDistributionRadio==false){
                this.difficultyRanking = null
                this.questionsCountTemp = this.questionsCount
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', this.difficultyRanking)
            } else {
                this.difficultyRanking = []
            }
        },

        questionsCount(){
            this.questionsCountTemp = this.questionsCount
            this.difficultyRanking = []
            this.switchQuestions = !this.switchQuestions
            this.paramsManagement(this.exam.subject, 'difficulty-ranking', undefined)
        },

        difficultyRanking(){
            if(this.difficultyDistributionRadio===true && this.questionsCountTemp==0 && this.questionsCount!=0){
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', this.themesRanking)
            } else if (this.difficultyDistributionRadio===true && this.questionsCountTemp!=0) {
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', undefined)
            }else if(this.difficultyDistributionRadio===false){
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', null)
            }

            console.log(this.difficultyRanking);
        },

        switchTests(){
            this.difficultyExistChecker()
            this.questionsCountTemp = this.questionsCount
        },

        difficultyExist(){
            if(!this.difficultyExist){
                this.paramsManagement(this.exam.subject, 'remove-difficulty-ranking')
            }
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        questionsByDifficultyMngt(type, difficulty){
            if(type=='plus'){
                const target = this.difficultyRanking.find(item=>item.difficulty==difficulty)
                if(target){
                    const index = this.difficultyRanking.indexOf(target)
                    this.difficultyRanking[index].count++
                } else {
                    this.difficultyRanking.push({
                        difficulty,
                        count: 1
                    })
                }

                this.questionsCountTemp--
            } else if(type=='minus'){
                const target = this.difficultyRanking.find(item=>item.difficulty==difficulty)
                if(target){
                    const index = this.difficultyRanking.indexOf(target)
                    this.difficultyRanking[index].count--

                    this.questionsCountTemp++

                    if(this.difficultyRanking[index].count==0){
                        this.difficultyRanking.splice(index, 1)
                    }
                }
            }

            if(this.questionsCountTemp){
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', undefined)
            } else {
                this.paramsManagement(this.exam.subject, 'difficulty-ranking', this.difficultyRanking)
            }
        },

        difficultyExistChecker(){
            let exist = 0
            this.exam.tests.forEach(test=>{
                const target = this.getTestImages.find(image=>image.fileName==test)
                if(target.info.params.considerDifficulty){
                    exist++
                }
            })

            if(exist==this.exam.tests.length){
                this.difficultyExist=true
            } else {
                this.difficultyExist=false
            }
            console.log(this.difficultyExist);
        }
    },
    mounted(){
        this.questionsCountTemp = this.questionsCount
        this.difficultyExistChecker()
    }
}
</script>