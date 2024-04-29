<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>
        
        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="limitAnswersCount"
            >
                <v-radio
                    label="yes"
                    :value="true"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="not (auto)"
                    :value="false"
                ></v-radio>
            </v-radio-group>
        </div>

        <div v-if="limitAnswersCount==true">
            <v-select
            density="compact"
            variant="outlined"
            label="Select answers count"
            :items="[3,4,5,6]"
            v-model="answersCountParam"
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
        potentialParam: Number | null | undefined
    },
    data(){
        return {
            limitAnswersCount: undefined,
            answersCountParam: undefined,

            potentialParamInjection: false
        }
    },
    mounted(){
        if(this.potentialParam){
            this.potentialParamInjection = true
            this.limitAnswersCount = true
            this.answersCountParam = this.potentialParam
        }else if(this.potentialParam === null){
            this.limitAnswersCount = false
        }
    },
    watch:{
        limitAnswersCount(){
            if(this.limitAnswersCount==false){
                this.answersCountParam = null
            } else {
                if(!this.potentialParamInjection){
                    this.answersCountParam = undefined
                } else this.potentialParamInjection = false
            }
        },

        answersCountParam(){
            this.paramsManagement(this.exam.subject, 'answers-count', this.answersCountParam)
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