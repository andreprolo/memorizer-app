import React, { useCallback, useEffect, useState } from 'react'
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

enum MemorizerAction {
  PLAYING,
  WAITING,
  FINISHED,
}

enum ItemState {
  HIDED,
  VISIBLE,
  MATCHED,
}

interface MemorizerItem {
  emoji: string,
  state: ItemState,
}

const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [action, setAction] = useState(MemorizerAction.WAITING)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(-1)
  const [memorizerGrid, setMemorizerGrid] = useState<MemorizerItem[]>([])
  const [pairsLeft, setPairsLeft] = useState(8)

  useEffect(() => {
    initializeNewGame()
  }, [])

  useEffect(() => {
    if (running) {
      startTimer()
    } else {
      restartTimer(MemorizerAction.WAITING)
      stopTimer()
      initializeNewGame()
    }
  }, [running])

  useEffect(() => {
    let matchedCount = memorizerGrid.filter(i => i.state === ItemState.MATCHED).length
    setPairsLeft(8 - matchedCount / 2)

    if (matchedCount == 16) {
      stopTimer()
      setAction(MemorizerAction.FINISHED)
    }
  }, [memorizerGrid])

  const initializeNewGame = () => {
    let result: MemorizerItem[] = []
    emojis.forEach(e => result.push(
      { emoji: e, state: ItemState.HIDED },
      { emoji: e, state: ItemState.HIDED },
    ))
    setMemorizerGrid(_ => result.sort(() => Math.random() - 0.5))
    setPairsLeft(8)
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

  const getTimeFormatted = useCallback(() => {
    const minutes = Math.floor(elapsedTime / 60).toString()
    const seconds = (elapsedTime % 60).toString()
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }, [elapsedTime])

  const restartTimer = useCallback((newAction: MemorizerAction) => {
    setAction(newAction)
    setElapsedTime(0)
  }, [])

  const handleItemClick = (item: MemorizerItem, index: number) => {
    if (action !== MemorizerAction.PLAYING) return

    if (item.state === ItemState.HIDED) {
      let visibleItems = memorizerGrid.filter(i => i.state === ItemState.VISIBLE)
      let newItemState = ItemState.VISIBLE
      let newMemorizerGrid = [...memorizerGrid]

      if (visibleItems.length == 1 && visibleItems.some(i => i.emoji === item.emoji)) {
        newMemorizerGrid = memorizerGrid.map(i => i.emoji === item.emoji ? { ...i, state: ItemState.MATCHED } : i)
        newItemState = ItemState.MATCHED
      } else if (visibleItems.length > 1) {
        newMemorizerGrid = memorizerGrid.map(i => i.state === ItemState.VISIBLE ? { ...i, state: ItemState.HIDED } : i)
      }

      newMemorizerGrid[index] = {
        ...item,
        state: newItemState
      }
      setMemorizerGrid(newMemorizerGrid)
    }
  }

  return (
    <SafeAreaView style={appStyles.page}>
      <View>
        <Text style={appStyles.title}>Memorizer</Text>
        <Text style={[appStyles.timer, action === MemorizerAction.PLAYING ? {} : appStyles.disabled]}>{getTimeFormatted()}</Text>
      </View>
      <View style={appStyles.container}>
        <FlatList
          scrollEnabled={false}
          data={memorizerGrid}
          keyExtractor={(grid, index) => `${grid}_${index}`}
          numColumns={4}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => { handleItemClick(item, index) }}>
              <View style={[appStyles.item, action === MemorizerAction.PLAYING && item.state !== ItemState.MATCHED ? {} : appStyles.disabled]}>
                <Text style={appStyles.item_content}>{item.state !== ItemState.HIDED ? item.emoji : ""}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
      <Text style={[appStyles.message, action === MemorizerAction.PLAYING ? {} : appStyles.disabled]}>Faltam {pairsLeft} pares.</Text>
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
  disabled: {
    color: 'grey',
    borderColor: 'grey'
  }
})

export default App
