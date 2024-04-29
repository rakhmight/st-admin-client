<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>
        
        <div v-if="existBallSystem && ballSystemEqual || difficultyExist">
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="examBallSystemRadio"
            >
                <v-radio
                    label="use existing"
                    value="exists"
                    class="mb-2"
                    v-if="existBallSystem && ballSystemEqual"
                ></v-radio>
                <v-radio
                    label="custom"
                    value="custom"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="by difficulty"
                    value="by-difficulty"
                    v-if="difficultyExist"
                ></v-radio>
            </v-radio-group>
        </div>

        <div class="d-flex flex-row" style="gap: 15px" v-if="examBallSystemRadio=='custom'">            
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For currect answer"
            v-model.number="balls.currect"
            min="0"
            ></v-text-field>
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For uncurrect answer"
            v-model.number="balls.uncurrect"
            min="0"
            ></v-text-field>
        </div>

        <div class="d-flex flex-column" style="gap: 15px" v-if="examBallSystemRadio=='by-difficulty'">
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For currect EASY difficulty answer"
            v-model.number="balls.easy"
            min="0"
            ></v-text-field>
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For currect MEDIUM difficulty answer"
            v-model.number="balls.medium"
            min="0"
            ></v-text-field>
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For currect HARD difficulty answer"
            v-model.number="balls.hard"
            min="0"
            ></v-text-field>
            <v-text-field
            density="compact"
            variant="outlined"
            type="number"
            label="For uncurrect answer"
            v-model.number="balls.uncurrect"
            min="0"
            ></v-text-field>
        </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex';

export default {
    props:{
        exam: Object,
        paramsManagement: Function,
        complex: Array,
        switchTests: Boolean,
        difficultyExist: Boolean,
        potentialParam: Object | null | undefined
    },
    data(){
        return {
            examBallSystemRadio: undefined,
            balls: {
                currect: undefined,
                uncurrect: undefined
            },
            existBallSystem: undefined,
            ballSystemEqual: false,

            potentialParamInjection: false
        }
    },
    watch:{
        examBallSystemRadio(){
            if(this.examBallSystemRadio=='exists'){
                this.balls = null
            } else if(this.examBallSystemRadio=='custom') {
                if(!this.potentialParamInjection){
                    this.balls = {
                        currect: undefined,
                        uncurrect: undefined
                    } 
                } else this.potentialParamInjection = false
            } else if(this.examBallSystemRadio=='by-difficulty'){
                if(!this.potentialParamInjection){
                    this.balls ={
                        easy: undefined,
                        medium: undefined,
                        hard: undefined,
                        uncurrect: undefined
                    }
                } else this.potentialParamInjection = false
            }
        },
        'balls.currect'(){
            console.log(this.balls);
            if(this.balls!=null){
                if(this.balls.currect>0 && this.balls.uncurrect>=0){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                    console.log(2222);
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        'balls.uncurrect'(){
            console.log(this.balls);
            if(this.difficultyExist){
                if(this.balls!=null){
                    if(this.examBallSystemRadio=='by-difficulty'){
                        if(this.balls.easy>0 && this.balls.medium>0 && this.balls.hard>0 && this.balls.uncurrect>=0){
                            this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                        } else {
                            this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                        }
                    } else if(this.examBallSystemRadio=='custom'){
                        if(this.balls.currect>0 && this.balls.uncurrect>=0){
                            this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                        } else {
                            this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                        }
                    }
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                }
            } else {
                if(this.balls!==null){
                    if(this.balls.currect>0 && this.balls.uncurrect>=0){
                        this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                    } else {
                        this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                    }
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                }
            }
        },
        'balls.easy'(){
            if(this.balls!==null){
                if(this.balls.easy>0 && this.balls.medium>0 && this.balls.hard>0 && this.balls.uncurrect>=0){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        'balls.medium'(){
            if(this.balls!==null){
                if(this.balls.easy>0 && this.balls.medium>0 && this.balls.hard>0 && this.balls.uncurrect>=0){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        'balls.hard'(){
            if(this.balls!==null){
                if(this.balls.easy>0 && this.balls.medium>0 && this.balls.hard>0 && this.balls.uncurrect>=0){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        switchTests(){
            this.ballSystemExistAndDifficulty()
            
            if(this.existBallSystem){
                this.checkBallsEquality()
            }
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        ballSystemExistAndDifficulty(){
            this.examBallSystemRadio = undefined
            let bsCount = 0

            this.exam.tests.forEach(test=>{
                const target = this.getTestImages.find(image=>image.fileName==test)

                if(target.info.params.ballSystem){
                    bsCount++
                }
            })
            if(this.exam.tests.length==bsCount){
                this.existBallSystem = true
                this.examBallSystemRadio = undefined
            } else if(!this.difficultyExist && this.exam.tests.length!=bsCount) {
                this.existBallSystem = false
                this.examBallSystemRadio = 'custom'
            }
        },

        checkBallsEquality(){
            let isEqual = false
            let lastMin
            let lastMax
            let stopChecking = false

            // first max & min
            const target = this.getTestImages.find(image=>image.fileName==this.exam.tests[0])
            lastMin = target.info.params.ballSystem.min
            lastMax = target.info.params.ballSystem.max

            // check equality
            if(!stopChecking){
                this.exam.tests.forEach(test=>{
                    const target = this.getTestImages.find(image=>image.fileName==test)

                    if(target.info.params.ballSystem.min == lastMin){
                        lastMin = target.info.params.ballSystem.min
                        isEqual = true
                    } else {
                        stopChecking = true
                    }

                    if(target.info.params.ballSystem.max == lastMax){
                        lastMax = target.info.params.ballSystem.max
                        isEqual = true
                    } else {
                        stopChecking = true
                    }
                })

                if(isEqual){
                    this.ballSystemEqual = true
                }
            } else {
                this.examBallSystemRadio = false
                return
            }
        }
    },
    mounted(){
        this.ballSystemExistAndDifficulty()
        if(this.existBallSystem){
            this.checkBallsEquality()
        }

        if(this.potentialParam){
            this.potentialParamInjection = true

            if(this.potentialParam.currect){
                this.examBallSystemRadio ='custom'
                this.balls.currect = this.potentialParam.currect
                this.balls.uncurrect = this.potentialParam.uncurrect
            }else if(this.potentialParam.easy && this.potentialParam.medium && this.potentialParam.hard){
                this.examBallSystemRadio ='by-difficulty'
                this.balls.uncurrect = this.potentialParam.uncurrect
                this.balls.easy = this.potentialParam.easy
                this.balls.medium = this.potentialParam.medium
                this.balls.hard = this.potentialParam.hard
            }
        } else if(this.potentialParam === null){
            this.examBallSystemRadio ='exists'
        }
    }
}
</script>