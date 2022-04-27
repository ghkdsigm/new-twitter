<template>
    <!--메인파트-->
    <div class="flex-1 border-r border-gray-100 dark:border-gray-700 overflow-y-auto" :class="isDark ? 'dark' : ''">
        <div class="flex flex-col">
        <!--페이지타이틀-->
        <div class="border-b border-gray-100 dark:border-gray-700 px-3 py-2 font-bold text-lg relative dark:text-white">
            홈  
            <!-- <span class="absolute right-1">
                <button type="button" class="px-2 mb-1" @click="toggleDarkMode">
                    <i class="far fa-sun bg-gray-100 border-2 border-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm" :class="isShow ? 'block' : 'hidden'"> 밝은모드켜기</i>
                    <i class="far fa-moon bg-gray-500 border-2 border-gray-100 text-white px-2 py-1 rounded-full text-sm" :class="isShow ? 'hidden' : 'block'"> 다크모드켜기</i>
                </button>
            </span> -->
        </div>
        <!--트위팅섹션-->
        <div class="flex px-3 py-3 border-b-8 border-gray-100 dark:border-gray-700">
            <img src="http://picsum.photos/200" class="w-10 h-10 rounded-full hover:opacity-80 cursor-pointer" />
            <div class="ml-3 flex-1 flex flex-col">
                <textarea class="w-full text-xl font-thin focus:outline-none mb-3 resize-none dark:bg-black dark:text-white" placeholder="무슨 일이 일어나고 있나요?"></textarea>
                <div class="text-right">
                    <button class="bg-primary text-white text-sm font-bold px-4 py-1 rounded-full hover:bg-dark">트윗</button>
                </div>
            </div>
        </div>
        <!--트위트-->
        <Tweet v-for="tweet in 5" :key="tweet"/>
        </div>
    </div>
    <!--트렌드파트-->
    <Trends />
</template>

<script>
import Trends from '../components/Trends.vue'
import Tweet from '../components/Tweet.vue'
export default {
  components:{
    Trends,
    Tweet
  },
//   methods:{
//     toggleDarkMode(){
//         this.isDark = !this.isDark;
//         this.isShow = !this.isShow;
//         this.changeDark = !this.changeDark;
//         localStorage.setItem('darkMode', this.isDark);     
//         localStorage.setItem('darkModeShow', this.isShow);  
//         this.$store.dispatch('toggleDarkMode', this.isDark);

//         if (localStorage.getItem('darkMode') === 'true') {                    
//             localStorage.setItem('changeDark', this.changeDark);  
//             document.documentElement.style.background = 'black';
//             this.changeDark = true;
//             document.documentElement.classList.add('dark');    
//         } else {
//             document.documentElement.classList.remove('dark');
//             document.documentElement.style.background = 'white';
//             localStorage.removeItem('changeDark', this.changeDark);  
//         }   
//     }
//   },
//   mounted(){
//     if(localStorage.getItem('changeDark') === 'true'){
//         document.documentElement.classList.add('dark'); 
//         document.documentElement.style.background = 'black';
//     }
//   },
//   data(){
//     let isDark = localStorage.getItem('darkMode') == 'true'
//     let isShow = localStorage.getItem('darkModeShow') == 'true'
//     let changeDark = localStorage.getItem('changeDark') == 'true'

//     return{
//       isDark,
//       isShow,
//       changeDark
//     }
//   }
}
</script>

<style>

</style>