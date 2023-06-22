<template>
    <div class="title">
        <div class="d-flex flex-row align-center justify-space-between mb-2">
            <span class="text-h6" v-if="section=='department'">Departments</span>
            <span class="text-h6" v-else>Positions</span>
            <div>
                <v-menu
                transition="slide-y-transition"
                location="bottom center"
                v-if="section=='department'"
                >
                <template v-slot:activator="{ props: menu  }">
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltip }">
                            <v-btn
                            color="var(--main-color)"
                            v-bind="mergeProps(menu, tooltip)"
                            density="compact"
                            icon
                            size="24"
                            class="mr-2"
                            >
                            <v-icon color="#fff" size="18">mdi-sort</v-icon>
                            </v-btn>
                        </template>
                        <span>Sort</span>
                    </v-tooltip>
                </template>
                    <v-list density="compact">
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">all</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">only generals</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">only chairs</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-tooltip :text="!status ? 'Add new' : 'Cancel'" location="left">
                <template v-slot:activator="{ props }">
                    <v-btn
                    v-bind="props"
                    density="compact"
                    :color="!status ? 'var(--main-color)' : 'var(--red-color)'"
                    size="24"
                    icon
                    class="mr-3"
                    @click="switchForm()"
                    v-if="section=='position' && getCurrentDepartment!==undefined || section=='department'"
                    >
                    <v-icon v-if="!status">mdi-plus</v-icon>
                    <v-icon size="19" v-else>mdi-window-close</v-icon>
                    </v-btn>
                </template>
                </v-tooltip>
            </div>
        </div>
        <v-divider></v-divider>
    </div>
</template>

<script>
import { mergeProps } from 'vue'
import { mapGetters } from 'vuex'

export default {
    props:{
        section: String,
        switchFunction: Function,
        status: Boolean
    },
    computed: mapGetters(['getCurrentDepartment']),
    methods:{
        switchForm(){
            if(this.section == 'department'){
                this.switchFunction('department')
            }else{
                this.switchFunction('position')
            }
        },
        
        mergeProps
    },
}
</script>


<style scoped>
.v-btn--icon{
    color: #fff
}
.v-list{
    padding: 0
}

</style>
