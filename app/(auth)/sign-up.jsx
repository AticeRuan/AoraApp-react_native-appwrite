import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import LoadingState from '../../components/LoadingState'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext()

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill all fields')
    }
    setisSubmitting(true)
    try {
      const resutl = await createUser(form.email, form.password, form.username)
      setUser(resutl)
      setIsLoggedIn(true)
      Alert.alert('Success', 'Account created successfully')
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setisSubmitting(false)
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {isSubmitting ? (
          <LoadingState text="Signing up..." />
        ) : (
          <View className=" w-full justify-center min-h-[80vh] px-4 my-6">
            <Image
              source={images.logo}
              className="w-[115px] h-[35px]"
              resizeMode="contain"
            />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign up to Aora
            </Text>
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-10"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />
            <CustomButton
              title="Sign Up"
              handpress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an account already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-secondary-100"
              >
                Sign In
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
