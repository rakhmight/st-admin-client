<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="changeAnswerPossibility"
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
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        potentialParam: Boolean | undefined
    },
    data(){
        return {
            changeAnswerPossibility: undefined,
        }
    },
    mounted(){
        if(this.potentialParam !== undefined){
            this.changeAnswerPossibility = this.potentialParam
        }
    },
    watch:{
        changeAnswerPossibility(){
            this.paramsManagement(this.exam.subject, 'change-answer', this.changeAnswerPossibility)
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

