<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props: modal  }">        
        <v-tooltip>
            <template v-slot:activator="{ props: tooltip  }">
                <v-btn
                v-bind="mergeProps(modal, tooltip)"
                icon
                variant="text"
                density="compact"
                color="var(--main-color)"
                >
                    <v-icon size="22px">mdi-account-plus</v-icon>
                </v-btn>
            </template>
            <span>Add examinees</span>
        </v-tooltip>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Adding examinee's to exam</span>
                   <v-btn
                   density="compact"
                   icon
                   @click="dialog=false"
                   >
                       <v-icon color="var(--red-color)" size="30">mdi-close-box</v-icon>
                   </v-btn>
               </div>
           </v-toolbar>
           <div class="dialog__content">

                <p class="mb-2" style="color: #777">Number of added examinee's: {{ users.length }}</p>

                <!--  -->
                <users-step
                :usersManagement="usersManagement"
                :users="users"
                :choisingUser="choisingUser"
                :reRenderSingle="reRenderSingle"
                :resetUsersList="resetUsersList" 
                />

               <div class="w-100 d-flex justify-center" style="position: absolute; bottom: 10px">
                   <v-btn
                   density="compact"
                   :color="blockBtn ? '#eee' : 'var(--bg-special-color)'"
                   width="200"
                   @click="addExaminees()"
                   :disabled="blockBtn"
                   >
                   <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Add examinee's</span>
                   <v-progress-circular
                   :width="1"
                   size="15"
                   color="var(--main-color)"
                   indeterminate
                   class=""
                   v-else
                   ></v-progress-circular>
                   </v-btn>
               </div>
           </div>

           <div class="alerts">           
               <v-alert
               density="compact"
               color="var(--red-color)"
               class="d-flex flex-row align-center"
               v-if="error.status"
               >
                   <v-icon color="#fff" class="mr-1">mdi-alert-circle</v-icon>
                   <span style="color:#fff">{{ error.msg }}</span>
               </v-alert>

               <v-alert
               density="compact"
               color="var(--main-color)"
               class="d-flex flex-row align-center"
               v-if="success"
               >
                   <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                   <span style="color:#fff">Examinee's added successfully</span>
               </v-alert>
           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapGetters, mapMutations } from 'vuex'
import { mergeProps } from 'vue'
import UsersStep from '../../steps/UsersStep.vue'
import { getCourse } from '@/plugins/getInfo'

