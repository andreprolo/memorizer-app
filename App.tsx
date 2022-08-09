import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

const grid = [
  ["🦜", "🏀", "🍄", "💉"],
  ["🧨", "🔮", "💣", "🐸"],
  ["🦜", "🏀", "🍄", "💉"],
  ["🧨", "🔮", "💣", "🐸"],
]

const App = () => {
  return (
    <SafeAreaView>
      <Text style={appStyles.title}>Memorizer</Text>
      <Text style={appStyles.timer}>00:00</Text>

      <View style={appStyles.container}>
        {
          grid.map((row, index) => (
            <View key={index} style={appStyles.row}>
              {row.map(emoji => (
                <View style={appStyles.item} key={`${index}${emoji}`}>
                  <Text style={appStyles.item_content}>{emoji}</Text>
                </View>
              ))}
            </View>
          ))
        }
      </View>

      <Text style={appStyles.message}>Faltam 99 pares.</Text>
      <Button color='blue' title="Iniciar" onPress={() => { }} />
    </SafeAreaView>
  )
}

const appStyles = StyleSheet.create({
  title: {
    fontSize: 32,
    marginTop: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    marginTop: 25,
    textAlign: 'center',
  },
  message: {
    fontSize: 22,
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 5,
    borderColor: '#304494',
    width: 75,
    height: 75,
  },
  item_content: {
    fontSize: 38,
  },
})

export default App
