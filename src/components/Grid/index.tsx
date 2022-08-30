import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { MemorizerAction } from "../../screens/Game";
import Item from "../Item";
import { ItemState, MemorizerItem } from "../Item/interface";
import { GridPrps } from "./interface";
import Styles from "./styles";


const emojis = ["🦜", "🏀", "🍄", "💉", "🧨", "🔮", "💣", "🐸"]

const Grid: React.FC<GridPrps> = ({ stopTimer, action, setAction, setPairsLeft }) => {
  const [memorizerGrid, setMemorizerGrid] = useState<MemorizerItem[]>([])

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

  const initializeNewGame = () => {
    let result: MemorizerItem[] = []
    emojis.forEach(e => result.push(
      { emoji: e, state: ItemState.HIDED },
      { emoji: e, state: ItemState.HIDED },
    ))
    setMemorizerGrid(_ => result.sort(() => Math.random() - 0.5))
    setPairsLeft(8)
  }

  useEffect(() => {
    if (action === MemorizerAction.WAITING) {
      initializeNewGame();
    }
  }, [action])

  useEffect(() => {
    let matchedCount = memorizerGrid.filter(i => i.state === ItemState.MATCHED).length
    setPairsLeft(8 - matchedCount / 2)

    if (matchedCount == 16) {
      stopTimer()
      setAction(MemorizerAction.FINISHED)
    }
  }, [memorizerGrid])

  useEffect(() => {
    initializeNewGame()
  }, [])

  return (
    <View style={Styles.container}>
      <FlatList
        scrollEnabled={false}
        data={memorizerGrid}
        keyExtractor={(grid, index) => `${grid}_${index}`}
        numColumns={4}
        renderItem={({ item, index }) => (
          <Item onPress={() => { handleItemClick(item, index) }} action={action} item={item} />
        )}
      />
    </View>
  )
}

export default Grid
