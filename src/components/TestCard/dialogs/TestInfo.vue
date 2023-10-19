<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-list-item-title>
                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-information-outline</v-icon>
                    <span class="menu-text">Info</span>
                </v-list-item-title>
            </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Test info</span>
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

            <v-table
            density="compact"
            >
              <tbody>
              <tr>
                <!-- Create date -->
                  <td>Date of creation</td>
                  <td class="text-right">{{ getTestDate('creation') }}</td>
              </tr>
              <tr>
                <!-- Sign date -->
                  <td>Date of signing</td>
                  <td class="text-right">{{ getTestDate('signing') }}</td>
              </tr>
              <tr>
                <!-- Author date -->
                  <td>Author</td>
                  <td class="text-right">{{ getTestAuthor() }}</td>
              </tr>
              <tr>
                <!-- Subject -->
                  <td>Subject</td>
                  <td class="text-right">{{ getTestSubject() }}</td>
              </tr>
              <tr>
                <!-- Themes -->
                  <td>Themes</td>
                  <td class="text-right">{{ getTestThemes() }}</td>
              </tr>
              <tr>
                <!-- Languages -->
                  <td>Languages</td>
                  <td class="text-right">{{ getTestLanguages() }}</td>
              </tr>
              <tr v-if="test.status.value=='rejected'" style="color: var(--red-color)">
                <!-- Remarks -->
                  <td>Remarks count</td>
                  <td class="text-right">{{ test.remarks.length }}</td>
              </tr>
              </tbody>
            </v-table>

            <div class="mt-3 d-flex align-center" v-if="test.info.params.considerDifficulty">
                <v-icon color="var(--main-color)" size="19">mdi-check-circle</v-icon>
                <span class="ml-1" style="font-size: 0.9em;">The test takes into account the complexity of the questions</span>
            </div>

            <div class="mt-3 d-flex flex-column" v-if="test.info.params.ballSystem">
                <div class="d-flex align-center">
                    <v-icon color="var(--main-color)" size="19">mdi-check-circle</v-icon>
                    <span class="ml-1" style="font-size: 0.9em;">The test takes into account the point system</span>
                </div>
                <div class="d-flex flex-row justify-space-between flex-wrap mt-1">
                    <div style="font-size: 0.9em;"><v-icon size="19" color="var(--main-color)">mdi-minus</v-icon>Minimum score: <b>{{ test.info.params.ballSystem.min }}</b></div> 
                    <div style="font-size: 0.9em;"><v-icon size="19" color="var(--main-color)">mdi-plus</v-icon>Maximum score: <b>{{ test.info.params.ballSystem.max }}</b></div>
                </div>
            </div>

            <div class="mt-3 d-flex flex-column">
                <div class="d-flex flex-column" style="gap: 30px">
                    <div class="d-flex align-center">
                        <v-icon color="var(--main-color)" size="19">mdi-help-circle</v-icon>
                        <span class="ml-1" style="font-size: 0.9em;">Total number of questions: <span>{{ test.info.testInfo.totalQuestions }}</span></span>
                    </div>

                    <div class="chart-box">
                        <div class="d-flex flex-column" style="gap:5px">
                            <div class="d-flex align-center">
                                <v-icon size="19" color="var(--main-color)">mdi-text</v-icon>
                                <span class="ml-1" style="font-size: 0.9em;">basic questions: <span style="color: var(--main-color)">{{ test.info.testInfo.bq }}</span></span>
                            </div>
                            <div class="d-flex align-center">
                                <v-icon size="19" color="var(--main-color)">mdi-image-outline</v-icon>
                                <span class="ml-1" style="font-size: 0.9em;">questions with images: <span style="color: var(--main-color)">{{ test.info.testInfo.qwi }}</span></span>
                            </div>
                            <div class="d-flex align-center">
                                <v-icon size="19" color="var(--main-color)">mdi-selection-ellipse-arrow-inside</v-icon>
                                <span class="ml-1" style="font-size: 0.9em;">questions with field: <span style="color: var(--main-color)">{{ test.info.testInfo.qwf }}</span></span>
                            </div>
                        </div>

                        <div style="width:100%; height: auto">
                            <canvas :id="`questionsChart-${test._id}`" width="250" height="250"></canvas>
                        </div>
                    </div>
                </div>

                <v-divider class="mt-5 mb-5" v-if="test.info.testInfo.qbThDif && test.info.testInfo.qbThDif.length"></v-divider>

                <div
                class="w-100 d-flex flex-column"
                style="gap:20px"
                v-if="test.info.testInfo.qbThDif && test.info.testInfo.qbThDif.length"
                >
                    <!-- by theme -->
                    <div>
                        <div class="d-flex align-center">
                            <v-icon color="var(--main-color)" size="19">mdi-alpha-t-box-outline</v-icon>
                            <span class="ml-1" style="font-size: 0.9em;">Statistics of questions by themes:</span>
                        </div>
                            
                        <v-table density="compact">
                            <tbody>
                                <tr v-for="(item, i) in test.info.testInfo.qbThDif" :key="i">
                                    <td><span style="color: var(--main-color)">{{ i+1 }}.</span> {{ getThemeName(item.theme) }}:</td>
                                    <td>
                                        <p><b>{{ item.count }}</b></p>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>

                    <v-divider v-if="test.info.testInfo.qbThDif[0].easy"></v-divider>
                    
                    <!-- by difficult -->
                    <div v-if="test.info.testInfo.qbThDif[0].easy">
                        <div class="d-flex align-center">
                            <v-icon color="var(--main-color)" size="19">mdi-chart-line</v-icon>
                            <span class="ml-1" style="font-size: 0.9em;">Statistics of questions by difficulty:</span>
                        </div>

                        <div>
                            <v-table density="compact">
                                <tbody>
                                    <tr v-for="(item, i) in test.info.testInfo.qbThDif" :key="i">
                                        <td><span style="color: var(--main-color)">{{ i+1 }}.</span> {{ getThemeName(item.theme) }}:</td>
                                        <td class="pt-1 pb-1">
                                            <p>• easy: <b>{{ item.easy }}</b></p>
                                            <p>• medium: <b>{{ item.medium }}</b></p>
                                            <p>• hard: <b>{{ item.hard }}</b></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
                    </div>
                </div>
            </div>

           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSubject, getAuthor, getDate, getLanguages, getThemes, getTheme } from '@/plugins/getInfo'
