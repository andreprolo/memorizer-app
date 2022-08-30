import { MemorizerAction } from "../../screens/Game";

export enum ItemState {
  HIDED,
  VISIBLE,
  MATCHED,
}

export interface MemorizerItem {
  emoji: string,
  state: ItemState,
}

export interface ItemProps {
  item: MemorizerItem,
  action: MemorizerAction,
  onPress: () => void,
}
