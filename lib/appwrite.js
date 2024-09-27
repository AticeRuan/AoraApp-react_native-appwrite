import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from 'react-native-appwrite'

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.chillotters.aora',
  projectId: '66f33f4000190baa2d12',
  databaseId: '66f3408200228254eeb2',
  userCollectionId: '66f3409a0005c9ca63af',
  videoCollectionId: '66f340bd00190f952c03',
  storageId: '66f341f60034c71b9220',
}

// Init your React Native SDK
const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    )
    if (!newAccount) throw new Error('Error creating user')

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    )
    console.log(newUser)
    return newUser
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export const signIn = async (email, password) => {
  try {
    // Check if there is an active session
    const currentSession = await account.getSession('current').catch(() => null)

    // If a session exists, delete it
    if (currentSession) {
      await account.deleteSession('current')
    }

    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)],
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')],
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))],
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)],
    )

    if (!posts) throw new Error('Something went wrong')

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')],
    )

    if (!posts) throw new Error('Something went wrong')

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLikedPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
    )

    if (!posts.documents || posts.documents.length === 0) {
      throw new Error('No posts found')
    }

    const filteredPosts = posts.documents.filter((post) => {
      const liked_by = Array.isArray(post.liked_by)
        ? post.liked_by.map((user) => user.$id)
        : []
      console.log('Liked by:', liked_by)
      return liked_by.includes(userId)
    })

    return filteredPosts // Return the filtered posts
  } catch (error) {
    throw new Error(error.message) // Ensure the correct error message is thrown
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mineType,
    size: file.fileSize,
    uri: file.uri,
  }
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset,
    )
    const fileUrl = await getFilePreview(uploadedFile.$id, type)
    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        'top',
        100,
      )
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const createPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    )

    return newPost
  } catch (error) {
    throw new Error(error)
  }
}

export const likePost = async (postId, userId) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId,
    )

    console.log('Post:', post)

    if (!post) throw new Error('Post not found')
    post.liked_by = post.liked_by || []

    const isLiked = post.liked_by.includes(userId)

    if (isLiked) {
      post.liked_by = post.liked_by.filter((id) => id !== userId)
    } else {
      post.liked_by.push(userId)
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId,
      { liked_by: post.liked_by },
    )

    return updatedPost
    console.log(updatedPost)
  } catch (error) {
    throw new Error(error)
  }
}
