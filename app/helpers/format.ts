'use client';

import { Player } from "../types/premierLeague";

export const decimaliseString = (numString: string): string => {
  // Adds a decimal infront of last character
  const arr = numString.split('');
  arr.splice(arr.length - 1, 0, '.');
  return arr.join('');
};

export const costFormatter = (_: unknown, row: Player): string => {
  return decimaliseString(row.now_cost.toString());
};