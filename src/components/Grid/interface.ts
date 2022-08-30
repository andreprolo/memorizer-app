import { MemorizerAction } from "../../screens/Game";

export interface GridPrps {
  stopTimer: () => void,
  action: MemorizerAction,
  setAction: (_: MemorizerAction) => void
  setPairsLeft: (_: number) => void,
}
