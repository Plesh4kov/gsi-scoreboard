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

  const playersArray = Object.entries(allPlayers).map(([steamid, playerData]) => ({
    steamid,
    ...playerData
  }));

  let ctPlayers = playersArray.filter(p => p.team === 'CT');
  let tPlayers = playersArray.filter(p => p.team === 'T');

  ctPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);
  tPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);

  ctPlayers = ctPlayers.slice(0, 5);
  tPlayers = tPlayers.slice(0, 5);

  const ADR_PLACEHOLDER = 'N/A';

  return (
    <div className="scoreboard-container">
      <div className="map-name">{matchData.map.name.toUpperCase()}</div>

      <div className="teams-line">
        <div className="team-info-line ct-side">
          <Image alt="CT Team" src={`/teams/${ctTeam.name}.png`} width={50} height={50}/>
          <span className="team-name">{ctTeam.name.toUpperCase()}</span>
        </div>
        <div className="score-middle">{ctTeam.score} - {tTeam.score}</div>
        <div className="team-info-line t-side">
          <span className="team-name">{tTeam.name.toUpperCase()}</span>
          <Image alt="T Team" src={`/teams/${tTeam.name}.png`} width={50} height={50}/>
        </div>
      </div>

      <div className="table-header-row">
        <div className="team-table-header ct-side">
          <span className="col-header">Kills</span>
          <span className="col-header">Deaths</span>
          <span className="col-header">ADR</span>
        </div>
        <div className="team-table-header t-side">
          <span className="col-header">Kills</span>
          <span className="col-header">Deaths</span>
          <span className="col-header">ADR</span>
        </div>
      </div>

      <div className="players-table-row">
        <div className="players-column ct-side">
          {ctPlayers.map(player => renderPlayerRow(player, ADR_PLACEHOLDER))}
        </div>
        <div className="players-column t-side">
          {tPlayers.map(player => renderPlayerRow(player, ADR_PLACEHOLDER))}
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
          padding: 10px 0;
        }

        .team-table-header {
          display: flex;
          width: 45%;
          justify-content: space-around;
          background: #201c2c;
          border-radius: 8px;
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
          border-radius: 50%;
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
          display: flex;
          flex: 3;
          justify-content: space-around;
        }

        .stat-value {
          font-weight: bold;
          font-size: 14px;
          min-width: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function renderPlayerRow(player, ADR_PLACEHOLDER) {
  const { name, steamid, match_stats } = player;
  const { kills, deaths } = match_stats;
  const adr = ADR_PLACEHOLDER;
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
        <div className="stat-value">{adr}</div>
      </div>
    </div>
  );
}