import { createStore } from 'vuex'
import auth from '@/store/modules/auth'
import testsList from '@/store/modules/testsList'
import inspectState from '@/store/modules/inspectState'
import subjectsList from '@/store/modules/subjectsList'
import usersList from '@/store/modules/usersList'
import departmentsList from '@/store/modules/departmentsList'
import userData from '@/store/modules/userData'
import devicesList from '@/store/modules/devicesList'
import params from '@/store/modules/params'

export default createStore({
  modules: {
    auth,
    testsList,
    inspectState,
    subjectsList,
    usersList,
    departmentsList,
    userData,
    devicesList,
    params
  }
})
