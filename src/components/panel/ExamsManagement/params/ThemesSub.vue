<template>
    <div>
        <div class="d-flex flex-row align-center">
            <v-icon size="16" color="var(--main-color)">mdi-alpha-t-box-outline</v-icon>
            <span class="ml-1">{{ getThemeName(theme) }}</span>
        </div>
        <div class="d-flex align-center" style="gap:10px">
            <span>{{ themeQuestions }}</span>

            <v-btn
            density="compact"
            icon
            size="18"
            @click="plusTheme()"
            >
                <v-icon size="16">mdi-plus</v-icon>
            </v-btn>

            <v-btn
            density="compact"
            icon
            size="18"
            @click="minusTheme()"
            >
                <v-icon size="16">mdi-minus</v-icon>
            </v-btn>
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
        questionsByThemesMngt: Function,
        switchQuestions: Boolean,
        switchTests: Boolean,
        choisedThemes: Array,
        potentialValue: Object | undefined
    },
    data(){
        return {
            themeQuestions: 0
        }
    },
    computed: mapGetters(['getSubjects']),
    mounted(){
        if(this.potentialValue){
            if(this.potentialValue.count > 0){
                for(let i = 0; i != this.potentialValue.count; i++){
                    this.plusTheme()
                }
            }
        }
    },
    methods:{
        getThemeName(id){
            return getTheme(this.exam.subject, id, this.getSubjects)
        },

        plusTheme(){
            if(this.questionsCount-1>=0){
                this.themeQuestions++
                this.questionsByThemesMngt('plus', this.theme)
            }
        },

        minusTheme(){
            if(this.themeQuestions-1>=0){
                this.themeQuestions--
                this.questionsByThemesMngt('minus', this.theme)
            }
        }
    },
    watch:{
        switchQuestions(){
            this.themeQuestions = 0
        },

        switchTests(){
            this.themeQuestions = 0
        },

        choisedThemes(){
            this.themeQuestions = {
                easy: 0,
                medium: 0,
                hard: 0
            }
        }
    }
}
</script>
