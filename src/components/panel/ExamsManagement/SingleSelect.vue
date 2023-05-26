<template>
    <div>
        <div class="d-flex flex-row justify-space-between align-center">
            <div class="d-flex flex-row align-center mb-2">
                <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                <span class="ml-1">Choose examinees</span>
            </div>

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
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">by editing date</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">by role</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
            </v-menu>
        </div>

        <v-table
        density="compact"
        style="font-size: 0.9em"
        v-if="!reRenderSingle"
        >
            <thead>
            <tr>
                <th class="text-left">
                #
                </th>
                <th class="text-left">
                Full name
                </th>
                <th class="text-left">
                Info
                </th>
                <th class="text-left">
                Action
                </th>
            </tr>
            </thead>
            <tbody>

                <!--  -->
                <user-from-table
                v-for="(user, i) in getUsersList"
                :key="i"
                :user="user"
                :index="i+1"
                :users="users"
                :choisingUser="choisingUser"
                />

            </tbody>
        </v-table>

        <data-empty :text="'User list is empty'" v-if="!getUsersList.length"/>
    </div>
</template>

<script>
import { mergeProps } from 'vue'
import { mapGetters } from 'vuex';
import UserFromTable from '@/components/panel/ExamsManagement/UserFromTable.vue';
import DataEmpty from '@/components/DataEmpty.vue';

export default {
    props:{
        users: Array,
        choisingUser: Function,
        reRenderSingle: Boolean
    },
    computed: mapGetters(['getUsersList', 'getDepartments']),
    methods: {
      mergeProps,
    },
    components:{
        UserFromTable,
        DataEmpty
    }
}
</script>
