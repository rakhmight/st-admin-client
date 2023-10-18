<template>
    <div class="columns">
        <div></div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="examsIntervalRadio"
            >
                <v-radio
                    label="at the command of the examinee"
                    value="on-command"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="through the interval"
                    value="interval"
                ></v-radio>
            </v-radio-group>
        </div>

        <div class="d-flex flex-row" style="gap: 5px" v-if="examsIntervalRadio=='interval'">
            <div style="width: 90px;">
                <v-text-field
                density="compact"
                variant="outlined"
                type="number"
                label="Time"
                v-model.number="examsInterval"
                min="0"
                ></v-text-field>
            </div>
            <span class="mt-2">seconds</span>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        paramsManagement: Function,
        switchTests: Boolean
    },
    data(){
        return {
            examsIntervalRadio: undefined,
            examsInterval: undefined
        }
    },
    watch:{
        examsIntervalRadio(){
            if(this.examsIntervalRadio=='on-command'){
                this.paramsManagement(undefined, 'exams-interval', null)
            } else {
                this.examsInterval = undefined
                this.paramsManagement(undefined, 'exams-interval', undefined)
            }
        },

        examsInterval(){
            if(this.examsInterval>=0){
                this.paramsManagement(undefined, 'exams-interval', this.examsInterval)
            } else {
                this.paramsManagement(undefined, 'exams-interval', undefined) 
            }
        },

        switchTests(){
            this.examsInterval = undefined
            this.examsIntervalRadio = undefined
        }
    }
}
</script>
