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
        background: 'none',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <h2 style={{fontSize: '40px', textTransform:'uppercase', letterSpacing:'2px'}}>Loading...</h2>
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

  let ctPlayers = playersArray.filter(p => p.team === 'CT');
  let tPlayers = playersArray.filter(p => p.team === 'T');

  ctPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);
  tPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);

  return (
    <div className="scoreboard-container">
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
        {renderRoundHistory(roundWins)}
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'BLENDERPRO-HEAVY';
          src: url('/fonts/BLENDERPRO-HEAVY.woff2') format('woff2'),
               url('/fonts/BLENDERPRO-HEAVY.woff') format('woff');
          font-weight: bold;
          font-style: normal;
        }

        body {
          margin: 0;
          padding: 0;
          background: none;
          font-family: 'BLENDERPRO-BOLD', sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 1000px;
          transform: scale(1.25);
          transform-origin: top center;
          margin: 20px auto; /* Меньше отступы сверху и снизу */
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px; /* Меньше вертикальных отступов */
        }

        .main-title {
          font-family: 'BLENDERPRO-HEAVY', sans-serif;
          font-size: 80px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          letter-spacing: 2px;
          margin: 0;
        }

        .map-name {
          font-size: 30px;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .teams-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: rgba(46,37,71,0.1); /* #2e2547 with ~90% transparency */
          border: 1px solid #423769;
          border-radius: 0; 
          padding: 5px 10px;
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
          font-size: 60px; 
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
          background: rgba(110,88,171,0.1); /* #6E58AB @90% transparency */
          border: 1px solid #423769;
          border-radius: 0;
        }

        .t-side.team-stat-container {
          background: rgba(153,137,89,0.1); /* #998959 @90% transparency */
          border: 1px solid #423769;
          border-radius: 0;
        }

        .team-stat-container {
          padding: 5px; 
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .team-table-header {
          display: grid;
          grid-template-columns: 1fr 30px 30px 40px;
          column-gap:20px;
          text-align: center;
          align-items: center;
          background: rgba(0,0,0,0.1);
          border: none; /* убрали обводку тут */
          border-radius: 0;
          padding: 5px;
        }

        .col-header-player {
          text-align: left;
          font-size: 30px; 
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          padding-right:70px; 
        }

        .col-header {
          font-size: 30px; 
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }

        .player-row {
          display: grid;
          grid-template-columns: 1fr 30px 30px 40px;
          column-gap:20px;
          align-items: center;
          background: rgba(0,0,0,0.1);
          /* без обводки для игрока */
          border-radius: 0;
          padding: 5px;
        }

        .player-img {
          width: 70px; /* было 45px, теперь еще на 50% больше ~68 => берем 70px */
          height: 70px;
          object-fit: contain; 
        }

        .player-name-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .player-name {
          font-weight: bold;
          font-size: 27px; /* было около 18px, увеличиваем на 50% ~27px */
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }

        .stat-value {
          font-weight: bold;
          font-size: 27px; /* было 18px, +50% = 27px */
          text-align: center;
          color: #fff;
        }

        .round-history-container {
          width: 100%;
          background: rgba(32,28,44,0.1); /* #201c2c @90% transparency */
          border: 1px solid #423769;
          border-radius: 0;
          padding: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .round-history-title {
          font-size: 20px; 
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 5px;
        }

        .halves-container {
          display: grid;
          grid-template-columns: repeat(24, 1fr);
          gap: 2px;
          width: 100%;
        }

        .round-wrapper {
          width: 100%; 
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(58,51,87,0.1); /* #3a3357 @90% transparency */
          border: none; 
        }

        .round-wrapper.ct-win {
          background: rgba(110,88,171,0.1); /* ct-win color transparent */
        }

        .round-wrapper.t-win {
          background: rgba(153,137,89,0.1); /* t-win color transparent */
        }

        .round-wrapper.empty {
          background: rgba(47,43,60,0.1); /* #2f2b3c @90% transparency */
        }

        .round-icon {
          width: 30px; /* увеличить иконку пропорционально */
          height: 30px;
          object-fit: contain;
        }

        .round-number {
          font-size: 14px; 
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
          width={70}
          height={70}
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
  const totalRounds = 24;
  const rounds = Array.from({length: totalRounds}, (_, i) => i+1);

  return (
    <div className="halves-container">
      {rounds.map(roundNumber => {
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
  let roundClass = '';
  let iconPath;

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
      <Image src={iconPath} alt={result} className="round-icon" width={30} height={30}/>
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}
