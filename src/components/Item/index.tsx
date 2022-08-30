import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { MemorizerAction } from "../../screens/Game";
import { ItemProps, ItemState } from "./interface";
import Styles from "./styles";

const Item: React.FC<ItemProps> = ({ onPress, item, action }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[Styles.item, action === MemorizerAction.PLAYING && item.state !== ItemState.MATCHED ? {} : Styles.disabled]}>
        <Text style={Styles.item_content}>{item.state !== ItemState.HIDED ? item.emoji : ""}</Text>
      </View>
    </TouchableWithoutFeedback >
  )
}

export default Item;
