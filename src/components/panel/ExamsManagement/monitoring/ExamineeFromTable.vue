<template>
    <tr>
        <td>
            <div class="pt-2 pb-2 d-flex flex-row align-center">
                <div style="width: 40px; height: 40px;">
                    <v-img :src="`${getAuthServerIP}/public/avatars/${user.id}.png`"></v-img>
                </div>
                <span class="ml-2">{{ getUserName() }}</span>
            </div>
        </td>
        <td>
            <user-info v-if="getUser()!=null" :user="getUser()" />
            <div v-else>null</div>
        </td>
        <td>
            <div v-if="timer!=null">
                <p v-if="timer>0" style="color: var(--main-color)">{{ formatTime(timer) }}</p>
                <p v-else style="color: var(--red-color)">time over {{ timer }}</p>
            </div>
            <p v-else style="color: #888">-</p>
        </td>
        <td>
            <p :style="getStatus().status=='waiting' ? 'color: #888' : getStatus().status=='working' ? 'color: var(--main-color)' : getStatus().status=='blocked' ? 'color: var(--red-color)' : getStatus().status=='finished' ? 'color: #20b516; font-weight: 700' : getStatus().status=='failed' ? 'color: var(--red-color); font-weight: 700' : getStatus().status=='paused' ? 'color: #ffa03b' : ''">{{ getStatus().des }}</p>
        </td>
        <td>
            <p v-if="getStatus().subject!=null" style="color: var(--main-color)">{{ getSubjectName(getStatus().subject) }}</p>
            <p v-else style="color: #888">-</p>
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
                    <change-status-dialog
                    v-if="getStatus().status=='working'"
                    :user="user"
                    :getUserName="getUserName"
                    :stopTimer="stopTimer"
                    />
                    <stop-exam-dialog
                    :user="user"
                    :getUserName="getUserName"
                    :getStatus="getStatus"
                    :stopTimer="stopTimer"
                    />
                    <pause-exam-dialog
                    :user="user"
                    :getStatus="getStatus"
                    :pauseTimer="pauseTimer"
                    :getUserName="getUserName"
                    :resumeTimer="resumeTimer"
                    v-if="getStatus().status=='working' || getStatus().status=='paused' || getStatus().status=='waiting'"
                    />
                    <reset-exam-dialog v-if="getStatus().status!='waiting'" :user="user" :getUserName="getUserName" :getStatus="getStatus" />
                    <results-dialog :user="user" :getUserName="getUserName" />
                    <change-questions-dialog v-if="getStatus().status=='working' || getStatus().status=='paused'" :user="user" :getUserName="getUserName" />
                    <exclude-user-dialog
                    :user="user"
                    :getUserName="getUserName"
                    :getStatus="getStatus"
                    />
                </v-list>
            </v-menu>
        </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex';
import UserInfo from '../UserInfo.vue';
import ExcludeUserDialog from './dialogs/ExcludeUserDialog.vue'
import StopExamDialog from './dialogs/StopExamDialog.vue'
import ResetExamDialog from './dialogs/ResetExamDialog.vue'
import PauseExamDialog from './dialogs/PauseExamDialog.vue'
import ResultsDialog from './dialogs/ResultsDialog.vue'
import ChangeQuestionsDialog from './dialogs/ChangeQuestionsDialog.vue'
import { getSubject } from '@/plugins/getInfo';
import ChangeStatusDialog from './dialogs/ChangeStatusDialog.vue';

export default {
    props: {
        user: Object,
        examineeStatusCount: Function
    },
    data(){
        return {
            timer: null,
            timerInterval: undefined
        }
    },
    mounted(){
        if(this.user.time.value && this.user.time.start != null){
            const timeData = Date.now() - this.user.time.start
            if(timeData>0){
                clearInterval(this.timerInterval)
                this.timer = this.user.time.value - Math.round(timeData/1000)
                
                if(this.timer>0){
                    this.timerInterval = setInterval(()=>{
                        if(this.timer!=0){
                            this.timer-=1
                        } else {
                            clearInterval(this.timerInterval)
                        }
                    },1000)
                } else {
                    this.timer = 0
                }
            }
        } else {
            this.timer = this.user.time.value
        }
    },
    watch: {
        'user.status'(){
            this.examineeStatusCount()
        },
        'user.time.value'(){
            if(this.user.time.start != null){
                clearInterval(this.timerInterval)
                this.timer = this.user.time.value

                if(this.user.time.value){
                    this.timerInterval = setInterval(()=>{
                        if(this.timer!=0){
                            this.timer-=1
                        } else {
                            clearInterval(this.timerInterval)
                        }
                    },1000)
                }
            } else {
                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                    this.timer = null
                }
            }
        },
        'user.time.start'(){
            if(this.user.time.start != null){
                
                clearInterval(this.timerInterval)
                this.timer = this.user.time.value

                if(this.user.time.value){
                    this.timerInterval = setInterval(()=>{
                        if(this.timer!=0){
                            this.timer-=1
                        } else {
                            clearInterval(this.timerInterval)
                        }
                    },1000)
                }
            } else {
                if(this.timerInterval){
                    clearInterval(this.timerInterval)
                    this.timerInterval = undefined
                    this.timer = null
                }
            }
        }
    },
    components: {
        UserInfo,
        ExcludeUserDialog,
        StopExamDialog,
        ResetExamDialog,
        PauseExamDialog,
        ResultsDialog,
        ChangeQuestionsDialog,
        ChangeStatusDialog
    },
    computed: mapGetters(['getUsersList', 'getAuthServerIP', 'getCurrentExam', 'getSubjects']),
    methods: {

        stopTimer(){
            this.pauseTimer()
            this.timer = null
        },

        resumeTimer(){
            return this.timer
        },

        pauseTimer(){
            clearInterval(this.timerInterval)
            this.timerInterval = undefined
            return this.timer
        },
        
        getSubjectName(subject) {
            return getSubject(subject, this.getSubjects)
        },

        getUserName(){
            const user = this.getUsersList.find(u => u.id == this.user.id)
            if(user) return `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`
            else return 'unknown'
        },

        getUser(){
            const user = this.getUsersList.find(u => u.id == this.user.id)
            if(user) return user
            else return null
        },

        getStatus() {
            const userData = this.getCurrentExam.users.find(u => u.id == this.user.id)

            if(userData) {
                switch (userData.status) {
                    case 'waiting':
                        return { status: 'waiting', des: 'pending', subject: userData.subject || null }
                    case 'working':
                        return { status: 'working', des: 'passes the exam..', subject: userData.subject || null }
                    case 'blocked':
                        return { status: 'blocked', des: 'blocked', subject: userData.subject || null }
                    case 'finished':
                        return { status: 'finished', des: 'finished', subject: userData.subject || null }
                    case 'failed':
                        return { status: 'failed', des: 'failed', subject: userData.subject || null }
                    case 'paused':
                        return { status: 'paused', des: 'paused', subject: userData.subject || null }
                    default:
                        break;
                }
            } else  return 'unknown'
        },

        // Форматирует таймер
        formatTime(time) {
            const minutes = Math.floor(time / 60)
            let seconds = time % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        },
    },
    unmounted() {
        clearInterval(this.timerInterval)
        this.timerInterval = undefined
    }
}
</script>