import { GameEvent } from "../types/premierLeague";

const getNextEventNumber = (events: GameEvent[]) => 
  events.find(e => new Date(e.deadline_time) > new Date())?.id ?? 0

export const getNextEventIds = (quantity: number, events: GameEvent[]): number[] => {
  const numberOfEvents = events.length;
  const nextEventNumber = getNextEventNumber(events);
  let counter = nextEventNumber;
  const nextEvents = []

  while (counter <= numberOfEvents && nextEvents.length < quantity) {
    nextEvents.push(counter);
    counter++;
  }

  return nextEvents;
}

export const getNextEvents = (quantity: number, events: GameEvent[]): GameEvent[] => {
  const ids = getNextEventIds(quantity, events);
  return ids.map(id => events[id - 1]);
}