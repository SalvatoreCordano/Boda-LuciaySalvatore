(function(){
  var audio = document.getElementById('bgMusic');
  var player = document.getElementById('musicPlayer');
  var toggleBtn = document.getElementById('musicToggle');
  var volDownBtn = document.getElementById('musicVolDown');
  var volUpBtn = document.getElementById('musicVolUp');
  if (!audio || !player || !toggleBtn) return;

  var VOL_STEP = 0.1;
  var DEFAULT_VOL = 0.25;
  var storedVol = parseFloat(localStorage.getItem('musicVolume'));
  audio.volume = isNaN(storedVol) ? DEFAULT_VOL : Math.min(1, Math.max(0, storedVol));

  function updateUI(){
    player.classList.toggle('is-playing', !audio.paused);
    toggleBtn.setAttribute('aria-label', audio.paused ? 'Reproducir música' : 'Pausar música');
  }

  function setVolume(v){
    audio.volume = Math.min(1, Math.max(0, v));
    localStorage.setItem('musicVolume', audio.volume.toFixed(2));
  }

  toggleBtn.addEventListener('click', function(){
    if (audio.paused) { audio.play().catch(function(){}); }
    else { audio.pause(); }
  });
  if (volDownBtn) volDownBtn.addEventListener('click', function(){ setVolume(audio.volume - VOL_STEP); });
  if (volUpBtn) volUpBtn.addEventListener('click', function(){ setVolume(audio.volume + VOL_STEP); });

  audio.addEventListener('play', function(){ sessionStorage.setItem('musicPlaying', '1'); updateUI(); });
  audio.addEventListener('pause', function(){ sessionStorage.setItem('musicPlaying', '0'); updateUI(); });

  // si venía sonando en la página anterior, intenta seguir sin pedir otro clic
  if (sessionStorage.getItem('musicPlaying') === '1') {
    audio.play().catch(function(){});
  }

  updateUI();
})();
