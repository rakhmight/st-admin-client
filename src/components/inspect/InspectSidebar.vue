<template>
        <div class="inspect__sidebar">
        <div>
            <!-- Sidebar header -->
            <div class="d-flex flex-row align-center justify-space-between" style="background-color: var(--main-color);padding:7px 5px;border-radius: 5px 5px 0 0;">
                <div class="d-flex flex-row align-center">
                    <v-icon size="20" color="#fff" class="mr-1">
                        mdi-content-paste
                    </v-icon>
                    <h4 style="color:#fff;font-weight: 400;">Content</h4>
                </div>
            </div>

            <!-- No questions -->
            <div v-if="questions.length==0 && !loader" class="inspect__map-empty d-flex flex-column justify-center align-center" style="border-radius: 0 0 5px 5px;">
                <v-img
                width="80"
                src="@/assets/media/no-questions.png"
                contain
                transition="scale-transition"
                style="opacity: 0.5;"
                ></v-img>
            </div>

            <!-- Map -->
            <div class="inspect__map" v-if="questions.length && !loader">
                <div class="map-elem"
                > 
                    <v-table density="compact">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    
                                </th>
                                <th class="text-left" style="width: 30px;max-width: auto;">
                                    #
                                </th>
                                <th class="text-left">
                                    Question
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="cursor: pointer;"
                            v-for="(question,i) in questions"
                            :key="question.id"
                            :to-question="question.id"
                            class="map-orient"
                            >
                                <td style="width:20px">
                                    <!-- Icon -->
                                    <inspect-type-icons :type="question.type" :questionID="question.id" :questions="questions"/>
                                </td>
                                <td style="color:#000;width: 30px;max-width: auto;">{{ i+1 }}</td>
                                <td>
                                    <p class="body-2 map-small" style="color:#484848">
                                        <span v-if="question.questionCtx.ru || question.questionCtx.eng || question.questionCtx.uz_l || question.questionCtx.uz_k || question.questionCtx.custom">{{ getCurrentQuestion(question.questionCtx) }}</span>
                                        <span style="color:#888;" v-else>Не заполнено</span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-table>
                </div>
            </div>

            <!-- Loader -->
            <div style="height: 237px; background-color: #aaaaaa80; border-radius: 0 0 5px 5px;" v-if="loader" class="d-flex justify-center align-center">
                <v-progress-circular
                :size="50"
                :width="3"
                color="#888"
                indeterminate
                ></v-progress-circular>
            </div>
        </div>

        <v-btn
        density="compact"
        width="270"
        :color="loader || blockAllBtns ? '#777' : 'var(--main-color)'"
        dark
        class="mt-5"
        @click="goToBack()"
        :disabled="loader || blockAllBtns"
        >
            <v-icon color="#fff" class="mr-1">mdi-keyboard-backspace</v-icon>
            <span style="color: #fff; font-weight: 400;">Quit</span>
        </v-btn>
    </div>
</template>

<script>
import InspectTypeIcons from '@/components/inspect/InspectTypeIcons'

export default {
    props:{
        questions: Array,
        loader: Boolean,
        testOptions: Object,
        blockAllBtns: Boolean
    },
    components:{
        InspectTypeIcons
    },
    methods:{
        goToBack(){
            this.$router.push('/box')
        },

        getCurrentQuestion(question){
            if(this.testOptions.languagesSettings.languages[0] == 'ru'){
                return question.ru
            } else if(this.testOptions.languagesSettings.languages[0] == 'eng'){
                return question.eng
            } else if(this.testOptions.languagesSettings.languages[0] == 'uz_l'){
                return question.uz_l
            } else if(this.testOptions.languagesSettings.languages[0] == 'uz_k'){
                return question.uz_k
            } else if(this.testOptions.languagesSettings.languages[0] == 'custom'){
                return question.custom
            }
        },

        mapOriented(){
            const questions = document.querySelectorAll('.map-orient')

            for(let i = 0; i!=questions.length; i++){
                let questionID = questions[i].getAttribute('to-question')
                let desiredQuestion = document.querySelector(`.question_${questionID}`)

                questions[i].addEventListener('click', ()=>{
                    if(desiredQuestion){
                        desiredQuestion.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        })
                    }
                })
            }
        },
    },
    mounted(){
        setTimeout(()=>{
            this.mapOriented()
        },500)
    }
}
</script>


<style scoped>
.v-table--density-compact > .v-table__wrapper > table > tbody > tr > td{
    padding:0 3px;
}.v-table--density-compact > .v-table__wrapper > table > thead > tr > th{
    padding:0 3px;
}

.inspect__map-empty{
    height: 30vh;
    background-color: #aaaaaa80;
    border-radius: 5px;
}.inspect__sidebar{
    width: 270px;
    position:fixed;
    z-index: 9;
}
.inspect__map{
    font-size: 0.9em;
    min-width: 100%;
    min-height: 30vh;
    max-height: 60vh;
    background-color: aliceblue;
    border-radius: 0 0 5px 5px;
    overflow-y: scroll;
    overflow-x: hidden;
    border-bottom: var(--main-color) 5px solid;
}

::-webkit-scrollbar {
    width: 6px; /* ширина для вертикального скролла */
    background-color: #b9b9b9;
}
</style>
