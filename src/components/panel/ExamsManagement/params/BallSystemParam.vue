<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>
        
        <div v-if="existBallSystem && ballSystemEqual">
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="examBallSystemRadio"
            >
                <v-radio
                    label="use existing"
                    :value="true"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="custom"
                    :value="false"
                ></v-radio>
            </v-radio-group>
        </div>

        <div class="d-flex flex-row" style="gap: 15px" v-if="examBallSystemRadio==false">            
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
        switchTests: Boolean
    },
    data(){
        return {
            examBallSystemRadio: undefined,
            balls: {
                currect: undefined,
                uncurrect: undefined
            },
            existBallSystem: undefined,
            ballSystemEqual: false
        }
    },
    watch:{
        examBallSystemRadio(){
            if(this.examBallSystemRadio){
                this.balls = null
            } else {
                this.balls = {
                    currect: undefined,
                    uncurrect: undefined
                } 
            }
        },
        'balls.currect'(){
            if(this.balls!==null){
                if(this.balls.currect>0 && this.balls.uncurrect>=0 && this.balls.uncurrect!==''){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        'balls.uncurrect'(){
            if(this.balls!==null){
                if(this.balls.currect>0 && this.balls.uncurrect>=0 && this.balls.uncurrect!==''){
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
                } else {
                    this.paramsManagement(this.exam.subject, 'exam-ball-system', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'exam-ball-system', this.balls)
            }
        },
        switchTests(){
            this.ballSystemExist()
            
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

        ballSystemExist(){
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
            } else {
                this.existBallSystem = false
                this.examBallSystemRadio = false
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
        this.ballSystemExist()
        if(this.existBallSystem){
            this.checkBallsEquality()
        }
    }
}
</script>