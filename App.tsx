import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

enum MemorizerAction {
  PLAYING,
  STOPPED,
  NONE
}

const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

interface MemorizerItem {
  emoji: string,
  flipped: boolean,
  match: boolean,
}

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [action, setAction] = useState(MemorizerAction.NONE)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(-1)
  const [memorizerGrid, setMemorizerGrid] = useState<MemorizerItem[]>([])

  useEffect(() => {
    let result: MemorizerItem[] = []
    emojis.forEach(e => result.push(
      { emoji: e, flipped: false, match: false },
      { emoji: e, flipped: false, match: false }
    ))
    setMemorizerGrid(_ => result.sort(() => Math.random() - 0.5));
  }, [])

  const toggleRunning = () => {
    setRunning(!running)
    if (action === MemorizerAction.NONE) {
      setAction(MemorizerAction.PLAYING)
    }
  }

  const startTimer = useCallback(() => {
    const id = setInterval(() => {
      setElapsedTime(currentValue => currentValue + 1)
    }, 1000)

    setIntervalId(id)
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(intervalId)
  }, [intervalId])

  useEffect(() => {
    if (running) {
      startTimer()
    } else {
      restartTimer(MemorizerAction.STOPPED)
      stopTimer()
    }
  }, [running])

  const getTimeFormatted = useCallback(() => {
    const minutes = Math.floor(elapsedTime / 60).toString()
    const seconds = (elapsedTime % 60).toString()
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }, [elapsedTime])

  const restartTimer = useCallback((newAction: MemorizerAction) => {
    setAction(newAction)
    setElapsedTime(0)
  }, [])

  return (
    <SafeAreaView style={appStyles.page}>
      <View>
        <Text style={appStyles.title}>Memorizer</Text>
        <Text style={appStyles.timer}>{getTimeFormatted()}</Text>
      </View>
      <View style={appStyles.container}>
        <FlatList
          data={memorizerGrid}
          keyExtractor={(grid, index) => `${grid}_${index}`}
          numColumns={4}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => {
              let newMemorizerGrid = [...memorizerGrid]
              newMemorizerGrid[index] = {
                ...newMemorizerGrid[index],
                flipped: !newMemorizerGrid[index].flipped
              }
              setMemorizerGrid(newMemorizerGrid)
            }}>
              <View style={appStyles.item}>
                <Text style={appStyles.item_content}>{item.flipped ? item.emoji : ""}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
      <Text style={appStyles.message}>Faltam 99 pares.</Text>
      <Button color='blue' title={running ? 'Reiniciar' : 'Iniciar'} onPress={toggleRunning} />
    </SafeAreaView>
  )
}

const appStyles = StyleSheet.create({
  page: {
    justifyContent: 'space-around',
    height: "100%"
  },
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
    justifyContent: 'center',
    alignItems: 'center',
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
