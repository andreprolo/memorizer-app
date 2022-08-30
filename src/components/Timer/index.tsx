import React from "react";
import { Text } from "react-native";
import { MemorizerAction } from "../../screens/Game";
import { TimerProps } from "./interface";
import Styles from "./styles";

const Timer: React.FC<TimerProps> = ({ action, timer }) => {
  return (
    <Text style={[Styles.timer, action === MemorizerAction.PLAYING ? {} : Styles.disabled]}>{timer}</Text>
  )
}

export default Timer
