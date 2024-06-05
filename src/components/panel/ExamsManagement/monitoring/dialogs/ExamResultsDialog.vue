<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
           <v-list-item v-bind="props">
               <v-list-item-title class="d-flex align-center">
                   <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-file-document-outline</v-icon>
                   <span class="menu-text">Get results</span>
               </v-list-item-title>
           </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Exam results </span>
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

                
                <v-select
                density="compact"
                variant="outlined"
                label="Results list variant"
                :items="variants"
                v-model="variant"
                ></v-select>
                
                <v-select
                density="compact"
                variant="outlined"
                label="Exam form"
                :items="forms"
                v-model="examForm"
                v-if="variant && variant=='exam' || variant && variant=='retake'"
                ></v-select>

                <div class="d-flex flex-row justify-space-between w-100" v-if="variant && variant=='exam' || variant && variant=='retake'">
                    <v-switch
                        v-model="prepareReference"
                        hide-details
                        label="Prepare reference"
                        color="var(--main-color)"
                    ></v-switch>

                    <v-switch
                        v-model="referenceWithCharts"
                        hide-details
                        label="Add charts to reference"
                        color="var(--main-color)"
                    ></v-switch>
                </div>

                <div class="w-100 d-flex justify-center">

                    <v-dialog
                        transition="dialog-top-transition"
                        width="500px"
                        v-model="hasDuplicates"
                    >
                        <template v-slot:default="{ isActive }">
                            <div style="width:500px; background-color: #fff;">
                                <div class="d-flex flex-row align-center" style="gap: 5px; background-color: var(--red-color); width: 100%; padding: 10px">
                                    <v-icon color="#fff" size="26">mdi-account-alert</v-icon>
                                    <p style="color: #fff; text-transform: uppercase; font-weight: bold;">These users are repeated several times:</p>
                                </div>

                                <div style="padding: 10px">
                                    <v-table
                                        fixed-header
                                        height="300px"
                                        width="500px"
                                        density="compact"
                                    >
                                        <thead>
                                        <tr>
                                            <th class="text-left">
                                            Name
                                            </th>
                                            <th class="text-left">
                                            Info
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr
                                            v-for="user in duplicatesData"
                                            :key="user.id"
                                        >
                                            <td>{{ user.bio.firstName }} {{ user.bio.lastName }} {{ user.bio.patronymic }}</td>
                                            <td><user-info :user="user"/></td>
                                        </tr>
                                        </tbody>
                                    </v-table>
                                </div>

                                <div style="display:flex; justify-content: flex-end; padding: 10px;">
                                    <v-btn
                                    color="var(--red-color)"
                                    @click="isActive.value = false"
                                    ><span style="color: #fff;font-weight: bold;">Ok</span></v-btn>
                                </div>
                            </div>
                        </template>
                    </v-dialog>

                   <v-btn
                   density="compact"
                   :color="blockBtn ? '#eee' : 'var(--main-color)'"
                   width="200"
                   @click="getResults()"
                   :disabled="blockBtn || !variant"
                   >
                   <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Get results</span>
                   <v-progress-circular
                   :width="1"
                   size="15"
                   color="var(--main-color)"
                   indeterminate
                   v-if="loader"
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
                   <span style="color:#fff">Exam result exported successfully</span>
               </v-alert>
           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { getSubject, getAuthor, getGroup, getCourse, getGroupByProps } from '@/plugins/getInfo'
import { mapGetters } from 'vuex'
import xlsx from "json-as-xlsx"
import JsExcelTemplate from '@/services/js-excel-templates2/browser'
import { TemplateHandler } from 'easy-template-x';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import UserInfo from '../../UserInfo.vue'

