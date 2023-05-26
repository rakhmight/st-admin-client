<template>
    <div class="form__step">

        <div class="columns">
            <div>
                <div class="d-flex flex-row align-center">
                    <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                    <span class="ml-1">Start exam:</span>
                </div>
            </div>

            <div>
                <v-radio-group
                v-model="startFormat"
                color="var(--main-color)"
                density="compact"
                >
                    <v-radio
                        label="at the command of the administrator"
                        value="byCommand"
                        class="mb-3"
                    ></v-radio>
                    <v-radio
                        label="according to the set date and time"
                        value="selected"
                    ></v-radio>
                </v-radio-group>
            </div>
            <div></div>
        </div>

        <div v-if="startFormat=='selected'">
            <v-divider></v-divider>

            <div class="columns" style="margin-top: 30px;">
                <div>
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Date and time of the start of the exam:</span>
                    </div>
                </div>

                <div>
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    type="date"
                    v-model="startDate"
                    :disabled="startByCommand"
                    ></v-text-field>

                    <v-text-field
                    density="compact"
                    variant="outlined"
                    type="time"
                    v-model="startTime"
                    :disabled="startByCommand"
                    ></v-text-field>
                </div>

                <div>
                    <v-checkbox
                    density="compact"
                    label="at the command of the administrator"
                    color="var(--main-color)"
                    v-model="startByCommand"
                    ></v-checkbox>
                </div>
            </div>

            

            <div class="columns" style="margin-top: 30px;">
                <div>
                    <div class="d-flex flex-row align-center">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Date and time of the end of the exam:
                            <v-tooltip text="Tooltip">
                            <template v-slot:activator="{ props }">
                                <v-icon size="18" color="#777" v-bind="props">mdi-information-outline</v-icon>
                            </template>
                            <span>the exam will also be automatically completed as soon as all users complete it</span>
                            </v-tooltip>
                        </span>
                    </div>
                </div>

                <div>
                    <v-text-field
                    density="compact"
                    variant="outlined"
                    type="date"
                    v-model="endDate"
                    :disabled="endByCommand"
                    ></v-text-field>

                    <v-text-field
                    density="compact"
                    variant="outlined"
                    type="time"
                    v-model="endTime"
                    :disabled="endByCommand"
                    ></v-text-field>
                </div>

                <div>
                    <v-checkbox
                    density="compact"
                    label="at the command of the administrator"
                    color="var(--main-color)"
                    v-model="endByCommand"
                    ></v-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props:{
        switchStartFormat: Function,
        installDateData: Function,
        examDateParams: Object
    },
    data(){
        return {
            startFormat: null,
            startDate: this.examDateParams.start.date,
            startTime: this.examDateParams.start.time,
            startByCommand: this.examDateParams.start.byCommand,
            endDate: this.examDateParams.end.date,
            endTime: this.examDateParams.end.time,
            endByCommand: this.examDateParams.end.byCommand
        }
    },
    watch:{
        startFormat(){
            this.switchStartFormat(this.startFormat)

            if(this.startFormat == 'byCommand'){
                this.startDate = undefined
                this.startTime = undefined
                this.startByCommand = true
                this.endDate = undefined
                this.endTime = undefined
                this.endByCommand = true
            }
        },

        startDate(){
            this.installDateData('startDate', this.startDate)
        },

        startTime(){
            this.installDateData('startTime', this.startTime)
        },

        startByCommand(){
            this.installDateData('startByCommand', this.startByCommand)
            if(this.startByCommand){
                this.startDate = undefined
                this.startTime = undefined
            }
        },

        endDate(){
            this.installDateData('endDate', this.endDate)
        },

        endTime(){
            this.installDateData('endTime', this.endTime)
        },

        endByCommand(){
            this.installDateData('endByCommand', this.endByCommand)
            if(this.endByCommand){
                this.endDate = undefined
                this.endTime = undefined
            }
        }
    }
}
</script>

<style scoped>
.form__step{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
}

.columns{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
}
</style>
