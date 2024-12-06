"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./style.css"; // импортируем стили из style.css

export default function Page() {
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

  // Достаем данные
  const mapName = matchData.map.name.replace(/^de_/i, '').toUpperCase();
  const ctTeam = matchData.map.team_ct;
  const tTeam = matchData.map.team_t;
  const allPlayers = matchData.allplayers;
  const roundWins = matchData.map.round_wins || {};

  const playersArray = Object.entries(allPlayers).map(([steamid, playerData]) => ({
    steamid,
    ...playerData
  }));

  let ctPlayers = playersArray.filter(p => p.team === 'CT').sort((a,b)=>b.match_stats.kills - a.match_stats.kills).slice(0,5);
  let tPlayers = playersArray.filter(p => p.team === 'T').sort((a,b)=>b.match_stats.kills - a.match_stats.kills).slice(0,5);

  const ctTeamName = ctTeam.name.toUpperCase();
  const tTeamName = tTeam.name.toUpperCase();
  const ctScore = ctTeam.score;
  const tScore = tTeam.score;

  const totalRounds = 24;
  const rounds = Array.from({length: totalRounds}, (_, i) => i+1);

  function getRoundBackground(result) {
    if (!result) return '#262626'; // не сыгран
    const normalizedResult = result.toLowerCase();
    if (normalizedResult.startsWith('ct_win')) return '#847ca1';
    if (normalizedResult.startsWith('t_win')) return '#8c8259';
    return '#262626';
  }

  function getRoundIcon(result) {
    if (!result) return null;
    const norm = result.toLowerCase();
    let iconPath = '/icons/default.png';
    if (norm.includes('elimination')) iconPath='/icons/skull.png';
    else if (norm.includes('bomb')) iconPath='/icons/bomb.png';
    else if (norm.includes('defuse')) iconPath='/icons/defuse.png';
    else if (norm.includes('time')) iconPath='/icons/clock.png';

    return <Image src={iconPath} alt="" width={20} height={20} style={{objectFit:'contain'}}/>;
  }

  // Функция для отрисовки игрока: 
  // Вместо множества отдельных PLAYERLONGNAME и "0", подставим данные
  // ADR = 0, Kills = kills, Deaths = deaths
  // name = player.name
  function renderPlayerRow(nameClass, killsClass, deathsClass, adrClass, playerData) {
    if (!playerData) {
      // Если игрока нет, ставим пустые данные
      return (
        <>
          <div className={nameClass}>NO PLAYER</div>
          <div className={killsClass}>0</div>
          <div className={deathsClass}>0</div>
          <div className={adrClass}>0</div>
        </>
      );
    }
    const {name, match_stats} = playerData;
    const {kills, deaths} = match_stats;
    const adr = 0; 
    return (
      <>
        <div className={nameClass}>{name}</div>
        <div className={killsClass}>{kills}</div>
        <div className={deathsClass}>{deaths}</div>
        <div className={adrClass}>{adr}</div>
      </>
    );
  }

  // На нижней части были пронумерованы раунды: 
  // Заменим все эти overlap-div для раундов динамически:
  function renderRounds() {
    // Удалим статические оверлэпы с цифрами и просто отрисуем нужные 24 раунда в нужном месте
    // Найдем div, где были раунды. В вашем коде цифры были в массе overlap-... блоков.
    // Проще все эти блоки удалить и вставить один контейнер для раундов.

    return (
      <div style={{position:'absolute', left:'231px', top:'903px', width:'1419px', height:'133px', display:'flex', gap:'5px'}}>
        {rounds.map((roundNumber) => {
          const result = roundWins[roundNumber.toString()] || null;
          const bg = getRoundBackground(result);
          return (
            <div key={roundNumber} style={{
              width:'50px',height:'96px',background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'
            }}>
              {getRoundIcon(result)}
              <div style={{color:'#fff',fontSize:'35px',fontFamily:'Blender Pro, sans-serif',fontWeight:'900',lineHeight:'28.9px',textAlign:'center'}}>
                {roundNumber}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="COMPARE-MVP">
      <div className="div">
        {/* Верхняя панель с именами команд, счетом */}
        <div className="overlap">
          <div className="overlap-group">
            {/* Логотип T */}
            <Image className="rectangle" alt="" src={`/teams/${tTeam.name}.png`} width={89} height={89} style={{position:'absolute', top:0,left:'236px',objectFit:'cover'}}/>
            <div className="team-name" style={{textTransform:'uppercase',textAlign:'right'}}>{ctTeamName}</div>
          </div>
          {/* Логотип CT */}
          <Image className="img" alt="" src={`/teams/${ctTeam.name}.png`} width={88} height={88} style={{position:'absolute', left:'11px', top:'13px',objectFit:'cover'}}/>
          <div className="text-wrapper" style={{textTransform:'uppercase'}}>{tTeamName}</div>
          <div className="text-wrapper-2">{tScore}</div>
          <div className="overlap-2">
            <div className="text-wrapper-3">{ctScore}</div>
            <div className="text-wrapper-4">:</div>
          </div>
        </div>

        {/* Заголовки MATCH STATS и MAP */}
        <div className="overlap-30">
          <div className="text-wrapper-31" style={{textTransform:'uppercase'}}>MATCH STATS</div>
          <div className="text-wrapper-32">MAP: {mapName}</div>
        </div>

        {/* Левый блок (CT) */}
        {/* Мы знаем, что в original коде были 5 игроков. В данном коде много повторяющихся PLAYERLONGNAME. Распределим ctPlayers на те же позиции. */}
        <div className="overlap-3">
          <div className="overlap-4">
            {/* Первый игрок CT */}
            {renderPlayerRow("playerlongname9","_0","_011","_021",ctPlayers[0])}
            {/* Второй игрок CT */}
            {renderPlayerRow("playerlongname7","_03","_013","_023",ctPlayers[1])}
          </div>

          <div className="overlap-5">
            {/* Третий игрок CT */}
            {renderPlayerRow("playerlongname5","_05","_015","_025",ctPlayers[2])}
          </div>

          <div className="navbar">
            {/* Четвертый игрок CT */}
            {renderPlayerRow("playerlongname3","_07","_017","_027",ctPlayers[3])}
          </div>

          <div className="overlap-6">
            {/* Пятый игрок CT */}
            {renderPlayerRow("playerlongname","_09","_019","_029",ctPlayers[4])}
          </div>

          <div className="player">PLAYER</div>
          <div className="text-wrapper-14">K</div>
          <div className="text-wrapper-15">D</div>
          <div className="text-wrapper-16">ADR</div>
        </div>

        {/* Правый блок (T) */}
        <div className="overlap-7">
          <div className="overlap-4">
            {/* Первый игрок T */}
            {renderPlayerRow("playerlongname10","_02","_012","_022",tPlayers[0])}
            {/* Второй игрок T */}
            {renderPlayerRow("playerlongname8","_04","_014","_024",tPlayers[1])}
          </div>

          <div className="overlap-5">
            {/* Третий игрок T */}
            {renderPlayerRow("playerlongname6","_06","_016","_026",tPlayers[2])}
          </div>

          <div className="navbar">
            {/* Четвертый игрок T */}
            {renderPlayerRow("playerlongname4","_08","_018","_028",tPlayers[3])}
          </div>

          <div className="overlap-6">
            {/* Пятый игрок T */}
            {renderPlayerRow("playerlongname2","_010","_020","_030",tPlayers[4])}
          </div>

          <div className="player">PLAYER</div>
          <div className="text-wrapper-14">K</div>
          <div className="text-wrapper-15">D</div>
          <div className="text-wrapper-16">ADR</div>
        </div>

        {/* Раунды внизу (вместо кучи overlap-... с цифрами) */}
        {renderRounds()}

      </div>
    </div>
  );
}
