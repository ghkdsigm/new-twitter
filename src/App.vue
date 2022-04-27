<template>
  <div class="flex h-screen container mx-auto dark:bg-black" :class="this.$store.state.darkmode ? 'dark' : ''">
    <!--사이드섹션-->
    <div class="w-20 lg:w-1/4 pt-5 lg:ml-10 flex flex-col justify-between border-r border-gray-200 dark:border-gray-700">
      <div class="flex flex-col items-center lg:items-start">
        <!--트위터 로고-->
        <router-link to="/">
          <i class="fab fa-twitter text-3xl text-primary hover:text-dark lg:ml-4 mb-3"><span class="ml-5 text-lg hidden lg:inline-block">승현이의 트위터</span></i>
        </router-link>

        <!--사이드메뉴-->
        <div class="flex flex-col items-start space-y-1">
          <router-link :to="route.path" class="hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 px-4 py-2 rounded-full  cursor-pointer dark:text-white" v-for="route in routes" :key="route">
            <i :class="route.icon"></i>
            <span class="ml-5 text-lg hidden lg:inline-block">{{route.title}}</span>
          </router-link>
          
        </div>
        <!--트위터 버튼-->
        <div class="w-full lg:pr-3 flex justify-center">
            <button class="mt-3 bg-primary text-white lg:w-full w-12 h-12 rounded-full hover:bg-dark">
              <span class="hidden lg:inline-block">트윗</span>
              <i class="fas fa-plus lg:hidden"></i>
            </button>
        </div>
        <!--다크모드-->
        <div class="w-full lg:pr-3 flex justify-center mt-7">
            <button type="button" class="px-2 mb-1" @click="toggleDarkMode">
                <i class="far fa-sun  border-2 border-gray-800 text-white px-3 py-2 dark:bg-gray-800 rounded-full lg:text-sm text-xl" :class="isShow ? 'block' : 'hidden'"> <span class="hidden lg:inline-block pl-0 lg:pl-1"> 밝은모드</span></i>
                <i class="far fa-moon  border-2 border-blue-600  text-blue-600 px-3 py-2 rounded-full lg:text-sm text-xl" :class="isShow ? 'hidden' : 'block'"> <span class="hidden lg:inline-block pl-0 lg:pl-1"> 다크모드</span></i>
            </button>
        </div>
      </div>

      <!--프로필 버튼-->
      <div class="lg:pr-3 mb-3">
          <button class="hidden lg:flex mt-3 px-2 py-1 w-full h-12 rounded-full hover:bg-blue-50  items-center">
          <img src="http://picsum.photos/100" class="w-10 h-10 rounded-full">
          <div class="lg:ml-2 hidden lg:block">
            <div class="text-sm font-bold">hsh.com</div>
            <div class="text-xs text-gray-500 text-left">@hsh</div>
          </div>
          <i class="fas fa-ellipsis-h fa-fw text-xl ml-auto  hidden lg:block"></i>
          </button>
          <div class="lg:hidden flex justify-center">
            <img src="http://picsum.photos/100" class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80" />          
          </div>
      </div>
      
    </div>
    <!--메인섹션-->
    <div class="flex-1 flex h-screen">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref,onBeforeMount,onMounted } from 'vue'
import { useStore } from 'vuex'
import router from './router'

export default {
  setup(){
    const routes = ref([])
    //const isDark = ref(true)
    const store = useStore()
    let isDark = localStorage.getItem('darkMode') == 'true'
    let isShow = localStorage.getItem('darkModeShow') == 'true'
    let changeDark = localStorage.getItem('changeDark') == 'true'

    onBeforeMount(()=>{
      routes.value = router.options.routes
    });
    onMounted(()=>{
      let set = store.state.darkmode;
      if(set == true){
        localStorage.getItem('darkMode') == 'true'
      }

      if(localStorage.getItem('changeDark') === 'true'){
        document.documentElement.classList.add('dark'); 
        document.documentElement.style.background = 'black';
      }
    });


    return {
      routes,
      isDark,
      isShow,
      changeDark
    }
  },  
  methods:{
    toggleDarkMode(){
        this.isDark = !this.isDark;
        this.isShow = !this.isShow;
        this.changeDark = !this.changeDark;
        localStorage.setItem('darkMode', this.isDark);     
        localStorage.setItem('darkModeShow', this.isShow);  
        this.$store.dispatch('toggleDarkMode', this.isDark);

        if (localStorage.getItem('darkMode') === 'true') {                    
            localStorage.setItem('changeDark', this.changeDark);  
            document.documentElement.style.background = 'black';
            this.changeDark = true;
            document.documentElement.classList.add('dark');    
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.background = 'white';
            localStorage.removeItem('changeDark', this.changeDark);  
        }   
    }
  },
  
}
</script>

<style>

</style>