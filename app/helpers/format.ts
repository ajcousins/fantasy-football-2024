'use client';
import { Player } from '../dataSource/premierLeague';

export const costFormatter = (_: unknown, row: Player) => {
  const costArr = row.now_cost.toString().split('');
  costArr.splice(costArr.length - 1, 0, '.');
  return costArr.join('');
};
