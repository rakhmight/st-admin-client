<template>
    <div class="d-flex flex-column" style="gap: 20px">
        <div class="usersTypes mt-2">
            <div class="d-flex flex-row align-center mb-2">
                <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                <span class="ml-1">Select a category of users</span>
            </div>
            <v-select
            label="Select users type"
            :items="usersTypes"
            density="compact"
            variant="outlined"
            multiple
            v-model="selectedUsersTypes"
            ></v-select>
        </div>

        <div class="studentsTypes" v-if="selectedUsersTypes.indexOf('students')!=-1">
            <v-divider style="margin-bottom: 30px;"></v-divider>
            <span class="text-h6">Students</span>

            <div class="types mt-1">

                <div>
                    <div class="d-flex flex-row align-center mb-2">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Select a form of study</span>
                    </div>  
                    <v-select
                    label="Choose a form of study"
                    :items="studentsTypes"
                    density="compact"
                    variant="outlined"
                    multiple
                    v-model="selectedStudentsType"
                    ></v-select>
                </div>

                <div>
                    <div v-if="selectedStudentsType.indexOf('full-time')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with full-time education</span>
                        </div>
                        <v-select
                        label="Choose group"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedStudentsGroupsFullTime"
                        ></v-select>
                    </div>
                    <div v-if="selectedStudentsType.indexOf('in-absentia')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with in absentia education</span>
                        </div>
                        <v-select
                        label="Choose group"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedStudentsGroupsInAbsentia"
                        ></v-select>
                    </div>
                    <div v-if="selectedStudentsType.indexOf('magistracy')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with magistracy education</span>
                        </div>
                        <v-select
                        label="Choose a form of study"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedStudentsGroupsMagistracy"
                        ></v-select>
                    </div>
                </div>
            </div>
        </div>

        <div class="enrolleesTypes" v-if="selectedUsersTypes.indexOf('enrollees')!=-1">
            <v-divider style="margin-bottom: 30px;"></v-divider>
            <span class="text-h6">Enrollees</span>

            <div class="types mt-2">

                <div>
                    <div class="d-flex flex-row align-center mb-2">
                        <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                        <span class="ml-1">Select a form of study</span>
                    </div>
                    
                    <v-select
                    label="Choose a form of study"
                    :items="enrolleesTypes"
                    density="compact"
                    variant="outlined"
                    multiple
                    v-model="selectedEnrolleesType"
                    ></v-select>
                </div>

                <div>
                    <div v-if="selectedEnrolleesType.indexOf('full-time')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with full-time education</span>
                        </div>
                        <v-select
                        label="Choose group"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedEnrolleesGroupsFullTime"
                        ></v-select>
                    </div>
                    <div v-if="selectedEnrolleesType.indexOf('in-absentia')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with in absentia education</span>
                        </div>
                        <v-select
                        label="Choose group"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedEnrolleesGroupsInAbsentia"
                        ></v-select>
                    </div>
                    <div v-if="selectedEnrolleesType.indexOf('magistracy')!=-1">
                        <div class="d-flex flex-row align-center mb-2">
                            <v-icon size="16" color="var(--bg-special-color)">mdi-circle-double</v-icon>
                            <span class="ml-1">Select groups with magistracy education</span>
                        </div>
                        <v-select
                        label="Choose a form of study"
                        :items="groups"
                        density="compact"
                        variant="outlined"
                        multiple
                        v-model="selectedEnrolleesGroupsMagistracy"
                        ></v-select>
                    </div>
                </div>
            </div>
        </div>

        <div class="types" v-if="selectedUsersTypes.indexOf('teachers')!=-1 || selectedUsersTypes.indexOf('employees')!=-1">
            <div class="teachersTypes" v-if="selectedUsersTypes.indexOf('teachers')!=-1">
                <v-divider style="margin-bottom: 30px;"></v-divider>
                <span class="text-h6">Teachers</span>

                <v-select
                class="mt-2"
                label="Choise chairs"
                :items="teachersTypes"
                density="compact"
                variant="outlined"
                multiple
                v-model="selectedTeachersType"
                ></v-select>
            </div>

            <div class="employeesTypes" v-if="selectedUsersTypes.indexOf('employees')!=-1">
                <v-divider style="margin-bottom: 30px;"></v-divider>
                <span class="text-h6">Employees</span>

                <v-select
                class="mt-2"
                label="Choise departments"
                :items="employeesTypes"
                density="compact"
                variant="outlined"
                multiple
                v-model="selectedEmployeesType"
                ></v-select>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props:{
        usersManagement: Function
    },
    data(){
        return {
            // optionally
            usersTypes: [
                { title: 'Students', value: 'students' },
                { title: 'Enrollees', value: 'enrollees' },
                { title: 'Teachers', value: 'teachers' },
                { title: 'Employees', value: 'employees' }
            ],

            studentsTypes:[
                { title: 'Full-time', value: 'full-time' },
                { title: 'In absentia', value: 'in-absentia' },
                { title: 'magistracy', value: 'magistracy' },
            ],
            enrolleesTypes: [
                { title: 'Full-time', value: 'full-time' },
                { title: 'In absentia', value: 'in-absentia' },
                { title: 'magistracy', value: 'magistracy' },
            ],
            teachersTypes: [],
            employeesTypes: [],
            groups: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],

            //
            selectedUsersTypes: [],

            selectedStudentsType: [],

            selectedStudentsGroupsFullTime: [],
            selectedStudentsGroupsInAbsentia: [],
            selectedStudentsGroupsMagistracy: [],

            selectedEnrolleesType: [],

            selectedEnrolleesGroupsFullTime: [],
            selectedEnrolleesGroupsInAbsentia: [],
            selectedEnrolleesGroupsMagistracy: [],

            selectedEmployeesType: [],
            selectedTeachersType: []

        }
    },
    computed: mapGetters(['getDepartments']),
    watch:{
        selectedStudentsGroupsFullTime(){
            this.usersManagement('group', {role: 'student', educationForm: 'full-time' }, this.selectedStudentsGroupsFullTime)
        },
        
        selectedStudentsGroupsInAbsentia(){
            this.usersManagement('group', {role: 'student', educationForm: 'in-absentia' }, this.selectedStudentsGroupsInAbsentia)
        },
        
        selectedStudentsGroupsMagistracy(){
            this.usersManagement('group', {role: 'student', educationForm: 'magistracy' }, this.selectedStudentsGroupsMagistracy)
        },

        selectedEnrolleesGroupsFullTime(){
            this.usersManagement('group', {role: 'enrollee', educationForm: 'full-time' }, this.selectedEnrolleesGroupsFullTime)
        },
        
        selectedEnrolleesGroupsInAbsentia(){
            this.usersManagement('group', {role: 'enrollee', educationForm: 'in-absentia' }, this.selectedEnrolleesGroupsInAbsentia)
        },
        
        selectedEnrolleesGroupsMagistracy(){
            this.usersManagement('group', {role: 'enrollee', educationForm: 'magistracy' }, this.selectedEnrolleesGroupsMagistracy)
        },

        selectedEmployeesType(){
            this.usersManagement('group', {role: 'employee'}, this.selectedEmployeesType)
        },

        selectedTeachersType(){
            this.usersManagement('group', {role: 'teacher'}, this.selectedTeachersType)
        }
    },
    mounted(){
        this.getDepartments.forEach(department=>{
            if(department.type=='general'){
                this.employeesTypes.push({
                    title: department.name.ru,
                    value: department.id
                })
            } else if(department.type=='chair'){
                this.teachersTypes.push({
                    title: department.name.ru,
                    value: department.id
                })
            }
        })
    }
}
</script>

<style>
.types{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
}
</style>
