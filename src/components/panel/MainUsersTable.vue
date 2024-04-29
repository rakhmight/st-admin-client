<template>
    <div>
        <div class="d-flex flex-row justify-space-between align-center mb-2">
            <subtitle-component :subtitle="'Users who can have access to the system'" v-if="mode=='users'" />
            <subtitle-component :subtitle="'Section for managing signatures of system participants'" v-if="mode=='signs'" />
                        
            <div class="d-flex align-center" style="width: 500px; gap: 15px; padding-top: 10px">
                <v-text-field
                label="Searching by fullname"
                prepend-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                ></v-text-field>

                <v-btn
                color="var(--main-color)"
                height="25"
                @click="() => showFilters=!showFilters"
                >
                    <v-icon color="#fff">mdi-sort</v-icon>
                </v-btn>
            </div>
        </div>

        <div class="d-flex" style="gap: 20px" v-if="showFilters">
            <div style="width: 200px">
                <v-select
                label="Select role"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                variant="outlined"
                color="var(--main-color)"
                density="compact"
                ></v-select>
            </div>
            
            <v-select
            label="Select department"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            variant="outlined"
            color="var(--main-color)"
            density="compact"
            ></v-select>
            
            <v-select
            label="Select form of education"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            variant="outlined"
            color="var(--main-color)"
            density="compact"
            ></v-select>
            
            <v-select
            label="Select course"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            variant="outlined"
            color="var(--main-color)"
            density="compact"
            ></v-select>
            
            <v-select
            label="Select group"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            variant="outlined"
            color="var(--main-color)"
            density="compact"
            ></v-select>
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
            v-for="member in membersList"
            :key="member.id"
            >
                <td>{{ member.number }}</td>
                <td>
                    <div class="pt-2 pb-2 d-flex flex-row align-center">
                        <div style="width: 40px; height: 40px;">
                            <v-img :src="`${this.getAuthServerIP}/public/avatars/${member.id}.png`"></v-img>
                        </div>
                        <span class="ml-2">{{ member.bio.firstName }} {{ member.bio.lastName }} {{ member.bio.patronymic ? member.bio.patronymic : '' }}</span>
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

                        <edit-user :user="member" />

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

        <v-pagination
        class="mt-3"
        v-model="page"
        :length="pages"
        :total-visible="7"
        density="compact"
        rounded="circle"
        ></v-pagination>
        
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
import EditUser from './UsersManagement/dialogs/EditUser.vue'

export default {
    props:{
        mode: String
    },
    data(){
        return {
            members:[],
            membersList: [],
            page: 1,
            pageSize: 30,
            listCount: 0,

            showFilters: false
        }
    },
    
    computed: {
        ...mapGetters(['getUsersList', 'getAuthServerIP', 'getUsersDataSwitcher']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        getUsersDataSwitcher(){
            this.makeList()
            this.initPage();
            this.updatePage(this.page);
        },

        page(){
            this.updatePage(this.page)
        },

        'getUsersList.length'(){
            this.makeList()
            this.initPage();
            this.updatePage(this.page);
        }
    },
    mounted(){
        this.makeList()
        this.initPage();
		this.updatePage(this.page);
    },
    methods: {
        mergeProps,

        makeList(){
            this.members= []
            this.getUsersList.forEach((member, i) => {
                const memberI = { ...member, number: i+1 }
                
                if(this.mode=='users') this.members.push(memberI)
                else {
                    if(member.hasSign) this.members.push(memberI)
                }
            })
        },

        initPage(){
            this.listCount = []
			this.listCount = this.members.length;
			if (this.listCount < this.pageSize) {
				this.membersList = this.members;
			} else {
				this.membersList = this.members.slice(0, this.pageSize);
			}
		},

        updatePage(pageIndex){
			let _start = (pageIndex - 1) * this.pageSize;
			let _end = pageIndex * this.pageSize;
			this.membersList = this.members.slice(_start, _end);
			this.page = pageIndex;
		}
    },
    components: {
        SubtitleComponent,
        GetSign,
        DataEmpty,
        UserInfo,
        EditUser
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}

.grid-table{
    font-size: 0.9em;
    display: grid;
    grid-template-columns:repeat(5, 1fr);
}
.grid-table > div {
    padding: 8px 4px;
    border-bottom: #777;
    height: 32%;
}

.scroller{
    width: 100%;
    height: 600px;
    overflow-y: auto
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>
