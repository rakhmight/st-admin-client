<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>
        
        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="examTimeRadio"
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

        <div class="d-flex flex-row" style="gap: 5px" v-if="examTimeRadio=='limited'">
            <div style="width: 90px;">
                <v-text-field
                density="compact"
                variant="outlined"
                type="number"
                label="Time"
                v-model.number="examTimeParam"
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
        paramsManagement: Function,
        complex: Array,
        potentialParam: Number | undefined | null
    },
    data(){
        return {
            examTimeRadio: undefined,
            examTimeParam: undefined,

            potentialParamInjection: false
        }
    },
    mounted(){
        if(this.potentialParam){
            this.potentialParamInjection = true
            this.examTimeRadio = 'limited'
            this.examTimeParam = this.potentialParam
        } else if(this.potentialParam === null){
            this.examTimeRadio = 'unlimit'
            this.examTimeParam = null
        }
    },
    watch:{
        examTimeRadio(){
            if(this.examTimeRadio=='unlimit'){
                this.examTimeParam = null
            } else {
                if(!this.potentialParamInjection) this.examTimeParam = undefined
                else this.potentialParamInjection = false
            }
        },

        examTimeParam(){
            if(this.examTimeParam>0 || this.examTimeParam===null){
                this.paramsManagement(this.exam.subject, 'exam-time', this.examTimeParam)
            } else {
                this.paramsManagement(this.exam.subject, 'exam-time', undefined)
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
