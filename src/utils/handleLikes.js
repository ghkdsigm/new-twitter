import { LIKE_COLLECTION, TWEET_COLEECTION } from '../firebase'
import store from '../store'
import firebase from 'firebase'

export default async (tweet) => {
  try {
    // 이미 좋아요 누른 상황
    if (tweet.isLiked) {
      // 좋아요 doc 삭제
      const snapshot = await LIKE_COLLECTION.where('from_tweet_id', '==', tweet.id).where('uid', '==', store.state.user.uid).get()
      await snapshot.docs[0].ref.delete()
      // 좋아요 숫자 감소
      await TWEET_COLEECTION.doc(tweet.id).update({
        num_likes: firebase.firestore.FieldValue.increment(-1),
      })
    } else {
      // 좋아요 누르지 않은 상황
      const doc = LIKE_COLLECTION.doc()
      await doc.set({
        id: doc.id,
        from_tweet_id: tweet.id,
        uid: store.state.user.uid,
        created_at: Date.now(),
      })

      await TWEET_COLEECTION.doc(tweet.id).update({
        num_likes: firebase.firestore.FieldValue.increment(1),
      })
    }
  } catch (e) {
    console.log('handle like error:', e)
  }
}