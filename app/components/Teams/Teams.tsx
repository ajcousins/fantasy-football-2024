/* eslint-disable @next/next/no-img-element */
import { DetailedTeam } from "@/app/helpers/teams";
import styles from "./teams.module.css";

interface IProps {
  teams: DetailedTeam[]
}

const difficultyColour: Record<number, string> = {
  5: '#fd3535',
  4: '#f18a00',
  3: '#c5ca00',
  2: '#74ff52',
}

const BADGE_URL = 'https://resources.premierleague.com/premierleague/badges/70/t'

export const TeamCards = ({ teams }: IProps) => {
  return (teams.map((team) => {
    return (
      <div className={`${styles['team-card']} card-border`} key={team.short_name}>
        <img src={`${BADGE_URL}${team.code}.png`} alt={team.name} />
        {team.name}
        <div className={styles.fixtures}>
          {team.runIn.map((fixture, i) => {
            console.log('fixture:', fixture);
            return (
              <div style={{ backgroundColor: `${difficultyColour[fixture.fixtureDifficulty]}` }} className={styles.fixture} key={`fixture_${i}`}>
                {fixture.short_name}
              </div>
            )
          })}
        </div>
      </div>
    )
  }))
}