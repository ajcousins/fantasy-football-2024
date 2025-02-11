import { fetchData } from '../helpers/client';
import { DetailedEvent, GameEvent, Player, Team } from '../types/premierLeague';

const SOURCE_ENDPOINT =
  'https://fantasy.premierleague.com/api/bootstrap-static/';

const DETAILED_EVENT_ENDPOINT =
  'https://fantasy.premierleague.com/api/fixtures/'

export const positions: Record<number, { short: string; long: string }> = {
  1: { short: 'GKP', long: 'Goalkeeper' },
  2: { short: 'DEF', long: 'Defender' },
  3: { short: 'MID', long: 'Midfielder' },
  4: { short: 'FWD', long: 'Forward' },
  5: { short: 'MAN', long: 'Manager'},
};

export const getData = async (): Promise<{
  teams: Team[];
  players: Player[];
  events: GameEvent[];
}> => {
  const { teams, elements, events } = await fetchData(SOURCE_ENDPOINT);

  return {
    teams,
    players: elements,
    events,
  };
};

export const getDetailedEvent = async (eventId: number): Promise<DetailedEvent[]> => {
  const data = await fetchData(`${DETAILED_EVENT_ENDPOINT}?event=${eventId}`)
  // console.log('data:', data);
  return data;
}