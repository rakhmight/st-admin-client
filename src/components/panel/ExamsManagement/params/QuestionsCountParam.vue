<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="Questions count"
            v-model.number="questionsCount"
            min="0"
            :max="maximalQuestionsCount"
            :rules="countRules"
            ></v-text-field>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';

export default {
    props:{
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        changeQuestionsCount: Function,
        potentialParam: Number | undefined
    },
    data(){
        return {
            questionsCount: 0,
            maximalQuestionsCount: 0,
            countRules: []
        }
    },
    mounted(){
        if(this.potentialParam){
            this.questionsCount = this.potentialParam
        }

        // check questions count
        const testsQuestionsCount = this.exam.tests.map(test => {
            const target = this.getTestImages.find(testImg => testImg.fileName == test)
            
            if(target) return target.info.testInfo.totalQuestions
            else return 0
        })
        
        this.maximalQuestionsCount = testsQuestionsCount.reduce((sum, number) => sum + number, 0)
        this.countRules = [
            v => ( v && v <= this.maximalQuestionsCount ) || `Max count: ${this.maximalQuestionsCount}`,
        ]
    },
    watch:{
        questionsCount(){
            if(this.questionsCount > this.maximalQuestionsCount){
                this.questionsCount = this.maximalQuestionsCount
            }

            if(this.questionsCount>0 || this.questionsCount===null){
                this.paramsManagement(this.exam.subject, 'questions-count', this.questionsCount)
            } else {
                this.paramsManagement(this.exam.subject, 'questions-count', undefined)
            }
            this.changeQuestionsCount(this.questionsCount)
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        }
    }
}
</script>
