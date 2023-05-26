<template>
    <div>
        <div class="d-flex flex-row align-center">
            <v-icon size="16" color="var(--main-color)">mdi-alpha-t-box-outline</v-icon>
            <span class="ml-1">{{ getDifficulty(difficulty) }} difficulty</span>
        </div>
        <div class="d-flex align-center" style="gap:10px">
            <span>{{ difficultyQuestions }}</span>
            <v-btn
            density="compact"
            icon
            size="18"
            @click="plusQuestion()"
            >
            <v-icon size="16">mdi-plus</v-icon>
            </v-btn>
            <v-btn
            density="compact"
            icon
            size="18"
            @click="minusQuestion()"
            >
            <v-icon size="16">mdi-minus</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        difficulty: Number,
        questionsCount: Number,
        questionsByDifficultyMngt: Function,
        switchQuestions: Boolean,
        switchTests: Boolean
    },
    data(){
        return{
            difficultyQuestions: 0
        }
    },
    methods:{
        getDifficulty(dif){
            if(dif==1){
                return 'Easy'
            } else if(dif==2){
                return 'Medium'
            } else if(dif==3){
                return 'Hard'
            }
        },

        plusQuestion(){
            if(this.questionsCount-1>=0){
                this.difficultyQuestions++
                this.questionsByDifficultyMngt('plus', this.difficulty)
            }
        },

        minusQuestion(){
            if(this.difficultyQuestions-1>=0){
                this.difficultyQuestions--
                this.questionsByDifficultyMngt('minus', this.difficulty)
            }
        }
    },
    watch:{
        switchQuestions(){
            this.difficultyQuestions = 0
        }
    }
}
</script>
