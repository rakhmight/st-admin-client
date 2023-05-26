<template>
    <div class="form pt-5">
        <v-select
            density="compact"
            placeholder="Languages"
            prepend-inner-icon="mdi-translate"
            variant="outlined"
            :items="languages"
            multiple
            v-model="choisedLangs"
            >
            </v-select>
            <v-select
            density="compact"
            placeholder="Chair"
            prepend-inner-icon="mdi-chair-rolling"
            variant="outlined"
            :items="chairs"
            v-model="chair"
            :error="chairError.status"
            :error-messages="chairError.msg"
            v-if="section=='subject'"
            >
            </v-select>
        <div>
            <div
            style="display:grid;grid-template-columns: 90% auto ; gap: 10px;"
            class="mr-1 mt-2"
            v-if="accessRu"
            >
                <v-text-field
                :label="section=='subject' ? 'Название предмета' : 'Название темы'"
                variant="outlined"
                density="compact"
                v-model="variants.ru"
                :error="ruError.status"
                :error-messages="ruError.msg"
                ></v-text-field>
                <v-img src="@/assets/media/russia.png" width="30" height="30" class="mt-1"></v-img>
            </div>
            <div
            style="display:grid;grid-template-columns: 90% auto ; gap: 10px;"
            class="mr-1 mt-2"
            v-if="accessEng"
            >
                <v-text-field
                :label="section=='subject' ? 'Subject name' : 'Theme name'"
                variant="outlined"
                density="compact"
                v-model="variants.eng"
                :error="engError.status"
                :error-messages="engError.msg"
                ></v-text-field>
                <v-img src="@/assets/media/united-states.png" width="30" height="30" class="mt-1"></v-img>
            </div>
            <div
            style="display:grid;grid-template-columns: 90% auto ; gap: 10px;"
            class="mr-1 mt-2"
            v-if="accessUzK"
            >
                <v-text-field
                :label="section=='subject' ? 'Фан номи' : 'Мавзу номи'"
                variant="outlined"
                density="compact"
                v-model="variants.uz_k"
                :error="uzKError.status"
                :error-messages="uzKError.msg"
                ></v-text-field>
                <v-img src="@/assets/media/uzbekistan.png" width="30" height="30" class="mt-1"></v-img>
            </div>
            <div
            style="display:grid;grid-template-columns: 90% auto ; gap: 10px;"
            class="mr-1 mt-2"
            v-if="accessUzL"
            >
                <v-text-field
                :label="section=='subject' ? `Fan nomi` : 'Mavzu nomi'"
                variant="outlined"
                density="compact"
                v-model="variants.uz_l"
                :error="uzLError.status"
                :error-messages="uzLError.msg"
                ></v-text-field>
                <v-img src="@/assets/media/uzbekistan.png" width="30" height="30" class="mt-1"></v-img>
            </div>
        </div>

        <div class="d-flex flex-row justify-center align-center">
            <v-btn
            density="compact"
            :color="blockAddBtn ? '#eee' : 'var(--main-color)'"
            class="mr-1"
            v-if="section=='subject'"
            @click="addMethod('subject')"
            :disabled="blockAddBtn"
            >
                <span style="font-size: 0.9em;" :style="blockAddBtn ? 'color: #444' : 'color:#fff' " v-if="!loader">Add subject</span>
                <v-progress-circular
                :width="1"
                size="15"
                color="var(--main-color)"
                indeterminate
                v-else
                ></v-progress-circular>
            </v-btn>
            <v-btn
            v-bind="props"
            density="compact"
            :color="blockAddBtn ? '#eee' : 'var(--main-color)'"
            class="mr-1"
            v-if="section=='theme'"
            @click="addMethod('theme')"
            :disabled="blockAddBtn"
            >
                <span style="font-size: 0.9em;" :style="blockAddBtn ? 'color: #444' : 'color:#fff' " v-if="!loader">Add theme</span>
                <v-progress-circular
                :width="1"
                size="15"
                color="var(--main-color)"
                indeterminate
                v-else
                ></v-progress-circular>
            </v-btn>
        </div>

        <v-alert
        density="compact"
        color="var(--main-color)"
        class="mt-3"
        v-if="reqSuccess"
        >
            <v-icon size="20" color="#fff" class="mr-1">mdi-check</v-icon>
            <span style="color:#fff; font-size: 0.9em;" v-if="section=='subject'">New subject added</span>
            <span style="color:#fff; font-size: 0.9em;" v-else>New theme added</span>
        </v-alert>

        <v-divider class="pb-3 mt-2"></v-divider>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/services/makeReq'

