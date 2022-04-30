<template>
  <div class="flex-1 flex">
      <!--채팅리스트-->
      <div class="w-2/5 border-r border-gray-100 dark:border-gray-800 overflow-y-auto">
      <div class="flex flex-col">
        <div class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70 p-3 font-bold text-xl border-b border-gray-100 dark:text-white dark:border-gray-800 h-14">쪽지</div>
       
        <!-- 유저 목록 한개 -->
        <div @click="onSelectUser(user)" class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70 flex cursor-pointer px-3 py-4 hover:bg-gray-50 dark:hover:bg-transparent border-b border-gray-100 dark:border-gray-800" v-for="user in users" :key="user.id">
          <img :src="user.profile_image_url" class="w-10 h-10 object-cover rounded-full cursor-pointer mr-2" />
          <div class="flex space-x-2">
            <div class="font-bold dark:text-white">{{ user.email }}</div>
            <div class="text-gray-500 dark:text-gray-400">@{{ user.username }}</div>
            <div class="text-gray-500">{{ moment(user.created_at).format('M월 DD일') }}</div>
          </div>
        </div>
      </div>
    </div>
      <!--채팅-->
      <div class="w-3/5 border-r border-gray-100 dark:border-gray-800" v-if="selectedUser">
        <div class="flex flex-col h-screen">
            <!--타이틀-->
            <div class="flex px-3 h-14 items-center border-b border-gray-100 dark:border-gray-800">
                <img :src="selectedUser.profile_image_url" class="w-8 h-8 rounded-full mr-2 cursor-pointer">
                <div>
                    <div class="font-bold text-xl dark:text-white">{{ selectedUser.email }}</div>
                    <div class="text-sm text-gray-500 dark-text-gray-400 dark:text-gray-400">@{{ selectedUser.username }}</div>
                </div>
            </div>
            <!--유저정보-->
            <div class="flex flex-col justify-center items-center border-b border-gray-100 dark:border-gray-800  py-6">
                <div>
                    <span class="font-bold mr-1 dark:text-white">{{ selectedUser.email }}</span>
                    <span class="text-gray-500 dark:text-gray-400">@{{ selectedUser.username }}</span>
                </div>
                <div>
                    <span class="font-bold mr-1 dark:text-gray-400">{{ selectedUser.followings.length }}</span><span class="text-gray-500">팔로우 중</span>
                    <span class="font-bold ml-3 mr-1 dark:text-gray-400">{{ selectedUser.followers.length }}</span><span class="text-gray-500">팔로워</span>
                </div>
                <div>
                    <span class="text-gray-500 mr-1">가입일</span>
                    <span class="text-gray-500 dark:text-gray-400">{{ moment(selectedUser.created_at).format('YYYY년 MM월') }}</span>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto lg:pl-3 lg:pr-3">
                <div v-for="message in messages" :key="message.id">
                  <!--채팅내용 마이채팅-->
                  <div v-if="currentUser.uid === message.from_uid" class="text-right px-3 py-3 mt-2 mb-2">
                      <span class="bg-primary dark:bg-blue-700 text-white px-4 py-2 text-lg rounded-full">{{ message.message_body }}</span>
                      <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          {{ moment(message.created_at).fromNow() }}
                      </div>
                  </div>
                  <!--채팅내용 상대방 채팅-->
                  <div v-else class="text-left px-3 py-3 mt-2 mb-2">
                      <span class="bg-gray-100 dark:bg-gray-300 px-4 py-2 text-lg rounded-full">{{ message.message_body }}</span>
                      <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          {{ moment(message.created_at).fromNow() }}
                      </div>
                  </div>
                </div>                
            </div>

            <!--채팅 인풋-->
            <div class="flex items-center bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 sticky">
                <input @keypress.enter="onSendMessage" v-model="messageBody" type="text" class="m-2 py-3 px-4 rounded-full bg-gray-100 dark:bg-opacity-5 dark:text-white resize-none outline-none flex-1" placeholder="새 쪽지 작성하기" />
                <button class="text-center"  @click="onSendMessage">
                    <i class="far fa-paper-plane mr-3 text-primary text-lg hover:bg-lighter dark:hover:bg-opacity-5 p-2 rounded-full w-10 h-10"></i>
                </button>
            </div>
        </div>
      </div>
      <div class="w-3/5 border-r dark:border-gray-800 m-5" v-else>
        <div class="font-bold text-lg">선택된 사용자가 없습니다.</div>
        <div class="text-gray">사용자를 선택해 주세요.</div>
      </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue'
import { MESSAGE_COLLECTION, USER_COLEECTION } from '../firebase'
import store from '../store'
import moment from 'moment'
export default {
  setup() {
    const currentUser = computed(() => store.state.user)
    const users = ref([])
    const selectedUser = ref(null)
    const messageBody = ref('')
    const messages = ref([])

    onBeforeMount(async () => {
      const snapshot = await USER_COLEECTION.orderBy('created_at', 'desc').get()
      snapshot.docs.forEach((doc) => {
        let user = doc.data()
        if (user.email === currentUser.value.email) return
        users.value.push(user)
      })
    })

    const onSelectUser = async (user) => {
      selectedUser.value = user
      //내가쓴 메시지
      let snapshot = await MESSAGE_COLLECTION.where('from_uid', '==', currentUser.value.uid).where('to_uid', '==', selectedUser.value.uid).get()
      messages.value = snapshot.docs.map((doc) => doc.data())
      //상대가 쓴 메시지
      snapshot = await MESSAGE_COLLECTION.where('to_uid', '==', currentUser.value.uid).where('from_uid', '==', selectedUser.value.uid).get()
      snapshot.docs.map((doc) => messages.value.push(doc.data()))
      messages.value = messages.value.sort((a, b) => (a.created_at > b.created_at ? 0 : -1))
    }
    const onSendMessage = async () => {
      if (!messageBody.value || !selectedUser.value) return
      const doc = MESSAGE_COLLECTION.doc()
      let message = {
        id: doc.id,
        from_uid: currentUser.value.uid,
        to_uid: selectedUser.value.uid,
        message_body: messageBody.value,
        created_at: Date.now(),
      }
      await doc.set(message)
      messages.value.push(message)
      messageBody.value = ''
    }
    return {
      currentUser,
      users,
      moment,
      onSelectUser,
      onSendMessage,
      messageBody,
      messages,
      selectedUser,
    }
  },
}
</script>

<style>

</style>