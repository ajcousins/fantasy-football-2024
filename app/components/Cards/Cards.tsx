/* eslint-disable @next/next/no-img-element */
'use client'
import React from "react"
import { AppendedPlayer, Team } from "@/app/types/premierLeague";
import styles from "./cards.module.css";
import { positions } from "@/app/dataSource/premierLeague";
import { decimaliseString } from "../../helpers/format";

const RESOURCE_URL = "https://resources.premierleague.com/premierleague/photos/players/"
const IMG_SIZE = "250x250"



interface IProps {
  players: AppendedPlayer[];
  teamMap: Map<number, Team>;
}

const Cards = ({ players, teamMap }: IProps) => {
  // console.log('players:', players);
  return (
    <div>
      {players.map((p, i) => {
        const team = teamMap.get(p.team_code);
        const stats = [
          {
            label: 'Total Points',
            stat: p.total_points,
          },
          {
            label: 'Cost',
            stat: decimaliseString(p.now_cost.toString()),
          },
          {
            label: 'Cost Value',
            stat: p.costValue,
          },
          {
            label: 'Total Points',
            stat: p.total_points,
          },
        ]
        // console.log('team:', team);
        if (!team) return null;

        return <div key={p.web_name} className={styles.card}>
          <img src={`${RESOURCE_URL}${IMG_SIZE}/p${p.code}.png`} alt={`${p.second_name}`} />
          <div className={styles['card_player_info']}>
            <h3>{i + 1}</h3>
            <span className={styles['card_position']}>{positions[p.element_type].long}</span>
            <h4>{p.first_name} {p.second_name}</h4>
            <p>{team.name}</p>
          </div>
          <div className={styles['card_stat_wrapper']}>
            {stats.map(s => (<div key={`${p.web_name}_${s.label}_stat`} className={styles['card_player_stat']}>
              <span className={styles['card_stat_label']}>{s.label}:</span>
              <span>{s.stat}</span>
            </div>)
            )}
          </div>
        </div>
      })}
    </div>
  )
};

export default Cards;
