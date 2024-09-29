import { DataGrid, GridColDef } from '@mui/x-data-grid';
import styles from "./page.module.css";
import { getData } from "./dataSource/premierLeague";
import { costFormatter } from './helpers/format';
import { positions } from './types/premierLeague';

export default async function Home() {
  const { players, teams } = await getData();
  const teamMap = new Map(teams.map(team => [team.code, team]))

  const appendedPlayers = players.map(player => {
    const teamId = player.team_code;
    const team = teamMap.get(teamId)
    const teamShortName = team ? team.short_name : ''
    const costValue = (player.total_points / player.now_cost).toFixed(3)
    const formValue = (Number(player.form) / player.now_cost).toFixed(3)
    const position = positions[player.element_type]

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
      width: 130,
    },
    {
      field: 'formValue',
      headerName: 'Form Value',
      type: 'number',
      width: 130,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className={styles.page}>
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
