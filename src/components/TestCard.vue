<template>
    <div class="work">
      <div class="work__content d-flex">
        <div class="work__logo d-flex flex-column justify-content-center justify-center">
            
          <!-- under Review -->
          <v-img
          v-if="true"
          src="@/assets/media/test_check.png"
          contain
          max-width="40"
          ></v-img>
          <!-- Approved -->
          <v-img
          v-if="false"
          src="@/assets/media/test_approved.png"
          contain
          max-width="40"
          ></v-img>
          <!-- Rejected -->
          <v-img
          v-if="false"
          src="@/assets/media/test_rejected.png"
          contain
          max-width="40"
          ></v-img>

        </div>
        <div class="work__info d-flex justify-content-center">
          <table>
            <tr>
              <td>Subject:</td>
              <td style="color:#0167FF">2231123</td>
            </tr>
            <tr>
              <td>Questions:</td>
              <td style="color:#0167FF">300</td>
            </tr>
            <tr>
              <td style="opacity:0">space</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td style="color:#9201ff" v-if="true">Under review</td>
              <td style="color:#0167FF" v-if="false">Approved</td>
              <td style="color:#ff3001" v-if="false">Rejected</td>
            </tr>
          </table>
          
          <div style="position: absolute; bottom:10px;left:0;">
            <span style="font-size: 2em; color: #9201ff">•</span>
            <span style="font-size: 2em; color: #888;">•</span>
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
              <v-list-item>
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-information-outline</v-icon>
                      <span class="menu-text">Info</span>
                  </v-list-item-title>
              </v-list-item>
              <v-list-item>
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-history</v-icon>
                      <span class="menu-text">History</span>
                  </v-list-item-title>
              </v-list-item>
              <v-list-item>
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-autorenew</v-icon>
                      <span class="menu-text">Update</span>
                  </v-list-item-title>
              </v-list-item>
              <v-list-item>
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-upload</v-icon>
                      <span class="menu-text">Export</span>
                  </v-list-item-title>
              </v-list-item>
              <v-list-item>
                  <v-list-item-title>
                      <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                      <span class="menu-text" style="color: var(--red-color)">Delete</span>
                  </v-list-item-title>
              </v-list-item>
                <!-- Info -->
                <!-- History -->
                <!-- Update -->
                <!-- Import -->
                <!-- Delete -->
            </v-list>
        </v-menu>

        <v-tooltip location="bottom" color="#00000073">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              height="31"
              variant="text"
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

export default {
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