<template>
    <div class="wrapper">
        <title-component :title="'Signs management'" />

        <main-users-table :mode="'signs'" />
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import MainUsersTable from '@/components/panel/MainUsersTable';

export default {
    components:{
        TitleComponent,
        MainUsersTable
    }
}
</script>