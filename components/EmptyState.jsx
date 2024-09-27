import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router, usePathname } from 'expo-router'

const EmptyState = ({ title, subtitle }) => {
  const pathName = usePathname()
  const isBookMark = pathName.startsWith('/bookmark')
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-xl font-psemibold text-center mt-2 text-white">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      {!isBookMark && (
        <CustomButton
          title="Create video"
          handpress={() => router.push('/create')}
          containerStyles="w-full my-5"
        />
      )}
    </View>
  )
}

export default EmptyState
