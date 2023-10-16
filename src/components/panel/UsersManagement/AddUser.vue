<template>
    <div class="wrapper">
        <div class="form">
            <div style=" width: 100%">
                <v-alert
                v-if="error.count.length"
                color="var(--red-color)"
                density="compact"
                class="mb-4"
                >
                <span style="color: #fff">{{ error.msg }}</span>
                </v-alert>
                <v-alert
                v-if="requestError.status"
                color="var(--red-color)"
                density="compact"
                class="mb-4"
                >
                <span style="color: #fff">{{ requestError.msg }}</span>
                </v-alert>
                <v-alert
                v-if="success"
                color="var(--main-color)"
                density="compact"
                class="mb-4"
                >
                <span style="color: #fff">New user added</span>
                </v-alert>
            </div>
            <medium-title-component :title="'Add new member'" />

            <div class="form__content">
                
                <div class="block">
                    <div class="block__title">
                        <div class="d-flex flex-row align-center mt-1" style="padding: 3px 10px; background-color: var(--bg-special-color); border-radius: 3px;"> 
                            <v-icon size="19" color="#fff">mdi-account</v-icon>
                            <span class="ml-1" style="color: #fff">Bio</span>
                        </div>
                    </div>
                    <div class="block__content">
                        <div class="d-flex flex-row align-center mb-2" style="gap:20px">
                            <v-file-input
                                :loading="loadAvatar"
                                width="100%"
                                class="mt-7"
                                variant="outlined"
                                density="compact"
                                :rules="rules"
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Pick an avatar"
                                prepend-icon="mdi-camera"
                                label="Avatar"
                                clearable
                                v-model="avatarFile"
                                @click:clear="avatarFile=undefined"
                                color="var(--main-color)"
                            ></v-file-input>
                            <div>
                                <v-avatar v-if="avatar" :image="avatar" size="80"></v-avatar>
                                <div v-if="!avatar" style="width: 80px">
                                    <v-img src="@/assets/media/default_avatar.png" size="80"></v-img>
                                </div>
                            </div>
                        </div>
                        <div class="block__trio-inputs d-flex flex-row" style="gap:20px">
                            <v-text-field
                            label="First name"
                            variant="outlined"
                            density="compact"
                            v-model="firstName"
                            :error="firstNameError"
                            ></v-text-field>
                            <v-text-field
                            label="Last name"
                            variant="outlined"
                            density="compact"
                            v-model="lastName"
                            :error="lastNameError"
                            ></v-text-field>
                            <v-text-field
                            label="Patronymic"
                            variant="outlined"
                            density="compact"
                            v-model="patronymic"
                            :error="patronymicError"
                            ></v-text-field>
                        </div>
                    </div>
                </div>


                <div class="block mt-9">
                    
                    <div class="block__title mb-5">
                        <div class="d-flex flex-row align-center mt-1" style="padding: 3px 10px; background-color: var(--bg-special-color); border-radius: 3px;"> 
                            <v-icon size="19" color="#fff">mdi-map-marker</v-icon>
                            <span class="ml-1" style="color: #fff">Geo</span>
                        </div>
                    </div>
                    <div class="block__content">
                        <div class="block__duo-inputs d-flex flex-row" style="gap: 20px">
                            <v-select
                            density="compact"
                            variant="outlined"
                            label="State"
                            :items="states"
                            v-model="state"
                            :error="stateError"
                            ></v-select>
                            <v-select
                            density="compact"
                            variant="outlined"
                            label="Region"
                            :items="regions"
                            v-model="region"
                            :error="regionError"
                            no-data-text="Select region first"
                            ></v-select>
                        </div>
                    </div>
                </div>
                

                <div class="block mt-9">
                    <div class="block__title mb-5">
                        <div class="d-flex flex-row align-center mt-1" style="padding: 3px 10px; background-color: var(--bg-special-color); border-radius: 3px;"> 
                            <v-icon size="19" color="#fff">mdi-gamepad-circle-outline</v-icon>
                            <span class="ml-1" style="color: #fff">Role</span>
                        </div>
                    </div>
                    <div class="block__content">
                        <div class="block__duo-inputs">
                            <v-select
                            density="compact"
                            variant="outlined"
                            label="Role"
                            :items="[{title:'Student',value:'student'},{title:'Enrollee',value:'enrollee'},{title:'Teacher',value:'teacher'},{title:'Employee',value:'employee'}]"
                            v-model="userRole"
                            :error="userRoleError"
                            ></v-select>
                        </div>

                        <div class="student-enrollee" v-if="userRole=='student' || userRole=='enrollee'">
                            <div class="block__trio-inputs d-flex flex-row" style="gap: 20px">
                                <v-select
                                density="compact"
                                variant="outlined"
                                label="Form of education"
                                :items="[{title:'Full-time',value:'full-time'},{title:'In absentia',value:'in-absentia'},{title:'Magistracy',value:'magistracy'}]"
                                v-model="educationForm"
                                :error="educationFormError"
                                ></v-select>
                                <v-select
                                density="compact"
                                variant="outlined"
                                label="Group"
                                :items="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,204,208]"
                                v-model="group"
                                :error="groupError"
                                ></v-select>
                                <v-text-field
                                v-if="userRole=='student'"
                                density="compact"
                                variant="outlined"
                                label="Receipt year"
                                v-model.number="recieptDate"
                                :error="recieptDateError"
                                ></v-text-field>
                                <v-text-field
                                v-if="userRole=='enrollee'"
                                density="compact"
                                variant="outlined"
                                label="Year of admission"
                                v-model.number="admissionYear"
                                :error="admissionYearError"
                                ></v-text-field>
                            </div>
                            
                        </div>

                        <div class="teacher-employee" v-if="userRole=='teacher' || userRole=='employee'">
                            <div class="block__duo-inputs d-flex flex-row" style="gap: 20px">
                                <v-select
                                density="compact"
                                variant="outlined"
                                :label="userRole=='teacher' ? 'Chair' : 'Department'"
                                :items="departments"
                                v-model="department"
                                :error="departmentError"
                                ></v-select>
                                <v-select
                                density="compact"
                                variant="outlined"
                                label="Position"
                                :items="positions"
                                v-model="position"
                                :error="positionError"
                                :no-data-text="userRole == 'teacher' ? 'Select chair first' : 'Select department first'"
                                ></v-select>
                            </div>
                        </div>

                    </div>
                </div>
                

                <div class="block mt-9">
                    <div class="block__title mb-5">
                        <div class="d-flex flex-row align-center mt-1" style="padding: 3px 10px; background-color: var(--bg-special-color); border-radius: 3px;"> 
                            <v-icon size="19" color="#fff">mdi-login</v-icon>
                            <span class="ml-1" style="color: #fff">Auth</span>
                        </div>
                    </div>
                    <div class="block__content">
                        <div class="block__duo-inputs d-flex flex-row" style="gap: 20px">
                            <v-text-field
                            prepend-inner-icon="mdi-at"
                            label="Login"
                            variant="outlined"
                            density="compact"
                            v-model="login"
                            :error="loginError"
                            ></v-text-field>
                            <v-text-field
                            prepend-inner-icon="mdi-key-variant"
                            label="Password"
                            variant="outlined"
                            density="compact"
                            v-model="password"
                            :error="passwordError"
                            ></v-text-field>
                        </div>
                    </div>
                </div>

                <div class="block mt-3">
                    <div></div>
                    <div class="d-flex flex-row" style="gap: 20px">
                        <v-select
                        label="Select permission"
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
                    </div>
                </div>
            </div>

            <div class="w-100 pt-3 d-flex justify-center">
                <v-btn
                :color="blockBtn ? '#eee' : 'var(--main-color)'"
                width="200"
                density="compact"
                @click="addUser()"
                :disabled="blockBtn"
                >
                    <span :style="blockBtn ? 'color: #777' : 'color:#fff'" v-if="!loader">Add user</span>
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
            firstName: undefined,
            lastName: undefined,
            patronymic: undefined,
            state: undefined,
            region: undefined,
            userRole: undefined,
            
            // Student & Enrollee
            educationForm: undefined,
            group: undefined,
            recieptDate: undefined,
            admissionYear: undefined,
            // Teacher && Employee
            department: undefined,
            position: undefined,
            
            login: undefined,
            password: undefined,
            permissions: undefined,
            createSign: false,
            signCheckboxBlocked: false,
            avatarFile: undefined,
            avatar: undefined,
            loadAvatar: false,

            /////////////////////////////// ErrorsStatus
            firstNameError: false,
            lastNameError: false,
            patronymicError: false,
            stateError: false,
            regionError: false,
            userRoleError: false,
            educationFormError: false,
            groupError: false,
            recieptDateError: false,
            admissionYearError: false,
            departmentError: false,
            positionError: false,
            loginError: false,
            passwordError: false,
            permissionsError: false,

            roles: [
                {title: 'User', value: 0},
                {title: 'Author', value: 1},
                {title: 'Inspector', value: 2},
                {title: 'Administrator', value: 3}
            ],
            states: [],
            regions: [],
            departments: [],
            positions: [],
            
            error: {
                count: [],
                msg: undefined
            },
            requestError:{
                status: false,
                msg: null
            },
            success: false,
            loader: false,
            blockBtn: false
        }
    },
    computed: mapGetters(['getAuthParams', 'getUsersList', 'getDepartments', 'getAdminServerIP', 'getAuthServerIP']),
    mounted(){
        let currentDate = new Date()
        this.admissionYear = currentDate.getFullYear()
        this.recieptDate = currentDate.getFullYear()

        this.states = [
            {title: 'Uzbekistan', value: 'UZ'},
            {title: 'Karakalpakistan', value: 'KRP'},
            {title: 'Kazahstan', value: 'KZ'},
            {title: 'Russia', value: 'RU'},
        ]

        console.log(this.states)
        console.log(this.recieptDate)
    },
    watch:{
        state(){
            if(this.state=='UZ'){
                this.regions = [
                    {title: 'Tashkent', value: 1},
                    {title: 'Tashkent region', value: 2},
                    {title: 'Andijan region', value: 3},
                    {title: 'Bukhara region', value: 4},
                    {title: 'Fergana region', value: 5},
                    {title: 'Jizzakh region', value: 6},
                    {title: 'Xorazm region', value: 7},
                    {title: 'Namangan region', value: 8},
                    {title: 'Navoiy region', value: 9},
                    {title: 'Qashqadaryo region	', value: 10},
                    {title: 'Samarqand region', value: 11},
                    {title: 'Sirdaryo region', value: 12},
                    {title: 'Surxondaryo region', value: 13},
                ]
            } else {
                this.regions = []
            }
            
            if(this.state){
                this.stateError = false
                let target = this.error.count.indexOf('state')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },

        firstName(){
            if(this.firstName){
                this.firstNameError = false
                let target = this.error.count.indexOf('firstName')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        lastName(){
            if(this.lastName){
                this.lastNameError = false
                let target = this.error.count.indexOf('lastName')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        patronymic(){
            if(this.patronymic){
                this.patronymicError = false
                let target = this.error.count.indexOf('patronymic')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        region(){
            if(this.region){
                this.regionError = false
                let target = this.error.count.indexOf('region')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        userRole(){
            if(this.userRole){
                this.userRoleError = false
                let target = this.error.count.indexOf('userRole')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }

                // чистка предыдущих
                let targets = ['educationForm', 'group', 'recieptDate', 'admissionYear', 'department', 'position']
                for(let i =0; i!=targets.length; i++){
                    let target = this.error.count.indexOf(targets[i])
                    if(target!=-1){
                        this.error.count.splice(target, 1)
                        
                        if(!this.error.count.length){
                            this.blockBtn = false
                        }
                    }
                }

                // departments
                this.departments = []
                this.positions = []
                this.department = undefined
                this.position = undefined
                if(this.userRole == 'teacher'){
                    this.departments = this.getDepartments.map(dep=>{
                        if(dep.type=='chair'){
                            return {
                                title: dep.name.ru,
                                value: dep.id
                            }
                        }
                    })
                } else {
                    this.departments = this.getDepartments.map(dep=>{
                        if(dep.type=='general'){
                            return {
                                title: dep.name.ru,
                                value: dep.id
                            }
                        }
                    })
                }
            }
        },
        educationForm(){
            if(this.userRole && this.educationForm){
                this.educationFormError = false
                let target = this.error.count.indexOf('educationForm')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        group(){
            if(this.userRole && this.group){
                this.groupError = false
                let target = this.error.count.indexOf('group')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        recieptDate(){
            if(this.userRole && this.recieptDate){
                this.recieptDateError = false
                let target = this.error.count.indexOf('recieptDate')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        admissionYear(){
            if(this.userRole && this.admissionYear){
                this.admissionYearError = false
                let target = this.error.count.indexOf('admissionYear')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        department(){
            if(this.userRole && this.department){
                this.departmentError = false
                let target = this.error.count.indexOf('department')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }

                this.positions = []
                this.getDepartments.forEach(dep=>{
                    if(dep.id==this.department){
                        dep.positions.forEach(value=>{
                            this.positions.push({
                                title: value.name.ru,
                                value: value.id
                            })
                        })
                    }
                })
            }
        },
        position(){
            if(this.userRole && this.position){
                this.positionError = false
                let target = this.error.count.indexOf('position')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        login(){
            if(this.login){
                this.loginError = false
                let target = this.error.count.indexOf('login')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }

            if(this.requestError.status){
                this.requestError.status = false
            }
        },
        password(){
            if(this.password){
                this.passwordError = false
                let target = this.error.count.indexOf('password')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }
            }
        },
        permissions(){
            if(this.permissions || this.permissions==0){
                this.permissionsError = false
                let target = this.error.count.indexOf('permissions')
                if(target!=-1){
                    this.error.count.splice(target, 1)
                    
                    if(!this.error.count.length){
                        this.blockBtn = false
                    }
                }

                if(this.permissions == 1){
                    this.createSign = true
                    this.signCheckboxBlocked = true
                } else {
                    this.signCheckboxBlocked = false
                }
            }
        },

        avatarFile(){
            if(this.avatarFile){
                this.loadAvatar = true
                this.readFile(this.avatarFile, 'set')
            } else {
                this.avatar = undefined
            }
        }
    },
    methods:{
        ...mapMutations(['updateUsersList']),
        
        readFile(file, flag) {
            let reader = new FileReader();

            if (file[0]) {
                if (/\.(jpe?g|png|svg|webp)$/i.test(file[0].name)) {
                    reader.readAsDataURL(file[0]);
                }
            }

            reader.onload = function () {
                if(flag=='set'){
                    this.avatar = reader.result
                    this.loadAvatar = false
                }
            }.bind(this);
        },

        async addUser(){
            let errorsCount = 0

            if(!this.firstName){
                this.firstNameError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('firstName')
                errorsCount++
            }
            if(!this.lastName){
                this.lastNameError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('lastName')
                errorsCount++
            }
            if(!this.patronymic){
                this.patronymicError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('patronymic')
                errorsCount++
            }
            if(!this.state){
                this.stateError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('state')
                errorsCount++
            }
            if(!this.region){
                this.regionError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('region')
                errorsCount++
            }
            if(!this.userRole){
                this.userRoleError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('userRole')
                errorsCount++
            }

            if(this.userRole){
                if(this.userRole=='student' || this.userRole=='enrollee'){
                    if(!this.educationForm){
                        this.educationFormError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('educationForm')
                        errorsCount++
                    }  
                }
                if(this.userRole=='student' || this.userRole=='enrollee'){
                    if(!this.group){
                        this.groupError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('group')
                        errorsCount++
                    }  
                }
                if(this.userRole=='student'){
                    if(!this.recieptDate){
                        this.recieptDateError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('recieptDate')
                        errorsCount++
                    }  
                }
                if(this.userRole=='enrollee'){
                    if(!this.admissionYear){
                        this.admissionYearError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('admissionYear')
                        errorsCount++
                    }  
                }
                if(this.userRole=='teacher' || this.userRole=='employee'){
                    if(!this.department){
                        this.departmentError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('department')
                        errorsCount++
                    }  
                }
                if(this.userRole=='teacher' || this.userRole=='employee'){
                    if(!this.position){
                        this.positionError = true
                        this.error.msg = 'Fill in all the fields'
                        this.error.count.push('position')
                        errorsCount++
                    }  
                }
            }

            if(!this.login){
                this.loginError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('login')
                errorsCount++
            }
            if(!this.password){
                this.passwordError = true
                this.error.msg = 'Fill in all the fields'
                this.error.count.push('password')
                errorsCount++
            }
            if(!this.permissions){
                if(this.permissions!=0){
                    this.permissionsError = true
                    this.error.msg = 'Fill in all the fields'
                    this.error.count.push('permissions')
                    errorsCount++
                }
            }

            if(errorsCount){
                this.blockBtn = true
                return
            }

            const data = {
                bio: {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    patronymic: this.patronymic,
                    avatar: this.avatar,
                    geo:{
                        state: this.state,
                        region: this.region
                    }
                },
                auth:{
                    login: this.login,
                    password: this.password
                },
                userRole: this.userRole,
                permission: this.permissions,
                createSign: this.createSign
            }

            const roleProperties = {}
            if(this.userRole == 'student' || this.userRole == 'enrollee'){
                roleProperties.educationForm = this.educationForm
                roleProperties.group = this.group
            }
            if(this.userRole == 'student'){
                roleProperties.recieptDate = this.recieptDate
            }
            if(this.userRole == 'enrollee'){
                roleProperties.admissionYear = this.admissionYear
            }
            if(this.userRole == 'teacher' || this.userRole == 'employee'){
                roleProperties.department = this.department
                roleProperties.position = this.position
            }

            data.roleProperties = roleProperties

            // запрос
            this.blockBtn = true
            this.loader = true
            console.log(data)
            await makeReq(`${this.getAuthServerIP}/api/user/add`, 'POST', {
                auth: {
                    ...this.getAuthParams,
                    requesting: 'client'
                },
                data
            })
            .then(data=>{
                    console.log(data);
                if(data.statusCode==200){
                    this.updateUsersList(data.data.user)

                    this.loader = false
                    this.success = true
                    setTimeout(()=>{
                        this.firstName = undefined
                        this.lastName = undefined
                        this.patronymic = undefined
                        this.state = undefined
                        this.region = undefined
                        this.userRole = undefined
                        this.educationForm = undefined
                        this.group = undefined
                        this.department = undefined
                        this.position = undefined
                        this.login = undefined
                        this.password = undefined
                        this.permissions = undefined
                        this.avatarFile = undefined
                        this.avatar = this.defaultAvatar
                        this.createSign = false
                        this.signCheckboxBlocked = false
                        ///
                        this.blockBtn = false
                        this.success = false
                    },3000)
                }else if(data.statusCode==409){
                    this.loader = false
                    this.blockBtn = false
                    this.requestError.status = true
                    this.requestError.msg = 'User with given login already exists'
                    this.loginError = true
                }else if(data.status==500){
                    this.loader = false
                    this.blockBtn = false
                    this.requestError.status = true
                    this.requestError.msg = 'ST Auth server internal error'
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
    padding: 15px 0 15px 15px;
    background-color: #fff;
    width: 100%;
    border-radius: 5px;
    position: relative;
}

.v-list-item-title{
    font-size: 0.9em;
}

.block{
    padding-right: 15px;
}

.block__title{
    width: 120px
}

.form__content{
    max-height: 64.3vh;
    overflow-y:scroll;
}
</style>
