import { View, Text, StyleSheet } from 'react-native';

export default function Divider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>ou</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '80%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
});
