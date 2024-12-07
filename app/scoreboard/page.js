"use client";

import Image from 'next/image';
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
        background: 'none',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2 style={{fontSize:'40px', textTransform:'uppercase', letterSpacing:'2px'}}>Loading...</h2>
      </div>
    );
  }

  const mapName = matchData.map.name.replace(/^de_/i, '').toUpperCase();
  const ctTeam = matchData.map.team_ct;
  const tTeam = matchData.map.team_t;
  const allPlayers = matchData.allplayers;
  const roundWins = matchData.map.round_wins || {};

  const playersArray = Object.entries(allPlayers).map(([steamid, playerData]) => ({
    steamid,
    ...playerData
  }));

  let ctPlayers = playersArray.filter(p => p.team === 'CT').sort((a,b)=>b.match_stats.kills - a.match_stats.kills);
  let tPlayers = playersArray.filter(p => p.team === 'T').sort((a,b)=>b.match_stats.kills - a.match_stats.kills);

  const totalRounds = 24;
  const rounds = Array.from({length: totalRounds}, (_, i) => i+1);

  return (
    <div className="scoreboard-root">
      <div className="main-title">MATCH RESULT</div>
      <div className="map-name">MAP: {mapName}</div>

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
        <div className="rounds-grid">
          {rounds.map(roundNumber => {
            const result = roundWins[roundNumber.toString()] || null;
            return createRoundCell(roundNumber, result);
          })}
        </div>
      </div>

      <style jsx>{`
        .scoreboard-root {
          width: 900px;
          margin: 10px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          font-family: 'BLENDERPRO-BOLD', sans-serif;
          color: #fff;
          background: none;
        }

        .main-title {
          font-family: 'BLENDERPRO-HEAVY', sans-serif;
          font-size: 50px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
        }

        .map-name {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 10px 0;
        }

        .teams-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: rgba(46,37,71,0.9);
          border: 1px solid #423769;
          border-radius: 0;
          padding: 5px 10px;
          box-sizing:border-box;
        }

        .team-info-line {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .team-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .team-name {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .score-middle {
          font-size: 30px;
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
          background: rgba(110,88,171,0.9);
          border: 1px solid #423769;
          border-radius: 0;
          padding: 5px;
          box-sizing:border-box;
          flex:1;
          display:flex;
          flex-direction:column;
          gap:5px;
        }

        .t-side.team-stat-container {
          background: rgba(153,137,89,0.9);
          border: 1px solid #423769;
          border-radius: 0;
          padding: 5px;
          box-sizing:border-box;
          flex:1;
          display:flex;
          flex-direction:column;
          gap:5px;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: 1fr 30px 30px 40px;
          column-gap:20px;
          align-items: center;
          background: rgba(0,0,0,0.2);
          border:none;
          border-radius:0;
          padding:5px;
          box-sizing:border-box;
        }

        .col-header-player {
          text-align:left;
          font-size:20px;
          font-weight:bold;
          text-transform:uppercase;
          color:#fff;
          padding-right:70px;
        }

        .col-header {
          font-size:20px;
          font-weight:bold;
          text-transform:uppercase;
          color:#fff;
        }

        .player-row {
          display:grid;
          grid-template-columns:1fr 30px 30px 40px;
          column-gap:20px;
          align-items:center;
          background:rgba(0,0,0,0.2);
          border-radius:0;
          padding:10px;
          box-sizing:border-box;
        }

        .player-img {
          width:60px;
          height:60px;
          object-fit:contain;
        }

        .player-name-wrapper {
          display:flex;
          align-items:center;
          gap:10px;
          overflow:hidden;
        }

        .player-name {
          font-weight:bold;
          font-size:18px;
          text-transform:uppercase;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          color:#fff;
        }

        .stat-value {
          font-weight:bold;
          font-size:18px;
          text-align:center;
          color:#fff;
        }

        .round-history-container {
          width:100%;
          background: rgba(32,28,44,0.9);
          border:1px solid #423769;
          border-radius:0;
          padding:5px;
          box-sizing:border-box;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .round-history-title {
          font-size:20px;
          font-weight:bold;
          text-transform:uppercase;
          color:#fff;
          margin-bottom:5px;
        }

        .rounds-grid {
          display:grid;
          grid-template-columns:repeat(24,1fr);
          gap:2px;
          width:100%;
          box-sizing:border-box;
        }

        .round-wrapper {
          width:100%;
          height:96px;
          background:rgba(0,0,0,0.2);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          border:none;
          padding:5px;
          box-sizing:border-box;
        }

        .round-wrapper.ct-win {
          background:rgba(0.52,0.49,0.63,1);
        }

        .round-wrapper.t-win {
          /* Если нужно иной цвет для T side */
        }

        .round-wrapper.empty {
          background:rgba(0.55,0.51,0.35,1);
        }

        .round-icon {
          width:20px;
          height:20px;
          object-fit:contain;
        }

        .round-number {
          font-size:14px;
          color:#fff;
          margin-top:2px;
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

function createRoundCell(roundNumber, result) {
  if (!result) {
    return (
      <div className="round-wrapper empty" key={roundNumber}>
        <span className="round-number">{roundNumber}</span>
      </div>
    );
  }

  const normalizedResult = result.toLowerCase();
  let roundClass = '';
  let iconPath = '/icons/default.png';

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
      <Image src={iconPath} alt={result} className="round-icon" width={20} height={20}/>
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}

function renderRoundHistory(roundWins) {
  const totalRounds = 24;
  const rounds = Array.from({length: totalRounds}, (_, i) => i+1);

  return (
    <>
      {rounds.map(roundNumber => {
        const result = roundWins[roundNumber.toString()] || null;
        return createRoundCell(roundNumber, result);
      })}
    </>
  );
}
