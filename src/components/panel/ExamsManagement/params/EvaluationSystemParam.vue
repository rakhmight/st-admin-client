<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <div class="d-flex" style="gap:40px">
                <div>
                    <div class="mt-2"><span style="font-weight: 700;">5</span></div>
                </div>
                <div class="d-flex" style="gap:5px">
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="from"
                    type="number"
                    v-model.number="evaluationSystem.great.from"
                    min="0"
                    ></v-text-field>
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="to"
                    type="number"
                    v-model.number="evaluationSystem.great.to"
                    min="0"
                    ></v-text-field>
                </div>
            </div>

            <div class="d-flex" style="gap:40px">
                <div>
                    <div class="mt-2"><span style="font-weight: 700;">4</span></div>
                </div>
                <div class="d-flex" style="gap:5px">
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="from"
                    type="number"
                    v-model.number="evaluationSystem.good.from"
                    disabled
                    ></v-text-field>
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="to"
                    type="number"
                    v-model.number="evaluationSystem.good.to"
                    min="0"
                    ></v-text-field>
                </div>
            </div>

            <div class="d-flex" style="gap:40px">
                <div>
                    <div class="mt-2"><span style="font-weight: 700;">3</span></div>
                </div>
                <div class="d-flex" style="gap:5px">
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="from"
                    type="number"
                    v-model.number="evaluationSystem.satisfactorily.from"
                    disabled
                    ></v-text-field>
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    label="to"
                    type="number"
                    v-model.number="evaluationSystem.satisfactorily.to"
                    min="0"
                    ></v-text-field>
                </div>
            </div>

            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';

export default {
    props:{
        paramsManagement: Function,
        complex: Array,
        exam: Object
    },
    data(){
        return {
            evaluationSystem: {
                great: { from: undefined, to: undefined },
                good: { from: undefined, to: undefined },
                satisfactorily: { from: undefined, to: undefined }
            }
        }
    },
    watch:{
        'evaluationSystem.great.from'(){
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        },
        'evaluationSystem.great.to'(){
            this.evaluationSystem.good.from = this.getNextValue(this.evaluationSystem.great.to)
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        },
        'evaluationSystem.good.from'(){
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        },
        'evaluationSystem.good.to'(){
            this.evaluationSystem.satisfactorily.from = this.getNextValue(this.evaluationSystem.good.to)
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        },
        'evaluationSystem.satisfactorily.from'(){
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        },
        'evaluationSystem.satisfactorily.to'(){
            if(this.evaluationSystem.great.from>=0 && this.evaluationSystem.great.from!=='' && this.evaluationSystem.great.to>=0 && this.evaluationSystem.great.to!=='' && this.evaluationSystem.good.from>=0 && this.evaluationSystem.good.from!=='' && this.evaluationSystem.good.to>=0 && this.evaluationSystem.good.to!=='' && this.evaluationSystem.satisfactorily.from>=0 && this.evaluationSystem.satisfactorily.from!=='' && this.evaluationSystem.satisfactorily.to>=0 && this.evaluationSystem.satisfactorily.to!==''){
                this.paramsManagement(this.exam.subject, 'evaluation-system', this.evaluationSystem)
            } else {
                this.paramsManagement(this.exam.subject, 'evaluation-system', undefined)
            }
        }
        
    },
    computed: mapGetters(['getSubjects']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },
        
        getNextValue(input){
            let output
            if(input){ 
                let value = input+''

                if(value.includes('.')){
                    const index = value.indexOf('.')
                    value = value.slice(index+1)
                    if(value.length == 1){
                        output = input-0.1
                    } else if(value.length == 2){
                        output = input-0.01
                    }
                } else {
                    output = input-1
                }
            }

            return output
        }
    }
}
</script>
