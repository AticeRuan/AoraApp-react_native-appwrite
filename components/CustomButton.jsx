import { TouchableOpacity, Text, Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({
  title,
  handpress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-secondary-100 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      onPress={handpress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}  `}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton
