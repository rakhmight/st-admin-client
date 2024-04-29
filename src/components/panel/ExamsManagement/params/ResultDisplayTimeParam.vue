<template>
    <div class="columns" v-if="showResults.indexOf(exam.subject)!=-1">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="displayTimeRadio"
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

        <div class="d-flex flex-row" style="gap: 5px" v-if="displayTimeRadio=='limited'">
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
        switchResultShowing: Boolean,
        potentialParam: Number | null | undefined
    },
    data(){
        return {
            displayTime: 0,
            displayTimeRadio: undefined,

            potentialParamInjection: false
        }
    },
    mounted(){
        if(this.potentialParam){
            this.potentialParamInjection = true
            this.displayTimeRadio = 'limited'

            this.displayTime = this.potentialParam
        } else if(this.potentialParam === null){
            this.displayTimeRadio = 'unlimit'
        }
    },
    watch:{
        displayTimeRadio(){
            if(this.displayTimeRadio == 'unlimit'){
                this.displayTime = null
            } else if(this.displayTimeRadio == 'limited'){
                if(!this.potentialParamInjection){
                    this.displayTime = 0
                    this.paramsManagement(this.exam.subject, 'result-display-time', undefined)
                } else this.potentialParamInjection = true
            }
        },

        displayTime(){
            if(this.displayTime>0){
                this.paramsManagement(this.exam.subject, 'result-display-time', this.displayTime)
            } else if(this.displayTime === null){
                this.paramsManagement(this.exam.subject, 'result-display-time', null)
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
