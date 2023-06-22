<template>
    <v-table density="compact">
        <thead>
        <tr>
            <th class="text-center" min-width="30px" width="30px">
            #
            </th>
            <th class="text-left">
            Subject('s)
            </th>
            <th class="text-left">
            Tickets / Questions count
            </th>
            <th class="text-left">
            Planned
            </th>
            <th class="text-left">
            Type
            </th>
            <th class="text-left">
            Status
            </th>
            <th class="text-left">
            Actions
            </th>
        </tr>
        </thead>
        <tbody>
            <exam-table-element
            v-for="(exam, i) in getExams"
            :key="i"
            :exam="exam"
            :examsTimes="examsTimes"
            :i="i"
            />
        </tbody>
    </v-table>
</template>

<script>
import { mapGetters } from 'vuex'
import ExamTableElement from '@/components/panel/ExamsManagement/ExamTableElement.vue'

export default {
    data(){
        return {
            examsTimes: [],
            examsTimersChecker: undefined
        }
    },
    components:{
        ExamTableElement
    },
    computed: mapGetters(['getExams']),
    methods:{
        checkExamsTimers(){
            this.examsTimes = []
            this.getExams.forEach(exam=>{

                if(exam.isActive){
                    if(!exam.examDateParams.start.byCommand){
                        const date = new Date(Date.parse(`${exam.examDateParams.start.date} ${exam.examDateParams.start.time}`))
                        let status
                        if(date > Date.now()){
                            status = 'in-order'
                        } else if(date < Date.now()){
                            status = 'active'
                        }
                        
                        this.examsTimes.push({
                            id: exam.id,
                            status: status
                        })
                    }
                }
            })
        }
    },
    mounted(){
        this.checkExamsTimers()

        this.examsTimersChecker = setInterval(()=>{
            this.checkExamsTimers()
        },10000)
    },
    unmounted(){
        clearInterval(this.examsTimersChecker)
    }
}
</script>


<style scoped>
.v-table{
    font-size: 0.9em
}
</style>