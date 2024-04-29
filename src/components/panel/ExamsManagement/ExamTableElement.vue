<template>
    <tr>
            <td class="text-center">{{ i }}</td>

            <td class="text-center">
                <v-tooltip location="bottom" color="#00000073">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="#888" class="hover" @click="copy(exam.id)">mdi-identifier</v-icon>
                    </template>
                    <span>click to copy</span>
                </v-tooltip>
            </td>

            <td>
                <p
                v-for="(subject, i) in getExamSubjects(exam)"
                :key="i"
                style="color: var(--main-color)"
                >{{ subject }}</p>
            </td>

            <td>
                <p
                v-for="(counts, i) in getExamCounts(exam)"
                :key="i"
                >{{ counts }}</p>
            </td>

            <td>
                {{ exam.users.length }}
            </td>

            <td>
                <!-- <p
                v-for="(date, i) in getPlannedTime(exam)"
                :key="i"
                >{{ date }}</p> -->
                <p>
                    <span v-if="exam.createdAt">{{ getFullDate(exam.createdAt) }}</span>
                    <span v-else style="color: #888">unknown</span>
                </p>
            </td>

            <td><span style="color: var(--main-color)">{{ exam.complex.length>1 ? 'complex exam' : 'exam' }}</span></td>
            <td v-if="status=='in-order'"><span style="color: #888">In order</span></td>
            <td v-if="status=='active'"><span style="color: var(--main-color)">Active exam</span></td>
            <td v-if="status=='stopped'"><span style="color: #ff8f00">Stopped exam</span></td>
            <td v-if="status=='in-active'"><span style="color: red">Inactive exam</span></td>
            <td v-if="!status">
                <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                ></v-progress-circular>
            </td>
            <td>
                <v-menu
                transition="slide-y-transition"
                >
                <template v-slot:activator="{ props }">
                    <v-btn
                    color="var(--main-color)"
                    v-bind="props"
                    density="compact"
                    variant="text"
                    icon="mdi-dots-horizontal"
                    size="35"
                    >
                    </v-btn>
                </template>
                <v-list density="compact" min-width="120">
                    <v-list-item>
                        <v-list-item-title class="d-flex align-center">
                            <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-information</v-icon>
                            <span class="menu-text">Info about exam</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title class="d-flex align-center" @click="choiceExam()">
                            <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-eye</v-icon>
                            <span class="menu-text">Monitor the exam</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title class="d-flex align-center">
                            <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                            <span style="color:var(--red-color)" class="menu-text">Delete the exam</span>
                        </v-list-item-title>
                    </v-list-item>
                    
                    <exam-results-dialog :exam="exam" />

                </v-list>
                </v-menu>

                <v-btn
                icon="mdi-play"
                variant="text"
                density="compact"
                color="var(--main-color)"
                @click="updateExamEx('begun')"
                v-if="!exam.hasBegun && exam.examDateParams.start.byCommand"
                >
                </v-btn>
                <v-btn
                v-if="exam.hasBegun && exam.examDateParams.end.byCommand"
                icon="mdi-stop"
                variant="text"
                density="compact"
                color="var(--red-color)"
                @click="updateExamEx('stopped')"
                >
                </v-btn>
            </td>

            <v-snackbar
            v-model="snackbar"
            :timeout="1500"
            color="var(--main-color)"
            variant="tonal"
            >
            Exam ID is copied!
            </v-snackbar>
        </tr>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getSubject, getDate } from '@/plugins/getInfo'
import ExamResultsDialog from './monitoring/dialogs/ExamResultsDialog.vue'
import { copyToClipBoard } from '@/utils/copyToClipBoard'

export default {
    props:{
        exam: Object,
        examsTimes: Array,
        i: Number,
        checkExamsTimers: Function,
        changeTab: Function,
        updateExam: Function,
        makeList: Function
    },
    data(){
        return {
            status: undefined,
            snackbar: false
        }
    },
    computed: mapGetters(['getSubjects', 'getExams']),
    components: {
        ExamResultsDialog
    },
    methods: {
        ...mapMutations(['setCurrentExam']),

        copy(id){
            copyToClipBoard(id)
            this.snackbar = true
        },

        getFullDate(date){
            return getDate(date)
        },

        choiceExam(){
            this.setCurrentExam(this.exam)
            this.changeTab('exam')
        },

        // !!!
        async updateExamEx(type){
            const data = await this.updateExam(this.exam, type)
            if(data){
                this.checkExamsTimers()
                this.makeList()
            }
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        getExamSubjects(exam){
            const subjects = []
            exam.complex.forEach(target=>{
                subjects.push(getSubject(target.subject, this.getSubjects))
            })

            return subjects
        },

        getExamCounts(exam){
            const counts = []
            exam.complex.forEach(target=>{
                counts.push(`${target.params.ticketsCount} / ${target.params.questionsCount}`)
            })

            return counts
        },

        getPlannedTime(exam){
            const dates = []

            if(!exam.examDateParams.start.byCommand && !exam.examDateParams.end.byCommand){
                dates.push(
                `start: ${this.normalizeDate(exam.examDateParams.start.date)} ${exam.examDateParams.start.time}`,
                `end: ${this.normalizeDate(exam.examDateParams.end.date)} ${exam.examDateParams.end.time}`
                )
            } else if(!exam.examDateParams.start.byCommand && exam.examDateParams.end.byCommand){
                dates.push(
                `start: ${this.normalizeDate(exam.examDateParams.start.date)} ${exam.examDateParams.start.time}`,
                `end: by admininstrator`
                )
            } else if(exam.examDateParams.start.byCommand && !exam.examDateParams.end.byCommand){
                dates.push(
                `start: by administrator`,
                `end: ${this.normalizeDate(exam.examDateParams.end.date)} ${exam.examDateParams.end.time}`
                )
            } else if(exam.examDateParams.start.byCommand && exam.examDateParams.end.byCommand){
                dates.push(
                `by administrator`
                )
            }

            return dates
        },

        normalizeDate(date){
            const d = date.split('-')
            return `${d[2]}.${d[1]}.${d[0]}`
        },

        getTimer(exam){
            const target = this.examsTimes.find(item=> item.id==exam.id)
            if(target){
                this.status = target.status
            }
        }
    },
    watch:{
        examsTimes(){
            this.getTimer(this.exam)
        }
    }
}
</script>

<style scoped>
#app > div > div > main > div > div.content > div > div:nth-child(2) > div.v-window.v-theme--light.mt-5 > div > div.v-window-item.v-window-item--active > div > div.v-table.v-theme--light.v-table--density-compact > div > table > tbody > tr > td{
    padding: 5px 10px;
}
</style>

