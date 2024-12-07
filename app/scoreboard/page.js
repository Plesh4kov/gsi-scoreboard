// app/scoreboard/page.js
'use client';
import { useEffect, useState } from 'react';

export default function ScoreboardPage() {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/gsi');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
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
  const playersArray = Object.values(allPlayers);

  let ctPlayers = playersArray.filter(p => p.team === 'CT');
  let tPlayers = playersArray.filter(p => p.team === 'T');

  ctPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);
  tPlayers.sort((a, b) => b.match_stats.kills - a.match_stats.kills);

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <div className="match-score-block">
          <div className="score-line">
            <div className="team-info ct-side">
              <img alt="CT Team" className="team-logo" src={`teams/${ctTeam.name}.png`} />
              <span className="team-name">{ctTeam.name}</span>
              <span className="score ct">{ctTeam.score}</span>
            </div>
            <span className="score-divider">:</span>
            <div className="team-info t-side">
              <span className="score t">{tTeam.score}</span>
              <span className="team-name">{tTeam.name}</span>
              <img alt="T Team" className="team-logo" src={`teams/${tTeam.name}.png`} />
            </div>
          </div>
          <div className="map-info">{matchData.map.name}</div>
        </div>
      </div>

      <div className="teams-wrapper">
        <div className="team-table ct-side">
          <div className="table-header">
            <div className="th player-col player-name">{ctTeam.name}</div>
            <div className="th stat-col">K</div>
            <div className="th stat-col">D</div>
            <div className="th stat-col">A</div>
            <div className="th stat-col">+/-</div>
            <div className="th stat-col">Score</div>
          </div>
          <div className="players-table">
            {ctPlayers.map((player, i) => {
              const { kills, assists, deaths, score } = player.match_stats;
              const plusMinus = kills - deaths;
              return (
                <div className="player-row" key={i}>
                  <div className="player-col player-name">{player.name}</div>
                  <div className="stat-col">{kills}</div>
                  <div className="stat-col">{deaths}</div>
                  <div className="stat-col">{assists}</div>
                  <div className="stat-col">{(plusMinus >= 0 ? '+' : '') + plusMinus}</div>
                  <div className="stat-col">{score}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="round-history">
          <div className="round-history-title">Round History</div>
          {renderRoundHistory(matchData.map.round_wins)}
        </div>

        <div className="team-table t-side">
          <div className="table-header">
            <div className="th player-col player-name">{tTeam.name}</div>
            <div className="th stat-col">K</div>
            <div className="th stat-col">D</div>
            <div className="th stat-col">A</div>
            <div className="th stat-col">+/-</div>
            <div className="th stat-col">Score</div>
          </div>
          <div className="players-table">
            {tPlayers.map((player, i) => {
              const { kills, assists, deaths, score } = player.match_stats;
              const plusMinus = kills - deaths;
              return (
                <div className="player-row" key={i}>
                  <div className="player-col player-name">{player.name}</div>
                  <div className="stat-col">{kills}</div>
                  <div className="stat-col">{deaths}</div>
                  <div className="stat-col">{assists}</div>
                  <div className="stat-col">{(plusMinus >= 0 ? '+' : '') + plusMinus}</div>
                  <div className="stat-col">{score}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #222;
          font-family: Arial, sans-serif;
          color: #fff;
        }

        .scoreboard-container {
          width: 1200px;
          max-width: 90%;
          margin: 30px auto;
          background: rgba(15,15,15,0.9);
          border-radius: 8px;
          padding: 20px;
          backdrop-filter: blur(5px);
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .scoreboard-header {
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #555;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .match-score-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .score-line {
          display: flex;
          align-items: center;
          font-size: 25px;
          font-weight: bold;
          justify-content: center;
          gap: 40px; 
        }

        .team-info {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: center;
        }

        .ct-side .team-name {
          color: #6E58AB;
        }

        .t-side .team-name {
          color: #998959;
        }

        .team-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .score-divider {
          color: #aaa;
          font-size: 36px;
        }

        .map-info {
          margin-top: 5px;
          font-size: 16px;
          color: #ccc;
          text-align: center;
          width: 100%;
        }

        .teams-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .team-table {
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 10px;
        }

        .table-header {
          display: flex;
          padding: 5px 0;
          border-bottom: 1px solid #555;
        }

        .th {
          flex: 1;
          text-align: center;
          font-weight: bold;
          color: #ccc;
          text-transform: uppercase;
          padding: 5px;
        }

        .player-col {
          flex: 2;
          text-align: center; 
        }

        .stat-col {
          flex: 1;
          text-align: center;
        }

        .players-table {
          border-radius: 0 0 8px 8px;
          padding: 10px;
          font-size: 14px;
        }

        .player-row {
          display: flex;
          border-bottom: 1px solid #333;
          padding: 8px 0;
          align-items: center;
        }

        .player-row:last-child {
          border-bottom: none;
        }

        .player-row div {
          padding: 5px 0;
        }

        .player-name {
          text-align: center;
          flex: 2;
        }

        /* Round History */
        .round-history-title {
          font-size: 16px;
          color: #ccc;
          margin-bottom: 10px;
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
        }

        .halves-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .half-rounds {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex: 1;
        }

        .half-rounds:first-child {
          justify-content: flex-end;
          margin-right: 20px; 
        }

        .half-rounds:last-child {
          justify-content: flex-start;
          margin-left: 20px; 
        }

        .rounds-divider {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background: #ccc;
          height: 30px;
        }

        .round-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .round-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          margin: 0 3px;
        }

        .round-number {
          font-size: 10px;
          color: #ccc;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

function renderRoundHistory(roundWins) {
  if (!roundWins) return null;

  const roundNumbers = Object.keys(roundWins).map(n => parseInt(n)).sort((a,b) => a - b);
  const firstHalfRounds = roundNumbers.filter(n => n <= 12);
  const secondHalfRounds = roundNumbers.filter(n => n > 12);

  return (
    <div className="halves-container">
      <div className="half-rounds">
        {firstHalfRounds.map(roundNumber => createRoundIcon(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
      <div className="rounds-divider"></div>
      <div className="half-rounds">
        {secondHalfRounds.map(roundNumber => createRoundIcon(roundNumber, roundWins[roundNumber.toString()]))}
      </div>
    </div>
  );
}

function createRoundIcon(roundNumber, result) {
  let iconPath;
  let teamColorClass;

  switch (result) {
    case 't_win_elimination':
        iconPath = 'icons/t_win_elimination.png';
        teamColorClass = 't-win';
        break;
    case 't_win_bomb':
        iconPath = 'icons/t_win_bomb.png';
        teamColorClass = 't-win';
        break;
    case 'ct_win_elimination':
        iconPath = 'icons/ct_win_elimination.png';
        teamColorClass = 'ct-win';
        break;
    case 'ct_win_defuse':
        iconPath = 'icons/ct_win_defuse.png';
        teamColorClass = 'ct-win';
        break;
    case 'ct_win_time':
        iconPath = 'icons/ct_win_time.png';
        teamColorClass = 'ct-win';
        break;
    default:
        iconPath = 'icons/default.png';
        teamColorClass = '';
        break;
  }

  return (
    <div className="round-wrapper" key={roundNumber}>
      <img src={iconPath} alt={result} className={`round-icon ${teamColorClass}`} title={`Round ${roundNumber}: ${result}`} />
      <span className="round-number">{roundNumber}</span>
    </div>
  );
}
