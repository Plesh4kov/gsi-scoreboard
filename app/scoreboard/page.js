'use client';

import { useEffect, useState } from 'react';

export default function ScoreboardPage() {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/gsi');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].map && data[0].allplayers) {
          setMatchData(data[0]);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!matchData || !matchData.map || !matchData.allplayers) {
    return (
      <div style={{
        color: '#fff',
        fontFamily: 'BLENDERPRO-BOLD, sans-serif',
        backgroundColor: 'transparent',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2 style={{fontSize: '24px'}}>Ожидание данных...</h2>
      </div>
    );
  }

  // Удаляем "de_" из названия карты (учитываем регистр)
  const mapName = matchData.map.name.replace(/^de_/i, '').toUpperCase();

  const ctTeam = matchData.map.team_ct;
  const tTeam = matchData.map.team_t;
  const allPlayers = matchData.allplayers;
  const roundWins = matchData.map.round_wins || {};

  const playersArray = Object.entries(allPlayers).map(([steamid, playerData]) => ({
    steamid,
    ...playerData
  }));

  let ctPlayers = playersArray.filter(p => p.team === 'CT');
  let tPlayers = playersArray.filter(p => p.team === 'T');

  ctPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);
  tPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);

  return (
    <div className="scoreboard-container">
      <div className="map-name">MAP: {mapName}</div>

      <div className="teams-line">
        <div className="team-info-line ct-side">
          <img alt="CT Team" src={`/teams/${ctTeam.name}.png`} width={50} height={50} className="team-logo"/>
          <span className="team-name">{ctTeam.name.toUpperCase()}</span>
        </div>
        <div className="score-middle">{ctTeam.score} - {tTeam.score}</div>
        <div className="team-info-line t-side">
          <span className="team-name">{tTeam.name.toUpperCase()}</span>
          <img alt="T Team" src={`/teams/${tTeam.name}.png`} width={50} height={50} className="team-logo"/>
        </div>
      </div>

      <div className="teams-stats-container">
        <div className="team-stat-container ct-side">
          <div className="team-table-header">
            <span className="col-header-player">PLAYER</span>
            <span className="col-header">KILLS</span>
            <span className="col-header">DEATHS</span>
            <span className="col-header">KD</span>
          </div>
          {ctPlayers.map(player => renderPlayerRow(player))}
        </div>
        <div className="team-stat-container t-side">
          <div className="team-table-header">
            <span className="col-header-player">PLAYER</span>
            <span className="col-header">KILLS</span>
            <span className="col-header">DEATHS</span>
            <span className="col-header">KD</span>
          </div>
          {tPlayers.map(player => renderPlayerRow(player))}
        </div>
      </div>

      <div className="round-history-container">
        <div className="round-history-title">ROUND HISTORY</div>
        {renderRoundHistory(roundWins)}
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'BLENDERPRO-BOLD';
          src: url('/fonts/BLENDERPRO-BOLD.woff2') format('woff2'),
               url('/fonts/BLENDERPRO-BOLD.woff') format('woff');
          font-weight: bold;
          font-style: normal;
        }

        body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: 'BLENDERPRO-BOLD', sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 80%;
          margin: 20px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px; /* Меньше расстояние между блоками */
        }

        .map-name {
          font-size: 60px; /* Крупнее шрифт */
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
          background: #2e2547;
          border-radius: 8px;
          padding: 5px 10px; /* Меньше отступы */
          text-align: center;
        }

        .teams-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: #2e2547;
          border-radius: 8px;
          padding: 5px 10px; /* Меньше отступы */
        }

        .team-info-line {
          display: flex;
          align-items: center;
          gap: 5px; /* Меньше зазор между элементами */
        }

        .team-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .team-name {
          font-size: 24px; /* Крупнее шрифт */
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .score-middle {
          font-size: 48px; /* Крупнее шрифт */
          font-weight: bold;
          color: #fff;
        }

        .teams-stats-container {
          width: 100%;
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }

        .ct-side.team-stat-container {
          background: #6E58AB;
        }

        .t-side.team-stat-container {
          background: #998959;
        }

        .team-stat-container {
          border-radius: 8px;
          padding: 5px; 
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: [player] 1fr [kills] 60px [deaths] 60px [kd] 60px;
          text-align: center;
          gap: 5px;
          align-items: center;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
          padding: 5px;
        }

        .col-header, .col-header-player {
          font-size: 16px; /* Крупнее шрифт */
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .col-header-player {
          text-align: left;
          padding-left: 5px;
        }

        .player-row {
          display: grid;
          grid-template-columns: [player] 1fr [kills] 60px [deaths] 60px [kd] 60px;
          align-items: center;
          background: rgba(0,0,0,0.2);
          padding: 5px;
          border-radius: 8px;
          gap: 5px;
        }

        .player-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: contain; /* Чтобы не обрезать изображение */
        }

        .player-name-wrapper {
          display: flex;
          align-items: center;
          gap: 5px;
          padding-left: 5px;
          overflow: hidden;
        }

        .player-name {
          font-weight: bold;
          font-size: 16px; /* Крупнее шрифт */
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }

        .stat-value {
          font-weight: bold;
          font-size: 16px; /* Крупнее шрифт */
          text-align: center;
          color: #fff;
        }

        .round-history-container {
          width: 100%;
          background: #201c2c;
          border-radius: 8px;
          padding: 5px;
          margin-top: 10px;
          box-sizing: border-box;
        }

        .round-history-title {
          font-size: 18px; /* Крупнее шрифт */
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 5px;
          text-align: center;
        }

        /* Убираем горизонтальную прокрутку, показываем все раунды сразу 
           Для этого позволим им переноситься на новую строку */
        .halves-container {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          position: relative;
          flex-wrap: wrap; /* Позволяем перенос раундов */
          gap: 5px; /* Меньше зазоры между раундами и разделителем */
        }

        .rounds-divider {
          width: 2px;
          background: #ccc;
          height: 50px; 
          margin: 5px 10px; 
          flex-shrink:0;
        }

        /* Фиксированный размер для раундов, прямоугольники */
        .round-wrapper {
          width: 40px; 
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border-radius: 2px;
          background: #3a3357;
          flex-shrink: 0;
          padding: 2px; /* Меньше отступов */
        }

        .round-wrapper.ct-win {
          background: #6E58AB;
        }

        .round-wrapper.t-win {
          background: #998959;
        }

        .round-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .round-number {
          font-size: 14px; /* Чуть крупнее шрифт */
          color: #fff;
        }
      `}</style>
    </div>
  );
}

function renderPlayerRow(player) {
  const { name, steamid, match_stats } = player;
  const { kills, deaths } = match_stats;
  const kd = deaths === 0 ? kills.toString() : (kills/deaths).toFixed(2);

  const lowercaseSteamId = steamid.toString().toLowerCase();

  return (
    <div className="player-row" key={steamid}>
      <div className="player-name-wrapper">
        <img 
          className="player-img"
          src={`/players/${lowercaseSteamId}.png`} 
          alt={name}
          width={60}
          height={60}
          onError={(e) => { e.currentTarget.src = '/players/idle.png'; }}
        />
        <div className="player-name">{name}</div>
      </div>
      <div className="stat-value">{kills}</div>
      <div className="stat-value">{deaths}</div>
      <div className="stat-value">{kd}</div>
    </div>
  );
}

function renderRoundHistory(roundWins) {
  const roundNumbers = Object.keys(roundWins)
    .map(n => parseInt(n))
    .sort((a,b) => a - b);

  if (roundNumbers.length === 0) return null;

  const firstHalfRounds = roundNumbers.filter(n => n <= 12);
  const secondHalfRounds = roundNumbers.filter(n => n > 12);

  return (
    <div className="halves-container">
      {firstHalfRounds.map(roundNumber => createRoundCell(roundNumber, roundWins[roundNumber.toString()]))}
      <div className="rounds-divider"></div>
      {secondHalfRounds.map(roundNumber => createRoundCell(roundNumber, roundWins[roundNumber.toString()]))}
    </div>
  );
}

function createRoundCell(roundNumber, result) {
  const normalizedResult = result.toLowerCase();
  let iconPath;
  let roundClass = '';

  if (normalizedResult.startsWith('ct_win')) {
    roundClass = 'ct-win';
  } else if (normalizedResult.startsWith('t_win')) {
    roundClass = 't-win';
  }

  switch (normalizedResult) {
    case 't_win_elimination':
    case 'ct_win_elimination':
      iconPath = '/icons/skull.png';
      break;
    case 't_win_bomb':
      iconPath = '/icons/bomb.png';
      break;
    case 'ct_win_defuse':
      iconPath = '/icons/defuse.png';
      break;
    case 'ct_win_time':
      iconPath = '/icons/clock.png';
      break;
    default:
      iconPath = '/icons/default.png';
      break;
  }

  return (
    <div className={`round-wrapper ${roundClass}`} key={roundNumber}>
      <img src={iconPath} alt={result} className="round-icon" />
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}
