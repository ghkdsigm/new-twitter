import { RETWEET_COLLECTION, TWEET_COLEECTION } from '../firebase'
import store from '../store'
import firebase from 'firebase'

export default async (tweet) => {
  try {
    // 이미 리트윗한 상황
    if (tweet.isRetweeted) {
      // 리트윈 doc 삭제
      const snapshot = await RETWEET_COLLECTION.where('from_tweet_id', '==', tweet.id).where('uid', '==', store.state.user.uid).get()
      await snapshot.docs[0].ref.delete()
      // 리트윗 숫자 감소
      await TWEET_COLEECTION.doc(tweet.id).update({
        num_retweets: firebase.firestore.FieldValue.increment(-1),
      })
    } else {
      // 리트윗하지않은 상황
      const doc = RETWEET_COLLECTION.doc()
      await doc.set({
        id: doc.id,
        from_tweet_id: tweet.id,
        uid: store.state.user.uid,
        created_at: Date.now(),
      })

      await TWEET_COLEECTION.doc(tweet.id).update({
        num_retweets: firebase.firestore.FieldValue.increment(1),
      })
    }
  } catch (e) {
    console.log('handle retweet error:', e)
  }
}