export default {
    props: {
        exam: Object
    },
    components:{
        UserInfo
    },
    mounted(){
        Chart.register(ChartDataLabels)
    },
   data(){
       return {
            dialog: false,
            success: false,
            loader: false,
            blockBtn: false,
            error: {
                status: false,
                msg: undefined,
            },

            variant: undefined,
            examForm: undefined,
            prepareReference: true,
            referenceWithCharts: false,
            hasDuplicates: false,
            duplicatesData: [],

            variants: [
                {title:'Exam', value:'exam'},
                {title:'Retake', value:'retake'},
                {title:'Old version', value:'fully'},
            ],

            forms: [
                {title:'Intermediate exam', value:'intermediate'},
                {title:'Final exam', value:'final'},
            ],


       }
   },
  computed: mapGetters(['getSubjects', 'getAdminServerIP', 'getAuthParams', 'getUsersList', 'getExams', 'getDepartments']),
   methods:{

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


      async makeXlsx(data){

        // variant:
        // - fully
        // - exam
        // - retake
        // - reception
        // - to-work

        // Find duplicates
        const duplicates = []
        data.filter((userResult, index, results) => {
            const target = results.find((ur, i) => ur.userID == userResult.userID && index!=i)
            if(target && !duplicates.find(dup => dup == target.userID)) duplicates.push(target.userID)
        });

        if(duplicates.length) {
            this.duplicatesData = duplicates.map( dup => {
                return this.getUsersList.find(u => u.id == dup)
            })

            this.hasDuplicates = true
        }
        
        if(this.variant == 'fully'){
          const doc = [{
              sheet: 'Results',
              columns: [
                  { label: "Т/р", value: "number" },
                  { label: "Номзодларнинг Ф.И.О.", value: "user" },
                  { label: "Гурух", value: "group" },
                  { label: "Тўғри жавоблар сони", value: "currectA" },
                  { label: "Нотўғри жавоблар сони", value: "wrongA" },
                  { label: "Билет бўйича максимал балл", value: "maxBall" },
                  { label: "Номзоднинг тўплаган умумий баллари", value: "ball" },
                  { label: "Фоиз", value: "percentage" },
                  { label: "Бахо", value: "grade" },
                  { label: "Сана", value: "date" },
              ],
              content: []
          }]

          const resultsToDoc = data.map((res,i)=>{
              return {
                  number: i+1,
                  user: getAuthor(res.userID, this.getUsersList),
                  group: getGroup(res.userID, this.getUsersList, 'full'),
                  currectA: res.results[0].exams[0].result.questions.correct,
                  wrongA: res.results[0].exams[0].result.questions.wrong,
                  maxBall: res.results[0].exams[0].result.ball.maxBall,
                  ball: res.results[0].exams[0].result.ball.score,
                  percentage: res.results[0].exams[0].result.percentage,
                  grade: res.results[0].exams[0].result.grade,
                  date: new Date(res.results[0].exams[0].date)
              }
          })

          const currentExam = this.getExams.find(ex => ex.id == this.exam.id)

          if(currentExam){
              currentExam.users.forEach(user => {
                  if(user.status == 'waiting' || user.status == 'working' || user.status == 'paused'){
                      resultsToDoc.push({
                          user: getAuthor(user.id, this.getUsersList),
                          group: getGroup(user.id, this.getUsersList, 'full'),
                          currectA: 'келмаган',
                      })
                  } else if(user.status == 'blocked'){
                      resultsToDoc.push({
                          user: getAuthor(user.id, this.getUsersList),
                          group: getGroup(user.id, this.getUsersList, 'full'),
                          currectA: 'четлаштирилган',
                      })
                  }
              })

              resultsToDoc.sort( (a,b) => b.grade - a.grade )
              resultsToDoc.sort( (a,b) => a.group - b.group )

              doc[0].content = resultsToDoc

              let settings = {
                  fileName: `Қайднома - ${getSubject(this.exam.complex[0].subject, this.getSubjects)}`,
                  //extraLength: 3,
                  writeMode: "writeFile",
                  writeOptions: {},
                  RTL: false,
              }

              xlsx(doc, settings)
          }
        } else{

            const dataset = []
            const examineesExamPassDate = []
            const reference = {
               header: undefined,
               subject: undefined,
               fullDate: undefined,
               form: undefined,
               examForm: undefined,
               examinees: [],
               examineesTotalCount: 0,
               participantsTotalCount: 0,
               greatTotalCount: 0,
               greatTotalPercent: 0,
               goodTotalCount: 0,
               goodTotalPercent: 0,
               satisfactorilyTotalCount: 0,
               satisfactorilyTotalPercent: 0,
               failedTotalCount: 0,
               failedTotalPercent: 0,
               missedTotalCount: 0,
               averageTotalGrade: 0,
               firstFailedLeft: [],
               firstFailedRight: [],
               secondFailedLeft: [],
               secondFailedRight: [],
               missedLeft: [],
               missedRight: [],
               disqualifiedData: [],
               year: undefined,
               month: undefined
            }
            
            if(Array.isArray(data)){
                data.forEach(userResult => {
                    const userData = this.getUsersList.find( user => user.id == userResult.userID )
                    if(userData){
                        const datasetRoleTarget = dataset.find( datasetElm => datasetElm.role == userData.userRole)

                        if(datasetRoleTarget){
                            if(userData.userRole == 'student'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                datasetElm.educationForm == userData.roleProperties.educationForm &&
                                datasetElm.recieptDate == userData.roleProperties.recieptDate &&
                                datasetElm.group == userData.roleProperties.group
                                )

                                if(datasetRolePropertiesTarget) dataset[dataset.indexOf(datasetRolePropertiesTarget)].users.push(userResult)
                                else dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: [userResult]
                                })
                            }else if(userData.userRole == 'enrollee'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                    datasetElm.formOfEducation == userData.roleProperties.formOfEducation &&
                                    datasetElm.admissionYear == userData.roleProperties.admissionYear &&
                                    datasetElm.group == userData.roleProperties.group
                                )

                                if(datasetRolePropertiesTarget) dataset[dataset.indexOf(datasetRolePropertiesTarget)].users.push(userResult)
                                else dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: [userResult]
                                })
                            }else if(userData.userRole == 'teacher' || userData.userRole == 'employee'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                datasetElm.department == userData.roleProperties.department &&
                                datasetElm.role == userData.userRole
                                )

                                if(datasetRolePropertiesTarget) dataset[dataset.indexOf(datasetRolePropertiesTarget)].users.push(userResult)
                                else dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: [userResult]
                                })

                            }
                        } else {
                            dataset.push( {
                                role: userData.userRole,
                                ...userData.roleProperties,
                                users: [userResult]
                            })
                        }

                        examineesExamPassDate.push(userResult.results[0].exams[0].date)
                    }
                })

                // добавить недостающие группы/ведомости
                const currentExam = this.getExams.find(ex => ex.id == this.exam.id)
                currentExam.users.forEach(user => {
                    const userData = this.getUsersList.find( u => u.id == user.id )
                    if(userData){
                        const datasetRoleTarget = dataset.find( datasetElm => datasetElm.role == userData.userRole)

                        if(datasetRoleTarget){
                            if(userData.userRole == 'student'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                datasetElm.educationForm == userData.roleProperties.educationForm &&
                                datasetElm.recieptDate == userData.roleProperties.recieptDate &&
                                datasetElm.group == userData.roleProperties.group
                                )

                                if(!datasetRolePropertiesTarget) dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: []
                                })
                            }else if(userData.userRole == 'enrollee'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                    datasetElm.formOfEducation == userData.roleProperties.formOfEducation &&
                                    datasetElm.admissionYear == userData.roleProperties.admissionYear &&
                                    datasetElm.group == userData.roleProperties.group
                                )

                                if(!datasetRolePropertiesTarget) dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: []
                                })
                            }else if(userData.userRole == 'teacher' || userData.userRole == 'employee'){
                                const datasetRolePropertiesTarget = dataset.find( datasetElm =>
                                datasetElm.department == userData.roleProperties.department &&
                                datasetElm.role == userData.userRole
                                )

                                if(!datasetRolePropertiesTarget) dataset.push({
                                    role: userData.userRole,
                                    ...userData.roleProperties,
                                    users: []
                                })

                            }
                        } else {
                            dataset.push( {
                                role: userData.userRole,
                                ...userData.roleProperties,
                                users: []
                            })
                        }
                    }
                })
            }
            dataset.sort( (a,b) => a.group - b.group )
            console.log(dataset);
            const examineesData = []
            
            const resultFileTmp = await fetch(`./results-${this.variant == 'exam' ? 'general' : this.variant == 'retake' ? 'retake' : ''}.xlsx`)
            const resTmpArrBuffer = await resultFileTmp.arrayBuffer()
            const excelTemplate = await JsExcelTemplate.fromArrayBuffer(resTmpArrBuffer)
            if(this.variant == 'exam'){
                dataset.forEach((datasetElm, i) => {
                    if(i==0){
                        excelTemplate.renameSheet(0, datasetElm.role == 'student' ? getGroupByProps(datasetElm.group, datasetElm.recieptDate) : `${i}`)
                    } else excelTemplate.addSheet(datasetElm.role == 'student' ? getGroupByProps(datasetElm.group, datasetElm.recieptDate) : `${i}`)
                })
            } else if(this.variant == 'retake'){
                excelTemplate.renameSheet(0, 'Қайта топшириш умумий', 'full')
            }

            if(this.variant == 'exam'){
                dataset.forEach((datasetElm, i) => {
                    const header = datasetElm.role == 'student' ? `${datasetElm.educationForm == 'full-time' ? 'Кундузги таълим' : datasetElm.educationForm == 'in-absentia' ? 'Сиртқи таълим' : 'Магистратура' } ${getCourse(datasetElm.recieptDate)}-ўқув курси ${getGroupByProps(datasetElm.group, datasetElm.recieptDate)}-гуруҳ ${datasetElm.educationForm == 'full-time' ? 'курсантлар' : 'тингловчилар'} учун` : datasetElm.role == 'teacher' || datasetElm.role == 'employee' ? `${this.getDepartment(datasetElm.department)} ${datasetElm.role == 'teacher' ? 'кафедра ўқитувчилар учун' : 'бўлим ходимлар учун'}` : `unknown`
                    const date = new Date()

                    excelTemplate.set(i, "currentDate", `${date.getDate()<10 ? `0${date.getDate()}` : date.getDate()}.${date.getMonth()+1<10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`);
                    excelTemplate.set(i, "header", header);
                    excelTemplate.set(i, "subject", getSubject(this.exam.complex[0].subject, this.getSubjects).split('(')[0].trim())
                    excelTemplate.set(i, "examForm", this.examForm == 'intermediate' ? 'Оралиқ назорат' : this.examForm == 'final' ? 'Якуний назорат' : '');
                    const examinees = datasetElm.users.map((userRes, ui) => {
                        return {
                            i: ui+1,
                            fullName: getAuthor(userRes.userID, this.getUsersList),
                            percent: userRes.results[0].exams[0].result.percentage,
                            grade: userRes.results[0].exams[0].result.grade,
                            id: userRes.userID,
                            status: userRes.results[0].exams[0].result.grade > 2 ? 'finished' : 'failed',
                            group: getGroup(userRes.userID, this.getUsersList, 'full')
                        }
                    })

                    const currentExam = this.getExams.find(ex => ex.id == this.exam.id)
                    const mergeCells = []

                    // filters+
                    examinees.sort( (a,b) => b.percent - a.percent )
                    examinees.forEach((ex, ui) => ex.i = ui+1 )

                    if(currentExam){
                        function checkEquals(userData){
                            if(userData.userRole == 'student' && datasetElm.role == 'student'){
                                if(userData.roleProperties.educationForm == datasetElm.educationForm && userData.roleProperties.recieptDate == datasetElm.recieptDate && userData.roleProperties.group == datasetElm.group) return true
                                else return false
                            } else if(userData.userRole == 'enrollee' && datasetElm.role == 'enrollee'){
                                if(userData.roleProperties.formOfEducation == datasetElm.formOfEducation && userData.roleProperties.admissionYear == datasetElm.admissionYear && userData.roleProperties.group == datasetElm.group) return true
                                else return false
                            } else if(userData.userRole == 'teacher' && datasetElm.role == 'teacher' || userData.userRole == 'employee' && datasetElm.role == 'employee'){
                                if(userData.roleProperties.department == datasetElm.department) return true
                                else return false
                            }
                        }

                        currentExam.users.forEach(user => {
                            if(user.status == 'waiting' || user.status == 'paused' || user.status == 'working'){
                                const examinee = examinees.find(ex => ex.id == user.id)
                                const userData = this.getUsersList.find(u => u.id == user.id)

                                if(!examinee && checkEquals(userData)){
                                    const examineesCount = examinees.length
                                    examinees.push({
                                        i: examineesCount+1,
                                        fullName: getAuthor(user.id, this.getUsersList),
                                        percent: 'келмаган',
                                        status: 'waiting',
                                        group: getGroup(user.id, this.getUsersList, 'full')
                                    })

                                    mergeCells.push(examineesCount)
                                }
                            } else if(user.status == 'blocked'){
                                const examinee = examinees.find(ex => ex.id == user.id)
                                const userData = this.getUsersList.find(u => u.id == user.id)

                                if(examinee && checkEquals(userData)){
                                    examinees[examinees.indexOf(examinee)].percent = 'четлаштирилган'
                                    examinees[examinees.indexOf(examinee)].grade = 2
                                    examinees[examinees.indexOf(examinee)].status = 'blocked'
                                    mergeCells.push(examinees.indexOf(examinee))
                                }else if(!examinee && checkEquals(userData)){
                                    const examineesCount = examinees.length
                                    examinees.push({
                                        i: examineesCount+1,
                                        fullName: getAuthor(user.id, this.getUsersList),
                                        percent: 'четлаштирилган',
                                        grade: 2,
                                        status: 'blocked',
                                        group: getGroup(user.id, this.getUsersList, 'full')
                                    })
                                    mergeCells.push(examineesCount)
                                }
                            }
                        })
                    }

                    let totalPercent = 0
                    let examineesPassed = 0
                    let examineesFailed = 0
                    let greatCount = 0
                    let goodCount = 0
                    let satisfactorilyCount = 0
                    let failedCount = 0
                    let missedCount = 0
                    let disqualifiedCount = 0
                    let realExamineesCount = examinees.length
                    
                    examineesData.push(...examinees)
                    examinees.forEach(examinee =>{
                        if(typeof examinee.percent == 'number') totalPercent+=examinee.percent
                        if(examinee.grade == 2){
                            failedCount++
                            examineesFailed++
                        } else if(examinee.grade == 3){
                            satisfactorilyCount++
                            examineesPassed++
                        } else if(examinee.grade == 4){
                            goodCount++
                            examineesPassed++
                        } else if(examinee.grade == 5){
                            greatCount++
                            examineesPassed++
                        }

                        if(examinee.status == 'waiting' || examinee.status == 'paused' || examinee.status == 'working'){
                            missedCount++
                            realExamineesCount--
                        }
                        if(examinee.status == 'blocked'){
                            examineesFailed++
                            disqualifiedCount++
                            realExamineesCount--
                        }
                    })

                    excelTemplate.set(i, "examinees", examinees)
                    excelTemplate.set(i, "averageResult", isNaN(Math.round(totalPercent/realExamineesCount)) ? 0 : Math.round(totalPercent/realExamineesCount))
                    excelTemplate.set(i, "examineesPassed", examineesPassed)
                    excelTemplate.set(i, "examineesFailed", examineesFailed)
                    excelTemplate.set(i, "greatCount", greatCount)
                    excelTemplate.set(i, "goodCount", goodCount)
                    excelTemplate.set(i, "satisfactorilyCount", satisfactorilyCount)
                    excelTemplate.set(i, "failedCount", failedCount)
                    excelTemplate.set(i, "missedCount", missedCount)
                    excelTemplate.set(i, "disqualifiedCount", disqualifiedCount)
                    mergeCells.forEach(mCell => excelTemplate.mergeCellsInSheet(i, mCell, 'general'))

                    excelTemplate.set(i, "examineesCount", examinees.length)
                    
                    /////                
                    reference.greatTotalCount += greatCount
                    reference.goodTotalCount += goodCount
                    reference.satisfactorilyTotalCount += satisfactorilyCount
                    reference.failedTotalCount += failedCount
                    reference.missedTotalCount += missedCount
                    //////
                    
                    reference.header = dataset[0].role == 'student' ? `${dataset[0].educationForm == 'full-time' ? 'Кундузги таълим' : dataset[0].educationForm == 'in-absentia' ? 'Сиртқи таълим' : 'Магистратура' } ${getCourse(dataset[0].recieptDate)}-ўқув курси ${dataset[0].educationForm == 'full-time' ? 'курсантлар' : 'тингловчилар'}и` : dataset[0].role == 'teacher' || dataset[0].role == 'employee' ? `${this.getDepartment(dataset[0].department)} ${dataset[0].role == 'teacher' ? 'кафедра ўқитувчилари' : 'бўлим ходимлари'}` : `unknown`
                    reference.subject = getSubject(this.exam.complex[0].subject, this.getSubjects).split('(')[0].trim()
                    reference.year = date.getFullYear()
                    reference.month = this.getMonthName(date.getMonth())
                    reference.form = this.examForm == 'intermediate' ? 'оралиқ назорат' : this.examForm == 'final' ? 'якуний назорат' : ''
                    reference.examForm = this.examForm == 'intermediate' ? 'Оралиқ назорат' : this.examForm == 'final' ? 'Якуний назорат' : ''
                })
            } else if(this.variant == 'retake'){
                // examineeGradeSum
                const examinees = []
                const header = dataset[0].role == 'student' ? `${dataset[0].educationForm == 'full-time' ? 'Кундузги таълим' : dataset[0].educationForm == 'in-absentia' ? 'Сиртқи таълим' : 'Магистратура' } ${getCourse(dataset[0].recieptDate)}-ўқув курси ${dataset[0].educationForm == 'full-time' ? 'курсантлар' : 'тингловчилар'} учун` :dataset[0].role == 'teacher' || dataset[0].role == 'employee' ? `${this.getDepartment(dataset[0].department)} ${dataset[0].role == 'teacher' ? 'кафедраўқитувчилар учун' : 'бўлим ходимлар учун'}` : `unknown`
                const date = new Date()
                const subject = getSubject(this.exam.complex[0].subject, this.getSubjects).split('(')[0].trim()
                const examForm = this.examForm == 'intermediate' ? 'Оралиқ назорат' : this.examForm == 'final' ? 'Якуний назорат' : ''
                
                excelTemplate.set(0, "currentDate", `${date.getDate()<10 ? `0${date.getDate()}` : date.getDate()}.${date.getMonth()+1<10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`);
                excelTemplate.set(0, "header", header);
                excelTemplate.set(0, "subject", subject)
                excelTemplate.set(0, "examForm", examForm);

                /////
                reference.header = `${header.replace(' учун', '')}и`
                reference.subject = subject
                reference.year = date.getFullYear()
                reference.month = this.getMonthName(date.getMonth())
                reference.form = `${examForm.toLowerCase()}ини қайта топшириш`
                reference.examForm = examForm
                //////

                dataset.forEach((datasetElm) => {
                    datasetElm.users.forEach((userRes, ui) => {
                        examinees.push({
                            i: ui+1,
                            fullName: getAuthor(userRes.userID, this.getUsersList),
                            percent: userRes.results[0].exams[0].result.percentage,
                            grade: userRes.results[0].exams[0].result.grade,
                            id: userRes.userID,
                            status: userRes.results[0].exams[0].result.grade > 2 ? 'finished' : 'failed',
                            group: getGroup(datasetElm.users[0].userID, this.getUsersList, 'full')
                        })
                    })
                })                

                const currentExam = this.getExams.find(ex => ex.id == this.exam.id)
                const mergeCells = []
                examinees.sort( (a,b) => b.percent - a.percent )

                if(currentExam){
                    currentExam.users.forEach(user => {
                        if(user.status == 'waiting' || user.status == 'paused' || user.status == 'working'){
                            const examinee = examinees.find(ex => ex.id == user.id)

                            if(!examinee){
                                const examineesCount = examinees.length
                                examinees.push({
                                    i: examineesCount+1,
                                    fullName: getAuthor(user.id, this.getUsersList),
                                    percent: 'келмаган',
                                    status: 'waiting',
                                    group: getGroup(user.id, this.getUsersList, 'full')
                                })
                            }
                        } else if(user.status == 'blocked'){
                            const examinee = examinees.find(ex => ex.id == user.id)

                            if(examinee){
                                examinees[examinees.indexOf(examinee)].percent = 'четлаштирилган'
                                examinees[examinees.indexOf(examinee)].grade = 2
                                examinees[examinees.indexOf(examinee)].status = 'blocked'
                            }else if(!examinee){
                                const examineesCount = examinees.length
                                examinees.push({
                                    i: examineesCount+1,
                                    fullName: getAuthor(user.id, this.getUsersList),
                                    percent: 'четлаштирилган',
                                    grade: 2,
                                    status: 'blocked',
                                    group: getGroup(user.id, this.getUsersList, 'full')
                                })
                            }
                        }
                    })
                }

                let totalPercent = 0
                let examineesPassed = 0
                let examineesFailed = 0
                let greatCount = 0
                let goodCount = 0
                let satisfactorilyCount = 0
                let failedCount = 0
                let missedCount = 0
                let disqualifiedCount = 0
                let realExamineesCount = examinees.length

                examinees.sort( (a,b) => a.group - b.group )
                examinees.forEach((examinee, ui) => {
                    examinee.i = ui+1
                    if(examinee.status == 'waiting' || examinee.status == 'paused' || examinee.status == 'working' || examinee.status == 'blocked') mergeCells.push(ui)
                    
                    if(typeof examinee.percent == 'number') totalPercent+=examinee.percent
                    if(examinee.grade == 2 && examinee.status != 'blocked'){
                        failedCount++
                        examineesFailed++
                    } else if(examinee.grade == 3){
                        satisfactorilyCount++
                        examineesPassed++
                    } else if(examinee.grade == 4){
                        goodCount++
                        examineesPassed++
                    } else if(examinee.grade == 5){
                        greatCount++
                        examineesPassed++
                    }

                    if(examinee.status == 'waiting' || examinee.status == 'working' || examinee.status == 'paused'){
                        missedCount++
                        realExamineesCount--
                    }
                    if(examinee.status == 'blocked'){
                        examineesFailed++
                        disqualifiedCount++
                        realExamineesCount--
                    }
                })
                
                examineesData.push(...examinees)

                excelTemplate.set(0, "examinees", examinees)
                excelTemplate.set(0, "averageResult", isNaN(Math.round(totalPercent/realExamineesCount)) ? 0 : Math.round(totalPercent/realExamineesCount))
                excelTemplate.set(0, "examineesPassed", examineesPassed)
                excelTemplate.set(0, "examineesFailed", examineesFailed)
                excelTemplate.set(0, "greatCount", greatCount)
                excelTemplate.set(0, "goodCount", goodCount)
                excelTemplate.set(0, "satisfactorilyCount", satisfactorilyCount)
                excelTemplate.set(0, "failedCount", failedCount)
                excelTemplate.set(0, "missedCount", missedCount)
                excelTemplate.set(0, "disqualifiedCount", disqualifiedCount)
                mergeCells.forEach(mCell => excelTemplate.mergeCellsInSheet(0, mCell, 'retake'))

                ///////
                reference.greatTotalCount = greatCount
                reference.goodTotalCount = goodCount
                reference.satisfactorilyTotalCount = satisfactorilyCount
                reference.failedTotalCount = failedCount
                reference.missedTotalCount = missedCount
                ///////

                excelTemplate.set(0, "examineesCount", examinees.length)
            }

            const blob = await excelTemplate.toBlob()
            const fileName = this.variant == 'retake' ? `Қайта топшириш қайднома - ${getSubject(this.exam.complex[0].subject, this.getSubjects)}.xlsx` : `Қайднома - ${getSubject(this.exam.complex[0].subject, this.getSubjects)}.xlsx`
            this.downloadFile(blob, fileName)

            // reference
            if(this.prepareReference){
                
                reference.fullDate = this.getExamDuration(examineesExamPassDate)

                const referenceExamineesData = dataset.map(datasetElm => {
                    return {
                        group: getGroupByProps(datasetElm.group, datasetElm.recieptDate),
                        examineesCount: 0,
                        participantsCount: 0,
                        greatCount: 0,
                        greatPercent: 0,
                        goodCount: 0,
                        goodPercent: 0,
                        satisfactorilyCount: 0,
                        satisfactorilyPercent: 0,
                        failedCount: 0,
                        failedPercent: 0,
                        missedCount: 0,
                        averageGrade: 0
                    }
                })
                console.log(referenceExamineesData);

                referenceExamineesData.forEach((refExamData, i) => {
                    // examineesCount
                    referenceExamineesData[i].examineesCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].examineesCount == undefined) referenceExamineesData[i].examineesCount=0

                    // participantsCount
                    referenceExamineesData[i].participantsCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.status != 'waiting' && currentValue.group == refExamData.group ||
                        currentValue.status == 'paused' && currentValue.group == refExamData.group || 
                        currentValue.status == 'working' && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].participantsCount == undefined) referenceExamineesData[i].participantsCount=0

                    // greatCount
                    referenceExamineesData[i].greatCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.grade == 5 && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].greatCount == undefined) referenceExamineesData[i].greatCount=0
                    
                    // greatPercent
                    const greatPercent = referenceExamineesData[i].greatCount/referenceExamineesData[i].participantsCount*100
                    referenceExamineesData[i].greatPercent = isNaN(+greatPercent.toFixed(1)) ? 0 : +greatPercent.toFixed(1)

                    // goodCount
                    referenceExamineesData[i].goodCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.grade == 4 && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)

                    if(referenceExamineesData[i].goodCount == undefined) referenceExamineesData[i].goodCount=0

                    // goodPercent
                    const goodPercent = referenceExamineesData[i].goodCount/referenceExamineesData[i].participantsCount*100
                    referenceExamineesData[i].goodPercent = isNaN(+goodPercent.toFixed(1)) ? 0 : +goodPercent.toFixed(1)

                    // satisfactorilyCount
                    referenceExamineesData[i].satisfactorilyCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.grade == 3 && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].satisfactorilyCount == undefined) referenceExamineesData[i].satisfactorilyCount=0

                    // satisfactorilyPercent
                    const satisfactorilyPercent = referenceExamineesData[i].satisfactorilyCount/referenceExamineesData[i].participantsCount*100
                    referenceExamineesData[i].satisfactorilyPercent = isNaN(+satisfactorilyPercent.toFixed(1)) ? 0 : +satisfactorilyPercent.toFixed(1)

                    // failedCount
                    referenceExamineesData[i].failedCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.grade == 2 && currentValue.group == refExamData.group || currentValue.status == 'blocked' && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].failedCount == undefined) referenceExamineesData[i].failedCount=0

                    // failedPercent
                    const failedPercent = referenceExamineesData[i].failedCount/referenceExamineesData[i].participantsCount*100
                    referenceExamineesData[i].failedPercent = isNaN(+failedPercent.toFixed(1)) ? 0 : +failedPercent.toFixed(1)

                    // missedCount
                    referenceExamineesData[i].missedCount = examineesData.reduce((accumulator, currentValue) => {
                        if(currentValue.status == 'waiting' && currentValue.group == refExamData.group ||
                        currentValue.status == 'paused' && currentValue.group == refExamData.group || 
                        currentValue.status == 'working' && currentValue.group == refExamData.group) return accumulator+1
                        else return accumulator
                    }, 0)
                    if(referenceExamineesData[i].missedCount == undefined) referenceExamineesData[i].missedCount=0

                    // averageGrade
                    let examineeGradeSum = examineesData.reduce((accumulator, currentValue) => {
                        const grade = isNaN(currentValue.grade) ? 0 : currentValue.grade
                        if(currentValue.grade && currentValue.group == refExamData.group && typeof currentValue.grade == 'number') return accumulator+grade
                        else return accumulator
                    }, 0)

                    if(examineeGradeSum == undefined) examineeGradeSum=0
                    const averageGrade = examineeGradeSum/referenceExamineesData[i].participantsCount
                    referenceExamineesData[i].averageGrade = isNaN(+averageGrade.toFixed(1)) ? 0 : +averageGrade.toFixed(1)
                })
                
                reference.examineesTotalCount = examineesData.length
                reference.participantsTotalCount = referenceExamineesData.reduce((accumulator, currentValue) => accumulator+currentValue.participantsCount, 0)
                reference.greatTotalPercent = +(reference.greatTotalCount/reference.participantsTotalCount*100).toFixed(1)
                reference.goodTotalPercent = +(reference.goodTotalCount/reference.participantsTotalCount*100).toFixed(1)
                reference.satisfactorilyTotalPercent = +(reference.satisfactorilyTotalCount/reference.participantsTotalCount*100).toFixed(1)
                reference.failedTotalPercent = +(reference.failedTotalCount/reference.participantsTotalCount*100).toFixed(1)
                const averageTotalGrade = referenceExamineesData.reduce((accumulator, currentValue) => accumulator+currentValue.averageGrade, 0)
                reference.averageTotalGrade = +(averageTotalGrade/referenceExamineesData.length).toFixed(1)

                const firstFailed = []
                const secondFailed = []
                const missed = []
                const disqualified = []

                let firstFailedIndex = 1
                let secondFailedIndex = 1
                let missedIndex = 1
                let disqualifiedIndex = 1

                examineesData.forEach(examinee => {
                    if(examinee.status == 'failed'){
                        const allResults = data.filter( u => u.userID == examinee.id && u.results[0].exams[0].result.grade == 2 )

                        if(allResults.length > 1){
                            const last = allResults[allResults.length-2]
                            const current = allResults[allResults.length-1]
                            
                            firstFailed.push({
                                i: firstFailedIndex,
                                group: examinee.group,
                                fullName: examinee.fullName,
                                id: examinee.id,
                                percent: last.results[0].exams[0].result.percentage
                            })
                            secondFailed.push({
                                i: secondFailedIndex,
                                group: examinee.group,
                                fullName: examinee.fullName,
                                id: examinee.id,
                                percent: current.results[0].exams[0].result.percentage
                            })
                            firstFailedIndex++
                            secondFailedIndex++
                        } else {
                            firstFailed.push({
                                i: firstFailedIndex,
                                group: examinee.group,
                                fullName: examinee.fullName,
                                id: examinee.id,
                                percent: examinee.percent
                            })

                            firstFailedIndex++
                        }
                    }else if(examinee.status == 'waiting' || examinee.status == 'paused' || examinee.status == 'working'){
                        missed.push({
                            i: missedIndex,
                            group: examinee.group,
                            fullName: examinee.fullName
                        })
                        missedIndex++
                    } else if(examinee.status == 'blocked'){
                        disqualified.push({
                            i: disqualifiedIndex,
                            group: examinee.group,
                            fullName: examinee.fullName
                        })
                        disqualifiedIndex++
                    }
                })

                reference.missedLeft = missed.slice(0, missed.length / 2);
                reference.missedRight = missed.slice(missed.length / 2);

                reference.firstFailedLeft = firstFailed.slice(0, firstFailed.length / 2);
                reference.firstFailedRight = firstFailed.slice(firstFailed.length / 2);

                reference.secondFailedLeft = secondFailed.slice(0, secondFailed.length / 2);
                reference.secondFailedRight = secondFailed.slice(secondFailed.length / 2);
                
                reference.disqualifiedData = disqualified

                const tmpData ={
                    i: '',
                    group: '',
                    fullName: ''
                }
                
                if(reference.firstFailedLeft.length == 0) reference.firstFailedLeft.push(tmpData)
                if(reference.secondFailedLeft.length == 0) reference.secondFailedLeft.push(tmpData)
                if(reference.firstFailedRight.length == 0) reference.firstFailedRight.push(tmpData)
                if(reference.secondFailedRight.length == 0) reference.secondFailedRight.push(tmpData)
                if(reference.missedLeft.length == 0) reference.missedLeft.push(tmpData)
                if(reference.missedRight.length == 0) reference.missedRight.push(tmpData)
                if(reference.disqualifiedData.length == 0) reference.disqualifiedData.push(tmpData)


                reference.examinees = referenceExamineesData
                console.log(reference);

                if(this.referenceWithCharts){

                    const dataset1 = [
                            {
                                data: referenceExamineesData.reduce((accumulator, currentValue) => {
                                    accumulator.push(currentValue.failedCount)
                                    return accumulator
                                }, []),
                                backgroundColor: "rgba(63,103,126,1)",
                                hoverBackgroundColor: "rgba(50,90,100,1)",
                                
                                datalabels: {
                                    color: 'red',
                                    font: {
                                        size: 16
                                    }
                                }
                            },
                            {
                                data: referenceExamineesData.reduce((accumulator, currentValue) => {
                                    accumulator.push(currentValue.satisfactorilyCount)
                                    return accumulator
                                }, []),
                                backgroundColor: "rgba(163,103,126,1)",
                                hoverBackgroundColor: "rgba(140,85,100,1)"
                            },
                            {
                                data: referenceExamineesData.reduce((accumulator, currentValue) => {
                                    accumulator.push(currentValue.goodCount)
                                    return accumulator
                                }, []),
                                backgroundColor: "rgba(63,203,226,1)",
                                hoverBackgroundColor: "rgba(46,185,235,1)"
                            },
                            {
                                data: referenceExamineesData.reduce((accumulator, currentValue) => {
                                    accumulator.push(currentValue.greatCount)
                                    return accumulator
                                }, []),
                                backgroundColor: "rgba(213,103,126,1)",
                                hoverBackgroundColor: "rgba(50,90,100,1)"
                            }
                    ]

                    console.log(dataset1);

                    const chart1 = await this.makeChart('chart1', 'bar', {
                        labels: referenceExamineesData.map(exData => exData.group),
                        datasets: dataset1
                    }, 
                    {
                        plugins: [ChartDataLabels],
                        indexAxis: 'y',
                        bezierCurve : false,
                        animation: {
                            duration: 0
                        },
                        responsive: true,
                        scales: {
                            x: {
                                stacked: true,
                            },
                            y: {
                                stacked: true
                            },
                        },
                    })

                    // var barOptions_stacked = {
                    //     tooltips: {
                    //         enabled: false
                    //     },
                    //     hover :{
                    //         animationDuration:0
                    //     },
                    //     scales: {
                    //     },
                    //     legend:{
                    //         display:false
                    //     },
                        
                    //     pointLabelFontFamily : "Quadon Extra Bold",
                    //     scaleFontFamily : "Quadon Extra Bold",
                    // };

                    // const chart2 = await this.makeChart('chart2', )

                    if(chart1){
                        reference.chart1 = {
                            _type: "image",
                            source: chart1,
                            format: 'image/png',
                            width: 1000,
                            height: 600
                        }

                        const referenceFileTmp = await fetch('./reference-with-charts.docx');
                        const templateFile = await referenceFileTmp.blob();
                        const handler = new TemplateHandler();
                        const doc = await handler.process(templateFile, reference);

                        this.downloadFile(doc, `Malumotnoma.docx`)
                    }
                } else {
                    const referenceFileTmp = await fetch('./reference.docx');
                    const templateFile = await referenceFileTmp.blob();
                    const handler = new TemplateHandler();
                    const doc = await handler.process(templateFile, reference);

                    this.downloadFile(doc, `Malumotnoma.docx`)
                }
            }
        }
      },


      getDepartment(department){
        const departmentName= this.getDepartments.find(item => item.id == department) || 'unknown'
        return departmentName.name.ru || departmentName.id
      },

      getMonthName(month){
        switch(month){
            case 0: return 'январь'
            case 1: return 'февраль'
            case 2: return 'март'
            case 3: return 'апрель'
            case 4: return 'май'
            case 5: return 'июнь'
            case 6: return 'июль'
            case 7: return 'август'
            case 8: return 'сентябрь'
            case 9: return 'октябрь'
            case 10: return 'ноябрь'
            case 11: return 'декабрь'
        }
      },

      async makeChart(name, type, data, options){
        const canvasElm = document.createElement('canvas')
        canvasElm.style.width = '800px'
        canvasElm.setAttribute('id', name)
        document.body.appendChild(canvasElm)

        // const chart = new Chart(document.getElementById('test'), {
        //     type: 'bar',
        //     data: {
        //         labels: ["2014", "2013", "2012", "2011"],
                
        //         datasets: [{
        //             data: [727, 589, 537, 543, 574],
        //             backgroundColor: "rgba(63,103,126,1)",
        //             hoverBackgroundColor: "rgba(50,90,100,1)"
        //         },{
        //             data: [238, 553, 746, 884, 903],
        //             backgroundColor: "rgba(163,103,126,1)",
        //             hoverBackgroundColor: "rgba(140,85,100,1)"
        //         },{
        //             data: [1238, 553, 746, 884, 903],
        //             backgroundColor: "rgba(63,203,226,1)",
        //             hoverBackgroundColor: "rgba(46,185,235,1)"
        //         }]
        //     },
        //     options:{
        //         indexAxis: 'y',
        //         bezierCurve : false,
        //         animation: {
        //             duration: 0
        //             // onComplete: done
        //         },
        //         responsive: true,
        //         scales: {
        //             x: {
        //                 stacked: true,
        //             },
        //             y: {
        //                 stacked: true
        //             }
        //         }
        //     }
        // });

        const chart = new Chart(document.getElementById(name), {
            type,
            data,
            options
        })

        if(chart) {
            const chartData = await new Promise(resolve => canvasElm.toBlob(resolve));
            console.log(chartData);

            canvasElm.remove()
            return chartData
        }

      },

      downloadFile(data, fileName){
        const url = window.URL || window.webkitURL;
        const blobData = url.createObjectURL(data)
        const link = document.createElement('a');
        link.setAttribute("href", blobData);
        link.setAttribute("download", fileName)

        document.body.appendChild(link); // required for firefox
        link.click();
        link.remove()
      },

      getExamDuration(dates){
        const minDate = new Date(Math.min.apply(null, dates))
        const maxDate = new Date(Math.max.apply(null, dates))

        if(minDate != maxDate){
            if(minDate.getFullYear() == maxDate.getFullYear()){
                if(minDate.getMonth() == maxDate.getMonth()){ // __ йилнинг __-__ апрель кунлари
                    return `${minDate.getFullYear()} йилнинг ${minDate.getDate()<10 ? `0${minDate.getDate()}` : minDate.getDate() }-${maxDate.getDate()<10 ? `0${maxDate.getDate()}` : maxDate.getDate() } ${this.getMonthName(minDate.getMonth())} кунлари`
                } else { // __ йилнинг __ апрель - __ май кунлари
                    return `${minDate.getFullYear()} йилнинг ${minDate.getDate()<10 ? `0${minDate.getDate()}` : minDate.getDate() } ${this.getMonthName(minDate.getMonth())} - ${maxDate.getDate()<10 ? `0${maxDate.getDate()}` : maxDate.getDate() } ${this.getMonthName(maxDate.getMonth())} кунлари`
                }
            } else { // __ йилнинг __ апрель - __ йилнинг __ май кунлари
                return `${minDate.getFullYear()} йилнинг ${minDate.getDate()<10 ? `0${minDate.getDate()}` : minDate.getDate() } ${this.getMonthName(minDate.getMonth())} - ${maxDate.getFullYear()} йилнинг ${maxDate.getDate()<10 ? `0${maxDate.getDate()}` : maxDate.getDate() } ${this.getMonthName(maxDate.getMonth())} кунлари`
            }
        } else return `${minDate.getFullYear()} йилнинг ${minDate.getDate()<10 ? `0${minDate.getDate()}` : minDate.getDate() } ${this.getMonthName(minDate.getMonth())} куни`
        // __ йилнинг __ апрель куни
      }
   }
}
</script>


<style scoped>
.dialog{
   width: 50vw;
   position: relative;
}
.dialog__content{
   padding: 20px;
   background-color: #fff;
}
.alerts{
   position: absolute;
   width: 100%;
   margin-top: 10px;
}
</style>
