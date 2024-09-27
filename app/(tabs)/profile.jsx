import { View, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import EmptyState from '../../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { router, useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { TouchableOpacity } from 'react-native'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import LoadingState from '../../components/LoadingState'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()

  const { data: posts, isLoading } = useAppwrite(() => getUserPosts(user.$id))
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading')
  const logout = async () => {
    setIsLoggingOut(true)
    setLoadingText('Logging out...')
    try {
      await signOut()
      setUser(null)
      setIsLoggedIn(false)
      router.replace('/sign-in')
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      {isLoading || isLoggingOut ? (
        <LoadingState text={loadingText} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard video={item} userID={user.$id} />
          )}
          ListHeaderComponent={() => {
            return (
              <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                <TouchableOpacity
                  className="w-full items-end mb-10"
                  onPress={logout}
                >
                  <Image
                    source={icons.logout}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </TouchableOpacity>
                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <InfoBox
                  title={user?.username}
                  containerStyles="mt-5"
                  titleStyles="text-lg"
                />
                <View className="mt-5 flex-row">
                  <InfoBox
                    title={posts.length || 0}
                    containerStyles="mr-10"
                    titleStyles="text-xl"
                    subtitle="Posts"
                  />
                  <InfoBox
                    title="1.2K"
                    subtitle="Followers"
                    titleStyles="text-xl"
                  />
                </View>
              </View>
            )
          }}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for the search query"
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

export default Profile
