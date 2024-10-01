import { fetchData } from '../helpers/client';
import { Player, Team } from '../types/premierLeague';

const SOURCE_ENDPOINT =
  'https://fantasy.premierleague.com/api/bootstrap-static/';

export const positions: Record<number, { short: string; long: string }> = {
  1: { short: 'GKP', long: 'Goalkeeper' },
  2: { short: 'DEF', long: 'Defender' },
  3: { short: 'MID', long: 'Midfielder' },
  4: { short: 'FWD', long: 'Forward' },
};

export const getData = async (): Promise<{
  teams: Team[];
  players: Player[];
}> => {
  const { teams, elements } = await fetchData(SOURCE_ENDPOINT);

  return {
    teams,
    players: elements,
  };
};
