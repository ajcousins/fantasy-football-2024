import { getDetailedEvent } from '../dataSource/premierLeague';
import { GameEvent, Team } from '../types/premierLeague';

interface Fixture {
  id: number;
  short_name: string;
  fixtureDifficulty: number;
  homeOrAway: 'HOME' | 'AWAY';
}

export interface DetailedTeam extends Team {
  runIn: Fixture[];
}

interface RunInRecord {
  eventId: number;
  id: number;
  short_name: string;
  fixtureDifficulty: number;
  homeOrAway: 'HOME' | 'AWAY';
}

const createRunInRecord = (
  eventId: number,
  id: number,
  shortName: string,
  fixtureDifficulty: number,
  homeOrAway: 'HOME' | 'AWAY'
): RunInRecord => ({
  eventId,
  id,
  short_name: shortName,
  fixtureDifficulty,
  homeOrAway,
});

export const getDetailedTeamMap = async (
  teams: Team[],
  events: GameEvent[],
  eventsToFetch: number[]
): Promise<Map<number, Team>> => {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const nextEvent = eventsToFetch[0] - 1;
  const eventIds = events
    .map((e) => e.id)
    .slice(nextEvent, nextEvent + eventsToFetch.length);

  const detailedEvents = (
    await Promise.all(eventIds.flatMap((id) => getDetailedEvent(id)))
  ).flat();

  detailedEvents.forEach((de) => {
    const homeTeam = { ...teamMap.get(de.team_h) } as DetailedTeam;
    const awayTeam = { ...teamMap.get(de.team_a) } as DetailedTeam;
    if (!homeTeam || !awayTeam) return;

    const homeTeamRecord = createRunInRecord(
      de.event,
      awayTeam.id,
      awayTeam.short_name,
      de.team_h_difficulty,
      'HOME'
    );

    const awayTeamRecord = createRunInRecord(
      de.event,
      homeTeam.id,
      homeTeam.short_name,
      de.team_a_difficulty,
      'AWAY'
    );

    if (!homeTeam.runIn) {
      homeTeam.runIn = [homeTeamRecord];
    } else {
      homeTeam.runIn.push(homeTeamRecord);
    }

    if (!awayTeam.runIn) {
      awayTeam.runIn = [awayTeamRecord];
    } else {
      awayTeam.runIn.push(awayTeamRecord);
    }

    teamMap.set(homeTeam.id, homeTeam);
    teamMap.set(awayTeam.id, awayTeam);
  });

  return teamMap;
};

const indexWeighting = [1, 0.9, 0.8, 0.7, 0.6];

export const totalRunInDifficulties = (
  acc: number,
  fixture: Fixture,
  i: number
): number => {
  return acc + fixture.fixtureDifficulty * indexWeighting[i];
};
