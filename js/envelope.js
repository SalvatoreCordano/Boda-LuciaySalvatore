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
  if (!moreLink || !modal) return;

  var existingCode = new URLSearchParams(location.search).get('inv');
  if (existingCode) {
    moreLink.href = '/invitacion/?inv=' + encodeURIComponent(existingCode.trim());
    return; // ya tiene código, no hace falta preguntar
  }

  function openModal(){
    modal.hidden = false;
    setTimeout(function(){ input.focus(); }, 50);
  }
  function closeModal(){
    modal.hidden = true;
  }

  moreLink.addEventListener('click', function(e){
    e.preventDefault();
    openModal();
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var code = input.value.trim();
    if (!code) { input.focus(); return; }
    location.href = '/invitacion/?inv=' + encodeURIComponent(code);
  });

  modal.addEventListener('click', function(e){
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
