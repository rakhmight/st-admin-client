<template>
    <div class="wrapper">
        <title-component :title="'Subjects & themes management'" />

        <div class="content">
            <div class="subjects section">
                <!-- Header -->
                <header-component :section="'subject'" />
                <!-- Form -->
                <add-form :section="'subject'" />
                <!-- Table -->
                <table-component :section="'subject'" />
            </div>

            <v-divider vertical></v-divider>

            <div class="themes section">
                <!-- Header -->
                <header-component :section="'theme'" />
                <!-- Form -->
                <add-form :section="'theme'" />
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
    grid-template-columns: 1fr 1px 1fr;
    gap: 15px
}

.section{
    max-height: 79vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 41px auto auto;
}
</style>