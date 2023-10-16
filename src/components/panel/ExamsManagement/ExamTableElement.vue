<template>
    <tr>
            <td class="text-center">{{ i+1 }}</td>
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
                <p
                v-for="(date, i) in getPlannedTime(exam)"
                :key="i"
                >{{ date }}</p>
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
                    <v-list-item>
                        <v-list-item-title class="d-flex align-center" @click="getResults()">
                            <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-file-document-outline</v-icon>
                            <span class="menu-text">Get results</span>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-menu>

                <v-btn
                icon="mdi-play"
                variant="text"
                density="compact"
                color="var(--main-color)"
                @click="updateExam('begun')"
                v-if="!exam.hasBegun && exam.examDateParams.start.byCommand"
                >
                </v-btn>
                <v-btn
                v-if="exam.hasBegun && exam.examDateParams.end.byCommand"
                icon="mdi-stop"
                variant="text"
                density="compact"
                color="var(--red-color)"
                @click="updateExam('stopped')"
                >
                </v-btn>
            </td>
        </tr>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getSubject, getAuthor } from '@/plugins/getInfo'
import makeReq from '@/services/makeReq'
import xlsx from "json-as-xlsx"

export default {
    props:{
        exam: Object,
        examsTimes: Array,
        i: Number,
        checkExamsTimers: Function,
        changeTab: Function
    },
    data(){
        return {
            status: undefined
        }
    },
    computed: mapGetters(['getSubjects', 'getAdminServerIP', 'getAuthParams', 'getUsersList']),
    methods: {
        ...mapMutations(['updateExamState', 'setCurrentExam']),

        choiceExam(){
            this.setCurrentExam(this.exam)
            this.changeTab('exam')
        },

        async updateExam(type){
            if(!this.exam.hasBegun && this.exam.examDateParams.start.byCommand || this.exam.hasBegun && this.exam.examDateParams.end.byCommand){
                await makeReq(`${this.getAdminServerIP}/api/exams/updatestate`, "POST", {
                    auth: {
                        ...this.getAuthParams
                    },
                    data:{
                        type,
                        examID: this.exam.id
                    }
                })
                .then(data=>{
                    if(data.statusCode==200){
                        this.updateExamState({type, examID: this.exam.id})
                        this.checkExamsTimers()
                    }
                })
                .catch(error => console.error(error))
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
        },

        // Только для одноразогого теста
        async getResults(){
            await makeReq(`${this.getAdminServerIP}/api/exams/results`, 'POST', {
                auth: {
                    ...this.getAuthParams
                },
                data: {
                    examID: this.exam.id
                }
            })
            .then(data=>{
                console.log(data.data.results)
                this.makeXlsx(data.data.results)
            })
            .catch(error=>{
                console.error(error)
            })
        },

        makeXlsx(data){
            const doc = [{
                sheet: 'Results',
                columns: [
                    { label: "Т/р", value: "number" },
                    { label: "Номзодларнинг Ф.И.О.", value: "user" },
                    { label: "Тўғри жавоблар сони", value: "currectA" },
                    { label: "Нотўғри жавоблар сони", value: "wrongA" },
                    { label: "Номзоднинг тўплаган умумий баллари", value: "ball" },
                ],
                content: []
            }]

            doc[0].content = data.map((res,i)=>{
                return {
                    number: i+1,
                    user: getAuthor(res.userID, this.getUsersList),
                    currectA: res.results[0].exams[0].result.questions.correct,
                    wrongA: res.results[0].exams[0].result.questions.wrong,
                    ball: res.results[0].exams[0].result.ball.score
                }
            })

            let settings = {
                fileName: `Қайднома - ${getSubject(this.exam.complex[0].subject, this.getSubjects)}`,
                //extraLength: 3,
                writeMode: "writeFile",
                writeOptions: {},
                RTL: false,
            }

            xlsx(doc, settings)
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

