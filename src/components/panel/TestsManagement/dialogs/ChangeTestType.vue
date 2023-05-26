<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
        
            <v-list-item  v-bind="props">
                <v-list-item-title class="d-flex align-center">
                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                    <span class="menu-text">Change type</span>
                </v-list-item-title>
            </v-list-item>

       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">Change test type</span>
                   <v-btn
                   density="compact"
                   icon
                   @click="dialog=false"
                   >
                       <v-icon color="var(--red-color)" size="30">mdi-close-box</v-icon>
                   </v-btn>
               </div>
           </v-toolbar>
           <div class="dialog__content">

            <!--  -->
            <v-select
            label="Choise test type"
            :items="types"
            variant="outlined"
            density="compact"
            v-model="testType"
            ></v-select>

            <div class="w-100 d-flex justify-center">
                <v-btn
                    density="compact"
                    :color="blockBtn ? '#eee' : 'var(--main-color)'"
                    width="200"
                    @click="changeTestType()"
                    :disabled="blockBtn"
                >
                <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Change type</span>
                <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                    v-else
                ></v-progress-circular>
                </v-btn>
            </div>

            <div class="alerts">
                <v-alert
                    density="compact"
                    color="var(--main-color)"
                    class="d-flex flex-row align-center mt-5"
                    v-if="success"
                >
                    <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                    <span style="color:#fff">Test type has changed successfully</span>
                </v-alert>
            </div>

           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq';
import { mapGetters, mapMutations } from 'vuex';

export default {
    props:{
        test: Object
    },
    data(){
        return {
            dialog: false,
            types: [
                {title: 'Public test', value: 'public'},
                {title: 'Private test', value: 'private'},
                {title: 'Examination test', value: 'exam'},
                {title: 'Blocked test', value: 'blocked'},
            ],
            blockBtn: false,
            loader: false,
            success: false,

            testType: this.test.type
        }
    },
    computed: mapGetters(['getAuthParams', 'getAdminServerIP']),
    methods:{
        ...mapMutations(['changeTestImage']),

        async changeTestType(){
            this.blockBtn = true
            this.loader = true

            await makeReq(`${this.getAdminServerIP}/api/test/changetype`, 'POST', {
                ...this.getAuthParams,
                data:{
                    id: this.test._id,
                    type: this.testType
                }
            })
            .then(data=>{
                if(data.statusCode==200){
                    this.success = true
                    this.loader = false

                    // изменение типа в стейте
                    this.changeTestImage({ operation: 'type', id:this.test._id, type: this.testType })

                    setTimeout(()=>{
                        this.blockBtn = false
                        this.success = false
                        this.testType = undefined
                        this.dialog = false
                    }, 3000)
                }
            })
        }
    }
}
</script>


<style scoped>
.dialog{
    width: 50vw;
    position: relative;
}
.dialog__content{
    padding: 20px;
    background-color: #fff;
}
</style>
