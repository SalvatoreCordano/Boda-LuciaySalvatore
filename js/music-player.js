(function(){
  var audio = document.getElementById('bgMusic');
  var player = document.getElementById('musicPlayer');
  var toggleBtn = document.getElementById('musicToggle');
  var volDownBtn = document.getElementById('musicVolDown');
  var volUpBtn = document.getElementById('musicVolUp');
  if (!audio || !player || !toggleBtn) return;

  var VOL_STEP = 0.1;
  var DEFAULT_VOL = 0.15;
  var VOL_KEY = 'musicVolume_v2'; // versionado para no heredar un volumen alto guardado antes
  var storedVol = parseFloat(localStorage.getItem(VOL_KEY));
  audio.volume = isNaN(storedVol) ? DEFAULT_VOL : Math.min(1, Math.max(0, storedVol));

  // false hasta que el usuario pause explícitamente con el botón
  var userPaused = sessionStorage.getItem('musicPlaying') === '0';

  function updateUI(){
    player.classList.toggle('is-playing', !audio.paused);
    toggleBtn.setAttribute('aria-label', audio.paused ? 'Reproducir música' : 'Pausar música');
  }

  function setVolume(v){
    audio.volume = Math.min(1, Math.max(0, v));
    localStorage.setItem(VOL_KEY, audio.volume.toFixed(2));
  }

  function tryAutoplay(){
    if (userPaused || !audio.paused) return;
    audio.play().catch(function(){});
  }

  toggleBtn.addEventListener('click', function(){
    if (audio.paused) { userPaused = false; audio.play().catch(function(){}); }
    else { userPaused = true; audio.pause(); }
  });
  if (volDownBtn) volDownBtn.addEventListener('click', function(){ setVolume(audio.volume - VOL_STEP); });
  if (volUpBtn) volUpBtn.addEventListener('click', function(){ setVolume(audio.volume + VOL_STEP); });

  audio.addEventListener('play', function(){ sessionStorage.setItem('musicPlaying', '1'); updateUI(); });
  audio.addEventListener('pause', function(){ sessionStorage.setItem('musicPlaying', '0'); updateUI(); });

  // los navegadores bloquean el autoplay con sonido sin gesto del usuario:
  // se intenta de una vez y, si falla, se reintenta con el primer toque/clic
  // en la página (a menos que el usuario ya haya pausado antes). El clic en
  // el sello de lacre (abrir el sobre) es el gesto más confiable para esto.
  var sealBtn = document.getElementById('sealBtn');
  if (sealBtn) sealBtn.addEventListener('click', tryAutoplay);

  tryAutoplay();
  ['click', 'touchstart', 'keydown'].forEach(function(evt){
    document.addEventListener(evt, tryAutoplay, { once: true });
  });

  updateUI();
})();
