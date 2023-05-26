<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="themesDistributionRadio"
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

        <div v-if="themesDistributionRadio">
            <div class="d-flex flex-row align-center">
                <v-icon size="18" color="var(--main-color)">mdi-help-circle-outline</v-icon>
                <span class="ml-1">Total questions: <b>{{ questionsCountTemp }}</b></span>
            </div>

            <v-divider></v-divider>

            <div class="mt-3 d-flex flex-column" style="gap:15px">
                <!--  -->
                <themes-sub
                v-for="(theme, i) in themes"
                :key="i"
                :theme="theme"
                :exam="exam"
                :questionsCount="questionsCountTemp"
                :questionsByThemesMngt="questionsByThemesMngt"
                :switchQuestions="switchQuestions"
                :switchTests="switchTests"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';
import ThemesSub from '@/components/panel/ExamsManagement/params/ThemesSub.vue'

export default {
    props:{
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        questionsCount: Number,
        switchTests: Boolean
    },
    components:{
        ThemesSub
    },
    data(){
        return {
            themesDistributionRadio: undefined,
            themesRanking: [],
            themes: [],
            questionsCountTemp: undefined,
            switchQuestions: false
        }
    },
    watch:{
        themesDistributionRadio(){
            if(this.themesDistributionRadio==false){
                this.themesRanking = null
                this.switchQuestions = !this.switchQuestions
                this.questionsCountTemp = this.questionsCount
            } else {
                this.themesRanking = []
            }
        },

        themesRanking(){
            if(this.themesDistributionRadio===true && this.questionsCountTemp==0){
                console.log(this.questionsCountTemp);
                this.paramsManagement(this.exam.subject, 'themes-ranking', this.themesRanking)
            } else if (this.themesDistributionRadio===true && this.questionsCountTemp!=0) {
                this.paramsManagement(this.exam.subject, 'themes-ranking', undefined)
            }else if(this.themesDistributionRadio===false){
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
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        countThemes(){
            this.themes = []
            this.exam.tests.forEach(test=>{
                const target = this.getTestImages.find(image=>image.fileName==test)
                this.themes.push(...target.info.params.themes)
                this.themes = new Set(this.themes)
                this.themes = new Array(...this.themes)
            })
        },

        questionsByThemesMngt(type, theme){
            if(type=='plus'){
                const target = this.themesRanking.find(item=>item.theme==theme)
                if(target){
                    const index = this.themesRanking.indexOf(target)
                    this.themesRanking[index].count++
                } else {
                    this.themesRanking.push({
                        theme,
                        count: 1
                    })
                }

                this.questionsCountTemp--
            } else if(type=='minus'){
                const target = this.themesRanking.find(item=>item.theme==theme)
                if(target){
                    const index = this.themesRanking.indexOf(target)
                    this.themesRanking[index].count--

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
        }
    },
    mounted(){
        this.countThemes()
        this.questionsCountTemp = this.questionsCount
    }
}
</script>
