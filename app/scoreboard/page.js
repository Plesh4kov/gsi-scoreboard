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

  // Преобразуем allPlayers в массив с включением steamid
  // Ключи allplayers - это steamid, используем их для фото
  const playersArray = Object.entries(allPlayers).map(([steamid, playerData]) => ({
    steamid,
    ...playerData
  }));

  let ctPlayers = playersArray.filter(p => p.team === 'CT');
  let tPlayers = playersArray.filter(p => p.team === 'T');

  // Сортируем по количеству убийств
  ctPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);
  tPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <div className="match-info">
          <div className="team-scores">
            <div className="team-block ct-side">
              <img alt="CT Team" className="team-logo" src={`teams/${ctTeam.name}.png`} />
              <span className="team-name">{ctTeam.name}</span>
              <span className="score ct">{ctTeam.score}</span>
            </div>
            <div className="score-divider">:</div>
            <div className="team-block t-side">
              <span className="score t">{tTeam.score}</span>
              <span className="team-name">{tTeam.name}</span>
              <img alt="T Team" className="team-logo" src={`teams/${tTeam.name}.png`} />
            </div>
          </div>
          <div className="map-info">{matchData.map.name}</div>
        </div>
      </div>

      <div className="teams-wrapper">
        {/* Блок для CT-команды */}
        <div className="team-row">
          <div className="team-header ct-side">
            <img alt="CT Team" className="team-logo-header" src={`teams/${ctTeam.name}.png`} />
            <span className="team-name-header">{ctTeam.name}</span>
          </div>
          <div className="players-row">
            {ctPlayers.map((player, i) => renderPlayerCard(player))}
          </div>
        </div>

        {/* Блок для T-команды */}
        <div className="team-row">
          <div className="team-header t-side">
            <img alt="T Team" className="team-logo-header" src={`teams/${tTeam.name}.png`} />
            <span className="team-name-header">{tTeam.name}</span>
          </div>
          <div className="players-row">
            {tPlayers.map((player, i) => renderPlayerCard(player))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #1c1b29;
          font-family: Arial, sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 1200px;
          max-width: 90%;
          margin: 30px auto;
          background: #201c2c;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .scoreboard-header {
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #444;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .match-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .team-scores {
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 28px;
          font-weight: bold;
        }

        .team-block {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .team-block .team-name {
          text-transform: uppercase;
          font-size: 24px;
        }

        .ct-side .team-name {
          color: #c94af1;
        }

        .t-side .team-name {
          color: #e0bf75;
        }

        .team-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .score-divider {
          font-size: 32px;
          color: #aaa;
        }

        .map-info {
          font-size: 18px;
          color: #ccc;
        }

        .teams-wrapper {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-top: 20px;
        }

        .team-row {
          background: #2a2440;
          padding: 20px;
          border-radius: 8px;
        }

        .team-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .team-logo-header {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .team-name-header {
          text-transform: uppercase;
          font-size: 20px;
          font-weight: bold;
        }

        .ct-side .team-name-header {
          color: #c94af1;
        }

        .t-side .team-name-header {
          color: #e0bf75;
        }

        .players-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: start;
        }

        .player-card {
          background: #3a3357;
          border-radius: 8px;
          padding: 15px;
          width: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .player-card img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 10px;
          border: 2px solid #555;
        }

        .player-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .player-stats {
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .player-stats div {
          display: flex;
          justify-content: space-between;
        }

        .stat-label {
          color: #bbb;
        }

        .stat-value {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

function renderPlayerCard(player) {
  const { name, steamid } = player;
  const { kills, deaths, assists } = player.match_stats;
  // KD ratio
  const kd = deaths === 0 ? kills.toString() : (kills/deaths).toFixed(2);

  // Заглушки для ADR, KAST, Damage
  const ADR = 'N/A';
  const KAST = 'N/A';
  const Damage = 'N/A';

  return (
    <div className="player-card" key={steamid}>
      <img src={`/players/${steamid}.jpg`} alt={name} onError={(e) => { e.currentTarget.src = '/players/default.jpg'; }} />
      <div className="player-name">{name}</div>
      <div className="player-stats">
        <div><span className="stat-label">K:</span><span className="stat-value">{kills}</span></div>
        <div><span className="stat-label">D:</span><span className="stat-value">{deaths}</span></div>
        <div><span className="stat-label">A:</span><span className="stat-value">{assists}</span></div>
        <div><span className="stat-label">KD:</span><span className="stat-value">{kd}</span></div>
        <div><span className="stat-label">ADR:</span><span className="stat-value">{ADR}</span></div>
        <div><span className="stat-label">KAST:</span><span className="stat-value">{KAST}</span></div>
        <div><span className="stat-label">Damage:</span><span className="stat-value">{Damage}</span></div>
      </div>
    </div>
  );
}
