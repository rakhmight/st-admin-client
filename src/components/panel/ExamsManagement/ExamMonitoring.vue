<template>
    <div v-if="this.getCurrentExam" class="content d-flex flex-column" style="gap:30px">
        <div v-if="this.getCurrentExam.complex.length>1">
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab
                v-for="exam of getCurrentExam.complex"
                :value="exam.subject"
                :key="exam.subject"
                style="border-bottom: 1px solid #ccc"
                >
                    <span class="text-subtitle-2">{{ getSubjectName(exam.subject) }}</span>
                </v-tab>
            </v-tabs>
        </div>

        <div class="block d-flex flex-column" style="gap: 10px" v-if="mngtExam">
            <exam-tools :updateExam="updateExam" :changeTab="changeTab" :mngtExam="mngtExam" />

            <v-divider />

            <exam-info :mngtExam="mngtExam" />
        </div>

        <div v-if="mngtExam">
            <div class="pt-2 pb-2 d-flex justify-space-between" style="font-size: 0.9em;">
                <p style="color: #888">Examinee's: <b>{{ getCurrentExam.users.length }}</b></p>
                <p style="color: #888">Waiting: <b>{{ examineeByStatus.waiting }}</b></p>
                <p style="color: var(--main-color)">Working: <b>{{ examineeByStatus.working }}</b></p>
                <p style="color: #ffa03b">Paused: <b>{{ examineeByStatus.paused }}</b></p>
                <p style="color: #20b516">Finished: <b>{{ examineeByStatus.finished }}</b></p>
                <p style="color: var(--red-color)">Failed: <b>{{ examineeByStatus.failed }}</b></p>
                <p style="color: var(--red-color)">Blocked: <b>{{ examineeByStatus.blocked }}</b></p>
            </div>

            <v-table density="compact">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Info</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Subject</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <examinee-from-table
                    v-for="user in examineesList"
                    :key="user"
                    :user="user"
                    :examineeStatusCount="examineeStatusCount"
                    />
                </tbody>
            </v-table>
            
            <v-pagination
            class="mt-3"
            v-model="page"
            :length="pages"
            :total-visible="7"
            density="compact"
            rounded="circle"
            ></v-pagination>
        </div>
    </div>
</template>

 <script>
import { mapGetters } from 'vuex';
import ExamTools from './monitoring/ExamTools.vue';
import ExamInfo from './monitoring/ExamInfo.vue';
import ExamineeFromTable from './monitoring/ExamineeFromTable.vue'

 export default {
    props: {
        updateExam: Function,
        changeTab: Function
    },
    data(){
        return {
            tab: undefined,
            mngtExam: undefined,
            examineeByStatus: {
                waiting: 0,
                worked: 0,
                paused: 0,
                failed: 0,
                finished: 0,
                blocked: 0
            },
            examineesList: [],
            page: 1,
            pageSize: 30,
            listCount: 0
        }
    },
    components: {
        ExamTools,
        ExamInfo,
        ExamineeFromTable
    },
    computed: {
        ...mapGetters(['getCurrentExam', 'getCurrentExamSwitcher']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    methods:{
        examineeStatusCount(){
            this.examineeByStatus = {
                waiting: 0,
                working: 0,
                paused: 0,
                failed: 0,
                finished: 0,
                blocked: 0
            }
            this.getCurrentExam.users.map(user => {
                switch (user.status) {
                    case 'waiting':
                        this.examineeByStatus.waiting++
                        break;
                    case 'working':
                        this.examineeByStatus.working++
                        break;
                    case 'paused':
                        this.examineeByStatus.paused++
                        break;
                    case 'finished':
                        this.examineeByStatus.finished++
                        break;
                    case 'failed':
                        this.examineeByStatus.failed++
                        break;
                    case 'blocked':
                        this.examineeByStatus.blocked++
                        break;
                
                    default:
                        break;
                }
            })
        },

        initPage(){
			this.listCount = this.getCurrentExam.users.length;
			if (this.listCount < this.pageSize) {
				this.examineesList = this.getCurrentExam.users;
			} else {
				this.examineesList = this.getCurrentExam.users.slice(0, this.pageSize);
			}
		},

        updatePage(pageIndex){
			let _start = (pageIndex - 1) * this.pageSize;
			let _end = pageIndex * this.pageSize;
			this.examineesList = this.getCurrentExam.users.slice(_start, _end);
			this.page = pageIndex;
		}
    },
    watch: {
        getCurrentExamSwitcher(){
            this.initPage()
            this.updatePage(this.page)
            this.examineeStatusCount()
        },

        'getCurrentExam.users'(){
            if(this.getCurrentExam){
                this.examineeStatusCount()
                this.initPage()
                this.updatePage(this.page)
            }
        },
        tab(){
            this.mngtExam = this.getCurrentExam.complex.find(ce => ce.subject == this.tab)
        },
        getCurrentExam(){
            console.log(this.getCurrentExam);
            if(this.getCurrentExam){
                this.examineeStatusCount()
                this.initPage()
                this.updatePage(this.page)
                
                this.mngtExam = this.getCurrentExam.complex[0]
            }
        },
        page(){
            this.updatePage(this.page)
        }
    },
    mounted(){
        this.mngtExam = this.getCurrentExam.complex[0]
        this.examineeStatusCount()

        this.initPage()
		this.updatePage(this.page)
    }
 }
 </script>
 
 <style>
    .block{
        background: white;
        border-radius: 5px;
        padding: 15px;
        font-size: 0.9em
    }

    .v-table{
        font-size: 0.9em
    }
</style>