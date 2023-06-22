<template>
    <div class="columns">
        <div>
            <span style="color: var(--main-color)" v-if="complex.length>1">• {{ getSubjectName(exam.subject) }}</span>
        </div>
        
        <div>
            <v-select
            density="compact"
            variant="outlined"
            label="Select languages"
            :items="examLanguages"
            v-model="choisedLanguages"
            multiple
            no-data-text="Choise test first"
            ></v-select>
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
            examLanguages: [],
            choisedLanguages: [],
        }
    },
    watch:{
        choisedLanguages(){
            if(this.choisedLanguages.length){
                this.paramsManagement(this.exam.subject, 'exam-languages', this.choisedLanguages)
            } else {
                this.paramsManagement(this.exam.subject, 'exam-languages', undefined)
            }
        },
        switchTests(){
            this.countLanguages()
            this.paramsManagement(this.exam.subject, 'exam-languages', undefined)
            this.choisedLanguages = []
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages']),
    methods: {
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        countLanguages(){
            this.examLanguages = []
            let fr = 0
            let de = 0
            let ru = 0
            let eng = 0
            let uz_l = 0
            let uz_k = 0
            let custom = 0

            this.exam.tests.forEach(test=>{
                const target = this.getTestImages.find(image=> image.fileName==test)

                if(target.info.params.languagesSettings.languages.indexOf('fr')!=-1){
                    fr++
                }if(target.info.params.languagesSettings.languages.indexOf('de')!=-1){
                    de++
                }
                if(target.info.params.languagesSettings.languages.indexOf('ru')!=-1){
                    ru++
                }
                if(target.info.params.languagesSettings.languages.indexOf('eng')!=-1){
                    eng++
                }
                if(target.info.params.languagesSettings.languages.indexOf('uz_l')!=-1){
                    uz_l++
                }
                if(target.info.params.languagesSettings.languages.indexOf('uz_k')!=-1){
                    uz_k++
                }
                if(target.info.params.languagesSettings.languages.indexOf('custom')!=-1){
                    custom++
                }
            })

            if(fr==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'France',
                    value: 'fr'
                })
            }
            if(de==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'Deutsch',
                    value: 'de'
                })
            }
            if(ru==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'Русский',
                    value: 'ru'
                })
            }
            if(eng==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'English',
                    value: 'eng'
                })
            }
            if(uz_l==this.exam.tests.length){
                this.examLanguages.push({
                    title: "O'zbek",
                    value: 'uz_l'
                })
            }
            if(uz_k==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'Ўзбек',
                    value: 'uz_k'
                })
            }
            if(custom==this.exam.tests.length){
                this.examLanguages.push({
                    title: 'Foreign',
                    value: 'custom'
                })
            }
        }
    },
    mounted(){
        this.countLanguages()
    }
}
</script>
