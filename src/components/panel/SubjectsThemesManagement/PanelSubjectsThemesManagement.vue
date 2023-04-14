<template>
    <div class="wrapper">
        <title-component :title="'Subjects & themes management'" />

        <div class="content">
            <div class="subjects section">
                <!-- Header -->
                <header-component :section="'subject'" :switchFunction="switchForm" :status="addSubjectForm"/>
                <!-- Form -->
                <add-form :section="'subject'" :switchFunction="switchForm" v-if="addSubjectForm"/>
                <!-- Table -->
                <table-component :section="'subject'" />
            </div>

            <v-divider vertical></v-divider>

            <div class="themes section">
                <!-- Header -->
                <header-component :section="'theme'" :switchFunction="switchForm" :status="addThemeForm"/>
                <!-- Form -->
                <add-form :section="'theme'" :switchFunction="switchForm" v-if="addThemeForm"/>
                <!-- Table -->
                <table-component :section="'theme'" />
            </div>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import HeaderComponent from '@/components/panel/SubjectsThemesManagement/HeaderComponent';
import AddForm from '@/components/panel/SubjectsThemesManagement/AddForm';
import TableComponent from '@/components/panel/SubjectsThemesManagement/TableComponent';

export default {
    data(){
        return {
            addSubjectForm: false,
            addThemeForm: false
        }
    },
    methods:{
        switchForm(form){
            if(form == 'subject'){
                this.addSubjectForm = !this.addSubjectForm
            }else {
                this.addThemeForm = !this.addThemeForm
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