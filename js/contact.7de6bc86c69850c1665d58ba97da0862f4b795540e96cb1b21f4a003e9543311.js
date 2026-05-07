/* ── Email obfuscation: decode custom cipher ── */
function _dec(s) {
  const alphabet = "mK9vXzL2eRpYqN7tJsA4WcBdFgHiOkMuVwx0P3Q6nZ8UbjfClEhGDarSTyo1I5";
  const hexAlpha = "0123456789abcdef";
  const xorKey = 0x42;

  // Reverse encoding steps:
  // Step 4 reverse: alphabet → hex
  let hexed = [...s].map(c => {
    let idx = alphabet.indexOf(c);
    return hexAlpha[idx];
  }).join('');

  // Step 3 reverse: hex → chars
  let xored = hexed.match(/.{2}/g).map(hex => String.fromCharCode(parseInt(hex, 16))).join('');

  // Step 2 reverse: XOR again
  let reversed = [...xored].map(c => String.fromCharCode(c.charCodeAt(0) ^ xorKey)).join('');

  // Step 1 reverse: reverse string
  return reversed.split('').reverse().join('');
}

/* ── Reveal email on button click ── */
function revealEmail(btn) {
  const email = _dec(btn.dataset.e);

  const link = document.createElement('a');
  link.href = 'mailto:' + email;
  link.className = 'email-link';
  link.textContent = email;

  btn.replaceWith(link);
}

/* ── FAQ accordion toggle ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}
