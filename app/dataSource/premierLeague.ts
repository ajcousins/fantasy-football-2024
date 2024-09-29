import { fetchData } from '../helpers/client';
import { Player, Team } from '../types/premierLeague';

const SOURCE_ENDPOINT =
  'https://fantasy.premierleague.com/api/bootstrap-static/';

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
