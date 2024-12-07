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
        fontFamily: 'Arial',
        backgroundColor: '#111',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2>Ожидание данных...</h2>
      </div>
    );
  }

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
      <div className="map-name">{matchData.map.name.toUpperCase()}</div>

      <div className="teams-line">
        <div className="team-info-line ct-side">
          <Image alt="CT Team" src={`/teams/${ctTeam.name}.png`} width={50} height={50} className="team-logo"/>
          <span className="team-name">{ctTeam.name.toUpperCase()}</span>
        </div>
        <div className="score-middle">{ctTeam.score} - {tTeam.score}</div>
        <div className="team-info-line t-side">
          <span className="team-name">{tTeam.name.toUpperCase()}</span>
          <Image alt="T Team" src={`/teams/${tTeam.name}.png`} width={50} height={50} className="team-logo"/>
        </div>
      </div>

      {/* Заголовки для колонок */}
      <div className="table-header-row">
        <div className="team-table-header ct-side">
          <span className="col-header">Kills</span>
          <span className="col-header">Deaths</span>
          <span className="col-header">KD</span>
        </div>
        <div className="team-table-header t-side">
          <span className="col-header">Kills</span>
          <span className="col-header">Deaths</span>
          <span className="col-header">KD</span>
        </div>
      </div>

      {/* Игроки */}
      <div className="players-table-row">
        <div className="players-column ct-side">
          {ctPlayers.map(player => renderPlayerRow(player))}
        </div>
        <div className="players-column t-side">
          {tPlayers.map(player => renderPlayerRow(player))}
        </div>
      </div>

      {/* История раундов */}
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
          width: 1000px;
          max-width: 90%;
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
        }

        .ct-side .team-name {
          color: #c94af1;
        }

        .t-side .team-name {
          color: #e0bf75;
        }

        .score-middle {
          font-size: 36px;
          font-weight: bold;
          color: #fff;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          background: transparent;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
          gap: 10px;
          width: 45%;
          padding: 10px 0;
        }

        .col-header {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          color: #ccc;
        }

        .players-table-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
        }

        .players-column {
          width: 45%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .player-row {
          display: flex;
          align-items: center;
          background: #2a2440;
          padding: 10px;
          border-radius: 8px;
          gap: 10px;
        }

        .player-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: contain;
        }

        .player-name {
          font-weight: bold;
          font-size: 14px;
          flex: 2;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          text-align: center;
          flex: 3;
        }

        .stat-value {
          font-weight: bold;
          font-size: 14px;
        }

        .round-history-container {
          width: 100%;
          background: #201c2c;
          border-radius: 8px;
          padding: 10px;
          margin-top: 10px;
        }

        .round-history-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 10px;
          text-align: left;
        }

        .round-history-line {
          display: flex;
          align-items: center;
          width: 100%;
          flex-wrap: nowrap;
        }

        .rounds-divider {
          width: 1px;
          background: #ccc;
          height: 20px;
          margin: 0 5px;
        }

        .rounds-line {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 5px;
        }

        .round-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }

        .round-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
          gap: 2px;
        }

        .round-number {
          font-size: 10px;
          color: #ccc;
        }

      `}</style>
    </div>
  );
}

function renderPlayerRow(player) {
  const { name, steamid, match_stats } = player;
  const { kills, deaths } = match_stats;
  const kd = deaths === 0 ? kills.toString() : (kills/deaths).toFixed(2);

  return (
    <div className="player-row" key={steamid}>
      <Image 
        className="player-img"
        src={`/players/${steamid}.jpg`} 
        alt={name} 
        width={40} 
        height={40} 
      />
      <div className="player-name">{name}</div>
      <div className="player-stats">
        <div className="stat-value">{kills}</div>
        <div className="stat-value">{deaths}</div>
        <div className="stat-value">{kd}</div>
      </div>
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
    <div className="round-history-line">
      <div className="rounds-line">
        {firstHalfRounds.map(roundNumber => createRoundIcon(roundNumber, roundWins[roundNumber.toString()]))}
        {firstHalfRounds.length > 0 && secondHalfRounds.length > 0 && <div className="rounds-divider"></div>}
        {secondHalfRounds.map(roundNumber => createRoundIcon(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
    </div>
  );
}

function createRoundIcon(roundNumber, result) {
  let iconPath;

  switch (result) {
    case 't_win_elimination':
        iconPath = 'icons/t_win_elimination.png';
        break;
    case 't_win_bomb':
        iconPath = 'icons/t_win_bomb.png';
        break;
    case 'ct_win_elimination':
        iconPath = 'icons/ct_win_elimination.png';
        break;
    case 'ct_win_defuse':
        iconPath = 'icons/ct_win_defuse.png';
        break;
    case 'ct_win_time':
        iconPath = 'icons/ct_win_time.png';
        break;
    default:
        iconPath = 'icons/default.png';
        break;
  }

  return (
    <div className="round-wrapper" key={roundNumber}>
      <Image src={`/${iconPath}`} alt={result} className="round-icon" width={16} height={16} />
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}