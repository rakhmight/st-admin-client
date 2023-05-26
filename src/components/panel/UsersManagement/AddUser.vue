<template>
    <div class="wrapper">
        <div class="form">
            <div style="position: absolute;top: -50px;left:0; width: 100%">
                <v-alert
                density="compact"
                color="var(--red-color)"
                class="d-flex flex-row align-center"
                v-if="error.errors.length"
                >
                    <v-icon color="#fff" class="mr-1">mdi-alert-circle</v-icon>
                    <span style="color:#fff">{{ error.msg }}</span>
                </v-alert>

                <v-alert
                density="compact"
                color="var(--main-color)"
                class="d-flex flex-row align-center"
                v-if="success"
                >
                    <v-icon color="#fff" class="mr-1">mdi-check</v-icon>
                    <span style="color:#fff">New member added</span>
                </v-alert>
            </div>
            <medium-title-component :title="'Add new member'" />
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap:30px">
                <div>
                    <v-select
                    label="Select user"
                    :items="users"
                    density="compact"
                    variant="outlined"
                    v-model="user"
                    :error="userError"
                    ></v-select>
                </div>

                <div>
                <v-select
                clearable
                label="Sort by departments"
                :items="departments"
                density="compact"
                variant="outlined"
                v-model="department"
                
                ></v-select>
                <v-select
                clearable
                label="Sort by positions"
                :items="positions"
                density="compact"
                variant="outlined"
                v-model="position"
                no-data-text="Select department first"
                ></v-select>
                </div>
            </div>

            <v-select
            label="Select role"
            :items="roles"
            density="compact"
            variant="outlined"
            v-model="permissions"
            :error="permissionsError"
            ></v-select>

            <v-checkbox
            :label="signCheckboxBlocked ? '*Sign is required for test authors': 'Simultaneously create a sign for the member'"
            density="compact"
            color="var(--main-color)"
            v-model="createSign"
            :readonly="signCheckboxBlocked"
            ></v-checkbox>

            <div class="w-100 d-flex justify-center">
                <v-btn
                :color="blockBtn ? '#eee' : 'var(--main-color)'"
                width="200"
                density="compact"
                @click="addMember"
                :disabled="blockBtn"
                >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Add member</span>
                    <v-progress-circular
                    :width="1"
                    size="15"
                    color="var(--main-color)"
                    indeterminate
                    v-else
                    ></v-progress-circular>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import MediumTitleComponent from '@/components/MediumTitleComponent';
import { mapGetters, mapMutations } from 'vuex';
import makeReq from '@/services/makeReq';

