<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="false"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
      <div class="button-group">
        <el-button class="nav-button" size="mini" @click="logout">注销</el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {SidebarItem, Logo},
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    routes() {
      return this.$store.getters.permission_routes
    },
    activeMenu() {
      const route = this.$route
      const {meta, path} = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="scss">

.button-group {
  position: fixed;
  bottom: 1vh;
  left: 1vh;
}

.nav-button {
  color: #20a0ff;
  background: transparent;
  font-size: 10px;
}

</style>
