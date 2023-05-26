<template>
    <div class="work">
      <div class="work__content d-flex">
        <div class="work__logo d-flex flex-column justify-content-center justify-center">
            
          <!-- under Review -->
          <v-img
          v-if="test.status.value=='under-review' && getRole=='author' || test.status.value=='under-review' && test.status.step==2 && getRole=='inspector'"
          src="@/assets/media/test_check.png"
          contain
          max-width="40"
          width="40"
          ></v-img>
          <!-- Incoming -->
          <v-img
          v-if="test.status.value=='under-review' && test.status.step==1 && getRole=='inspector' || test.status.value=='under-review' && test.status.step==2 && getRole=='admin'"
          src="@/assets/media/test_incoming.png"
          contain
          max-width="40"
          width="40"
          ></v-img>
          <!-- Approved -->
          <v-img
          v-if="test.status.value=='approved'"
          src="@/assets/media/test_approved.png"
          contain
          max-width="40"
          width="40"
          ></v-img>
          <!-- Rejected -->
          <v-img
          v-if="test.status.value=='rejected'"
          src="@/assets/media/test_rejected.png"
          contain
          max-width="40"
          width="40"
          ></v-img>

        </div>
        <div class="work__info d-flex justify-content-center">
          <table>
            <tr>
              <td>Subject:</td>
              <td style="color:#0167FF;"><div style="max-width: 90px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">{{ getSubjectName(test.info.params.subject) }}</div></td>
            </tr>
            <tr>
              <td>Questions:</td>
              <td style="color:#0167FF;text-align: right;">{{ test.info.testInfo.totalQuestions }}</td>
            </tr>
            <tr>
              <td style="opacity:0">space</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td style="color:#9201ff;text-align: right;" v-if="test.status.value=='under-review' && getRole=='author' || test.status.value=='under-review' && test.status.step==2 && getRole=='inspector'">Under review</td>
              <td style="color:#9d630c;text-align: right;" v-if="test.status.value=='under-review' && test.status.step==1 && getRole=='inspector' || test.status.value=='under-review' && test.status.step==2 && getRole=='admin'">Incoming</td>
              <td style="color:#14917f;text-align: right;" v-if="test.status.value=='approved'">Approved</td>
              <td style="color:#ff3001;text-align: right;" v-if="test.status.value=='rejected'">Rejected</td>
            </tr>
          </table>
          
          <div style="position: absolute; bottom:10px;left:0;" v-if="test.status.value=='under-review' && getRole=='author' || test.status.value=='under-review' && test.status.step==2 && getRole=='inspector'">
            <span style="font-size: 2em; color: #9201ff" >•</span>
            <span style="font-size: 2em;" :style="test.status.step>1 ? 'color: #9201ff' : 'color: #888'">•</span>
          </div>
          
          <div style="position: absolute; bottom:25px;left:0;" v-if="test.status.value=='rejected'">
            <span style="font-size: 0.9em; width: 100%">
              From:
              <span v-if="test.status.rejected=='inspector'" style="color: var(--red-color)">Inspector ({{ test.remarks.length }})</span>
              <span v-if="test.status.rejected=='admin'" style="color: var(--red-color)">Administrator ({{ test.remarks.length }})</span>
            </span>
          </div>
        </div>
      </div>
      <div class="work__menu d-flex justify-space-between align-center">
        <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                v-bind="props"
                icon="mdi-dots-horizontal"
                size="30"
                class="ml-1"
                >
              </v-btn>
            </template>
            <v-list density="compact" width="120">

              <test-info :test="test" />
              <test-history :test="test" />
              <test-update :test="test" v-if="test.status.value=='rejected' && getRole=='author'" :reRenderTests="reRenderTests ? reRenderTests : undefined" />
              <test-export :test="test" v-if="test.status.value=='rejected' && getRole=='author'"/>
              <test-delete :test="test" v-if="getRole=='admin' || test.author==getAuthParams.id && test.status.value!='approved'"/>

            </v-list>
        </v-menu>

        <v-tooltip location="bottom" color="#00000073">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              height="31"
              variant="text"
              v-if="getRole=='inspector' && test.status.value=='under-review' && test.status.step==1 || getRole=='admin' && test.status.value=='under-review' && test.status.step==2"
              @click="goToInspect(test._id)"
              >
              <v-icon color="#0167FF" size="22">mdi-arrow-top-right</v-icon>
            </v-btn>
          </template>
          <span>Go to work check</span>
        </v-tooltip>
      </div>
    </div>
</template>

<script>
import { getSubject } from '@/plugins/getInfo'
import { mapGetters, mapMutations } from 'vuex';
import TestInfo from '@/components/TestCard/dialogs/TestInfo.vue';
import TestHistory from '@/components/TestCard/dialogs/TestHistory.vue';
import TestUpdate from '@/components/TestCard/dialogs/TestUpdate.vue';
import TestExport from '@/components/TestCard/dialogs/TestExport.vue';
import TestDelete from '@/components/TestCard/dialogs/TestDelete.vue';

export default {
  props:{
    test: Object,
    reRenderTests: Function
  },
  computed: mapGetters(['getSubjects', 'getRole', 'getAuthParams']),
  methods:{
    ...mapMutations(['setInspectTest']),
    getSubjectName(id){
      return getSubject(id, this.getSubjects)
    },

    goToInspect(id){
      this.setInspectTest(id)
      this.$router.push('/inspect')
    }
  },
  components: {
    TestInfo,
    TestHistory,
    TestUpdate,
    TestExport,
    TestDelete
  }
}
</script>

<style scoped>
.work{
  width: 250px;
  height: 150px;
  background-color: rgb(240, 240, 240);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.25);
  -webkit-box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.25);
  -moz-box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.25);
  transition: box-shadow 0.2s ease-in-out;
}
.work:hover{
  box-shadow: 0px 6px 8px -1px rgb(0 0 0 / 20%), 0px 8px 9px 0px rgb(0 0 0 / 14%), 0px 5px 14px 0px rgb(0 0 0 / 12%);
}

.work__content{
height: 115px;
padding: 15px 10px 0;
}
.work__logo{
  height: 100%;
  width: 60px;
  opacity: 0.5;
}
.work__info{
  width: 100%;
  margin-left: 15px;
  position: relative;
}

.work__menu{
  width: 100%;
  height: 35px;
  border-top: 1px solid rgb(156, 156, 156);
  background-color: rgb(217, 217, 217);
}

.work__item:hover{
background-color: rgb(224, 224, 224);
}
.work__item:not(:first-child){
  border-left: 1px solid rgb(156, 156, 156);
}

.work__info>table{
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}
</style>