export default {
    props:{
        section: String,
        switchFunction: Function
    },
    data(){
        return {
            variants: {
                ru: null,
                eng: null,
                uz_l: null,
                uz_k: null
            },
            languages:[
                {title: 'Русский', value: 'ru',},
                {title: 'Ўзбекча', value: 'uz_k',},
                {title: "O'zbekcha", value: 'uz_l',},
                {title: 'English', value: 'eng',},
            ],
            choisedLangs:[],
            chair: undefined,
            chairs: [],

            accessRu:false,
            accessEng:false,
            accessUzL:false,
            accessUzK:false,

            ruError:{status:false, msg:''},
            engError:{status:false, msg:''},
            uzKError: {status:false, msg:''},
            uzLError: {status:false, msg:''},
            chairError: {status:false, msg:''},

            blockAddBtn: true,
            loader: false,
            reqSuccess: false
        }
    },
    mounted(){
        this.getDepartments.forEach(department=>{
            if(department.type == 'chair'){
                this.chairs.push({
                    title: department.name.ru,
                    value: department.id
                })
            }
        })
    },
    watch:{
        choisedLangs(){
            if(this.choisedLangs.length){
                this.blockAddBtn = false
            } else{
                this.blockAddBtn = true
            }


            if(this.choisedLangs.includes('ru')){
                this.accessRu = true
            }else{
                this.accessRu = false
            }
            
            if(this.choisedLangs.includes('eng')){
                this.accessEng = true
            }else{
                this.accessEng = false
            }
            
            if(this.choisedLangs.includes('uz_l')){
                this.accessUzL = true
            }else{
                this.accessUzL = false
            }
            
            if(this.choisedLangs.includes('uz_k')){
                this.accessUzK = true
            }else{
                this.accessUzK = false
            }
        },

        'variants.ru'(){
            if(this.variants.ru){
                this.ruError.status = false
                this.ruError.msg = ''
            }
        },
        'variants.eng'(){
            if(this.variants.eng){
                this.engError.status = false
                this.engError.msg = ''
            }
        },
        'variants.uz_k'(){
            if(this.variants.uz_k){
                this.uzKError.status = false
                this.uzKError.msg = ''
            }
        },
        'variants.uz_l'(){
            if(this.variants.uz_l){
                this.uzLError.status = false
                this.uzLError.msg = ''
            }
        },
        chair(){
            if(this.chair){
                this.chairError.status = false
                this.chairError.msg = ''
            }
        }
    },
    computed: mapGetters(['getCurrentSubject', 'getAuthParams', 'getSubjects', 'getDepartments', 'getAdminServerIP']),
    methods:{
        ...mapMutations(['updateSubjects','setThemes','updateCurrentSubjectThemes', 'setCurrentSubjectThemes', 'updateSubjectThemes']),
        addMethod(type){
            // предварительная подготовка данных
            let data
            let newTheme = {
                name:{
                    ru: null,
                    eng: null,
                    uz_k: null,
                    uz_l: null
                },
                id: undefined
            }

            if(type=='subject'){
                data = {
                    name:{},
                    themes:[],
                    counter: 1,
                    chair: undefined
                }
            } else {
                data = {
                    id: this.getCurrentSubject._id,
                    theme: {},
                }
            }

            // валидаторы
            if(type == 'subject'){
                if(!this.chair){
                    this.chairError.msg='Выберите кафедру, к которой принадлежит предмет'
                    return this.chairError.status = true
                } else {
                    data.chair = this.chair
                }
            }

            if(this.choisedLangs.includes('ru') && !this.variants.ru){
                this.ruError.msg = 'Заполните это поле'
                return this.ruError.status = true
            }else{
                if(type=='subject'){
                    data.name.ru = this.variants.ru
                } else{
                    newTheme.name.ru = this.variants.ru
                }
            }

            if(this.choisedLangs.includes('eng') && !this.variants.eng){
                this.engError.msg = 'Заполните это поле'
                return this.engError.status = true
            }else{
                if(type=='subject'){
                    data.name.eng = this.variants.eng
                } else{
                    newTheme.name.eng = this.variants.eng
                }
            }

            if(this.choisedLangs.includes('uz_k') && !this.variants.uz_k){
                this.uzKError.msg = 'Заполните это поле'
                return this.uzKError.status = true
            }else{
                if(type=='subject'){
                    data.name.uz_k = this.variants.uz_k
                } else{
                    newTheme.name.uz_k = this.variants.uz_k
                }
            }

            if(this.choisedLangs.includes('uz_l') && !this.variants.uz_l){
                this.uzLError.msg = 'Заполните это поле'
                return this.uzLError.status = true
            }else{
                if(type=='subject'){
                    data.name.uz_l = this.variants.uz_l
                } else{
                    newTheme.name.uz_l = this.variants.uz_l
                }
            }
            if(type=='theme'){
                data.theme = newTheme
            }

            this.loader = true
            this.blockAddBtn = true

            let reqRoute = ''
            if(type=='subject'){
                reqRoute = `${this.getAdminServerIP}/api/subjects/create`
            } else {
                reqRoute = `${this.getAdminServerIP}/api/themes/update`
            }

            makeReq(reqRoute, 'POST', {
                ...this.getAuthParams,
                data:{
                    ...data
                }
            })
            .then(data=>{
                if(data.statusCode = 200){
                    this.loader = false
                    this.reqSuccess = true
                    if(type=='subject'){
                        // заносим в state
                        this.updateSubjects(data.data)
                    } else {
                        this.setThemes(data.data)

                        this.setCurrentSubjectThemes(data.data)
                        let target
                        this.getSubjects.forEach((subject, i) => {
                            if(subject._id==this.getCurrentSubject._id){
                                target = i
                            }
                        });
                        this.updateSubjectThemes({index:target, themes: data.data})
                    }

                    setTimeout(()=>{
                        if(type=='subject'){
                            this.switchFunction('subject')
                        } else {
                            this.switchFunction('theme')
                        }
                        this.blockAddBtn = false
                        this.reqSuccess = false
                        this.choisedLangs = []
                        this.variants = {
                            ru: null,
                            eng: null,
                            uz_l: null,
                            uz_k: null
                        }
                    },3000)
                }
            })
        },
    }
}
</script>

<style scoped>
.v-list{
    padding: 0;
}
</style>
