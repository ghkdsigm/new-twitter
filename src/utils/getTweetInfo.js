import { LIKE_COLLECTION, RETWEET_COLLECTION, USER_COLEECTION } from '../firebase'

export default async (tweet, currentUser) => {
  // 유저정보추가
  const doc = await USER_COLEECTION.doc(tweet.uid).get()
  tweet.profile_image_url = doc.data().profile_image_url
  tweet.email = doc.data().email
  tweet.username = doc.data().username

  // 리트윗정보추가
  const retweetSnapshot = await RETWEET_COLLECTION.where('from_tweet_id', '==', tweet.id).where('uid', '==', currentUser.uid).get()
  if (retweetSnapshot.empty) {
    tweet.isRetweeted = false
  } else {
    tweet.isRetweeted = true
  }

  // 좋아요정보추가
  const likeSnapshot = await LIKE_COLLECTION.where('from_tweet_id', '==', tweet.id).where('uid', '==', currentUser.uid).get()
  if (likeSnapshot.empty) {
    tweet.isLiked = false
  } else {
    tweet.isLiked = true
  }

  return tweet
}