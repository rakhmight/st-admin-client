<template>
    <div class="columns" v-if="showResults.indexOf(exam.subject)!=-1">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div class="d-flex flex-row" style="gap: 5px">
            <div style="width: 90px;">
                <v-text-field
                density="compact"
                variant="outlined"
                type="number"
                label="Time"
                v-model.number="displayTime"
                min="0"
                ></v-text-field>
            </div>
            <span class="mt-2">seconds</span>
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
        switchResultShowing: Boolean
    },
    data(){
        return {
            displayTime: 0
        }
    },
    watch:{
        displayTime(){
            if(this.displayTime>0){
                this.paramsManagement(this.exam.subject, 'result-display-time', this.displayTime)
            } else {
                this.paramsManagement(this.exam.subject, 'result-display-time', undefined)
            }
        },

        switchResultShowing(){
            if(this.showResults.indexOf(this.exam.subject)==-1){
                this.displayTime = 0
            }
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
