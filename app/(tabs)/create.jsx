import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { createPost } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import LoadingState from '../../components/LoadingState'

const Create = () => {
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: '',
    thumbnail: '',
    prompt: '',
  })
  const { user } = useGlobalContext()

  const openPicker = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,

      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (type === 'video') {
        setForm({ ...form, video: result.assets[0] })
      }
      if (type === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert('Please fill all fields')
      return
    }
    setUploading(true)
    try {
      await createPost({ ...form, userId: user.$id })
      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setUploading(false)
      setForm({ title: '', video: '', thumbnail: '', prompt: '' })
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      {uploading ? (
        <LoadingState text="Uploading" />
      ) : (
        <ScrollView className="px-4 my-6">
          <Text className="font-psemibold text-2xl text-white">
            Upload Video
          </Text>
          <FormField
            title="Video Title"
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            placeholder="Give your video a catchy title..."
            otherStyles="mt-10"
          />
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload Video
            </Text>
            <TouchableOpacity onPress={() => openPicker('video')}>
              {form.video ? (
                <Video
                  resizeMode={ResizeMode.CONTAIN}
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Thumbnail Image
            </Text>
            <TouchableOpacity onPress={() => openPicker('image')}>
              {form.thumbnail ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-100 flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title="AI Prompt"
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            placeholder="The promt you used to generate the video..."
            otherStyles="mt-7"
          />
          <CustomButton
            title="Submit & Publish"
            handpress={submit}
            isLoading={uploading}
            containerStyles="mt-7"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Create
