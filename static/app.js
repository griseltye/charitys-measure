
async function recalc() {
  const scores = [];
  for (let i = 0; i < 8; i++) {
    const raw = document.getElementById('d'+(8+i)).value;
    const v = raw === '' ? null : parseFloat(raw);
    scores.push(v);
  }
  const yn = (document.getElementById('d19').value || '').trim();

  const res = await fetch('/calc', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({scores, yn})
  });
  const data = await res.json();

  for (let i = 0; i < 8; i++) {
    const m = data.meanings[i];
    document.getElementById('m1_'+i).textContent = (m && m[1]) ? m[1] : '';
    document.getElementById('m2_'+i).textContent = (m && m[2]) ? m[2] : '';
  }

  document.getElementById('r16_left_val').textContent = data.any ? data.d16.toFixed(1) : '';
  document.getElementById('r16_mid_val').textContent = data.any ? data.sum.toFixed(1) : '';
  document.getElementById('b17_val').textContent = data.b17.toFixed(1);

  document.getElementById('r18_score').textContent = data.any ? (data.d18*100).toFixed(1) + '%' : '';
  document.getElementById('r18_text').textContent = data.e18 || '';

  document.getElementById('r19_msg').textContent = data.r19_msg || '';

  const yes = (yn.toLowerCase() === 'y');
  document.getElementById('r20_mid').textContent = yes ? data.d20.toFixed(1) : '0.0';
  document.getElementById('r20_script').textContent = data.scripture.text || '';

  // Points short of the glory of God = 80 - sum
  if (data.any) {
    const pointsShort = Math.max(0, (80.0 - data.sum));
    document.getElementById('r20_short').textContent = pointsShort.toFixed(1);
  } else {
    document.getElementById('r20_short').textContent = '';
  }

  document.getElementById('r21_mid').textContent = yes ? (data.d16 + data.d20).toFixed(1) : (data.any ? '0.0' : '');
  document.getElementById('r21_script').textContent = data.r21_ref || '';

  document.getElementById('r22_left').textContent = data.row22.left || '';
  document.getElementById('r22_right').textContent = data.row22.right || '';
}
function init() {
  for (let i = 0; i < 8; i++) {
    document.getElementById('d'+(8+i)).addEventListener('input', recalc);
  }
  document.getElementById('d19').addEventListener('input', recalc);
  recalc();
}
window.addEventListener('DOMContentLoaded', init);
