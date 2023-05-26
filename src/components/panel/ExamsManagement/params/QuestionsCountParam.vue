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
        changeQuestionsCount: Function
    },
    data(){
        return {
            questionsCount: 0
        }
    },
    watch:{
        questionsCount(){
            if(this.questionsCount>0 || this.questionsCount===null){
                this.paramsManagement(this.exam.subject, 'questions-count', this.questionsCount)
            } else {
                this.paramsManagement(this.exam.subject, 'questions-count', undefined)
            }
            this.changeQuestionsCount(this.questionsCount)
        }
    },
    computed: mapGetters(['getSubjects']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        }
    }
}
</script>
