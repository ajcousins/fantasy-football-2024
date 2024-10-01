/* eslint-disable @next/next/no-img-element */
import React from "react"
import { Player, Team } from "@/app/types/premierLeague";
import styles from "./cards.module.css";
import { positions } from "@/app/dataSource/premierLeague";

const RESOURCE_URL = "https://resources.premierleague.com/premierleague/photos/players/"
const IMG_SIZE = "250x250"



interface IProps {
  players: Player[];
  teamMap: Map<number, Team>;
}

const Cards = ({ players, teamMap }: IProps) => {
  // console.log('players:', players);
  return (
    <div>
      {players.map((p, i) => {
        const team = teamMap.get(p.team_code);
        // console.log('team:', team);
        if (!team) return null;

        return <div key={p.web_name} className={styles.card}>
          <img src={`${RESOURCE_URL}${IMG_SIZE}/p${p.code}.png`} alt={`${p.second_name}`} />
          <div className={styles['card_player_info']}>
            <h3>{i + 1}</h3>
            <span>{positions[p.element_type].long}</span>
            <h4>{p.first_name} {p.second_name}</h4>
            <p>{team.name}</p>
          </div>
        </div>
      })}
    </div>
  )
};

export default Cards;
