<template>
    <tr>
        <td width="50">{{ index }}</td>

        <td>
            <div class="pt-2 pb-2 d-flex flex-row align-center">
                <v-avatar :image="user.bio.avatar"></v-avatar>
                <span class="ml-2">{{ user.bio.lastName }} {{ user.bio.firstName }} {{ user.bio.patronymic }}</span>
            </div>
        </td>

        <td>
            <div v-if="user.userRole == 'student'">
                <span>student of {{ getCourse(+user.roleProperties.recieptDate) }} course {{ user.roleProperties.group }} group</span>
            </div>
            <div v-if="user.userRole == 'enrollee'">
                <span>enrollee of {{ user.roleProperties.group }} group (year of admission: {{ user.roleProperties.admissionYear }})</span>
            </div>
            <div v-if="user.userRole == 'teacher'">
                <span>{{ getPosition(user.roleProperties.department,user.roleProperties.position) }} of {{ getDepartment(user.roleProperties.department) }} chair </span>
            </div>
            <div v-if="user.userRole == 'employee'">
                <span>{{ getPosition(user.roleProperties.department,user.roleProperties.position) }} of {{ getDepartment(user.roleProperties.department) }} department </span>
            </div>
        </td>

        <td>
            <v-checkbox
            density="compact"
            color="var(--main-color)"
            v-model="choiseUser"
            
            ></v-checkbox>
        </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props:{
        index: Number,
        user: Object,
        users: Array,
        choisingUser: Function
    },
    data(){
        return {            
            currentYear: null,
            nextEducationYear: false,
            choiseUser: this.users.indexOf(this.user.id)!=-1 ? true : false
        }
    },
    computed: mapGetters(['getDepartments']),
    methods: {
      getCourse(year){
        if(this.nextEducationYear && this.currentYear-year!=3){
            return (this.currentYear-year)+1
        }
        return this.currentYear-year
      },

      getDepartment(department){
        const departmentName= this.getDepartments.find(item => item.id == department) || 'unknown'
        return departmentName.name.ru
      },

      getPosition(department, position){
        const departments = this.getDepartments
        let positionName = 'unknown'

        departments.forEach(item=>{
            if(item.id == department){
                item.positions.forEach(value=>{
                    if(value.id==position){
                        positionName = value.name.ru
                    }
                })
            }
        })

        return positionName
      }
    },
    mounted(){
        let currentDate = new Date()
        this.currentYear = currentDate.getFullYear()
        if(currentDate.getMonth()>8){
            this.nextEducationYear = true
        }
    },
    watch:{
        choiseUser(){
            if(this.choiseUser){
                this.choisingUser('add', this.user.id)
            } else {
                this.choisingUser('remove', this.user.id)
            }
        }
    }
}
</script>