export default {
    props: {
        user: Object,
        getUserName: Function
    },
    components:{
        UsersStep
    },
   data(){
       return {
            dialog: false,
            usersParams:{
                students:{
                    course: null,
                    fullTime: [],
                    inAbsentia: [],
                    magistracy: []
                },
                enrollees:{
                    fullTime: [],
                    inAbsentia: [],
                    magistracy: []
                },
                teachers: [],
                employees: []
            },
            reRenderSingle: false,
            users: [],
            
            error:{
                msg: undefined,
                status: false
            },
            success: false,
            loader: false,
            blockBtn: false,
            question: undefined
       }
   },
   computed: mapGetters(['getAuthParams', 'getAuthServerIP', 'getUsersList', 'getCurrentExam', 'getAdminServerIP']),
   watch:{
    getCurrentExam(){
        if(this.getCurrentExam){
            this.makeUsersList()
        }
    }
   },
   methods:{
    mergeProps,

    ...mapMutations(['switchCurrentExamSwitcher', 'changeExamineesList']),

    usersManagement(type, options, value){
        if(type=='group'){
            if(options.role=='student' && options.educationForm=='full-time'){
                this.usersParams.students.course = options.course
                this.usersParams.students.fullTime = value
            }
            if(options.role=='student' && options.educationForm=='in-absentia'){
                this.usersParams.students.course = options.course
                this.usersParams.students.inAbsentia = value
            }
            if(options.role=='student' && options.educationForm=='magistracy'){
                this.usersParams.students.course = options.course
                this.usersParams.students.magistracy = value
            }
            if(options.role=='enrollee' && options.educationForm=='full-time'){
                this.usersParams.enrollees.fullTime = value
            }
            if(options.role=='enrollee' && options.educationForm=='in-absentia'){
                this.usersParams.enrollees.inAbsentia = value
            }
            if(options.role=='enrollee' && options.educationForm=='magistracy'){
                this.usersParams.enrollees.magistracy = value
            }
            
            if(options.role=='employee'){
                this.usersParams.employees = value
            }
            if(options.role=='teacher'){
                this.usersParams.teachers = value
            }

            this.usersCouting()
        }  
    },
    
    resetUsersList(){
        this.users = []
        this.makeUsersList()
    },

    makeUsersList(){
        this.users = this.getCurrentExam.users.map(examinee => examinee.id)
    },
    
    usersCouting(){
        this.users = []
        this.makeUsersList()

        this.getUsersList.forEach(user => {
                if(this.usersParams.students.fullTime.length){
                    this.usersParams.students.fullTime.forEach(element=>{
                        if(user.roleProperties.group==element && getCourse(user.roleProperties.recieptDate) == this.usersParams.students.course && user.roleProperties.educationForm == 'full-time' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.students.inAbsentia.length){
                    this.usersParams.students.inAbsentia.forEach(element=>{
                        if(user.roleProperties.group==element && getCourse(user.roleProperties.recieptDate) == this.usersParams.students.course && user.roleProperties.educationForm == 'in-absentia' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.students.magistracy.length){
                    this.usersParams.students.magistracy.forEach(element=>{
                        if(user.roleProperties.group==element && getCourse(user.roleProperties.recieptDate) == this.usersParams.students.course && user.roleProperties.educationForm == 'magistracy' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.fullTime.length){
                    this.usersParams.enrollees.fullTime.forEach(element=>{
                        if(user.roleProperties.group==element && user.roleProperties.formOfEducation == 'full-time' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.inAbsentia.length){
                    this.usersParams.enrollees.inAbsentia.forEach(element=>{
                        if(user.roleProperties.group==element && user.roleProperties.formOfEducation == 'in-absentia' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.enrollees.magistracy.length){
                    this.usersParams.enrollees.magistracy.forEach(element=>{
                        if(user.roleProperties.group==element && user.roleProperties.formOfEducation == 'magistracy' && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                
                if(this.usersParams.employees.length){
                    this.usersParams.employees.forEach(element=>{
                        if(user.roleProperties.department==element && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
                if(this.usersParams.teachers.length){
                    this.usersParams.teachers.forEach(element=>{
                        if(user.roleProperties.department==element && !(!!this.getCurrentExam.users.find(examinee => examinee.id == user.id))){
                            this.users.push(user.id)
                        }
                    })
                }
            

        });

        console.log(this.users)
        this.reRenderSingle = true
        setTimeout(()=>{
            this.reRenderSingle = false
        },200)
    },

    choisingUser(type, value){
        if(type=='add'){
            this.users.push(value)
        } else if(type=='remove'){
            const index = this.users.indexOf(value)
            this.users.splice(index, 1)
        }
    },

    async addExaminees(){
        this.blockBtn = true
        const newExamineesList = []
        this.users.map( user => {
            if(!(!!this.getCurrentExam.users.find(examinee => examinee.id == user))){
                const target = this.getUsersList.find(u => u.id == user)

                if(target){
                    newExamineesList.push(target)
                }
            }
        })

        if(newExamineesList.length){
            this.loader = true

            try {
                const data = await makeReq(`${this.getAdminServerIP}/api/exams/add-examinees`, 'POST',{
                    auth:{
                        ...this.getAuthParams
                    },
                    data: {
                        examID: this.getCurrentExam.id,
                        users: newExamineesList
                    }
                })

                if(data){
                    if(data.statusCode == 200){
                        this.success = true
                        this.loader = false

                        // TODO: state mngt data.data.users
                        this.changeExamineesList({ examID: this.getCurrentExam.id, users: data.data.users})
                        this.switchCurrentExamSwitcher()

                        setTimeout(() => {
                            this.success = false
                            this.blockBtn = false
                        },2000)
                    }
                }
            } catch (error) {
                this.loader = false
                console.error(error);
                this.error.status = true
                this.error.msg = 'Some problems with server'
                setTimeout(() => {
                    this.error.status = false
                    this.blockBtn = false
                }, 2000)
            }

        } else {
            this.loader = false
            this.error.status = true
            this.error.msg = 'The examinees to be added are not selected'

            setTimeout(() => {
                this.error.status = false
                this.blockBtn = false
            }, 2000)
        }
    }
   },
   mounted(){
    this.makeUsersList()
   }
}
</script>


<style scoped>
.dialog{
   width: 80vw;
   position: relative;
}
.dialog__content{
   padding: 20px 20px 50px 20px;
   background-color: #fff;
   max-height: 70vh;
   min-height:70vh;
   overflow-y: auto
}
.alerts{
   position: absolute;
   width: 100%;
   margin-top: 10px;
}
</style>
