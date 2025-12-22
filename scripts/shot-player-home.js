(function(){
  // Shot player modal + shot list for home team (team 1)
  // This script injects a modal and a shots list and intercepts "Tiro" button for team 1
  // so the app asks for the player who took the shot (same UX used for goals/cards).

  // Helper: safe DOM ready
  function onReady(fn){
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function(){
    try{
      // Inject modal HTML into body
      if (!document.getElementById('shot-player-modal')){
        var modal = document.createElement('div');
        modal.id = 'shot-player-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        modal.innerHTML = '\n  <div class="modal-content">\n    <div class="modal-header">Tiro in porta - Seleziona giocatore</div>\n    <p class="text-gray-400 mb-4">Seleziona il giocatore che ha effettuato il tiro</p>\n    <div style="display:flex; justify-content:center; gap:8px; margin-bottom:14px;">\n      <select id="shot-player-select" class="modal-input" style="min-width:220px;">\n        <option value="">-- Seleziona giocatore --</option>\n      </select>\n    </div>\n    <div class="flex justify-center gap-4">\n      <button id="confirm-shot-player-button" class="btn btn-goal px-8">Conferma</button>\n      <button id="cancel-shot-player-button" class="btn bg-gray-500 hover:bg-gray-600 px-8">Annulla</button>\n    </div>\n  </div>\n';
        document.body.appendChild(modal);
      }

      // Insert shots-list-1 after scorers-list-1 if not present
      if (!document.getElementById('shots-list-1')){
        var scorersList1 = document.getElementById('scorers-list-1');
        var shotsDiv = document.createElement('div');
        shotsDiv.id = 'shots-list-1';
        shotsDiv.className = 'shots-list';
        shotsDiv.innerHTML = '<h4>Tiri in porta:</h4>';
        if (scorersList1 && scorersList1.parentNode){
          scorersList1.parentNode.insertBefore(shotsDiv, scorersList1.nextSibling);
        } else {
          // Fallback: append to stats container if exists
          var statsTeam1 = document.querySelector('.stats-team') || document.getElementById('stats-team1');
          if (statsTeam1) statsTeam1.appendChild(shotsDiv);
          else document.body.appendChild(shotsDiv);
        }
      }

      // Local state
      window.team1Shots = window.team1Shots || []; // keep globally accessible for debugging
      var pendingShotPeriod = null;
      var pendingShotButtonQuarter = null;

      function getCurrentMatchMinute(){
        try{
          if (typeof timerStartTime !== 'undefined' && timerStartTime){
            var elapsedMs = Date.now() - timerStartTime - (pausedDuration || 0);
            return Math.max(0, Math.floor(elapsedMs / 60000));
          }
        }catch(e){console.warn('shot-player-home getMinute', e);} 
        return (typeof lastSetSeconds !== 'undefined') ? Math.floor(((lastSetSeconds||0) - (totalSeconds||0))/60) : 0;
      }

      function showShotPlayerModal(period){
        pendingShotPeriod = period || (typeof currentPeriod !== 'undefined' ? currentPeriod + "°T" : '1°T');
        var select = document.getElementById('shot-player-select');
        if (!select) return;
        select.innerHTML = '<option value="">-- Seleziona giocatore --</option>';

        var players = (window.currentClub && window.currentClub.giocatori) ? window.currentClub.giocatori : [];
        // players might be array of strings
        players.forEach(function(p){
          var opt = document.createElement('option');
          opt.value = p;
          opt.textContent = p;
          select.appendChild(opt);
        });

        document.getElementById('shot-player-modal').style.display = 'block';
        // focus select
        setTimeout(function(){ select.focus(); }, 50);
      }

      // expose globally so HTML handler can call it if we update the inline handlers
      window.showShotPlayerModal = showShotPlayerModal;

      function hideShotPlayerModal(){
        var modal = document.getElementById('shot-player-modal');
        if (modal) modal.style.display = 'none';
        pendingShotPeriod = null;
        var select = document.getElementById('shot-player-select'); if (select) select.value = '';
      }

      function renderShotsList(){
        var container = document.getElementById('shots-list-1');
        if (!container) return;
        container.innerHTML = '<h4>Tiri in porta:</h4>';
        window.team1Shots.forEach(function(s){
          var div = document.createElement('div');
          div.className = 'scorer-list-item';
          div.textContent = (s.player || 'Sconosciuto') + ' - ' + (s.minute||0) + "' (" + (s.period||'?') + ")";
          container.appendChild(div);
        });
      }

      // Intercept clicks on "Tiro" add button for team 1
      document.addEventListener('click', function(ev){
        try{
          var btn = ev.target.closest && ev.target.closest('button[data-type="shot"][data-team="1"][data-action="add"]');
          if (!btn) return;

          // Prevent the page's existing handler from running (we will replicate its behavior)
          ev.stopImmediatePropagation();
          ev.preventDefault();

          // If period not selected, show alert like original
          if (!window.currentPeriod){ alert('Seleziona prima il tempo per registrare gli eventi!'); return; }

          var quarter = btn.dataset.quarter || (window.currentPeriod ? (window.currentPeriod + '°T') : '1°T');
          pendingShotButtonQuarter = quarter;
          showShotPlayerModal(quarter);
        }catch(e){ console.error('shot-player-home click intercept error', e); }
      }, true); // use capture to run before other listeners

      // Confirm button handler
      var confirmBtn = document.getElementById('confirm-shot-player-button');
      if (confirmBtn){
        confirmBtn.addEventListener('click', function(){
          var select = document.getElementById('shot-player-select');
          if (!select) return;
          var player = select.value;
          if (!player){ alert('Seleziona un giocatore prima di confermare.'); return; }

          var period = pendingShotPeriod || pendingShotButtonQuarter || (window.currentPeriod ? (window.currentPeriod + '°T') : '1°T');
          var minute = getCurrentMatchMinute();

          // Update eventsByPeriod like original code would
          try{
            if (window.eventsByPeriod && window.eventsByPeriod.team1 && window.currentPeriod){
              var key = window.currentPeriod.toString();
              if (!window.eventsByPeriod.team1.shots[key] && window.eventsByPeriod.team1.shots.hasOwnProperty(key)===false){
                // safety init
                window.eventsByPeriod.team1.shots[key] = 0;
              }
              window.eventsByPeriod.team1.shots[key]++;
            }
          }catch(e){ console.warn('shot-player-home eventsByPeriod update failed', e); }

          // Add to detailed list
          window.team1Shots.push({ player: player, period: period, minute: minute });

          // Update UI & persist
          try{ if (typeof updateStats === 'function') updateStats(); }catch(e){}
          try{ renderShotsList(); }catch(e){}
          try{ if (typeof showActionConfirmation === 'function') showActionConfirmation('+'); }catch(e){}

          // call saveCurrentGameState and also ensure team1Shots are persisted
          try{
            if (typeof window.saveCurrentGameState === 'function'){
              window.saveCurrentGameState();
            }
          }catch(e){ console.warn('saveCurrentGameState call failed', e); }

          // Best-effort persist team1Shots in localStorage in case the app doesn't include it yet
          try{
            localStorage.setItem('team1Shots', JSON.stringify(window.team1Shots));
          }catch(e){ console.warn('localStorage team1Shots save failed', e); }

          hideShotPlayerModal();
        });
      }

      // Cancel button
      var cancelBtn = document.getElementById('cancel-shot-player-button');
      if (cancelBtn) cancelBtn.addEventListener('click', hideShotPlayerModal);

      // Wrap/augment saveCurrentGameState so it includes team1Shots in the saved payload if possible
      if (typeof window.saveCurrentGameState === 'function'){
        (function(){
          var originalSave = window.saveCurrentGameState;
          window.saveCurrentGameState = function(){
            try{
              var result = originalSave.apply(this, arguments);
              // Try to attach team1Shots to known in-memory objects
              var candidateNames = ['currentGameState','currentGame','currentMatch','gameState','savedGameState','matchState'];
              candidateNames.forEach(function(name){
                try{
                  if (window[name] && typeof window[name] === 'object'){
                    window[name].team1Shots = window.team1Shots;
                  }
                }catch(e){}
              });
              // Also try to find a localStorage entry that looks like a match object and augment it
              try{
                for(var i=0;i<localStorage.length;i++){
                  var key = localStorage.key(i);
                  try{
                    var val = JSON.parse(localStorage.getItem(key));
                    if (val && typeof val === 'object' && ('score1' in val || 'team1' in val || 'scorers1' in val)){
                      val.team1Shots = window.team1Shots;
                      localStorage.setItem(key, JSON.stringify(val));
                      break;
                    }
                  }catch(e){}
                }
              }catch(e){}

              // Ensure backup key
              try{ localStorage.setItem('team1Shots', JSON.stringify(window.team1Shots)); }catch(e){}

              return result;
            }catch(e){
              console.warn('Wrapped saveCurrentGameState failed', e);
              try{ return originalSave.apply(this, arguments); }catch(e){ return null; }
            }
          };
        })();
      }

      // Keep shots list in sync if external code changes shots count (removals via existing UI)
      var prevShotsCount = (function(){ var el = document.getElementById('shots-team1'); return el ? parseInt(el.textContent||'0',10)||0 : window.team1Shots.length; })();
      setInterval(function(){
        try{
          var el = document.getElementById('shots-team1');
          if (!el) return;
          var current = parseInt(el.textContent||'0',10)||0;
          if (current < prevShotsCount){
            // shots decreased -> remove last entries from team1Shots
            var diff = prevShotsCount - current;
            for(var i=0;i<diff;i++){ window.team1Shots.pop(); }
            renderShotsList();
          }
          prevShotsCount = current;
        }catch(e){ /* ignore */ }
      }, 700);

      // Ensure shots list is rendered on load/when updateAllDisplays runs
      // If updateAllDisplays exists, wrap it to call renderShotsList afterwards
      if (typeof window.updateAllDisplays === 'function'){
        var originalUpdateAll = window.updateAllDisplays;
        window.updateAllDisplays = function(){
          try{ originalUpdateAll.apply(this, arguments); }catch(e){ console.warn(e); }
          try{ renderShotsList(); }catch(e){}
        };
      }

      // Initial render
      renderShotsList();

      console.log('[shot-player-home] initialized');

    }catch(err){ console.error('[shot-player-home] init error', err); }
  });
})();
