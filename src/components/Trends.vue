<template>
    <div class="hidden lg:block lg:w-2/5 px-4 py-2">
        <!--트렌드검색-->
        <div class="relative mb-5">
            <input type="text" placeholder="트위터검색" class="pl-10 rounded-full w-full p-2 bg-gray-100 dark:bg-gray-700 text-sm dark:text-white focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none" />
            <i class="fas fa-search absolute left-0 mt-2 ml-3 text-base text-gray-500 dark:text-light"></i>
        </div>
        <!--나를위한 트렌드-->
        <div class="w-full rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col">
            <div class="flex items-center justify-between px-3 py-1 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xl font-bold dark:text-white">
                나를 위한 트렌드
                </span>
                <i class="fas fa-cog text-lg text-primary text-center hover:bg-blue-50 p-2 rounded-full"></i>
            </div>
            <div class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-transparent px-4 py-2 cursor-pointer" v-for="trend in 3" :key="trend">
                <div class="flex">
                <div class="flex-1 flex-col">
                    <div class="text-gray-500">대한민국에서 트렌드 중</div>
                    <div class="text-lg font-bold dark:text-white">김정민</div>
                    <div class="text-gray-500">1,141,222 트윗</div>
                </div>
                <i class="fas fa-ellipsis-h text-gray-500"></i>
                </div>
            </div>
            <div class="px-4 py-4">
                <span class="text-primary text-lg rounded-xl">더보기</span>
            </div>
        </div>
        <!--팔로우 추천-->
        <div class="mt-5 w-full rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col">
            <div class="items-center justify-between px-3 py-3 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xl font-bold dark:text-white">
                팔로우 추천
                </span>
            </div>
            <div class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-transparent px-4 py-2 cursor-pointer" v-for="trend in 3" :key="trend">
                <div class="flex items-center">            
                    <img src="../assets/jm.jpg" class="w-12 h-12 rounded-full mr-2">             
                <div class="flex-1 flex-col">
                    <div class="text-lg font-bold dark:text-white">김정민</div>
                    <div class="text-gray-500 text-sm">@dubookim_jm</div>
                </div>
                <div>
                    <button class="border-2 border-primary hover:bg-blue-100 px-4 py-1 text-sm rounded-full text-primary dark:bg-white dark:text-black dark:border-transparent dark:hover:bg-opacity-90">팔로우</button>
                </div>
                </div>
            </div>
            <div class="px-4 py-4">
                <span class="text-primary text-lg rounded-xl">더보기</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>