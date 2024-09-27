import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getLikedPosts } from '../../lib/appwrite'

const Bookmark = () => {
  const { user } = useGlobalContext()

  const { data: posts, refetch } = useAppwrite(() => getLikedPosts(user.$id))
  useEffect(() => {
    refetch()
  }, [])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} userID={user?.$id} />}
        ListHeaderComponent={() => {
          return (
            <View className="my-6 px-4 ">
              <Text className="font-pmedium text-sm text-gray-100">
                BookMark
              </Text>
              <Text className="text-xl font-psemibold text-white">
                Saved Videos
              </Text>
              {/* <View className="mt-6 mb-8">
                <SearchInput />
              </View> */}
            </View>
          )
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Saved"
            subtitle="You have not saved any videos yet"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Bookmark
