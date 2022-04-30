<template>
  <div class="flex h-screen container mx-auto relative"> 
    <!--사이드섹션-->
    <div class="w-20 lg:w-1/5 pt-5 pl-5 pr-5 lg:ml-10 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800">
      <div class="flex flex-col items-center lg:items-start">
        <!--트위터 로고-->
        <router-link to="/">
          <i class="fab fa-twitter transition-all ease-in-out lg:text-3xl text-xl text-primary hover:text-dark lg:ml-4 mb-3"><span class="ml-5 text-lg font-light hidden lg:inline-block align-text-top">승현이의 트위터</span></i>
        </router-link>

        <!--사이드메뉴-->
        <div class="flex flex-col items-start space-y-3 lg:mt-4 lg:mb-4">
          <router-link :to="route.path" :class="`transition-all ease-in-out hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 px-4 py-2 rounded-full  cursor-pointer dark:text-gray-300 ${router.currentRoute.value.name == route.name ? 'text-primary dark:text-primary'  : ''}`" v-for="route in routes" :key="route">
            <div v-if="route.meta.isMenu">
                <i :class="route.icon"></i>
                <span class="ml-5 text-xl font-light hidden lg:inline-block">{{route.title}}</span>
            </div>
          </router-link>          
        </div>
        <!--트위터 버튼-->
        <div class="w-full lg:pr-3 flex justify-center shadow-[0_15px_30px_-25px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_25px_-25px_rgba(255,255,255,0.5)]">
            <button @click="showTweetModal = true" class="mt-3 transition-all ease-in-out bg-primary text-white lg:w-full lg:h-14 h-10 w-full rounded-full hover:bg-dark">
              <span class="hidden lg:inline-block text-lg">트윗</span>
              <i class="fas fa-paper-plane lg:hidden lg:text-xl text-base"></i>
            </button>
        </div>
        <!--다크모드-->
        <div class="w-full lg:pr-3 flex justify-center mt-7">
            <button type="button" class="px-2 mb-1" @click="toggleDarkMode" :class="this.$store.state.darkmode ? 'dark' : ''">
                <i class="far fa-sun transition-all ease-in-out border-2 border-gray-800 text-yellow-50 lg:px-5 px-3 py-2 dark:bg-gray-800 rounded-full lg:text-base text-base dark:hover:bg-opacity-80" :class="isDark ? 'hidden' : 'block'"> <span class="hidden lg:inline-block pl-0 lg:pl-2 text-white font-light"> 라이트모드</span></i>
                <i class="fas fa-moon transition-all ease-in-out border-2 border-blue-600  text-blue-600 lg:px-5 px-3 py-2 rounded-full lg:text-base text-base hover:bg-gray-50" :class="isDark ? 'block' : 'hidden'"> <span class="hidden lg:inline-block pl-0 lg:pl-2 font-light"> 다크모드</span></i>
            </button>
        </div>
      </div>

      <!--프로필 버튼-->
      <div class="lg:pr-3 mb-3 relative" @click="showProfileDropdown = true">
          <button class="transition-all ease-in-out hidden lg:flex mt-3 px-2 py-1 w-full h-12 rounded-full hover:bg-blue-50  dark:hover:bg-gray-800 items-center">
          <img :src="currentUser.profile_image_url" class="w-10 h-10 object-cover rounded-full">
          <div class="lg:ml-2 hidden lg:block">
            <div class="text-sm font-bold dark:text-white">{{ currentUser.email }}</div>
            <div class="text-sm text-gray-500 text-left dark:text-gray-400">@{{ currentUser.username }}</div>
          </div>
          <i class="fas fa-ellipsis-h fa-fw text-xl ml-auto  hidden lg:block dark:text-gray-400"></i>
          </button>
          <div class="lg:hidden flex justify-center">
            <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80" />          
          </div>
      </div>
      
    </div>
    <!--메인섹션-->
    <div class="flex-1 flex h-screen">
      <router-view></router-view>
    </div>

    <!-- 프로필 드롭다운 메뉴 -->
    <div class="absolute bottom-20 lg:left-10 left-5 border-2 border-gray-300 dark:border-gray-500 shadow-[0_25px_30px_-25px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_25px_-25px_rgba(255,255,255,0.5)] rounded-lg lg:w-80 w-60 bg-white dark:bg-gray-800" v-if="showProfileDropdown">
      <button class="border-b border-gray-300 dark:border-gray-600 flex p-3 w-full items-center cursor-default">
        <img :src="currentUser.profile_image_url" class="w-12 h-12 rounded-full" />
        <div class="ml-3">
          <div class="font-bold lg:text-lg text-sm dark:text-white">{{ currentUser.email }}</div>
          <div class="text-left text-gray-500 lg:text-base text-xs dark:text-gray-400">@{{ currentUser.username }}</div>
        </div>
        <i class="fas fa-solid fa-x text-red-500 ml-auto dark:text-white cursor-pointer"  @click="showProfileDropdown = false"></i>
        <!-- <i class="fas fa-check text-primary ml-auto" ></i> -->
      </button>
      <button class="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  w-full text-center text-sm" @click="onLogout">계정 로그아웃</button>
    </div>

    <!-- 트윗 모달 팝업 -->
    <tweet-modal v-if="showTweetModal" @close-modal="showTweetModal = false"></tweet-modal>
  </div>
