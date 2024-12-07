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
        fontFamily: 'Arial',
        backgroundColor: 'transparent',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2>Ожидание данных...</h2>
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
      <div className="map-name">{mapName}</div>

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
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: Arial, sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 80%; 
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .map-name {
          font-size: 48px;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 20px;
          background: #2e2547;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }

        .teams-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 20px;
          background: #2e2547;
          border-radius: 8px;
        }

        .team-info-line {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .team-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .team-name {
          font-size: 24px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .score-middle {
          font-size: 36px;
          font-weight: bold;
          color: #fff;
        }

        .teams-stats-container {
          width: 100%;
          display: flex;
          gap: 20px;
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
          /* Уменьшаем отступы для менее "воздушного" вида */
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
          font-size: 14px;
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
          /* Уменьшаем внутренние отступы */
          padding: 5px;
          border-radius: 8px;
          gap: 5px; 
        }

        .player-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          /* object-fit: contain, чтобы не обрезать изображение */
          object-fit: contain;
        }

        .player-name-wrapper {
          display: flex;
          align-items: center;
          /* Меньше расстояние между фото и никнеймом */
          gap: 5px; 
          padding-left: 5px; 
          overflow: hidden;
        }

        .player-name {
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }

        .stat-value {
          font-weight: bold;
          font-size: 14px;
          text-align: center;
          color: #fff;
        }

        .round-history-container {
          width: 100%;
          background: #201c2c;
          border-radius: 8px;
          /* Уменьшаем отступы */
          padding: 5px; 
          margin-top: 10px;
          box-sizing: border-box;
        }

        .round-history-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 5px; 
          text-align: center;
        }

        .halves-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          position: relative;
          /* Разрешаем горизонтальную прокрутку, если раундов слишком много */
          overflow-x: auto; 
        }

        .first-half-rounds,
        .second-half-rounds {
          display: flex;
          flex-wrap: nowrap;
          gap: 5px; 
          align-items: center;
        }

        .rounds-divider {
          width: 2px;
          background: #ccc;
          height: 50px; 
          margin: 0 10px; 
          flex-shrink:0;
        }

        /* Фиксированный размер для раундов, чтобы не менялся с количеством */
        .round-wrapper {
          width: 40px; 
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border-radius: 2px;
          background: #3a3357;
          flex-shrink: 0;
          padding: 5px;
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
          font-size: 12px;
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
      <div className="first-half-rounds">
        {firstHalfRounds.map(roundNumber => createRoundCell(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
      <div className="rounds-divider"></div>
      <div className="second-half-rounds">
        {secondHalfRounds.map(roundNumber => createRoundCell(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
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
