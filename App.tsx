import React, { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

enum MemorizerAction {
  PLAYING,
  STOPPED,
  NONE
}

const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

const grid = [
  ["🦜", "🏀", "🍄", "💉"],
  ["🧨", "🔮", "💣", "🐸"],
  ["🦜", "🏀", "🍄", "💉"],
  ["🧨", "🔮", "💣", "🐸"],
]

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [action, setAction] = useState(MemorizerAction.NONE)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(-1)

  const toggleRunning = () =>{
    setRunning(!running)
    if (action === MemorizerAction.NONE) {
      setAction(MemorizerAction.PLAYING)
    }
  }

  const startTimer = useCallback(() => {
		const id = setInterval( () => {
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
    <SafeAreaView>
      <Text style={appStyles.title}>Memorizer</Text>
      <Text style={appStyles.timer}>{getTimeFormatted()}</Text>
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
      <Button color='blue' title={running ? 'Reiniciar' : 'Iniciar'} onPress={toggleRunning} />
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