import Chart from 'chart.js/auto'

export default {
    props: {
        test: Object
    },
    data(){
        return {
            dialog: false,
            chartAvaible:false
        }
    },
    computed: mapGetters(['getSubjects', 'getUsersList']),
    methods: {
        getThemeName(theme){
            return getTheme(this.test.info.params.subject, theme, this.getSubjects)
        },
        getTestDate(type){
            if(type=='creation'){
                return getDate(this.test.history[0].date)
            }
            if(type=='signing'){
                const target = this.test.history.findLast(item => item.type=='signed')
                return getDate(target.date)
            }
        },
        getTestAuthor(){
            return getAuthor(this.test.author, this.getUsersList)
        },
        getTestSubject(){
            return getSubject(this.test.info.params.subject, this.getSubjects)
        },
        getTestThemes(){
            return getThemes(this.test.info.params.subject, this.test.info.params.themes, this.getSubjects)
        },
        getTestLanguages(){
            return getLanguages(this.test.info.params.languagesSettings.languages)
        }
    },
    watch:{
        dialog(){
            if(this.dialog && !this.chartAvaible ){
                setTimeout(()=> {
                    const ctx = document.querySelector(`#questionsChart-${this.test._id}`)
                    new Chart(ctx, {
                        type: 'pie',
                        data: {
                        labels: [
                            'basic questions',
                            'questions with images',
                            'questions with field',
                        ],
                        datasets: [{
                            data: [this.test.info.testInfo.bq, this.test.info.testInfo.qwi, this.test.info.testInfo.qwf],
                            backgroundColor: [
                            '#0d5fd8',
                            '#444',
                            '#0c2242'
                            ],
                            hoverOffset: 4
                        }]
                        },
                        options: {
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        }
                    })
                    this.chartAvaible = true
                },500)
            }
            else if(!this.dialog && this.chartAvaible){
                this.chartAvaible = false
            }
        }
    }
}
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px; /* ширина для вертикального скролла */
    background-color: #b9b9b9;
}

.dialog{
    width: 50vw;
    position: relative;
}
.dialog__content{
    padding: 20px;
    background-color: #fff;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.chart-box{
    display: grid;
    grid-template-columns: 1.2fr 0.7fr;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
}
</style>
