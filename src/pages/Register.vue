<template>
  <div class="flex flex-col items-center space-y-4 justify-center h-screen pb-20">
    <i :class="`fab fa-twitter text-4xl text-primary ${loading ? 'animate-bounce' : ''}`"></i>
    <span class="text-2xl font-bold dark:text-white text-center pb-2"><span class="text-xl font-light">승현이의 트위터</span> <br/> 회원가입</span>
    <input v-model="username" type="text" class="rounded-full w-96 px-4 py-3 border border-gray-300 dark:border-gray-400 focus:ring-2 focus:border-primary focus:outline-none dark:bg-black dark:text-white" placeholder="아이디" />
    <input v-model="email" type="text" class="rounded-full w-96 px-4 py-3 border border-gray-300 dark:border-gray-400 focus:ring-2 focus:border-primary focus:outline-none dark:bg-black dark:text-white" placeholder="이메일" />
    <input v-model="password" @keyup.enter="onRegister" type="password" class="rounded-full w-96 px-4 py-3 border border-gray-300 dark:border-gray-400 focus:ring-2 focus:border-primary focus:outline-none dark:bg-black dark:text-white" placeholder="비밀번호" />
    <span class="dark:text-gray-400 text-gray-500 text-xs text-right w-96">※ 패스워드는 6글자 이상 입력해주세요!</span>
    <button v-if="loading" class="w-96 rounded-full bg-light text-white py-3">회원가입 중입니다..</button>
    <button v-else class="w-96 rounded-full bg-primary text-white py-3 hover:bg-dark" @click="onRegister">회원가입</button>
    <router-link to="/login">
      <button class="text-primary hover:text-blue-500">계정이 이미 있으신가요? 로그인 하기</button>
    </router-link>
  </div>
</template>
<script>
import { ref } from 'vue'
import { auth, USER_COLEECTION } from '../firebase'
import { useRouter } from 'vue-router' 

export default {
    setup(){
        const username = ref('')
        const email = ref('')
        const password = ref('')
        const loading = ref(false)
        const router = useRouter()

        const onRegister = async () => {

            if(!username.value){
                return alert('아이디를 입력해주세요')
            } else if (!email.value){
                return  alert('이메일을 입력해주세요')
            } else if (!password.value){
                return  alert('패스워드를 입력해주세요')
            }

            try{
                loading.value = true
                const credential = await auth.createUserWithEmailAndPassword(email.value, password.value)
                const user = credential.user //고유값(uid) 가져오기
                const doc = USER_COLEECTION.doc(user.uid)
                await doc.set({
                    uid: user.uid,
                    username: username.value,
                    email: email.value,
                    profile_image_url: '/profile.jpeg',
                    background_image_url: '/background.png',
                    num_tweets: 0,
                    followers: [],
                    followings: [],
                    created_at: Date.now(),
                })
                alert('가입이 완료되었습니다, 로그인 해주세요!')
                router.push("/login")
            } catch(e){
                switch (e.code) {
                case 'auth/invalid-email':
                    alert('이메일을 바르게 입력해주세요')
                    break
                case 'auth/weak-password':
                    alert('비밀번호가 너무 쉬워요')
                    break
                case 'auth/email-already-in-use':
                    alert('이미 가입되어 있는 이메일 입니다.')
                    break
                default:
                    alert('회원가입 실패')
                    break
                }
            } finally {
                loading.value = false                
            }
        }
        return { username, email, password, onRegister, loading }
    }
}

</script>

<style></style>