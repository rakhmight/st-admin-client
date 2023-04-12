<template>
    <div class="d-flex flex-row justify-space-between align-center mb-2">
        <subtitle-component :subtitle="'All tests'" v-if="window=='all'" />
        <subtitle-component :subtitle="'Limited tests'" v-if="window=='limited'" />
        <subtitle-component :subtitle="'Free tests'" v-if="window=='free'" />
        <subtitle-component :subtitle="'Examination tests'" v-if="window=='examination'" />
        <subtitle-component :subtitle="'Blocked tests'" v-if="window=='blocked'" />
        <!-- Sort -->
        
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
</template>



<script>
import { mergeProps } from 'vue'
import SubtitleComponent from '@/components/SubtitleComponent';

export default {
    props:{
        window: String
    },
    methods: {
      mergeProps,
    },
    components:{
        SubtitleComponent
    }
}
</script>