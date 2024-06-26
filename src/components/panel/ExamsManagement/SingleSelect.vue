<template>
    <div>
        <div class="d-flex flex-row justify-space-between align-center">
            <div class="d-flex flex-row align-center mb-2">
                <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                <span class="ml-1">Choose examinees</span>
            </div>

           <div class="d-flex flex-row justify-space-between align-center" style="gap: 20px">
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

                <div style="width: 300px; margin-right: 10px">
                    <v-file-input
                        hide-details
                        accept="application/json"
                        show-size
                        counter
                        clearable
                        label="JSON file of users"
                        density="compact"
                        variant="outlined"
                        v-model="retakeListFile"
                        @change="handleRetakeList()"
                        :error="retakeListError.status"
                        :error-messages="retakeListError.msg"
                        :loading="loadFile"
                        color="var(--main-color)"
                    ></v-file-input>
                </div>
           </div>
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
                v-for="user in usersList"
                :key="user.id"
                :user="user"
                :index="user.number"
                :users="users"
                :choisingUser="choisingUser"
                />

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
    data(){
        return {
            usersMap: [],
            usersList: [],
            page: 1,
            pageSize: 30,
            listCount: 0,
            
            retakeListError: {
                status: false,
                msg: undefined
            },
            retakeListFile: undefined,
            loadFile: false
        }
    },
    computed: {
        ...mapGetters(['getUsersList', 'getDepartments']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        page(){
            this.updatePage(this.page)
        }
    },
    mounted(){
        this.getUsersList.forEach((user, i) => {
            const userI = { ...user, number: i+1 }
            this.usersMap.push(userI)
        })

        this.initPage();
		this.updatePage(this.page);
    },
    methods: {
        mergeProps,

        handleRetakeList(){
            this.loadFile = true
            this.retakeListError.status = false
            this.retakeListError.msg = undefined

			let reader  = new FileReader()

            reader.addEventListener("load", function () {
                this.loadFile= false
                const retakeList = JSON.parse(reader.result)
                console.log(retakeList.retakeList);

                if(retakeList.retakeList && Array.isArray(retakeList.retakeList)){
                    retakeList.retakeList.map( item => {
                        console.log(item)
                        this.choisingUser('add', item)
                    } )
                } else{
                    this.retakeListError.status = true
                    this.retakeListError.msg = 'Incorrect list format'
                    return
                }
			}.bind(this), false)

            if(this.retakeListFile){
                if ( /\.(json)$/i.test( this.retakeListFile[0].name ) ) {
					reader.readAsText(this.retakeListFile[0])
				} else{
                    this.retakeListError.status = true
                    this.retakeListError.msg = 'Incorrect list format'
                    return
                }
            }
        },

        initPage(){
			this.listCount = this.usersMap.length;
			if (this.listCount < this.pageSize) {
				this.usersList = this.usersMap;
			} else {
				this.usersList = this.users.slice(0, this.pageSize);
			}
		},

        updatePage(pageIndex){
			let _start = (pageIndex - 1) * this.pageSize;
			let _end = pageIndex * this.pageSize;
			this.usersList = this.usersMap.slice(_start, _end);
			this.page = pageIndex;
		}
    },
    components:{
        UserFromTable,
        DataEmpty
    }
}
</script>
