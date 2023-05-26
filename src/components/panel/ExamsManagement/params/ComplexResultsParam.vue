<template>
    <div class="columns">
        <div></div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="complexResultsRadio"
            >
                <v-radio
                    label="after every exam"
                    value="regularly"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="after passing all exams"
                    value="finally"
                ></v-radio>
            </v-radio-group>
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
            complexResultsRadio: undefined
        }
    },
    watch:{
        complexResultsRadio(){
            this.paramsManagement(undefined, 'complex-results', this.complexResultsRadio)
        },

        switchTests(){
            this.complexResultsRadio = undefined
        }
    }
}
</script>
