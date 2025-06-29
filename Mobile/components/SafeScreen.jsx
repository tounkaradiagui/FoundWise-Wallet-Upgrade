import { View, Text } from 'react-native'
import React, { use } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({children}) => {
    // This component can be used to wrap screens to ensure they are safe from notches, etc.

    const insets = useSafeAreaInsets();
    return (
    <View style={{paddingTop: insets.top, flex: 1, backgroundColor: 'white'}} >
      {children}
    </View>
  )
}

export default SafeScreen