<template>
    <div>
        <div class="d-flex flex-row align-center">
            <v-icon size="16" color="var(--main-color)">mdi-alpha-t-box-outline</v-icon>
            <span class="ml-1">{{ getThemeName(theme) }}</span>
        </div>

        <div>
            <div class="d-flex align-center" style="gap:10px">
                <span>Easy: {{ themeQuestions.easy }}</span>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="plusTheme('easy')"
                >
                    <v-icon size="16">mdi-plus</v-icon>
                </v-btn>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="minusTheme('easy')"
                >
                    <v-icon size="16">mdi-minus</v-icon>
                </v-btn>
            </div>
            
            <div class="d-flex align-center" style="gap:10px">
                <span>Medium: {{ themeQuestions.medium }}</span>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="plusTheme('medium')"
                >
                    <v-icon size="16">mdi-plus</v-icon>
                </v-btn>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="minusTheme('medium')"
                >
                    <v-icon size="16">mdi-minus</v-icon>
                </v-btn>
            </div>
            
            <div class="d-flex align-center" style="gap:10px">
                <span>Hard: {{ themeQuestions.hard }}</span>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="plusTheme('hard')"
                >
                    <v-icon size="16">mdi-plus</v-icon>
                </v-btn>

                <v-btn
                density="compact"
                icon
                size="18"
                @click="minusTheme('hard')"
                >
                    <v-icon size="16">mdi-minus</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { getTheme } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';

export default {
    props:{
        theme: Number,
        questionsCount: Number,
        exam: Object,
        questionsByThemesDifficultyMngt: Function,
        switchQuestions: Boolean,
        switchTests: Boolean,
        choisedThemes: Array
    },
    data(){
        return {
            themeQuestions: {
                easy: 0,
                medium: 0,
                hard: 0
            }
        }
    },
    computed: mapGetters(['getSubjects']),
    methods:{
        getThemeName(id){
            return getTheme(this.exam.subject, id, this.getSubjects)
        },

        plusTheme(type){
            if(
                type == 'easy' && this.questionsCount-1>=0 ||
                type == 'medium' && this.questionsCount-1>=0 ||
                type == 'hard' && this.questionsCount-1>=0
            ){
                    if(type == 'easy') this.themeQuestions.easy++
                    if(type == 'medium') this.themeQuestions.medium++
                    if(type == 'hard') this.themeQuestions.hard++
                    this.questionsByThemesDifficultyMngt('plus', this.theme, type=='easy' ? 'easy' : type=='medium' ? 'medium' : 'hard')
            }
        },

        minusTheme(type){
            if(
                type == 'easy' && this.themeQuestions.easy-1>=0 ||
                type == 'medium' && this.themeQuestions.medium-1>=0 ||
                type == 'hard' && this.themeQuestions.hard-1>=0
            ){
                    if(type == 'easy') this.themeQuestions.easy--
                    if(type == 'medium') this.themeQuestions.medium--
                    if(type == 'hard') this.themeQuestions.hard--
                    this.questionsByThemesDifficultyMngt('minus', this.theme, type=='easy' ? 'easy' : type=='medium' ? 'medium' : 'hard')
            } else {
                console.log(this.questionsCount-1>=0)
                console.log(this.themeQuestions.easy-1>=0)
            }
        }
    },
    watch:{
        switchQuestions(){
            this.themeQuestions = {
                easy: 0,
                medium: 0,
                hard: 0
            }
        },

        switchTests(){
            this.themeQuestions = {
                easy: 0,
                medium: 0,
                hard: 0
            }
        },

        choisedThemes(){
            this.themeQuestions = {
                easy: 0,
                medium: 0,
                hard: 0
            }
        }
    },
    mounted(){
        console.log(this.themeQuestions)
    }
}
</script>