</template>

<script>
import { ref,onBeforeMount,onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import router from '../router'
import { auth } from '../firebase'
import TweetModal from '../components/TweetModal.vue'

export default {    
  components: { TweetModal },
  setup(){
    const routes = ref([])
    //드롭다운
    const showProfileDropdown = ref(false)
    const showTweetModal = ref(false)
    const onLogout = async () => {
      if(confirm('로그아웃 하시겠습니다?')){
        await auth.signOut()
        store.commit('SET_USER', null)
        alert('승현이의 트위터에서 로그아웃 되었습니다.')
        await router.replace('/login')
      }
    }

    //유저정보 vuex에서 가져오기
    const currentUser = computed(() => store.state.user)
    
    //다크모드
    //const isDark = ref(true)
    const store = useStore()
    let isDark = localStorage.getItem('darkMode') == 'true'
    let isShow = localStorage.getItem('darkModeShow') == 'true'
    let changeDark = localStorage.getItem('changeDark') == 'true'

    onBeforeMount(()=>{
      //routes.value = router.options.routes
      routes.value = router.options.routes.filter((route) => route.meta.isMenu == true)
    });
    onMounted(()=>{
      let set = store.state.darkmode;
      if(set == true){
        localStorage.getItem('darkMode') == 'true'
      }

      if(localStorage.getItem('changeDark') == 'true'){
        document.documentElement.classList.remove('dark'); 
        document.documentElement.style.background = 'white';
      }
    });


    return {
      routes,
      isDark,
      isShow,
      changeDark, 
      showProfileDropdown, 
      onLogout, 
      currentUser, 
      router, 
      showTweetModal,
    }
  },  
  methods:{
    // 다크모드
    toggleDarkMode(){
        this.isDark = !this.isDark;
        this.isShow = !this.isShow;
        this.changeDark = !this.changeDark;
        localStorage.setItem('darkMode', this.isDark);     
        localStorage.setItem('darkModeShow', this.isShow);  
        this.$store.dispatch('toggleDarkMode', this.isDark);

        if (localStorage.getItem('darkMode') == 'true') {                    
            localStorage.setItem('changeDark', this.changeDark);  
            document.documentElement.style.background = 'white';
            this.changeDark = true;
            document.documentElement.classList.remove('dark');    
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.style.background = 'black';
            localStorage.removeItem('changeDark', this.changeDark);  
        }   
    }
  },
  
}
</script>

<style>

</style>