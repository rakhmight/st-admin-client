<template>
  <div class="dashboard bg-color">
    <div class="navbar bg-special-color">
      <div class="navbar__header d-flex flex-row align-center">
        <v-icon class="mr-1">mdi-cog</v-icon>
        <span class="text-h6">Admin panel</span>
      </div>
        <v-divider thickness="2" class="mt-2 mb-3"></v-divider>
        <div class="navbar__content">
          <div class="nav-group">
            <div class="nav-group__title text-overline text-blue-lighten-4">
              Management
            </div>
            <div class="nav-group-items">
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='users' ? 'text-light-blue-special' : ''" @click="tab='users'">
                <v-icon size="22" class="mr-3">mdi-account-group</v-icon>
                <span>Users</span>
              </div>
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='tests' ? 'text-light-blue-special' : ''" @click="tab='tests'">
                <v-icon size="22" class="mr-3">mdi-note-text</v-icon>
                <span>Tests</span>
              </div>
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='exams' ? 'text-light-blue-special' : ''" @click="tab='exams'">
                <v-icon size="22" class="mr-3">mdi-clock-time-eight</v-icon>
                <span>Exams</span>
              </div>
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='signs' ? 'text-light-blue-special' : ''" @click="tab='signs'">
                <v-icon size="22" class="mr-3">mdi-draw</v-icon>
                <span>Signs</span>
              </div>
            </div>
          </div>

          <div class="nav-group mt-5">
            <div class="nav-group__title text-overline text-blue-lighten-4">
              General
            </div>
            <div class="nav-group-items">
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='results' ? 'text-light-blue-special' : ''" @click="tab='results'">
                <v-icon size="22" class="mr-3">mdi-clipboard-text</v-icon>
                <span>Results</span>
              </div>
            </div>
          </div>

          <div class="nav-group mt-5">
            <div class="nav-group__title text-overline text-blue-lighten-4">
              Monitoring
            </div>
            <div class="nav-group-items">
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='server-state' ? 'text-light-blue-special' : ''" @click="tab='server-state'">
                <v-icon size="22" class="mr-3">mdi-access-point</v-icon>
                <span>Server state</span>
              </div>
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='server-calls' ? 'text-light-blue-special' : ''" @click="tab='server-calls'">
                <v-icon size="22" class="mr-3">mdi-bell-ring</v-icon>
                <span>Server calls</span>
              </div>
              <div class="nav-group__item d-flex flex-row align-center" :class="tab=='logs' ? 'text-light-blue-special' : ''" @click="tab='logs'">
                <v-icon size="22" class="mr-3">mdi-notebook</v-icon>
                <span>Logs</span>
              </div>
            </div>
          </div>
        </div>
    </div>

    <div class="content">
        <panel-users-management v-if="tab=='users'"/>
        <panel-tests-management v-if="tab=='tests'"/>
        <panel-exams-management v-if="tab=='exams'"/>
        <panel-signs-management v-if="tab=='signs'"/>
        <panel-results v-if="tab=='results'"/>
        <panel-server-state v-if="tab=='server-state'"/>
        <panel-server-calls v-if="tab=='server-calls'"/>
        <panel-logs v-if="tab=='logs'"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelUsersManagement from '@/components/panel/PanelUsersManagement'
import PanelTestsManagement from '@/components/panel/PanelTestsManagement'
import PanelExamsManagement from '@/components/panel/PanelExamsManagement'
import PanelSignsManagement from '@/components/panel/PanelSignsManagement'
import PanelResults from '@/components/panel/PanelResults'
import PanelServerState from '@/components/panel/PanelServerState'
import PanelServerCalls from '@/components/panel/PanelServerCalls'
import PanelLogs from '@/components/panel/PanelLogs'

export default {
  data(){
    return {
      tab: 'users'
    }
  },
  computed: mapGetters(["getAuthState"]),
  mounted() {
    if(!this.getAuthState){
        this.$router.push('/')
    }
  },
  components:{
    PanelUsersManagement,
    PanelTestsManagement,
    PanelExamsManagement,
    PanelSignsManagement,
    PanelResults,
    PanelServerState,
    PanelServerCalls,
    PanelLogs
  }
}
</script>


<style scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 270px auto;
}
.navbar{
  width: 100%;
  min-height: 100vh;
  padding: 74px 15px 20px;
  color: #fff;
}
.content{
  width: 100%;
  min-height: 100vh;
  padding: 74px 30px 20px;
}

.nav-group__item{
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.nav-group__item:hover{
  background-color: #ffffff2f
}
.text-light-blue-special{ 
  color: #7baef9
}
</style>
