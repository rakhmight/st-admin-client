<template>
    <div>
        
        <div class="d-flex flex-row justify-space-between align-center mb-2">
            <subtitle-component :subtitle="'Exam client devices'" />
            <!-- Sort -->
            
            <div class="d-flex flex-row" style="gap:20px">
                <add-device />

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
                                    <span class="menu-text">all</span>
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>
                                    <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                    <span class="menu-text">only online</span>
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>
                                    <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                    <span class="menu-text">only offline</span>
                                </v-list-item-title>
                            </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
        
        <div>
            <v-table
            v-if="getDevices.length"
            density="compact"
            >
                <thead>
                <tr>
                    <th class="text-center" style="width:100px"></th>
                    <th class="text-center">ID</th>
                    <th class="text-center">
                    Status
                    </th>
                    <th class="text-center">
                    Actions
                    </th>
                </tr>
                </thead>

                <tbody>
                <tr
                v-for="(device, i) in getDevices"
                :key="i"
                >
                    <td class="pt-2 pb-2 text-center" style="width:100px">
                        <v-tooltip text="Tooltip">
                        <template v-slot:activator="{ props }">
                            <v-icon
                            v-bind="props"
                            size="35"
                            :color="device.status=='binding' ? '#c78d0a' : device.status=='online' ? 'var(--main-color)' : '#777'"
                            >
                                mdi-remote-desktop
                            </v-icon>
                        </template>
                        <span v-if="device.status=='binding'">waiting..</span>
                        <span v-if="device.status=='offline'">offline</span>
                        <span v-if="device.status=='online'">online</span>
                        </v-tooltip>
                    </td>
                    <td class="text-center">{{ device._id }}</td>
                    <td class="text-center">
                        <span style="color:#7c5807" v-if="device.status=='binding'">waiting for binding..</span>
                        <span style="color:#777" v-if="device.status=='offline'">offline</span>
                        <span style="color:var(--main-color)" v-if="device.status=='online'">online</span>
                    </td>

                    <td class="text-center">
                        <v-menu
                        transition="slide-y-transition"
                        >
                        <template v-slot:activator="{ props }">
                            <v-btn
                            color="var(--main-color)"
                            v-bind="props"
                            density="compact"
                            variant="text"
                            icon="mdi-dots-horizontal"
                            size="35"
                            >
                            </v-btn>
                        </template>
                        <v-list density="compact" min-width="120">
                            <v-list-item>
                                <v-list-item-title class="d-flex align-center">
                                    <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-plus</v-icon>
                                    <span class="menu-text">Some</span>
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title class="d-flex align-center">
                                    <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                    <span style="color:var(--red-color)" class="menu-text">Delete device</span>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>
                    </td>
                </tr>
                </tbody>
            </v-table>

            <data-empty :text="'No registered devices'" v-if="!getDevices.length"/>
        </div>
    </div>
</template>

<script>
import { mergeProps } from 'vue'
import SubtitleComponent from '@/components/SubtitleComponent';
import AddDevice from '@/components/panel/DevicesManagement/dialogs/AddDevice'
import { mapGetters } from 'vuex';
import DataEmpty from '@/components/DataEmpty.vue';

export default {
    methods: {
      mergeProps,
    },
    computed: mapGetters(['getDevices']),
    components:{
        SubtitleComponent,
        AddDevice,
        DataEmpty
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
