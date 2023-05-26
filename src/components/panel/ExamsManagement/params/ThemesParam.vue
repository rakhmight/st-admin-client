<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>

        <div>
            <v-radio-group
            color="var(--main-color)"
            density="compact"
            v-model="examThemesRadio"
            >
                <v-radio
                    label="yes"
                    :value="true"
                    class="mb-2"
                ></v-radio>
                <v-radio
                    label="not (use all)"
                    :value="false"
                ></v-radio>
            </v-radio-group>
        </div>

        <div v-if="examThemesRadio">
            <v-select
            density="compact"
            variant="outlined"
            label="Select themes"
            :items="examThemes"
            no-data-text="Choise test first"
            v-model="choisedThemes"
            multiple
            ></v-select>
        </div>
    </div>
</template>

<script>
import { getSubject, getTheme } from '@/plugins/getInfo'
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
            examThemesRadio: undefined,
            choisedThemes: [],
            
            examThemes: [],
            themesTemp: []
        }
    },
    watch:{
        examThemesRadio(){
            if(this.examThemesRadio===false){
                this.choisedThemes = null
            } else {
                this.choisedThemes = []
            }
        },

        choisedThemes(){
            if(this.examThemesRadio!==false){
                if(this.choisedThemes.length){
                    this.paramsManagement(this.exam.subject, 'themes', this.choisedThemes)
                } else {
                    this.paramsManagement(this.exam.subject, 'themes', undefined)
                }
            } else {
                this.paramsManagement(this.exam.subject, 'themes', this.choisedThemes)
            }
        },

        switchTests(){
            this.countThemes()
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        countThemes(){
            this.examThemes = []
            const themes = []

            this.exam.tests.forEach(test=>{
                const target = this.getTestImages.find(image=>image.fileName==test)

                target.info.params.themes.forEach(theme=>{
                    this.themesTemp.push(theme)
                })
            })

            this.themesHandler()
        },

        themesHandler(){
            const themes = new Set(this.themesTemp)

            themes.forEach(theme=>{
                this.examThemes.push({
                    title: getTheme(this.exam.subject, theme, this.getSubjects),
                    value: theme
                })
            })
        }
    },
    mounted(){
        this.countThemes()
    }
}
</script>