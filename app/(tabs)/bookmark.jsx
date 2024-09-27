import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getLikedPosts } from '../../lib/appwrite'
import LoadingState from '../../components/LoadingState'

const Bookmark = () => {
  const { user } = useGlobalContext()

  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => getLikedPosts(user?.$id))
  useEffect(() => {
    refetch()
  }, [])

  const [onLoading, setOnLoading] = useState(false)

  useEffect(() => {
    setOnLoading(isLoading)
  }, [isLoading])

  return (
    <SafeAreaView className="bg-primary h-full">
      {onLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard video={item} userID={user?.$id} />
          )}
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
      )}
    </SafeAreaView>
  )
}

export default Bookmark
