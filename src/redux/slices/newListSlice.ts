import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

type newListItem = {
  id: number;
  amount: number;
  name: string;
};

// Define a type for the slice state
type newListState = {
  categories: { [key: string]: newListItem[] };
};

// Define the initial state using that type
const initialState: newListState = {
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
      if (
        action.payload.categoryName in state.categories &&
        Boolean(state.categories[action.payload.categoryName]?.length)
      ) {
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
  },
});

export const { addItem } = newListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCategories = (state: RootState) => state.newList.categories;

export default newListSlice.reducer;
