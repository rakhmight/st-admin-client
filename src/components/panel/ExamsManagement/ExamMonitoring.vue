<template>
    <div class="content d-flex flex-column" style="gap:30px">
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
            <div class="actions d-flex justify-space-between">
                <div class="d-flex" style="gap: 40px">
                    <div>  
                        <div v-if="!getCurrentExam.hasBegun && getCurrentExam.examDateParams.start.byCommand">
                            <v-tooltip>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    v-bind="props"
                                    icon="mdi-play"
                                    variant="text"
                                    density="compact"
                                    color="var(--main-color)"
                                    @click="updateExam(getCurrentExam, 'begun')"
                                    >
                                    </v-btn>
                                </template>
                                <span>Start exam</span>
                            </v-tooltip>
                        </div>
                        <div v-if="getCurrentExam.hasBegun && getCurrentExam.examDateParams.end.byCommand">
                            <v-tooltip>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    v-bind="props"
                                    icon="mdi-stop"
                                    variant="text"
                                    density="compact"
                                    color="var(--red-color)"
                                    @click="updateExam(getCurrentExam, 'stopped')"
                                    >
                                    </v-btn>
                                </template>
                                <span>Stop exam</span>
                            </v-tooltip>
                        </div>
                    </div>

                    <div class="d-flex" style="gap:7px">
                        <div>
                            <v-tooltip>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    v-bind="props"
                                    icon="mdi-restart"
                                    variant="text"
                                    density="compact"
                                    color="#ffa03b"
                                    >
                                    </v-btn>
                                </template>
                                <span>Mulligan management</span>
                            </v-tooltip>
                        </div>
                        <div>
                            <v-tooltip>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    v-bind="props"
                                    icon
                                    variant="text"
                                    density="compact"
                                    color="var(--main-color)"
                                    >
                                        <v-icon size="22px">mdi-file-document-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>Get results</span>
                            </v-tooltip>
                        </div>
                        <div>
                            <v-tooltip>
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    v-bind="props"
                                    icon
                                    variant="text"
                                    density="compact"
                                    color="var(--main-color)"
                                    >
                                        <v-icon size="22px">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit params of exam</span>
                            </v-tooltip>
                        </div>
                    </div>
                </div>

                <div class="d-flex" style="gap: 7px">
                    <div>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                v-bind="props"
                                icon
                                variant="text"
                                density="compact"
                                color="#858585"
                                >
                                    <v-icon size="22px">mdi-archive-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Archive exam</span>
                        </v-tooltip>
                    </div>
                    <div>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                v-bind="props"
                                icon
                                variant="text"
                                density="compact"
                                color="var(--red-color)"
                                >
                                    <v-icon size="22px">mdi-delete-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Delete exam</span>
                        </v-tooltip>
                    </div>
                </div>
            </div>

            <v-divider />

            <div class="exam-info d-flex flex-column" style="gap: 15px">
                
                <!-- TODO: Complex params -->
                <div class="d-flex" style="gap: 60px">
                    <v-table density="compact" style="font-size: 0.9rem">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="small">mdi-access-point</v-icon>
                                        <span>Status:</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <span v-if="getCurrentExam.isActive && getCurrentExam.hasBegun" style="color: var(--main-color)">Active</span>
                                        <span v-if="getCurrentExam.isActive && !getCurrentExam.hasBegun" style="color: var(--red-color)">Stopped</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-table density="compact" style="font-size: 0.9rem">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="small">mdi-alarm</v-icon>
                                        <span>Exam start:</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <span v-if="getCurrentExam.examDateParams.start.byCommand" style="color: var(--main-color)">by admin</span>
                                        <span v-if="!getCurrentExam.examDateParams.start.byCommand" style="color: var(--main-color)">{{ getCurrentExam.examDateParams.start.time }} {{ getCurrentExam.examDateParams.start.date }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="small">mdi-alarm</v-icon>
                                        <span>Exam end:</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <span v-if="getCurrentExam.examDateParams.end.byCommand" style="color: var(--main-color)">by admin</span>
                                        <span v-if="!getCurrentExam.examDateParams.start.byCommand" style="color: var(--main-color)">{{ getCurrentExam.examDateParams.end.time }} {{ getCurrentExam.examDateParams.end.date }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-table density="compact" style="font-size: 0.9rem" v-if="getCurrentExam.complex.length>1">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="19px">mdi-order-numeric-ascending</v-icon>
                                        <span>Order:</span>
                                    </div>
                                </td>
                                <td>
                                    <p v-for="(ex, i) in getCurrentExam.params.complex.examsOrder" :key="ex">
                                        <span style="color: var(--main-color)">{{ i+1 }}.</span> {{ getSubjectName(ex) }}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-table density="compact" style="font-size: 0.9rem" v-if="getCurrentExam.complex.length>1">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="small">mdi-check-decagram-outline</v-icon>
                                        <span>Order of results display:</span>
                                    </div>
                                </td>
                                <td>
                                    <p v-if="getCurrentExam.params.complex.complexResults=='regularly'">after each module exam</p>
                                    <p v-if="getCurrentExam.params.complex.complexResults=='finally'">after all modules</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex justify-start align-center" style="gap: 5px">
                                        <v-icon color="var(--main-color)" size="small">mdi-timer-outline</v-icon>
                                        <span>Order of transition to the next module:</span>
                                    </div>
                                </td>
                                <td>
                                    <p v-if="getCurrentExam.params.complex.examsInterval != null">timeout {{ getCurrentExam.params.complex.examsInterval }} sec.</p>
                                    <p v-else>by examinee command (click to button)</p>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>

                <div class="d-flex justify-space-between">
                    <p style="color: #888">Exam params</p>
                    
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            :icon="showExamParams ? 'mdi-menu-up' : 'mdi-menu-down'"
                            variant="text"
                            density="compact"
                            color="#888"
                            @click="showExamParamsPanel"
                            >
                            </v-btn>
                        </template>
                        <span v-if="!showExamParams">Show params</span>
                        <span v-else>Hide params</span>
                    </v-tooltip>
                </div>

                <div v-if="showExamParams" class="d-flex flex-column" style="gap: 40px">
                    <div class="d-flex justify-space-between" style="gap: 60px">
                    <!-- Main params -->
                        <v-table density="compact" style="font-size: 0.9rem; width: 150%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-alpha-s-box-outline</v-icon>
                                            <span>Subject:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ getSubjectName(mngtExam.subject) }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-alpha-t-box-outline</v-icon>
                                            <span>Themes:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            <p v-for="(theme , i) in getThemesName()" :key="i">{{ i+1 }}. {{ theme }}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-file-document-outline</v-icon>
                                            <span>Tests:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            <p v-for="(test , i) in mngtExam.tests" :key="i" style="color: var(--main-color)">{{ i+1 }}. {{ test }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>

                        <v-table density="compact" style="font-size: 0.9rem; width: 100%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-timer-outline</v-icon>
                                            <span>Exam time:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.examTime == null ? 'unlim' : mngtExam.params.examTime }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-timer-sand</v-icon>
                                            <span>Question time:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.questionTime==null ? 'unlim' : mngtExam.params.questionTime }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-ab-testing</v-icon>
                                            <span>Possibility change answer:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.changeAnswerPossibility ? 'yes' : 'no' }}</span>
                                        </div> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-chart-line</v-icon>
                                            <span>Exist difficulty:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.difficultyExist ? 'yes' : 'no' }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        
                        <v-table density="compact" style="font-size: 0.9rem; width: 100%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-ticket-outline</v-icon>
                                            <span>Tickets count:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.ticketsCount }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-help-circle-outline</v-icon>
                                            <span>Questions count in ticket:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.questionsCount }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-lightbulb-outline</v-icon>
                                            <span>Answers count:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ mngtExam.params.answersCount==null ? 'all' : mngtExam.params.answersCount }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-translate</v-icon>
                                            <span>Languages:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{{ getExamLanguages(mngtExam.params.languages) }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>

                    <!-- TODO: Results params -->
                    <div class="d-flex justify-space-between" style="gap: 60px">
                        <v-table density="compact" style="font-size: 0.9rem; width: 150%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-chart-bar</v-icon>
                                            <span>Ranking by th/dif:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1" v-if="!mngtExam.params.difficultyExist">
                                            <div v-if="mngtExam.params.themesRanking == null">
                                                <p>auto</p>
                                            </div>

                                            <div v-else>
                                                <table width="100%">
                                                    <tr v-for="(theme, i) in mngtExam.params.themesRanking" :key="theme">
                                                        <td><b>{{ i+1 }}. {{ getThemeName(mngtExam.subject, theme.theme) }}</b></td>
                                                        <td><span style="color: var(--main-color)">{{ theme.count }}</span></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="pt-1 pb-1" v-else>
                                            <div v-if="mngtExam.params.themesRanking == null">
                                                <p>auto</p>
                                            </div>

                                            <div v-else>
                                                <div v-for="(theme, i) in mngtExam.params.themesRanking" :key="theme">
                                                    <p><b>{{ i+1 }}. {{ getThemeName(mngtExam.subject, theme.theme) }}</b></p>
                                                    <table width="100%">
                                                        <tr>
                                                            <td>Easy:</td>
                                                            <td><span style="color: var(--main-color)">{{ theme.easy }}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Medium:</td>
                                                            <td><span style="color: var(--main-color)">{{ theme.medium }}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Hard:</td>
                                                            <td><span style="color: var(--main-color)">{{ theme.hard }}</span></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        
                        <v-table density="compact" style="font-size: 0.9rem; width: 100%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-adjust</v-icon>
                                            <span>Ball system:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1" v-if="mngtExam.params.ballSystem == null">
                                            <p>custom</p>
                                        </div>
                                        <div class="pt-1 pb-1" v-if="mngtExam.params.ballSystem != null">
                                            <table width="100%">
                                                <tr v-if="mngtExam.params.ballSystem.easy">
                                                    <td>Easy q.:</td>
                                                    <td>{{ mngtExam.params.ballSystem.easy }} ball</td>
                                                </tr>
                                                <tr v-if="mngtExam.params.ballSystem.medium">
                                                    <td>Medium q.:</td>
                                                    <td>{{ mngtExam.params.ballSystem.medium }} ball</td>
                                                </tr>
                                                <tr v-if="mngtExam.params.ballSystem.hard">
                                                    <td>Hard q.:</td>
                                                    <td>{{ mngtExam.params.ballSystem.hard }} ball</td>
                                                </tr>
                                                <tr v-if="mngtExam.params.ballSystem.currect">
                                                    <td>Currect q.:</td>
                                                    <td>{{ mngtExam.params.ballSystem.currect }} ball</td>
                                                </tr>
                                                <tr v-if="mngtExam.params.ballSystem.uncurrect || mngtExam.params.ballSystem.uncurrect==0">
                                                    <td>Uncurrect q.:</td>
                                                    <td>{{ mngtExam.params.ballSystem.uncurrect }} ball</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-percent-outline</v-icon>
                                            <span>Evaluation system:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            
                                            <table width="100%">
                                                <tr>
                                                    <td>
                                                        <span style="font-weight: 600; color: var(--main-color)">"5"</span> <span style="color: #888">(great)</span>
                                                    </td>
                                                    <td>{{ `${mngtExam.params.evaluationSystem.great.from}-${mngtExam.params.evaluationSystem.great.to} %` }}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span style="font-weight: 600; color: var(--main-color)">"4"</span> <span style="color: #888">(good)</span>
                                                    </td>
                                                    <td>{{ `${mngtExam.params.evaluationSystem.good.from}-${mngtExam.params.evaluationSystem.good.to} %` }}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span style="font-weight: 600; color: var(--main-color)">"3"</span> <span style="color: #888">(satisfactorily)</span>
                                                    </td>
                                                    <td>{{ `${mngtExam.params.evaluationSystem.satisfactorily.from}-${mngtExam.params.evaluationSystem.satisfactorily.to} %` }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        
                        <v-table density="compact" style="font-size: 0.9rem; width: 100%; text-align: start;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-text-box-check-outline</v-icon>
                                            <span>Show results:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            <p>{{ mngtExam.params.showResults ? 'yse' : 'no' }}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="mngtExam.params.showResults">
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-clock-outline</v-icon>
                                            <span>Result display time:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            <p v-if="mngtExam.params.resultDisplayTime==null">unlim</p>
                                            <p v-else>{{ mngtExam.params.resultDisplayTime }} sec.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="mngtExam.params.showResults">
                                    <td>
                                        <div class="d-flex justify-start align-center pt-1" style="gap: 5px">
                                            <v-icon color="var(--main-color)" size="small">mdi-send</v-icon>
                                            <span>Displayed in result:</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="pt-1 pb-1">
                                            <p>{{ getDisplayedResults(mngtExam.params.displayedResultParams) }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="mngtExam">
            <v-table density="compact">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Info</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Result</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="user in getCurrentExam.users" :key="user">
                        <td>
                            <div class="pt-2 pb-2 d-flex flex-row align-center">
                                <div style="width: 40px; height: 40px;">
                                    <v-img :src="`${this.getAuthServerIP}/public/avatars/${user}.png`"></v-img>
                                </div>
                                <span class="ml-2">{{ getUserName(user) }}</span>
                            </div>
                        </td>
                        <td>
                            <user-info v-if="getUser(user)!=null" :user="getUser(user)" />
                            <div v-else>null</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
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
                                            <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-stop</v-icon>
                                            <span class="menu-text">Stop exam</span>
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title class="d-flex align-center">
                                            <v-icon size="18" class="mr-1" color="#ffa03b">mdi-pause</v-icon>
                                            <span class="menu-text">Pause exam</span>
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title class="d-flex align-center">
                                            <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-file-document-outline</v-icon>
                                            <span class="menu-text">Get report</span>
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

 <script>
import { mapGetters } from 'vuex';
import { getSubject, getThemes, getLanguages, getTheme } from '@/plugins/getInfo'
import UserInfo from './UserInfo.vue';

 export default {
    props: {
        updateExam: Function
    },
    data(){
        return {
            tab: undefined,
            mngtExam: undefined,
            showExamParams: false
        }
    },
    components: {
        UserInfo
    },
    computed: mapGetters(['getCurrentExam', 'getSubjects', 'getUsersList', 'getAuthServerIP']),
    methods: {

        getThemeName(subject, theme){
            return getTheme(subject, theme, this.getSubjects)
        },

        getDisplayedResults(results){
            const displayedResults = []
            results.map(res=>{
                switch (res) {
                    case 'spentTime':
                        displayedResults.push('Spent Time')
                        break;
                    case 'showAStat':
                        displayedResults.push('Number of correct and incorrect answers')
                        break;
                    case 'ball':
                        displayedResults.push('Score (ball)')
                        break;
                    case 'percentage':
                        displayedResults.push('Percentage (%)')
                        break;
                    case 'eachQT':
                        displayedResults.push('Time spent on each question')
                        break;
                    case 'showSkipStat':
                        displayedResults.push('Answers skip statistics')
                        break;
                    case 'wrongThA':
                        displayedResults.push('Themes with the most wrong answers')
                        break;
                    case 'wrongQ':
                        displayedResults.push('Show wrong answered questions')
                        break;
                    case 'wrongQA':
                        displayedResults.push('Show wrong answered questions & answers')
                        break;
                    default:
                        break;
                }

            })
            
            return displayedResults.join(', ')
        },

        getExamLanguages(languages){
            return getLanguages(languages)
        },

        getSubjectName(subject){
            return getSubject(subject, this.getSubjects)
        },

        getUserName(id){
            const user = this.getUsersList.find(u => u.id == id)
            if(user) return `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`
            else return 'unknown'
        },

        getUser(id){
            const user = this.getUsersList.find(u => u.id == id)
            if(user) return user
            else return null
        },

        showExamParamsPanel(){
            this.showExamParams = !this.showExamParams
        },

        getThemesName(){
            const themes = []
            if(this.mngtExam.params.themes!=null){
                this.mngtExam.themes.map(th => {
                    if(this.mngtExam.params.themes.indexOf(th)) themes.push(th)
                })
            } else themes.push(...this.mngtExam.themes)

            const output =  getThemes(this.mngtExam.subject, themes, this.getSubjects)
            return output.split(', ')
        },
    },
    watch: {
        tab(){
            this.mngtExam = this.getCurrentExam.complex.find(ce => ce.subject == this.tab)
        },
        getCurrentExam(){
            this.mngtExam = this.getCurrentExam.complex[0]
        }
    },
    mounted(){
        this.mngtExam = this.getCurrentExam.complex[0]
        console.log(this.getCurrentExam);
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