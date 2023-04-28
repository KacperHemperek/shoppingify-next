import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

export type NewListItem = {
  id: number;
  amount: number;
  name: string;
  category: string;
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
      const category = state.categories[action.payload.categoryName];

      if (category) {
        category.push({
          amount: 1,
          id: action.payload.itemId,
          name: action.payload.itemName,
          category: action.payload.categoryName,
        });
      } else {
        state.categories[action.payload.categoryName] = [
          {
            amount: 1,
            id: action.payload.itemId,
            name: action.payload.itemName,
            category: action.payload.categoryName,
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
      const category = state.categories[action.payload.categoryName];
      if (category) {
        state.categories[action.payload.categoryName] = category.filter(
          (item) => item.id !== action.payload.itemId
        );

        if (state.categories[action.payload.categoryName]?.length === 0) {
          delete state.categories[action.payload.categoryName];
        }
      }
    },
    clearList: (state, _action: PayloadAction<void>) => {
      Object.keys(state.categories).forEach((key) => {
        delete state.categories[key];
      });
    },
    changeItemAmount: (
      state,
      action: PayloadAction<{
        itemId: number;
        categoryName: string;
        type: 'increment' | 'decrement';
        number?: number;
      }>
    ) => {
      const category = state.categories[action.payload.categoryName];

      if (category) {
        const itemIndex = category.findIndex(
          (item) => item.id === action.payload.itemId
        );

        if (itemIndex === -1 || itemIndex === undefined) {
          return;
        }

        const amountToChange =
          action.payload.type === 'increment'
            ? action.payload.number ?? 1
            : action.payload.number
            ? -action.payload.number
            : -1;
        const item = category[itemIndex];

        if (item) {
          item.amount += amountToChange;

          if (item.amount <= 0) {
            state.categories[action.payload.categoryName] = category.filter(
              (item) => item.id !== action.payload.itemId
            );

            state.categories[action.payload.categoryName]?.length === 0 &&
              delete state.categories[action.payload.categoryName];
          }
        }
      }
    },
  },
});

export const { addItem, removeItem, changeItemAmount, clearList } =
  newListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCategories = (state: RootState) =>
  Object.entries(state.newList.categories).sort((a, b) => {
    const nameA = a[0].toLowerCase();
    const nameB = b[0].toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

export const itemAlreadyOnLIst = (
  state: RootState,
  itemId: number,
  categoryName: string
) => {
  return Boolean(
    state.newList.categories[categoryName]?.find((item) => item.id === itemId)
  );
};

export const getAllItems = (state: RootState) =>
  Object.entries(state.newList.categories)
    .map(([_categoryName, items]) => items)
    .reduce((prev, current) => [...prev, ...current], []);

export default newListSlice.reducer;
