<template>
    <div>
        <v-table density="compact">
            <thead>
            <tr>
                <th class="text-center" min-width="30px" width="30px">
                #
                </th>
                <th class="text-center" min-width="30px" width="30px">
                ID
                </th>
                <th class="text-left">
                Subject('s)
                </th>
                <th class="text-left">
                Tickets / Questions
                </th>
                <th class="text-left">
                Examinee's
                </th>
                <th class="text-left">
                Created
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
                v-for="exam in examsList"
                :key="exam.id"
                :exam="exam"
                :examsTimes="examsTimes"
                :i="exam.number"
                :checkExamsTimers="checkExamsTimers"
                :changeTab="changeTab"
                :updateExam="updateExam"
                :makeList="makeList"
                />
            </tbody>
        </v-table>

        <v-pagination
        v-if="examsList.length"
        class="mt-3"
        v-model="page"
        :length="pages"
        :total-visible="7"
        density="compact"
        rounded="circle"
        ></v-pagination>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExamTableElement from '@/components/panel/ExamsManagement/ExamTableElement.vue'

export default {
    props:{
        changeTab: Function,
        updateExam: Function,
    },
    data(){
        return {
            examsMap: [],
            examsTimes: [],
            examsTimersChecker: undefined,
            examsList: [],
            page: 1,
            pageSize: 40,
            listCount: 0
        }
    },
    components:{
        ExamTableElement
    },
    computed: {
        ...mapGetters(['getExams']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        page(){
            this.updatePage(this.page)
        },
        'getExams.length'(){
            this.makeList()
        }
    },
    methods:{
        makeList(){
            this.examsMap = []

            this.getExams.forEach((exam, i) => {
                const examI = { ...exam, number: i+1 }
                console.log(examI.id);
                this.examsMap.push(examI)
            })

            this.initPage()
            this.updatePage(this.page)
        },

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
                    } else if(exam.examDateParams.start.byCommand){
                        if(exam.hasBegun){
                            this.examsTimes.push({
                                id: exam.id,
                                status: 'active'
                            })
                        } else {
                            this.examsTimes.push({
                                id: exam.id,
                                status: 'stopped'
                            })
                        }
                    }
                } else {
                    this.examsTimes.push({
                        id: exam.id,
                        status: 'in-active'
                    })
                }
            })
        },

        initPage(){
			this.listCount = this.examsMap.length;
			if (this.listCount < this.pageSize) {
				this.examsList = this.examsMap;
			} else {
				this.examsList = this.examsMap.slice(0, this.pageSize);
			}
		},

        updatePage(pageIndex){
			let _start = (pageIndex - 1) * this.pageSize;
			let _end = pageIndex * this.pageSize;
			this.examsList = this.examsMap.slice(_start, _end);
			this.page = pageIndex;
		}
    },
    mounted(){
        this.makeList()

        this.checkExamsTimers()

        this.examsTimersChecker = setInterval(()=>{
            this.checkExamsTimers()
        },10000)

        this.initPage();
		this.updatePage(this.page);
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