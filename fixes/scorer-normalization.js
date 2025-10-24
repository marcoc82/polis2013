(function(){
  // This script patches the app at runtime to normalize scorer entries before saving
  // and to make the history counting tolerant of both string and object scorer formats.
  function safeName(scorer){
    if(!scorer) return '';
    return (typeof scorer === 'string') ? scorer : (scorer.player || '');
  }

  function normalizeScorersArray(arr){
    if(!Array.isArray(arr)) return [];
    return arr.map(s => (typeof s === 'string') ? { player: s } : s);
  }

  // Wait for the app to expose saveMatch/createMatch function or the place where match is built
  function patchSave(){
    // Try common function names used in the project
    const candidates = [window.saveMatch, window.save_match, window.saveGame];
    // If there is a function on window named saveMatch, wrap it
    if(typeof window.saveMatch === 'function'){
      const orig = window.saveMatch;
      window.saveMatch = function(){
        try{
          if(window.team1Scorers) window.team1Scorers = normalizeScorersArray(window.team1Scorers);
          if(window.team2Scorers) window.team2Scorers = normalizeScorersArray(window.team2Scorers);
        }catch(e){console.error('scorer-normalization: normalize failure', e)}
        return orig.apply(this, arguments);
      };
      console.log('scorer-normalization: patched window.saveMatch');
      return true;
    }

    // Try to find a function that creates match object by scanning for element with id "save-match-button"
    const btn = document.getElementById('save-match-button') || document.getElementById('save-game-button');
    if(btn){
      const handler = btn.onclick;
      if(typeof handler === 'function'){
        btn.onclick = function(evt){
          try{
            if(window.team1Scorers) window.team1Scorers = normalizeScorersArray(window.team1Scorers);
            if(window.team2Scorers) window.team2Scorers = normalizeScorersArray(window.team2Scorers);
          }catch(e){console.error('scorer-normalization: normalize failure', e)}
          return handler.apply(this, arguments);
        };
        console.log('scorer-normalization: patched save button onclick');
        return true;
      }
    }

    return false;
  }

  function patchRenderHistory(){
    // Replace or wrap renderHistory if present
    if(typeof window.renderHistory === 'function'){
      const orig = window.renderHistory;
      window.renderHistory = function(){
        try{
          // Make window.loadMatchHistory tolerant by patching localStorage read post-processing inside this wrapper
          const history = (function(){
            try{
              const h = localStorage.getItem('polis_match_history');
              if(!h) return [];
              const parsed = JSON.parse(h);
              // Normalize existing saved matches in-memory for counting
              return parsed.map(match => {
                const copy = Object.assign({}, match);
                copy.scorers1 = Array.isArray(match.scorers1) ? match.scorers1.map(s => (typeof s === 'string') ? { player: s } : s) : [];
                copy.scorers2 = Array.isArray(match.scorers2) ? match.scorers2.map(s => (typeof s === 'string') ? { player: s } : s) : [];
                return copy;
              });
            }catch(e){console.error('scorer-normalization: history parse failed', e); return []}
          })();

          // Temporarily replace loadMatchHistory to return normalized history while orig runs
          const oldLoad = window.loadMatchHistory;
          window.loadMatchHistory = function(){ return history; };
          const result = orig.apply(this, arguments);
          // restore
          window.loadMatchHistory = oldLoad;
          return result;
        }catch(e){console.error('scorer-normalization: renderHistory wrapper error', e); return orig.apply(this, arguments);}      
      };
      console.log('scorer-normalization: patched renderHistory');
      return true;
    }
    return false;
  }

  // attempt patching periodically until success or timeout
  let tries = 0;
  const maxTries = 50;
  const interval = setInterval(()=>{
    tries++;
    const s = patchSave();
    const r = patchRenderHistory();
    if((s || typeof window.saveMatch === 'function') && (r || typeof window.renderHistory === 'function')){
      clearInterval(interval);
      console.log('scorer-normalization: patches applied');
    }
    if(tries>maxTries){ clearInterval(interval); console.warn('scorer-normalization: giving up after max tries'); }
  }, 300);
})();