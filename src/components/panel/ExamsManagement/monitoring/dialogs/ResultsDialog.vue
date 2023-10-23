<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
           <v-list-item v-bind="props">
               <v-list-item-title class="d-flex align-center">
                   <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-file-document-outline</v-icon>
                   <span class="menu-text">Get report</span>
               </v-list-item-title>
           </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: #fff">{{ getUserName() }} - exam results </span>
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


           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
import makeReq from '@/services/makeReq'
import { mapGetters } from 'vuex'

export default {
    props: {
        user: Object,
        getUserName: Function
    },
   data(){
       return {
            dialog: false
       }
   },
   computed: mapGetters(['getAuthParams']),
   methods:{
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
.alerts{
   position: absolute;
   width: 100%;
   margin-top: 10px;
}
</style>
