import { View, Text, Image, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { TouchableOpacity } from 'react-native'
import { ResizeMode, Video } from 'expo-av'
import { likePost } from '../lib/appwrite'
import { usePathname } from 'expo-router'
import { deletePost } from '../lib/appwrite'

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    liked_by,
    $id,
  },
  userID,
}) => {
  const [play, setPlay] = useState(false)
  const likedBy = Array.isArray(liked_by)
    ? liked_by.map((user) => user.$id)
    : []

  const [isLiked, setLiked] = useState(likedBy.includes(userID))
  const [isLoading, setLoading] = useState(false)

  const likepost = async () => {
    setLoading(true)
    try {
      await likePost($id, userID)
      setLiked(!isLiked)
      Alert.alert('Post liked successfully')
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setLoading(false)
    }
  }
  const deleteOnePost = async () => {
    setLoading(true)
    try {
      await deletePost($id)
      Alert.alert('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setLoading(false)
    }
  }

  const pathName = usePathname()

  const isProfile = pathName.startsWith('/profile')

  return (
    <View className="flex-col items-center px-4 mb-14 flex">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5 ">
            <Image
              source={{ uri: avatar }}
              resizeMode="contain"
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="flex-1 justify-center gap-y-1 ml-3">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Pressable onPress={isProfile ? deleteOnePost : likepost} active>
            {isProfile ? (
              <View className="w-15 h-6 bg-secondary rounded-lg p-1 shadow-md ">
                <Text className=" text-white text-center font-pmedium ">
                  Delete
                </Text>
              </View>
            ) : (
              <Image
                source={icons.bookmark}
                className="w-5 h-5"
                resizeMode="contain"
                tintColor={isLiked ? '#FF9C01' : ''}
              />
            )}
          </Pressable>
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VideoCard
