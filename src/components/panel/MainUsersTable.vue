<template>
    <div>
        <div class="d-flex flex-row justify-space-between align-center mb-2">
            <subtitle-component :subtitle="'Users who can have access to the system'" v-if="mode=='users'" />
            <subtitle-component :subtitle="'Section for managing signatures of system participants'" v-if="mode=='signs'" />
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

        <v-table density="compact">
            <thead>
            <tr>
                <th class="text-left">
                #
                </th>
                <th class="text-left">
                Member
                </th>
                <th class="text-left">
                Info
                </th>
                <th class="text-left">
                Role
                </th>
                <th class="text-left">
                Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <tr
            v-for="(member, i) in members"
            :key="i"
            >
                <td>{{ i+1 }}</td>
                <td>
                    <div class="pt-2 pb-2 d-flex flex-row align-center">
                        <div style="width: 40px; height: 40px;">
                            <v-img :src="`${this.getAuthServerIP}/public/avatars/${member.id}.png`"></v-img>
                        </div>
                        <span class="ml-2">{{ member.bio.lastName }} {{ member.bio.firstName }} {{ member.bio.patronymic }}</span>
                    </div>
                </td>
                <td>
                    <user-info :user="member" />
                </td>
                <td v-if="member.permission==0"><span style="color: var(--main-color)">User</span></td>
                <td v-if="member.permission==1"><span style="color: var(--main-color)">Author of tests</span></td>
                <td v-if="member.permission==2"><span style="color: var(--main-color)">Inspector</span></td>
                <td v-if="member.permission==3"><span style="color: var(--bg-special-color)">Administrator of system</span></td>
                <td>
                    <v-menu
                    transition="slide-y-transition"
                    v-if="mode=='users'"
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
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-information</v-icon>
                                <span class="menu-text">Info</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                                <span class="menu-text">Edit</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>

                    <v-menu
                    transition="slide-y-transition"
                    v-if="mode=='signs'"
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
                        <get-sign :memberID="member.id" />
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-autorenew</v-icon>
                                <span class="menu-text">Update sign</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete sign</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>
            </tbody>
        </v-table>
        
        <data-empty :text="'Users not found'" v-if="!members.length" />
    </div>
</template>

<script>
import SubtitleComponent from '@/components/SubtitleComponent';
import GetSign from '@/components/panel/SignsManagement/dialogs/GetSign';
import { mergeProps } from 'vue'
import { mapGetters } from 'vuex';
import DataEmpty from '@/components/DataEmpty.vue'
import UserInfo from './ExamsManagement/UserInfo.vue';

export default {
    props:{
        mode: String
    },
    data(){
        return {
            members:[]
        }
    },
    
    computed: {
        ...mapGetters(['getUsersList', 'getAuthServerIP'])
    },
    mounted(){
        console.log(this.getUsersList);
        if(this.mode=='users'){
            this.members = this.getUsersList
        } else {
            this.getUsersList.forEach(member => {
                if(member.hasSign){
                    this.members.push(member)
                }
            });
        }
    },
    methods: {
        mergeProps,
    },
    components: {
        SubtitleComponent,
        GetSign,
        DataEmpty,
        UserInfo
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
