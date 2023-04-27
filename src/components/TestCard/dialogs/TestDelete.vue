<template>
    <v-dialog
       transition="dialog-top-transition"
       width="auto"
       v-model="dialog"
     >
       <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-list-item-title>
                    <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                    <span class="menu-text" style="color: var(--red-color)">Delete</span>
                </v-list-item-title>
            </v-list-item>
       </template>
       <template v-slot:default="{ isActive }">
         <div class="dialog">
           <v-toolbar
             color="var(--bg-special-color)"
           >
               <div class="pl-3 pr-3 d-flex flex-row align-center justify-space-between w-100">
                   <span class="text-h5" style="color: var(--red-color)">Delete test</span>
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

           </div>
         </div>
       </template>
     </v-dialog>
</template>

<script>
export default {
    data(){
        return {
            dialog: false
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
