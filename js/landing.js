(function(){
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(function(el){ io.observe(el); });
})();

(function(){
  var elDays = document.getElementById('cdDays');
  var elHours = document.getElementById('cdHours');
  var elMinutes = document.getElementById('cdMinutes');
  if (!elDays) return;

  var target = new Date('2026-11-28T15:30:00-05:00').getTime();

  function pad(n){ return String(n).padStart(2, '0'); }

  function tick(){
    var diff = Math.max(0, target - Date.now());
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
  }

  tick();
  setInterval(tick, 30000);
})();

(function(){
  var buttons = document.querySelectorAll('.copy-btn');
  if (!buttons.length) return;

  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  buttons.forEach(function(btn){
    var label = btn.querySelector('svg').nextSibling;
    var originalText = label ? label.textContent : 'Copiar';

    btn.addEventListener('click', function(){
      var value = btn.getAttribute('data-copy');
      var done = function(){
        btn.classList.add('is-copied');
        if (label) label.textContent = ' Copiado';
        setTimeout(function(){
          btn.classList.remove('is-copied');
          if (label) label.textContent = originalText;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function(){
          fallbackCopy(value);
          done();
        });
      } else {
        fallbackCopy(value);
        done();
      }
    });
  });
})();
