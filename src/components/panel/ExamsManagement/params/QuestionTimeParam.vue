<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="questionTimeRadio"
            >
                <v-radio
                    label="do not limit"
                    value="unlimit"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="restrict"
                    value="limited"
                ></v-radio>
            </v-radio-group>
        </div>

        <div class="d-flex flex-row" style="gap: 5px" v-if="questionTimeRadio=='limited'">
            <div style="width: 90px;">
                <v-text-field
                density="compact"
                variant="outlined"
                type="number"
                label="Time"
                v-model.number="questionTimeParam"
                min="0"
                ></v-text-field>
            </div>
            <span class="mt-2">minutes</span>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';

export default {
    props:{
        exam: Object,
        complex: Array,
        paramsManagement: Function
    },
    data(){
        return {
            questionTimeRadio: undefined,
            questionTimeParam: 0
        }
    },
    watch:{
        questionTimeRadio(){
            if(this.questionTimeRadio=='unlimit'){
                this.questionTimeParam = null
            } else {
                this.questionTimeParam = undefined
            }
        },

        questionTimeParam(){
            if(this.questionTimeParam>0 || this.questionTimeParam===null){
                this.paramsManagement(this.exam.subject, 'question-time', this.questionTimeParam)
            } else {
                this.paramsManagement(this.exam.subject, 'question-time', undefined)
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
