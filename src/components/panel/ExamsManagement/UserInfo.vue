<template>
    <div>
        <div v-if="user.userRole == 'student'">
                <span>student of {{ getUserCourse(+user.roleProperties.recieptDate) }} course {{ user.roleProperties.group }} group ({{ user.roleProperties.educationForm }})</span> <!-- FIXME: form of educ -->
        </div>
        <div v-if="user.userRole == 'enrollee'">
            <span>enrollee of {{ user.roleProperties.group }} group ({{ user.roleProperties.admissionYear }}, {{ user.roleProperties.formOfEducation }})</span>
        </div>
        <div v-if="user.userRole == 'teacher'">
            <span>{{ getPosition(user.roleProperties.department,user.roleProperties.position) }} of {{ getDepartment(user.roleProperties.department) }} chair </span>
        </div>
        <div v-if="user.userRole == 'employee'">
                <span>{{ getPosition(user.roleProperties.department,user.roleProperties.position) }} of {{ getDepartment(user.roleProperties.department) }} department </span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCourse } from '@/plugins/getInfo'

export default {
    props:{
        user: Object
    },
    computed: mapGetters(['getDepartments']),
    methods: {
      getUserCourse(year){
        return getCourse(year)
      },

      getDepartment(department){
        const departmentName= this.getDepartments.find(item => item.id == department) || 'unknown'
        return departmentName.name.ru || departmentName.id
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
    }
}
</script>