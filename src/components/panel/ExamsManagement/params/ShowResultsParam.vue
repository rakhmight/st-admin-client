<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="showResultsRadio"
            >
                <v-radio
                    label="yes"
                    :value="true"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="not"
                    :value="false"
                ></v-radio>
            </v-radio-group>
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
        exam: Object,
        switchShowingResults: Function,
        potentialParam: Boolean | undefined
    },
    data(){
        return {
            showResultsRadio: undefined
        }
    },
    mounted(){
        if(this.potentialParam !== undefined){
            this.showResultsRadio = this.potentialParam
        }
    },
    watch:{
        showResultsRadio(){
            this.paramsManagement(this.exam.subject, 'show-results', this.showResultsRadio)

            if(this.showResultsRadio){
                this.switchShowingResults('add', this.exam.subject)
            } else {
                this.switchShowingResults('remove', this.exam.subject)
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
