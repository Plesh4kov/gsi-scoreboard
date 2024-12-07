"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
        fontFamily: 'Blender Pro, sans-serif',
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

  let ctPlayers = playersArray.filter(p => p.team === 'CT').sort((a,b)=>b.match_stats.kills - a.match_stats.kills).slice(0,5);
  let tPlayers = playersArray.filter(p => p.team === 'T').sort((a,b)=>b.match_stats.kills - a.match_stats.kills).slice(0,5);

  const totalRounds = 24;
  const rounds = Array.from({length: totalRounds}, (_, i) => i+1);

  // Стили для заголовков колонок
  const colHeaderStyle = {
    fontSize:'20px',
    fontWeight:'bold',
    textTransform:'uppercase',
    color:'#fff'
  };

  const playerRowStyle = {
    display:'grid',
    gridTemplateColumns:'1fr 30px 30px 40px',
    columnGap:'20px',
    alignItems:'center',
    background:'rgba(0,0,0,0.2)',
    borderRadius:'0',
    padding:'10px',
    boxSizing:'border-box',
    marginTop:'5px'
  };

  const playerNameWrapperStyle = {
    display:'flex',
    alignItems:'center',
    gap:'10px',
    overflow:'hidden'
  };

  const playerNameStyle = {
    fontWeight:'bold',
    fontSize:'18px',
    textTransform:'uppercase',
    whiteSpace:'nowrap',
    overflow:'hidden',
    textOverflow:'ellipsis',
    color:'#fff',
    fontFamily:'Blender Pro, sans-serif'
  };

  const statValueStyle = {
    fontWeight:'bold',
    fontSize:'18px',
    textAlign:'center',
    color:'#fff',
    fontFamily:'Blender Pro, sans-serif'
  };

  function renderPlayerRowADR(player) {
    const { name, steamid, match_stats } = player;
    const { kills, deaths } = match_stats;
    const adr = 0; // Нет данных ADR
    const lowercaseSteamId = steamid.toString().toLowerCase();

    return (
      <div style={playerRowStyle} key={steamid}>
        <div style={playerNameWrapperStyle}>
          <Image 
            src={`/players/${lowercaseSteamId}.png`}
            alt={name}
            width={60}
            height={60}
            onError={(e) => { e.currentTarget.src = '/players/idle.png'; }}
            style={{objectFit:'contain'}}
          />
          <div style={playerNameStyle}>{name}</div>
        </div>
        <div style={statValueStyle}>{kills}</div>
        <div style={statValueStyle}>{deaths}</div>
        <div style={statValueStyle}>{adr}</div>
      </div>
    );
  }

  function getRoundBackground(result) {
    if (!result) return '#262626'; // не сыгран: #262626
    const normalizedResult = result.toLowerCase();
    if (normalizedResult.startsWith('ct_win')) return '#847CA1'; // ct-win: #847CA1
    if (normalizedResult.startsWith('t_win')) return '#8C8259';  // t-win: #8C8259
    return '#262626'; // по умолчанию
  }

  function getRoundIcon(result) {
    if (!result) return null;
    const norm = result.toLowerCase();
    let iconPath = '/icons/default.png';
    if (norm.includes('elimination')) iconPath='/icons/skull.png';
    else if (norm.includes('bomb')) iconPath='/icons/bomb.png';
    else if (norm.includes('defuse')) iconPath='/icons/defuse.png';
    else if (norm.includes('time')) iconPath='/icons/clock.png';

    return <Image src={iconPath} alt={result} width={20} height={20} style={{objectFit:'contain'}}/>;
  }

  return (
    <div style={{background:'none', width:'100%', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div style={{
        position:'relative',
        width:'1920px',
        height:'1080px',
        background:'none',  // Убрали основной бекграунд
        fontFamily:'Blender Pro, sans-serif',
        color:'#fff',
        boxSizing:'border-box'
      }}>

        {/* MATCH STATS Title */}
        <div style={{
          width:'803px', height:'140px', left:'539px', top:'17px', position:'absolute',
          textAlign:'center', color:'white', fontSize:'91px', fontFamily:'Blender Pro', fontWeight:'900', lineHeight:'75.13px', textTransform:'uppercase'
        }}>MATCH STATS</div>

        <div style={{
          width:'240px', height:'46px', left:'819px', top:'127px', position:'absolute',
          textAlign:'center', color:'white', fontSize:'29px', fontFamily:'Blender Pro', fontWeight:'500', lineHeight:'23.94px'
        }}>MAP: {mapName}</div>

        {/* Верхний прямоугольник */}
        <div style={{
          width:'1419px', height:'113px', left:'231px', top:'173px', position:'absolute',
          background:'rgba(33.63,27.95,59.17,0.88)', boxShadow:'0px -5px 0px #40327C inset'
        }}></div>

        {/* Нижний прямоугольник */}
        <div style={{
          width:'1419px', height:'133px', left:'231px', top:'884px', position:'absolute',
          background:'rgba(33.63,27.95,59.17,0.88)', border:'1px #40327C solid'
        }}></div>

        {/* Левая панель */}
        <div style={{
          width:'702px', height:'542px', left:'231px', top:'307px', position:'absolute',
          background:'linear-gradient(0deg, rgba(21,17,39,0.88) 0%, rgba(21,17,39,0.88) 100%), linear-gradient(180deg, rgba(14.88,14.88,14.88,0) 0%, rgba(56.42,39.21,113.79,0.20) 100%)',
          border:'1px #40327C solid',
          boxSizing:'border-box',
          padding:'10px',
          display:'flex',flexDirection:'column'
        }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 30px 30px 40px',
            columnGap:'20px',
            alignItems:'center',
            background:'rgba(0,0,0,0.2)',
            border:'none',
            borderRadius:'0',
            padding:'5px',
            boxSizing:'border-box'
          }}>
            <span style={{
              textAlign:'left',
              fontSize:'20px',
              fontWeight:'bold',
              textTransform:'uppercase',
              color:'#fff',
              paddingRight:'70px'
            }}>PLAYER</span>
            <span style={colHeaderStyle}>K</span>
            <span style={colHeaderStyle}>D</span>
            <span style={colHeaderStyle}>ADR</span>
          </div>
          {ctPlayers.map(p=>renderPlayerRowADR(p))}
        </div>

        {/* Правая панель */}
        <div style={{
          width:'702px', height:'542px', left:'948px', top:'307px', position:'absolute',
          background:'linear-gradient(0deg, rgba(52.06,47.46,37.53,0.88) 0%, rgba(52.06,47.46,37.53,0.88) 100%), linear-gradient(180deg, rgba(14.88,14.88,14.88,0) 0%, rgba(113.79,96.39,39.21,0.20) 100%)',
          border:'1px #EADAA5 solid',
          boxSizing:'border-box',
          padding:'10px',
          display:'flex',flexDirection:'column'
        }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 30px 30px 40px',
            columnGap:'20px',
            alignItems:'center',
            background:'rgba(0,0,0,0.2)',
            border:'none',
            borderRadius:'0',
            padding:'5px',
            boxSizing:'border-box'
          }}>
            <span style={{
              textAlign:'left',
              fontSize:'20px',
              fontWeight:'bold',
              textTransform:'uppercase',
              color:'#fff',
              paddingRight:'70px'
            }}>PLAYER</span>
            <span style={colHeaderStyle}>K</span>
            <span style={colHeaderStyle}>D</span>
            <span style={colHeaderStyle}>ADR</span>
          </div>
          {tPlayers.map(p=>renderPlayerRowADR(p))}
        </div>

        {/* Названия команд и счет */}
        <div style={{
          width:'240px', height:'48px', left:'335px', top:'209px', position:'absolute',
          color:'white', fontSize:'40px', fontFamily:'Blender Pro', fontWeight:'700', textTransform:'uppercase', lineHeight:'33.02px'
        }}>{ctTeam.name.toUpperCase()}</div>

        <div style={{
          width:'240px', height:'48px', left:'1300px', top:'209px', position:'absolute',
          textAlign:'right', color:'white', fontSize:'40px', fontFamily:'Blender Pro', fontWeight:'700', textTransform:'uppercase', lineHeight:'33.02px'
        }}>{tTeam.name.toUpperCase()}</div>

        {/* Лого команд сверху */}
        {/* Левое лого */}
        <Image src={`/teams/${ctTeam.name}.png`} alt="CT Team" width={88} height={88} style={{objectFit:'contain', position:'absolute', left:'242px', top:'186px'}}/>
        {/* Правое лого */}
        <Image src={`/teams/${tTeam.name}.png`} alt="T Team" width={89} height={89} style={{objectFit:'contain', position:'absolute', left:'1536px', top:'181px'}}/>

        <div style={{
          width:'130.50px', left:'810px', top:'194px', position:'absolute',
          textAlign:'center', color:'#847CA1', fontSize:'100px', fontFamily:'Blender Pro', fontWeight:'900', lineHeight:'82.56px'
        }}>{ctTeam.score}</div>

        <div style={{
          left:'985px', top:'196px', position:'absolute',
          textAlign:'center', color:'#EADAA5', fontSize:'100px', fontFamily:'Blender Pro', fontWeight:'900', lineHeight:'82.56px'
        }}>{tTeam.score}</div>

        <div style={{
          width:'20px',height:'55px', left:'933px', top:'190px', position:'absolute',
          textAlign:'center', color:'#575170', fontSize:'99px', fontFamily:'Blender Pro', fontWeight:'900', lineHeight:'81.73px'
        }}>:</div>

        {/* Отрисовка 24 раундов снизу */}
        {rounds.map((roundNumber, i) => {
          const result = roundWins[roundNumber.toString()] || null;
          const baseLeft = 247;
          const spacing = 57;   
          const leftPos = baseLeft + i*spacing;
          const topPos = 903;
          const bg = getRoundBackground(result);
          return (
            <div key={roundNumber} style={{
              width:'51px', height:'96px',
              position:'absolute',
              left:`${leftPos}px`,
              top:`${topPos}px`,
              background:bg,
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center',
              boxSizing:'border-box',
              padding:'5px'
            }}>
              {getRoundIcon(result)}
              <div style={{
                fontSize:'35px',
                color:'#fff',
                textAlign:'center',
                fontFamily:'Blender Pro',
                fontWeight:'900',
                lineHeight:'28.90px',
                textTransform:'uppercase'
              }}>{roundNumber}</div>
            </div>
          );
        })}

        {/* Остальные картинки и элементы, если нужны, можно добавить аналогично */}
      </div>
    </div>
  );
}
