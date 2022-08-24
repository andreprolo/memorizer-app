import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

enum MemorizerAction {
  PLAYING,
  WAITING
}

const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

enum ItemState {
  HIDED,
  VISIBLE,
  MATCHED,
}

interface MemorizerItem {
  emoji: string,
  state: ItemState,
}

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [action, setAction] = useState(MemorizerAction.WAITING)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(-1)
  const [memorizerGrid, setMemorizerGrid] = useState<MemorizerItem[]>([])

  useEffect(() => {
    initializeNewGame()
  }, [])

  const initializeNewGame = () => {
    let result: MemorizerItem[] = []
    emojis.forEach(e => result.push(
      { emoji: e, state: ItemState.HIDED },
      { emoji: e, state: ItemState.HIDED },
    ))
    setMemorizerGrid(_ => result.sort(() => Math.random() - 0.5));
  }

  const toggleRunning = () => {
    setRunning(!running)
    if (action === MemorizerAction.WAITING) {
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
      restartTimer(MemorizerAction.WAITING)
      stopTimer()
      initializeNewGame()
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
        <Text style={action === MemorizerAction.PLAYING ? appStyles.timer : [appStyles.timer, { color: 'grey' }]}>{getTimeFormatted()}</Text>
      </View>
      <View style={appStyles.container}>
        <FlatList
          data={memorizerGrid}
          keyExtractor={(grid, index) => `${grid}_${index}`}
          numColumns={4}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => {
              if (!running) return
              let newMemorizerGrid = [...memorizerGrid]
              if (newMemorizerGrid[index].state == ItemState.HIDED) {
                newMemorizerGrid[index] = {
                  ...newMemorizerGrid[index],
                  state: ItemState.VISIBLE
                }
                setMemorizerGrid(newMemorizerGrid)
              }
            }}>
              <View style={action === MemorizerAction.PLAYING ? appStyles.item : [appStyles.item, { borderColor: 'grey' }]}>
                {
                  item.state != ItemState.MATCHED &&
                  <Text style={appStyles.item_content}>{item.state == ItemState.VISIBLE ? item.emoji : ""}</Text>
                }
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
      <Text style={action === MemorizerAction.PLAYING ? appStyles.message : [appStyles.message, { color: 'grey' }]}>Faltam 8 pares.</Text>
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
