import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

type NewListItem = {
  id: number;
  amount: number;
  name: string;
};

// Define a type for the slice state
type NewListState = {
  categories: { [key: string]: NewListItem[] };
};

// Define the initial state using that type
const initialState: NewListState = {
  categories: {},
};

export const newListSlice = createSlice({
  name: 'newList',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        itemId: number;
        itemName: string;
        categoryName: string;
      }>
    ) => {
      if (action.payload.categoryName in state.categories) {
        state.categories[action.payload.categoryName]?.push({
          amount: 1,
          id: action.payload.itemId,
          name: action.payload.itemName,
        });
      } else {
        state.categories[action.payload.categoryName] = [
          {
            amount: 1,
            id: action.payload.itemId,
            name: action.payload.itemName,
          },
        ];
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{
        itemId: number;
        categoryName: string;
      }>
    ) => {
      if (action.payload.categoryName in state.categories) {
        state.categories[action.payload.categoryName] = state.categories[
          action.payload.categoryName
        ]!.filter((item) => item.id !== action.payload.itemId);

        if (state.categories[action.payload.categoryName]?.length === 0) {
          delete state.categories[action.payload.categoryName];
        }
      }
    },
  },
});

export const { addItem, removeItem } = newListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCategories = (state: RootState) => state.newList.categories;

export const itemAlreadyOnLIst = (
  state: RootState,
  itemId: number,
  categoryName: string
) => {
  return Boolean(
    state.newList.categories[categoryName]?.find((item) => item.id === itemId)
  );
};

export default newListSlice.reducer;
