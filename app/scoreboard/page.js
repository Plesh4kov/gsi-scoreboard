'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        backgroundColor: '#000',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2 style={{fontSize: '24px'}}>Ожидание данных...</h2>
      </div>
    );
  }

  // Преобразуем название карты
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
      <div className="main-title">MATCH RESULTS</div>
      <div className="sub-info">MAP: {mapName}</div>
      <div className="teams-line">
        <div className="team-info-line ct-side">
          <Image alt="CT Team" src={`/teams/${ctTeam.name}.png`} width={30} height={30} className="team-logo"/>
          <span className="team-name">{ctTeam.name.toUpperCase()}</span>
        </div>
        <div className="score-middle">{ctTeam.score} - {tTeam.score}</div>
        <div className="team-info-line t-side">
          <span className="team-name">{tTeam.name.toUpperCase()}</span>
          <Image alt="T Team" src={`/teams/${tTeam.name}.png`} width={30} height={30} className="team-logo"/>
        </div>
      </div>

      <div className="teams-stats-container">
        <div className="team-stat-container ct-side">
          <div className="team-table-header">
            <span className="col-header-player">PLAYER</span>
            <span className="col-header">K</span>
            <span className="col-header">D</span>
            <span className="col-header">KD</span>
          </div>
          {ctPlayers.map(player => renderPlayerRow(player))}
        </div>
        <div className="team-stat-container t-side">
          <div className="team-table-header">
            <span className="col-header-player">PLAYER</span>
            <span className="col-header">K</span>
            <span className="col-header">D</span>
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
          background: #000;
          font-family: 'BLENDERPRO-BOLD', sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 80%;
          margin: 20px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .main-title {
          font-size: 48px;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .sub-info {
          font-size: 14px;
          color: #bbb;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .teams-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: #2e2547;
          border-radius: 8px;
          padding: 5px 10px; 
        }

        .team-info-line {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .team-logo {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        .team-name {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .score-middle {
          font-size: 24px;
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
          padding: 5px; 
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: [player] 1fr [kills] 30px [deaths] 30px [kd] 30px;
          text-align: center;
          gap: 5px;
          align-items: center;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
          padding: 5px;
        }

        .col-header, .col-header-player {
          font-size: 10px; 
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
          grid-template-columns: [player] 1fr [kills] 30px [deaths] 30px [kd] 30px;
          align-items: center;
          background: rgba(0,0,0,0.2);
          padding: 5px;
          border-radius: 4px;
          gap: 5px;
        }

        .player-img {
          width: 30px;
          height: 30px;
          border-radius: 2px;
          object-fit: contain; 
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
          font-size: 10px; 
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }

        .stat-value {
          font-weight: bold;
          font-size: 10px; 
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
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .round-history-title {
          font-size: 10px; 
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 5px;
          text-align: center;
        }

        .halves-container {
          display: flex;
          justify-content: center; 
          align-items: center;
          flex-wrap: wrap;
          gap: 2px; 
          width: 100%;
        }

        .rounds-divider {
          width: 2px;
          background: #ccc;
          height: 40px; 
          margin: 0 10px; 
          flex-shrink:0;
        }

        .round-wrapper {
          width: 30px; 
          height: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          background: #3a3357;
          flex-shrink: 0;
          padding: 0;
        }

        .round-wrapper.ct-win {
          background: #6E58AB;
        }

        .round-wrapper.t-win {
          background: #998959;
        }

        .round-wrapper.empty {
          background: #2f2b3c;
        }

        .round-icon {
          width: 14px;
          height: 14px;
          object-fit: contain;
        }

        .round-number {
          font-size: 8px; 
          color: #fff;
          margin-top: 1px;
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
        <Image 
          className="player-img"
          src={`/players/${lowercaseSteamId}.png`}
          alt={name}
          width={30}
          height={30}
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
  const firstHalfRounds = Array.from({length: 12}, (_,i)=>i+1);
  const secondHalfRounds = Array.from({length: 12}, (_,i)=>i+13);

  return (
    <div className="halves-container">
      {firstHalfRounds.map(roundNumber => {
        const result = roundWins[roundNumber.toString()] || null;
        return createRoundCell(roundNumber, result);
      })}
      <div className="rounds-divider"></div>
      {secondHalfRounds.map(roundNumber => {
        const result = roundWins[roundNumber.toString()] || null;
        return createRoundCell(roundNumber, result);
      })}
    </div>
  );
}

function createRoundCell(roundNumber, result) {
  if (!result) {
    return (
      <div className="round-wrapper empty" key={roundNumber}>
        <span className="round-number">{roundNumber}</span>
      </div>
    );
  }

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
      <Image src={iconPath} alt={result} className="round-icon" width={14} height={14}/>
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}
