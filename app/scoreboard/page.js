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

      {/* Статистика команд (заголовки и игроки) */}
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

      {/* История раундов */}
      <div className="round-history-container">
        <div className="round-history-title">ROUND HISTORY</div>
        {renderRoundHistory(roundWins)}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #000;
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

        .teams-stats-container {
          width: 100%;
          display: flex;
          gap: 20px;
          justify-content: space-between;
        }

        .team-stat-container {
          background: #2a2440;
          border-radius: 8px;
          padding: 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: [player] 1fr [kills] 60px [deaths] 60px [kd] 60px;
          text-align: center;
          gap: 10px;
          align-items: center;
          background: #201c2c;
          border-radius: 4px;
          padding: 10px;
        }

        .col-header, .col-header-player {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          color: #ccc;
        }

        .col-header-player {
          text-align: left;
          padding-left: 10px;
        }

        .player-row {
          display: grid;
          grid-template-columns: [player] 1fr [kills] 60px [deaths] 60px [kd] 60px;
          align-items: center;
          background: #3a3357;
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

        .player-name-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 10px;
          overflow: hidden;
        }

        .player-name {
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-value {
          font-weight: bold;
          font-size: 14px;
          text-align: center;
        }

        .round-history-container {
          width: 100%;
          background: #201c2c;
          border-radius: 8px;
          padding: 20px; /* увеличиваем отступы */
          margin-top: 10px;
          box-sizing: border-box;
        }

        .round-history-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 20px; /* побольше отступ под заголовком */
          text-align: left;
          padding-left: 10px;
        }

        .halves-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .first-half-rounds,
        .second-half-rounds {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
          align-items: center;
          flex: 1;
        }

        .first-half-rounds {
          justify-content: flex-end;
        }

        .second-half-rounds {
          justify-content: flex-start;
        }

        .rounds-divider {
          width: 2px;
          background: #ccc;
          height: 50px; /* делаем разделитель выше */
          margin: 0 60px; /* больше пространства вокруг разделителя */
        }

        .round-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
          gap: 2px;
        }

        .round-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
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
      <div className="player-name-wrapper">
        <Image 
          className="player-img"
          src={`/players/${steamid}.jpg`} 
          alt={name} 
          width={40} 
          height={40} 
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
        {firstHalfRounds.map(roundNumber => createRoundIcon(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
      <div className="rounds-divider"></div>
      <div className="second-half-rounds">
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
