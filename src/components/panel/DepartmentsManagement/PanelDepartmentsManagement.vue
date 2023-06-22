<template>
    <div class="wrapper">
        <title-component :title="'Departments & positions management'" />

        <div class="content">
            <div class="departments section">
                <!-- Header -->
                <header-component :section="'department'" :switchFunction="switchForm" :status="addDepartmentForm"/>
                <!-- Form -->
                <add-form :section="'department'" :switchFunction="switchForm" v-if="addDepartmentForm"/>
                <!-- Table -->
                <table-component :section="'department'" />
            </div>

            <v-divider vertical></v-divider>

            <div class="positions section">
                <!-- Header -->
                <header-component :section="'position'" :switchFunction="switchForm" :status="addPositionForm"/>
                <!-- Form -->
                <add-form :section="'position'" :switchFunction="switchForm" v-if="addPositionForm"/>
                <!-- Table -->
                <table-component :section="'position'" />
            </div>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import HeaderComponent from '@/components/panel/DepartmentsManagement/HeaderComponent';
import AddForm from '@/components/panel/DepartmentsManagement/AddForm';
import TableComponent from '@/components/panel/DepartmentsManagement/TableComponent';

export default {
    data(){
        return {
            addDepartmentForm: false,
            addPositionForm: false
        }
    },
    methods:{
        switchForm(form){
            if(form == 'department'){
                this.addDepartmentForm = !this.addDepartmentForm
            }else {
                this.addPositionForm = !this.addPositionForm
            }
        }
    },
    components:{
        TitleComponent,
        HeaderComponent,
        AddForm,
        TableComponent
    }
}
</script>

<style scoped>
.content{
    padding: 15px;
    background-color: #fff;
    width: 100%;
    border-radius: 5px;
    display: grid;
    grid-template-columns: 1.2fr 1px 1fr;
    gap: 15px;
    font-family: "Roboto", sans-serif ;
}

.section{
    max-height: 79vh;
    min-height: 79vh;
    overflow: hidden;
}
</style>