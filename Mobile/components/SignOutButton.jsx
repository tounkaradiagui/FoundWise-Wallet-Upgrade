import { useClerk } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'

export const SignOutButton = () => {
  // This component can be used to sign out the user.
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/sign-in');
      
    } catch (err) {
      Toast.show(
        {
          type: 'error',
          text1: 'Déconnexion échouée',
          text2: 'Veuillez réessayer plus tard.',
          position: 'top',
          visibilityTime: 3000,
        });
    }
  }
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  )
}