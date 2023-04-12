<template>
    <v-container>
        <div class="wrapper">
          <div class="tests-nav-area"></div>
          <div class="tests-nav">
            <div class="title pt-3">
              <span class="text-h5">Tests</span>
              <v-divider></v-divider>
            </div>
            <div class="tests">
              <test-component :id="'test-345463'"/>
            </div>
          </div>

          <div class="content">
            <div class="reports">
              <div class="title pt-3">
                <span class="text-h5">Reports</span>
                <v-divider></v-divider>
              </div>

              <div class="reports__container mt-3">
                <report-component />
              </div>
            </div>

            <div class="date-nav">
              <div class="date-nav__wrapper">
                <div class="title pt-3 pl-3">
                  <span class="text-h5">Date</span>
                  <v-divider></v-divider>
                </div>

                <div class="date-nav__content mt-3">
                  <date-component />
                </div>
              </div>
            </div>
          </div>
        </div>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TestComponent from '@/components/reports/TestComponent.vue';
import ReportComponent from '@/components/reports/ReportComponent.vue';
import DateComponent from '@/components/reports/DateComponent.vue'

export default {
  computed: mapGetters(["getAuthState"]),
  mounted(){
    if(!this.getAuthState){
        this.$router.push('/')
    }
  },
  components:{
    TestComponent,
    ReportComponent,
    DateComponent
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
.v-container{
  padding-top: 0;
  padding-bottom: 0;
}
.wrapper{
  width: 100%;
  display: grid;
  grid-template-columns: 250px auto;
  padding-top: 74px;
  padding-bottom: 20px;
}

.tests-nav{
  width: 250px;
  height: 88vh;
  max-height: 88vh;
  padding: 0 15px;
  position: fixed;
  background-color: #fff;
  border-radius: 5px;
  display:grid;
  grid-template-rows: 45px auto;
}
.tests{
  margin: 15px 0;
  height: auto;
  overflow-y: scroll;
}
.content{
  width: 100%;
  display: grid;
  grid-template-columns: auto 170px;
  position: relative;
}

.reports{
  padding: 0 20px;
  height: 88vh;
  max-height: 88vh;
  display:grid;
  grid-template-rows: 45px auto;
}
.reports__container{
  overflow-y: scroll; 
  display: flex;
  flex-direction: column;
  gap:30px;
}

.date-nav{
  border-left: 1px solid #a4a4a4;
}
.date-nav__wrapper{
  height: 88vh;
  max-height: 88vh;
  display:grid;
  grid-template-rows: 45px auto;
}
.date-nav__content{
  overflow-y: scroll; 
}
</style>
