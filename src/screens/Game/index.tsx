import React, { useCallback, useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import Grid from "../../components/Grid";
import Timer from "../../components/Timer";
import Title from "../../components/Title";
import Styles from "./styles";


export enum MemorizerAction {
  PLAYING,
  WAITING,
  FINISHED,
}

const Game = () => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(-1)
  const [action, setAction] = useState(MemorizerAction.WAITING)
  const [pairsLeft, setPairsLeft] = useState(8)

  useEffect(() => {
    if (running) {
      startTimer()
    } else {
      restartTimer(MemorizerAction.WAITING)
      stopTimer()
    }
  }, [running])

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

  return (
    <SafeAreaView style={Styles.page}>
      <View>
        <Title />
        <Timer timer={getTimeFormatted()} action={action} />
      </View>
      <Grid stopTimer={stopTimer} action={action} setAction={setAction} setPairsLeft={setPairsLeft} />
      <Text style={[Styles.message, action === MemorizerAction.PLAYING ? {} : Styles.disabled]}>Faltam {pairsLeft} pares.</Text>
      <Button color='blue' title={running ? 'Reiniciar' : 'Iniciar'} onPress={toggleRunning} />
    </SafeAreaView>
  )
}

export default Game