export default {
    components:{
        MediumTitleComponent
    },
    data(){
        return {
            user: undefined,
            department: undefined,
            position: undefined,
            permissions: undefined,
            createSign: false,
            signCheckboxBlocked: false,

            roles: [
                {title: 'Author', value: 1},
                {title: 'Inspector', value: 2},
                {title: 'Administrator', value: 3}
            ],
            users: [],
            departments: [],
            choisedDepartment: null,
            positions: [],

            userError: false,
            permissionsError: false,
            error: {
                errors: [],
                msg: undefined
            },
            success: false,
            loader: false,
            blockBtn: false
        }
    },
    computed: mapGetters(['getAuthParams', 'getUsersList', 'getDepartments', 'getMembersList', 'getAdminServerIP']),
    mounted(){
        this.makeAllUsersList()

        const departments = this.getDepartments
        departments.forEach(department=>{
            this.departments.push({
                title: department.name.ru,
                value: department.id
            })
        })
    },
    watch:{
        user(){
            this.userError = false
            let target = this.error.errors.indexOf('user')
            this.error.errors.splice(target, 1)
            if(!this.error.errors.length){
                this.blockBtn = false
            }
        },
        permissions(){
            this.permissionsError = false
            let target = this.error.errors.indexOf('permissions')
            this.error.errors.splice(target, 1)
            if(!this.error.errors.length){
                this.blockBtn = false
            }

            if(this.permissions){
                if(this.permissions==1){
                    this.createSign = true
                    this.signCheckboxBlocked = true
                } else {
                    this.createSign = false
                    this.signCheckboxBlocked = false
                }
            }
        },

        department(){
            this.user = undefined
            this.positions = []
            this.position = undefined
            this.getDepartments.forEach(department=>{
                if(department.id == this.department){
                    this.choisedDepartment = department
                }
            })

            if(this.department===null){
                return this.makeAllUsersList()
            }

            this.makeUsersListByDepartment()
            
            this.choisedDepartment.positions.forEach(position=>{
                this.positions.push({
                    title: position.name.ru,
                    value: position.id
                })
            })
        },
        position(){
            this.user = undefined
            if(this.position===null && this.department){
                return this.makeUsersListByDepartment()
            }
            if(this.position){
                this.makeUsersListByDepartmentAndPosition()
            }
        }
    },
    methods:{
        ...mapMutations(['updateMembersList']),
        async addMember(){
            this.blockBtn = true
            let errorsCount = 0

            if(!this.user){
                errorsCount++
                this.error.errors.push('user')
                this.userError = true
            }
            if(!this.permissions){
                errorsCount++
                this.error.errors.push('permissions')
                this.permissionsError = true
            }

            if(errorsCount){
                this.error.msg = 'Fill in all required fields first'
                this.blockBtn = true
                return
            }
            
            this.loader=true
            const user = this.getUsersList.find(user=>user.id==this.user)
            await makeReq(`${this.getAdminServerIP}/api/members/add`, 'POST', {
                ...this.getAuthParams,
                data:{
                    _id: this.user,
                    token: null,
                    permission: this.permissions,
                    hasSign: this.createSign,
                    department: user.roleProperties.department
                }
            })
            .then(async (data)=>{
                if(this.createSign){
                    await makeReq(`${this.getAdminServerIP}/api/signs/create`, 'POST',{
                        ...this.getAuthParams,
                        data:{
                            _id: this.user,
                        }
                    })
                }

                // добавить в state
                let newMember = this.getUsersList.find(user => user.id == this.user)
                newMember.memberRole = this.permissions
                newMember.hasSign = this.createSign
                this.updateMembersList(newMember)

                if(data.statusCode == 200){
                    this.loader= false
                    this.success = true
                    setTimeout(()=>{
                        this.success = false
                        this.position = undefined
                        this.department = undefined
                        this.positions = []
                        this.departments = []
                        this.user = undefined
                        this.permissions = undefined
                        this.blockBtn = false
                        this.createSign = false
                        this.signCheckboxBlocked = false
                        this.makeAllUsersList()
                    }, 3000)
                }
            })
            
        },

        makeAllUsersList(){
            this.users = []
            const users = this.getUsersList
            users.forEach(user => {
                if(user.userRole == 'teacher' || user.userRole=='employee'){
                    let isMember = this.getMembersList.find(member => member.id==user.id)
                    if(!isMember){
                        this.users.push({
                            title: `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`,
                            value: user.id
                        })
                    }
                }
            });
        },

        makeUsersListByDepartment(){
            this.users = []
            this.getUsersList.forEach(user=>{
                let check = this.getMembersList.find(member=> member.id==user.id)

                if(user.roleProperties.department == this.department && !check){
                    this.users.push({
                    title: `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`,
                    value: user.id
                    })
                }
            })
        },

        makeUsersListByDepartmentAndPosition(){
            this.users = []
            this.getUsersList.forEach(user=>{
                let check = this.getMembersList.find(member=> member.id==user.id)
                if(user.roleProperties.department == this.department && user.roleProperties.position == this.position && !check){
                    this.users.push({
                        title: `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`,
                        value: user.id
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    min-height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.form{
    padding: 15px;
    background-color: #fff;
    width: 800px;
    border-radius: 5px;
    position: relative;
}

.v-list-item-title{
    font-size: 0.9em;
}
</style>
