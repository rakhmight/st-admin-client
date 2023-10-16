<template>
    <tr>
        <td width="50">{{ index }}</td>

        <td>
            <div class="pt-2 pb-2 d-flex flex-row align-center">
                <div style="width: 40px; height: 40px;">
                    <v-img :src="`${this.getAuthServerIP}/public/avatars/${user.id}.png`"></v-img>
                </div>
                <span class="ml-2">{{ user.bio.lastName }} {{ user.bio.firstName }} {{ user.bio.patronymic }}</span>
            </div>
        </td>

        <td>
            <user-info :user="user" />
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
import UserInfo from './UserInfo.vue';

export default {
    props:{
        index: Number,
        user: Object,
        users: Array,
        choisingUser: Function
    },
    components: {
        UserInfo
    },
    data(){
        return {            
            currentYear: null,
            nextEducationYear: false,
            choiseUser: this.users.indexOf(this.user.id)!=-1 ? true : false
        }
    },
    computed: mapGetters(['getDepartments', 'getAuthServerIP']),
    methods: {
      getCourse(year){
        if(this.nextEducationYear && this.currentYear-year!=3){
            return (this.currentYear-year)+1
        }
        return this.currentYear-year
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
