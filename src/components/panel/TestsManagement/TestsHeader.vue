<template>
    <div class="d-flex flex-row justify-space-between align-center mb-2">
        <subtitle-component :subtitle="'All tests'" v-if="window=='all'" />
        <subtitle-component :subtitle="'Private tests'" v-if="window=='private'" />
        <subtitle-component :subtitle="'Public tests'" v-if="window=='public'" />
        <subtitle-component :subtitle="'Examination tests'" v-if="window=='examination'" />
        <subtitle-component :subtitle="'Blocked tests'" v-if="window=='blocked'" />
        <!-- Sort -->
        
        <div>
            <v-tooltip location="top">
                <template v-slot:activator="{ props: tooltip }">
                    <v-btn
                    color="var(--main-color)"
                    v-bind="tooltip"
                    height="25"
                    @click="getTestsList()"
                    >
                    <v-icon color="#fff">mdi-list</v-icon>
                    </v-btn>
                </template>
                <span>Get test list</span>
            </v-tooltip>

            <v-menu
            transition="slide-y-transition"
            location="bottom center"
            >
            <template v-slot:activator="{ props: menu  }">
                <v-tooltip location="top">
                    <template v-slot:activator="{ props: tooltip }">
                        <v-btn
                        color="var(--main-color)"
                        v-bind="mergeProps(menu, tooltip)"
                        height="25"
                        >
                        <v-icon color="#fff">mdi-sort</v-icon>
                        </v-btn>
                    </template>
                    <span>Sort</span>
                </v-tooltip>
            </template>
                <v-list density="compact">
                    <v-list-item>
                        <v-list-item-title>
                            <v-icon size="13" class="mr-1">mdi-play</v-icon>
                            <span class="menu-text">by adding date</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="window=='all'">
                        <v-list-item-title>
                            <v-icon size="13" class="mr-1">mdi-play</v-icon>
                            <span class="menu-text">by status</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>
                            <v-icon size="13" class="mr-1">mdi-play</v-icon>
                            <span class="menu-text">by questions count</span>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>



<script>
import { mergeProps } from 'vue'
import SubtitleComponent from '@/components/SubtitleComponent';

export default {
    props:{
        window: String,
        getTestsList: Function
    },
    methods: {
      mergeProps,
    },
    components:{
        SubtitleComponent
    }
}
</script>