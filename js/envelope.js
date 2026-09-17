(function(){
  var sealBtn = document.getElementById('sealBtn');
  var envelopeScene = document.getElementById('envelopeScene');
  var letterScene = document.getElementById('letterScene');
  var cardSobre = document.getElementById('cardSobre');
  var moreLink = document.getElementById('moreLink');
  var extraCards = [
    document.getElementById('cardGrupo1'),
    document.getElementById('cardGrupo2'),
    document.getElementById('cardRegalos'),
    document.getElementById('cardRecepcion'),
    document.getElementById('cardInvitacion')
  ];
  var opened = false;

  function reveal(el){
    void el.offsetWidth; // fuerza reflow para que la animación se dispare
    el.classList.add('is-visible');
  }

  sealBtn.addEventListener('click', function(){
    if(opened) return;
    opened = true;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var envelopeFade = reduced ? 250 : 400;
    var revealDuration = reduced ? 300 : 700;
    var pauseBeforeContent = 500;
    var stagger = 110;

    envelopeScene.classList.add('is-hidden');

    setTimeout(function(){
      envelopeScene.hidden = true;
      letterScene.hidden = false;
      reveal(cardSobre);

      setTimeout(function(){
        extraCards.forEach(function(card, i){
          setTimeout(function(){ reveal(card); }, i * stagger);
        });

        // el link "Saber más" aparece justo después de que termina
        // de asentarse la última tarjeta
        var lastCardDelay = (extraCards.length - 1) * stagger;
        setTimeout(function(){ reveal(moreLink); }, lastCardDelay + revealDuration + 300);
      }, revealDuration + pauseBeforeContent);
    }, envelopeFade);
  });
})();

(function(){
  var moreLink = document.getElementById('moreLink');
  var modal = document.getElementById('codeModal');
  var form = document.getElementById('codeForm');
  var input = document.getElementById('codeInput');
  var errorEl = document.getElementById('codeError');
  var submitBtn = form ? form.querySelector('.code-modal-submit') : null;
  if (!moreLink || !modal) return;

  var existingCode = new URLSearchParams(location.search).get('inv');

  function parseCsvLine(line){
    var cells = [];
    var cur = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++){
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { cells.push(cur); cur = ''; }
        else { cur += ch; }
      }
    }
    cells.push(cur);
    return cells;
  }

  function isValidCode(code){
    var target = code.trim().toLowerCase();
    if (!target) return Promise.resolve(false);
    return fetch('/invitados.csv', { cache: 'no-store' })
      .then(function(res){ return res.ok ? res.text() : ''; })
      .then(function(text){
        var rows = text.split(/\r?\n/).filter(function(r){ return r.trim().length; });
        for (var i = 1; i < rows.length; i++) {
          var cols = parseCsvLine(rows[i]);
          if ((cols[0] || '').trim().toLowerCase() === target) return true;
        }
        return false;
      })
      .catch(function(){ return false; });
  }

  function goToInvitacion(code){
    location.href = '/invitacion/?inv=' + encodeURIComponent(code.trim());
  }

  function openModal(showError){
    if (errorEl) errorEl.hidden = !showError;
    modal.hidden = false;
    setTimeout(function(){ input.focus(); }, 50);
  }
  function closeModal(){
    modal.hidden = true;
  }

  moreLink.addEventListener('click', function(e){
    e.preventDefault();
    if (!existingCode) { openModal(false); return; }
    isValidCode(existingCode).then(function(ok){
      if (ok) { goToInvitacion(existingCode); }
      else { openModal(true); }
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var code = input.value.trim();
    if (!code) { input.focus(); return; }
    if (submitBtn) submitBtn.disabled = true;
    isValidCode(code).then(function(ok){
      if (submitBtn) submitBtn.disabled = false;
      if (ok) {
        goToInvitacion(code);
      } else if (errorEl) {
        errorEl.hidden = false;
        input.focus();
        input.select();
      }
    });
  });

  modal.addEventListener('click', function(e){
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
