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

        <div>
            <div
            style="display:grid;grid-template-columns: 90% auto ; gap: 10px;"
            class="mr-1 mt-2"
            v-if="accessRu"
            >
                <v-text-field
                :label="section=='department' ? 'Department name' : 'Position name'"
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
                :label="section=='department' ? 'Название отдела/кафедры' : 'Название должности'"
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
                :label="section=='department' ? 'Бўлим/кафедра номи' : 'Лавозим номи'"
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
                :label="section=='department' ? `Bo'lim/kafedra nomi` : 'Mavzu nomi'"
                variant="outlined"
                density="compact"
                v-model="variants.uz_l"
                :error="uzLError.status"
                :error-messages="uzLError.msg"
                ></v-text-field>
                <v-img src="@/assets/media/uzbekistan.png" width="30" height="30" class="mt-1"></v-img>
            </div>
        </div>

        <div v-if="section=='department'">
            <v-radio-group v-model="depType" density="compact" :error="depTypeError.status" :error-messages="depTypeError.msg">
                <v-radio label="General department" value="general"></v-radio>
                <v-radio label="Chair" value="chair"></v-radio>
            </v-radio-group>
        </div>

        <div class="d-flex flex-row justify-center align-center">
            <v-btn
            density="compact"
            :color="blockAddBtn ? '#eee' : 'var(--main-color)'"
            class="mr-1"
            v-if="section=='department'"
            @click="addMethod('department')"
            :disabled="blockAddBtn"
            >
                <span style="font-size: 0.9em;" :style="blockAddBtn ? 'color: #444' : 'color:#fff' " v-if="!loader">Add department</span>
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
            v-if="section=='position'"
            @click="addMethod('position')"
            :disabled="blockAddBtn"
            >
                <span style="font-size: 0.9em;" :style="blockAddBtn ? 'color: #444' : 'color:#fff' " v-if="!loader">Add position</span>
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
            <span style="color:#fff; font-size: 0.9em;" v-if="section=='department'">New department added</span>
            <span style="color:#fff; font-size: 0.9em;" v-else>New position added</span>
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
            depType: undefined,

            accessRu:false,
            accessEng:false,
            accessUzL:false,
            accessUzK:false,

            ruError:{status:false, msg:undefined},
            engError:{status:false, msg:undefined},
            uzKError: {status:false, msg:undefined},
            uzLError: {status:false, msg:undefined},
            depTypeError: {status: false, msg: undefined},

            blockAddBtn: false,
            loader: false,
            reqSuccess: false
        }
    },
    mounted(){
        this.choisedLangs.push('ru')
        this.accessRu = true
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

        depType(){
            if(this.depType && this.section == 'department'){
                this.depTypeError.status = false
                this.depTypeError.msg = undefined
            }
        },

        'variants.ru'(){
            if(this.variants.ru){
                this.ruError.status = false
                this.ruError.msg = undefined
            }
        },
        'variants.eng'(){
            if(this.variants.eng){
                this.engError.status = false
                this.engError.msg = undefined
            }
        },
        'variants.uz_k'(){
            if(this.variants.uz_k){
                this.uzKError.status = false
                this.uzKError.msg = undefined
            }
        },
        'variants.uz_l'(){
            if(this.variants.uz_l){
                this.uzLError.status = false
                this.uzLError.msg = undefined
            }
        }
    },
    computed: mapGetters(['getAuthParams', 'getDepartments', 'getAdminServerIP', 'getCurrentDepartment']),
    methods:{
        ...mapMutations(['updateDepartments','setPositions','setCurrentPositions', 'setCurrentDepartments', 'updatePositions']),
        addMethod(type){
            console.log(type);
            // предварительная подготовка данных
            let data
            let newPosition = {
                name:{
                    ru: null,
                    eng: null,
                    uz_k: null,
                    uz_l: null
                }
            }

            if(type=='department'){
                data = {
                    name:{},
                    type: undefined
                }
            } else {
                data = {
                    id: this.getCurrentDepartment.id,
                    position: {},
                }
            }

            if(this.choisedLangs.includes('ru') && !this.variants.ru){
                this.ruError.msg = 'Fill in this field'
                return this.ruError.status = true
            }else{
                if(type=='department'){
                    data.name.ru = this.variants.ru
                } else{
                    newPosition.name.ru = this.variants.ru
                }
            }

            if(this.choisedLangs.includes('eng') && !this.variants.eng){
                this.engError.msg = 'Fill in this field'
                return this.engError.status = true
            }else{
                if(type=='department'){
                    data.name.eng = this.variants.eng
                } else{
                    newPosition.name.eng = this.variants.eng
                }
            }

            if(this.choisedLangs.includes('uz_k') && !this.variants.uz_k){
                this.uzKError.msg = 'Fill in this field'
                return this.uzKError.status = true
            }else{
                if(type=='department'){
                    data.name.uz_k = this.variants.uz_k
                } else{
                    newPosition.name.uz_k = this.variants.uz_k
                }
            }

            if(this.choisedLangs.includes('uz_l') && !this.variants.uz_l){
                this.uzLError.msg = 'Fill in this field'
                return this.uzLError.status = true
            }else{
                if(type=='department'){
                    data.name.uz_l = this.variants.uz_l
                } else{
                    newPosition.name.uz_l = this.variants.uz_l
                }
            }

            if(type=='department'){
                if(!this.depType){
                    this.depTypeError.status = true
                    return this.depTypeError.msg = 'Choise department type'
                } else {
                    data.type = this.depType
                }
            }

            if(type=='position'){
                data.position.name = newPosition.name
            }

            this.loader = true
            this.blockAddBtn = true

            let reqRoute = ''
            if(type=='department'){
                reqRoute = `${this.getAdminServerIP}/api/departments/add`
            } else {
                reqRoute = `${this.getAdminServerIP}/api/positions/add`
            }

            makeReq(reqRoute, 'POST', {
                auth:{
                    ...this.getAuthParams,
                },
                data:{
                    ...data
                }
            })
            .then(data=>{
                if(data.statusCode = 200){
                    this.loader = false
                    this.reqSuccess = true
                    if(type=='department'){
                        this.updateDepartments(data.data.department)
                    } else {
                        this.setPositions(data.data.positions)

                        this.setCurrentPositions(data.data.positions)
                        let target
                        this.getDepartments.forEach((dep, i) => {
                            if(dep.id==this.getCurrentDepartment.id){
                                target = i
                            }
                        });
                        this.updatePositions({index:target, positions: data.data.positions})
                    }

                    setTimeout(()=>{
                        if(type=='department'){
                            this.switchFunction('department')
                        } else {
                            this.switchFunction('position')
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
                    },1000)
                }
            })
            .catch(error=>{
                console.error(error)
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
