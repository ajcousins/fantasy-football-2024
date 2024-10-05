import { DataGrid, GridColDef } from '@mui/x-data-grid';
import styles from "./page.module.css";
import { getData, positions } from "./dataSource/premierLeague";
import { costFormatter } from './helpers/format';
import Cards from './components/Cards/Cards';
import { getNextEvents } from './helpers/gameEvents';
import { DetailedTeam, getDetailedTeamMap, totalRunInDifficulties } from './helpers/teams';
import { TeamCards } from './components/Teams/Teams';
import { TableWrapper } from './components/TableWrapper/TableWrapper';

export default async function Home() {
  const { players, teams, events } = await getData();
  const teamMap = new Map(teams.map(team => [team.code, team]))

  const appendedPlayers = players.map(player => {
    const teamId = player.team_code;
    const team = teamMap.get(teamId)
    const teamShortName = team ? team.short_name : ''
    const costValue = (player.total_points / player.now_cost * 10).toFixed(3)
    const formValue = (Number(player.form) / player.now_cost * 10).toFixed(3)
    const position = positions[player.element_type].short

    return {
      ...player,
      teamShortName,
      costValue,
      formValue,
      position
    }
  })

  const columns: GridColDef[] = [
    { field: 'web_name', headerName: 'Name', width: 150 },
    {
      field: 'position', headerName: 'Position', width: 80, headerAlign: 'center', align: 'center',
    },
    {
      field: 'teamShortName', headerName: 'Team', width: 80, headerAlign: 'center', align: 'center',
    },
    {
      field: 'total_points',
      headerName: 'Total Points',
      type: 'number',
      width: 130,
    },
    {
      field: 'now_cost',
      headerName: 'Cost',
      type: 'number',
      width: 130,
      valueFormatter: costFormatter,
    },
    {
      field: 'costValue',
      headerName: 'Cost Value (tp / c)',
      type: 'number',
      width: 160,
    },
    {
      field: 'formValue',
      headerName: 'Form Value',
      type: 'number',
      width: 130,
    },
  ];

  const paginationModel = { page: 0, pageSize: 20 };

  const playersSortedByFormValue = appendedPlayers.sort((a, b) => {
    if (a.formValue > b.formValue) return -1;
    if (a.formValue < b.formValue) return 1;
    return 0;
  }).slice(0, 10)

  const nextEvents = getNextEvents(5, events);
  const detailedTeamMap = await getDetailedTeamMap(teams, events, nextEvents.map(e => e.id))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const teamArr = Array.from(detailedTeamMap, ([_, value]) => (value)) as DetailedTeam[]
  const teamArrFavourablySorted = teamArr.sort((a, b) => {
    const a_runInTotal = a.runIn.reduce(totalRunInDifficulties, 0)
    const b_runInTotal = b.runIn.reduce(totalRunInDifficulties, 0)
    return a_runInTotal > b_runInTotal ? 1 : -1
  })

  return (
    <div className={styles.page}>
      <TableWrapper
        heading='Teams'
        subHeading='Sorted by fixture difficulty'
      >
        <TeamCards teams={teamArrFavourablySorted} />
      </TableWrapper>
      <TableWrapper
        heading='Value for Money'
        subHeading='Sorted by Form Value (form / cost)'
      >
        <Cards players={playersSortedByFormValue} teamMap={teamMap} />
      </TableWrapper>
      <div className={styles['table-wrapper']}>
        <DataGrid
          rows={appendedPlayers}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20, 50, 100]}
          sx={{ border: 0 }}
        />
      </div>
    </div>
  );
}
