"use client";

import React from 'react';
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

  // Порядок игроков CT сверху вниз
  const ctPlayersOrder = [
    {nameClass:"playerlongname9", killsClass:"_0", deathsClass:"_011", adrClass:"_021"},
    {nameClass:"playerlongname7", killsClass:"_03", deathsClass:"_013", adrClass:"_023"},
    {nameClass:"playerlongname5", killsClass:"_05", deathsClass:"_015", adrClass:"_025"},
    {nameClass:"playerlongname3", killsClass:"_07", deathsClass:"_017", adrClass:"_027"},
    {nameClass:"playerlongname",  killsClass:"_09", deathsClass:"_019", adrClass:"_029"}
  ];

  // Порядок игроков T сверху вниз
  const tPlayersOrder = [
    {nameClass:"playerlongname10", killsClass:"_02", deathsClass:"_012", adrClass:"_022"},
    {nameClass:"playerlongname8",  killsClass:"_04", deathsClass:"_014", adrClass:"_024"},
    {nameClass:"playerlongname6",  killsClass:"_06", deathsClass:"_016", adrClass:"_026"},
    {nameClass:"playerlongname4",  killsClass:"_08", deathsClass:"_018", adrClass:"_028"},
    {nameClass:"playerlongname2",  killsClass:"_010", deathsClass:"_020", adrClass:"_030"}
  ];

  function getRoundBackground(result) {
    if (!result) return '#262626';
    const normalizedResult = result.toLowerCase();
    if (normalizedResult.startsWith('ct_win')) return '#847CA1';
    if (normalizedResult.startsWith('t_win')) return '#8C8259';
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

  function renderPlayerData(player) {
    const { name, match_stats } = player;
    const { kills, deaths } = match_stats;
    const adr = 0; 
    return { name, kills, deaths, adr };
  }

  return (
    <div style={{width:'100%',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'none'}}>
      <div 
        className="compare-mvp" 
        style={{
          background: 'url(compare-mvp.png) center no-repeat',
          backgroundSize:'cover',
          position:'relative',
          width:'1920px',
          height:'1080px',
          overflow:'hidden',
          fontFamily:'Blender Pro, sans-serif',
          color:'#fff'
        }}
      >
        <div className="rectangle-53"></div>
        <div className="rectangle-55" style={{border:'1px solid #40327C'}}></div>
        <div className="rectangle-50"></div>
        <div className="rectangle-648"></div>
        <div className="rectangle-606"></div>
        <div className="rectangle-655"></div>
        <div className="rectangle-617"></div>
        <div className="rectangle-612"></div>
        <div className="rectangle-618"></div>
        <div className="rectangle-619"></div>
        <div className="rectangle-613"></div>
        <div className="rectangle-620"></div>
        <div className="rectangle-610"></div>
        <div className="rectangle-621"></div>
        <div className="rectangle-607"></div>
        <div className="rectangle-622"></div>
        <div className="rectangle-615"></div>
        <div className="rectangle-623"></div>
        <div className="rectangle-609"></div>
        <div className="rectangle-624"></div>
        <div className="rectangle-616"></div>
        <div className="rectangle-625"></div>
        <div className="rectangle-627"></div>
        <div className="rectangle-628"></div>
        <div className="rectangle-629"></div>
        <div className="rectangle-630"></div>
        <div className="rectangle-611"></div>
        <div className="rectangle-626"></div>
        <div className="rectangle-631"></div>
        <div className="rectangle-632"></div>
        <div className="rectangle-649"></div>
        <div className="rectangle-637"></div>
        <div className="rectangle-650"></div>
        <div className="rectangle-644"></div>
        <div className="rectangle-651"></div>
        <div className="rectangle-645"></div>
        <div className="rectangle-652"></div>
        <div className="rectangle-646"></div>
        <div className="rectangle-653"></div>
        <div className="rectangle-647"></div>
        <div className="rectangle-654"></div>

        <Image className="rectangle-49" src={`/teams/${tTeam.name}.png`} alt="" width={89} height={89} style={{position:'absolute',left:'1536px',top:'181px',objectFit:'cover'}}/>
        <Image className="rectangle-47" src={`/teams/${ctTeam.name}.png`} alt="" width={88} height={88} style={{position:'absolute',left:'242px',top:'186px',objectFit:'cover'}}/>

        <Image className="player-photo" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'252px',top:'744px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo2" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'969px',top:'744px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo3" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'252px',top:'656px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo4" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'969px',top:'656px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo5" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'252px',top:'566px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo6" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'969px',top:'566px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo7" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'252px',top:'476px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo8" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'969px',top:'476px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo9" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'252px',top:'386px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>
        <Image className="player-photo10" alt="" src="https://via.placeholder.com/127x81" width={127} height={81} style={{position:'absolute',left:'969px',top:'386px',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',objectFit:'cover'}}/>

        <div className="team-name" style={{textTransform:'uppercase'}}>{ctTeam.name.toUpperCase()}</div>
        <div className="team-name2" style={{textTransform:'uppercase'}}>{tTeam.name.toUpperCase()}</div>

        <div className="player">PLAYER</div>
        <div className="player2">PLAYER</div>
        <div className="k">K</div>
        <div className="k2">K</div>
        <div className="d">D</div>
        <div className="d2">D</div>
        <div className="adr">ADR</div>
        <div className="adr2">ADR</div>

        <div className="_031" style={{textAlign:'center',color:'#847CA1',fontSize:'100px',fontFamily:'Blender Pro',fontWeight:'900',lineHeight:'82.56px',position:'absolute',left:'810px',top:'194px'}}>{ctTeam.score}</div>
        <div className="_2" style={{textAlign:'center',color:'#EADAA5',fontSize:'100px',fontFamily:'Blender Pro',fontWeight:'900',lineHeight:'82.56px',position:'absolute',left:'985px',top:'196px'}}>{tTeam.score}</div>
        <div className="div" style={{textAlign:'center',color:'#575170',fontSize:'99px',fontFamily:'Blender Pro',fontWeight:'900',lineHeight:'81.73px',position:'absolute',left:'933px',top:'190px'}}>:</div>

        <div className="match-stats" style={{
          position:'absolute', left:'539px', top:'17px', width:'803px', height:'140px',
          textAlign:'center', color:'#fff', fontSize:'91px', fontFamily:'Blender Pro', fontWeight:'900', textTransform:'uppercase',lineHeight:'75.13px'
        }}>MATCH STATS</div>

        <div className="map-nuke" style={{
          position:'absolute', left:'819px', top:'127px', width:'240px', height:'46px',
          textAlign:'center', color:'#fff', fontSize:'29px', fontFamily:'Blender Pro', fontWeight:'500', lineHeight:'23.94px'
        }}>MAP: {mapName}</div>

        {/* CT Players */}
        {ctPlayers.map((pl,i) => {
          const mapping = ctPlayersOrder[i];
          const { name, kills, deaths, adr } = renderPlayerData(pl);
          return (
            <React.Fragment key={pl.steamid}>
              <div className={mapping.nameClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'31px',fontWeight:'700',textTransform:'uppercase',width:'301px',whiteSpace:'nowrap',overflow:'hidden'}}>{name}</div>
              <div className={mapping.killsClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{kills}</div>
              <div className={mapping.deathsClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{deaths}</div>
              <div className={mapping.adrClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{adr}</div>
            </React.Fragment>
          );
        })}

        {/* T Players */}
        {tPlayers.map((pl,i)=>{
          const mapping = tPlayersOrder[i];
          const { name, kills, deaths, adr } = renderPlayerData(pl);
          return (
            <React.Fragment key={pl.steamid}>
              <div className={mapping.nameClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'31px',fontWeight:'700',textTransform:'uppercase',width:'301px',whiteSpace:'nowrap',overflow:'hidden',textAlign:'left'}}>{name}</div>
              <div className={mapping.killsClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{kills}</div>
              <div className={mapping.deathsClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{deaths}</div>
              <div className={mapping.adrClass} style={{position:'absolute',color:'#fff',fontFamily:'Blender Pro',fontSize:'40px',fontWeight:'700',textTransform:'uppercase'}}>{adr}</div>
            </React.Fragment>
          );
        })}

        {/* Раунды */}
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

        <style jsx global>{`
          .compare-mvp,
          .compare-mvp * {
            box-sizing: border-box;
          }
          .compare-mvp {
            height: 1080px;
            position: relative;
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            overflow: hidden;
          }
          /* Здесь вставьте все ваши стили для .rectangle-..., .playerlongname..., ._0, ._011 и т.д. */
          /* Из вашего кода замените class на className. Сейчас у нас они есть как className. */
          /* Убедитесь, что все классы playerlongname, _0, _011, и т.д. определены либо используйте inline-стили как мы сейчас делаем. */
        `}</style>

      </div>
    </div>
  );
}
