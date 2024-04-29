<template>
    <div class="columns" v-if="showResults.indexOf(exam.subject)!=-1">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-select
            density="compact"
            variant="outlined"
            label="Select displayed params"
            :items="displayedParams"
            v-model="choisedParams"
            multiple
            ></v-select>
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
        showResults: Array,
        switchResultShowing: Boolean,
        potentialParam: Array | undefined
    },
    data(){
        return {
            displayedParams: [
                { title: 'Spent Time', value: 'spentTime' },
                { title: 'Not show grade', value: 'grade' },
                { title: 'Number of correct and incorrect answers', value: 'showAStat' },
                { title: 'Score (ball)', value: 'ball' },
                { title: 'Percentage (%)', value: 'percentage' },
                // { title: 'Time spent on each question', value: 'eachQT' },
                // { title: 'answers skip statistics', value: 'showSkipStat' },
                { title: 'Themes with the most wrong answers', value: 'wrongThA' },
                { title: 'Show wrong answered questions', value: 'wrongQ' },
                { title: 'Show wrong answered questions & answers', value: 'wrongQA' },
            ],
            choisedParams: []
        }
    },
    mounted(){
        if(this.potentialParam){
            if(Array.isArray(this.potentialParam)){
                this.choisedParams.push(...this.potentialParam)
                
                if(this.choisedParams.length){
                    this.paramsManagement(this.exam.subject, 'displayed-result-params', this.choisedParams)
                }
            }
        }
    },
    watch:{
        choisedParams(){
            if(this.choisedParams.length){
                this.paramsManagement(this.exam.subject, 'displayed-result-params', this.choisedParams)
            } else {
                this.paramsManagement(this.exam.subject, 'displayed-result-params', undefined)
            }
        },

        switchResultShowing(){
            if(this.showResults.indexOf(this.exam.subject)==-1){
                this.choisedParams = []
            }
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },
    }
}
</script>