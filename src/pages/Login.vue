<template>
  <div class="flex flex-col items-center space-y-4 justify-center h-screen pb-20">
    <i :class="`fab fa-twitter text-4xl text-primary  ${loading ? 'animate-bounce' : ''}`"></i>
    <span class="text-2xl font-bold dark:text-white text-center pb-2"><span class="text-xl font-light">승현이의 트위터</span> <br/>  로그인</span>
    <input v-model="email" type="text" class="w-96 px-4 py-3 border border-gray-300 dark:border-gray-400 focus:ring-2 focus:border-primary focus:outline-none dark:bg-black dark:text-white rounded-full" placeholder="이메일" />
    <input v-model="password" ref="myinput" @keyup.enter="onLogin" type="password" class="w-96 px-4 py-3 border border-gray-300 dark:border-gray-400 focus:ring-2 focus:border-primary focus:outline-none dark:bg-black dark:text-white rounded-full" placeholder="비밀번호" />
    <button class="text-black dark:text-white" @click="guestLogin">Guest 계정으로 로그인하기</button>
    <button v-if="loading" class="w-96 rounded-full bg-light text-white py-3">로그인 중입니다..</button>
    <button v-else class="w-96 rounded-full bg-primary text-white py-3 hover:bg-dark" @click="onLogin">로그인</button>
    <router-link to="/register">
      <button class="text-primary hover:text-blue-500">계정이 없으신가요? 회원가입 하기</button>
    </router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { auth, USER_COLEECTION } from '../firebase'
import { useRouter } from 'vue-router'
import store from '../store'

export default {
    setup() {
       const email = ref('') 
       const myinput = ref(null); // vue3 ref 사용방법
       const password = ref('') 
       const loading = ref(false)
       const router = useRouter()

       onMounted(()=>{
           console.log(store.state.user)
       })

       const onLogin = async () => {

            if (!email.value){
                return  alert('이메일을 입력해주세요')
            } else if (!password.value){
                return  alert('패스워드를 입력해주세요')
            }

           try{
               loading.value = true
               const credential = await auth.signInWithEmailAndPassword(email.value, password.value)
               const user = credential.user //고유값(uid) 가져오기
               
               // 유저정보 가져오기
               const doc = await USER_COLEECTION.doc(user.uid).get()
               //console.log(doc.data())
               store.commit('SET_USER', doc.data())
               router.replace("/") //router.push로 갔을경우 뒤로갔을때 다시 로그인 화면이 뜨기때문에 replace로 처음값을지정
           } catch(e) {
                switch (e.code) { //fire auth 에러코드 인터넷 검색하면 많이 나옴
                case 'auth/invalid-email':
                    alert('잘못된 이메일 형식입니다.')
                    break
                case 'auth/wrong-password':
                    alert('비밀번호가 틀립니다. 다시 시도해주세요.')
                    break
                case 'auth/user-not-found':
                    alert('등록되지 않은 이메일입니다.')
                    break
                default:
                    alert(e.message)
                    break
                }
           } finally {
               loading.value = false
           }
       }
       const guestLogin = () => {
           email.value = 'Guest@guest.com'
           password.value = 'guest1!'
           myinput.value.focus();
       }
       return {email,password,onLogin,loading,guestLogin,myinput}
    },
}
</script>



<style></style>