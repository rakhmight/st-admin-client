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
            min="0"
            label="Tickets count"
            v-model.number="ticketsCount"
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
        complex: Array
    },
    data(){
        return {
            ticketsCount: 0
        }
    },
    watch:{
        ticketsCount(){
            if(this.ticketsCount>0 || this.ticketsCount===null){
                this.paramsManagement(this.exam.subject, 'tickets-count', this.ticketsCount)
            } else {
                this.paramsManagement(this.exam.subject, 'tickets-count', undefined)
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