import { View, Text, ActivityIndicator } from 'react-native'

const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#078ECB" />
    </View>
  )
}

export default Loader