<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="themesDifficultyDistributionRadio"
            >
                <v-radio
                    label="random"
                    :value="false"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="manually"
                    :value="true"
                ></v-radio>
            </v-radio-group>
        </div>

        <div v-if="themesDifficultyDistributionRadio">
            <div class="d-flex flex-row align-center">
                <v-icon size="18" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                <span class="ml-1">Total questions: <b>{{ questionsCountTemp ? questionsCountTemp : 0 }}</b></span>
            </div>

            <v-divider></v-divider>

            <div class="mt-3 d-flex flex-column" style="gap:15px" v-if="!potentialParam">
                <!--  -->
                <theme-difficulty-sub
                v-for="(theme) in themes"
                :key="theme"
                :theme="theme"
                :exam="exam"
                :questionsCount="questionsCountTemp"
                :questionsByThemesDifficultyMngt="questionsByThemesDifficultyMngt"
                :switchQuestions="switchQuestions"
                :switchTests="switchTests"
                :choisedThemes="choisedThemes"
                />
            </div>
            <div class="mt-3 d-flex flex-column" style="gap:15px" v-if="potentialParam">
                <!--  -->
                <theme-difficulty-sub
                v-for="(theme) in themes"
                :key="theme"
                :theme="theme"
                :exam="exam"
                :questionsCount="questionsCountTemp"
                :questionsByThemesDifficultyMngt="questionsByThemesDifficultyMngt"
                :switchQuestions="switchQuestions"
                :switchTests="switchTests"
                :choisedThemes="choisedThemes"
                :potentialValue="potentialParam.find(pm => pm.theme == theme) ? potentialParam.find(pm => pm.theme == theme) : undefined"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';
import ThemeDifficultySub from '@/components/panel/ExamsManagement/params/ThemeDifficultySub.vue'

export default {
    props:{
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        questionsCount: Number,
        switchTests: Boolean,
        choisedThemes: Array,
        potentialParam: Array | null | undefined
    },
    components:{
        ThemeDifficultySub
    },
    data(){
        return {
            themesDifficultyDistributionRadio: undefined,
            themesRanking: [],
            themes: [],
            questionsCountTemp: undefined,
            switchQuestions: false,

            potentialParamInjection: false
        }
    },
    watch:{
        themesDifficultyDistributionRadio(){
            if(this.themesDifficultyDistributionRadio==false){
                this.themesRanking = null
                this.switchQuestions = !this.switchQuestions
                this.questionsCountTemp = this.questionsCount
            } else {
                if(!this.potentialParamInjection){
                    this.themesRanking = []
                } else this.potentialParamInjection = false
            }
        },

        themesRanking(){
            if(this.themesDifficultyDistributionRadio===true && this.questionsCountTemp==0){
                console.log(this.questionsCountTemp);
                this.paramsManagement(this.exam.subject, 'themes-ranking', this.themesRanking)
            } else if (this.themesDifficultyDistributionRadio===true && this.questionsCountTemp!=0) {
                this.paramsManagement(this.exam.subject, 'themes-ranking', undefined)
            }else if(this.themesDifficultyDistributionRadio===false){
                this.paramsManagement(this.exam.subject, 'themes-ranking', null)
            }
        },

        switchTests(){
            this.countThemes()
            this.themesRanking = []
            this.questionsCountTemp = this.questionsCount
        },

        questionsCount(){
            this.questionsCountTemp = this.questionsCount
            this.themesRanking = []
            this.switchQuestions = !this.switchQuestions
        },

        choisedThemes(){
            this.countThemes()
            this.themesRanking = []
            this.questionsCountTemp = this.questionsCount
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        countThemes(){
            this.themes = []

            if(this.choisedThemes.length){
                this.themes = [...this.choisedThemes]
            } else {
                this.exam.tests.forEach(test=>{
                    const target = this.getTestImages.find(image=>image.fileName==test)
                    this.themes.push(...target.info.params.themes)
                    this.themes = new Set(this.themes)
                    this.themes = new Array(...this.themes)
                })
            }
        },

        questionsByThemesDifficultyMngt(type, theme, difficulty){

            if(type=='plus'){
                const target = this.themesRanking.find(item=>item.theme==theme)
                if(target){
                    const index = this.themesRanking.indexOf(target)
                    if(difficulty=='easy') this.themesRanking[index].easy++
                    if(difficulty=='medium') this.themesRanking[index].medium++
                    if(difficulty=='hard') this.themesRanking[index].hard++
                } else {
                    if(difficulty=='easy') this.themesRanking.push({ theme, easy: 1, medium: 0, hard: 0 })
                    if(difficulty=='medium') this.themesRanking.push({ theme, easy: 0, medium: 1, hard: 0 })
                    if(difficulty=='hard') this.themesRanking.push({ theme, easy: 0, medium: 0, hard: 1 })
                }

                this.questionsCountTemp--
            } else if(type=='minus'){
                const target = this.themesRanking.find(item=>item.theme==theme)
                if(target){
                    const index = this.themesRanking.indexOf(target)
                    
                    if(difficulty=='easy') this.themesRanking[index].easy--
                    if(difficulty=='medium') this.themesRanking[index].medium--
                    if(difficulty=='hard') this.themesRanking[index].hard--

                    this.questionsCountTemp++

                    if(this.themesRanking[index].count==0){
                        this.themesRanking.splice(index, 1)
                    }
                }
            }

            if(this.questionsCountTemp){
                this.paramsManagement(this.exam.subject, 'themes-ranking', undefined)
            } else {
                this.paramsManagement(this.exam.subject, 'themes-ranking', this.themesRanking)
            }
        },

        // questionsByThemesMngt(type, theme){
        //     if(type=='plus'){
        //         const target = this.themesRanking.find(item=>item.theme==theme)
        //         if(target){
        //             const index = this.themesRanking.indexOf(target)
        //             this.themesRanking[index].count++
        //         } else {
        //             this.themesRanking.push({
        //                 theme,
        //                 count: 1
        //             })
        //         }

        //         this.questionsCountTemp--
        //     } else if(type=='minus'){
        //         const target = this.themesRanking.find(item=>item.theme==theme)
        //         if(target){
        //             const index = this.themesRanking.indexOf(target)
        //             this.themesRanking[index].count--

        //             this.questionsCountTemp++

        //             if(this.themesRanking[index].count==0){
        //                 this.themesRanking.splice(index, 1)
        //             }
        //         }
        //     }

        //     if(this.questionsCountTemp){
        //         this.paramsManagement(this.exam.subject, 'themes-ranking', undefined)
        //     } else {
        //         this.paramsManagement(this.exam.subject, 'themes-ranking', this.themesRanking)
        //     }
        // }
    },
    mounted(){
        this.countThemes()
        this.questionsCountTemp = this.questionsCount
        this.themesRanking = []

        if(this.potentialParam){
            this.potentialParamInjection = true
            this.themesDifficultyDistributionRadio = true
        }else if(this.potentialParam === null){
            this.themesDifficultyDistributionRadio = false
        }
    }
}
</script>
