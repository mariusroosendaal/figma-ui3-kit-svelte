// Shared by NumericInput and NumericInputMulti.

// Arithmetic without eval: numbers, + - * /, parentheses and unary minus.
// Anything else is not a number.
export function evaluate(source) {
  const src = String(source ?? '')
    .replace(/,/g, '.')
    .replace(/\s+/g, '');
  if (!src) return null;
  let at = 0;
  const peek = () => src[at];
  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '-') v = src[at++] === '+' ? v + term() : v - term();
    return v;
  }
  function term() {
    let v = factor();
    while (peek() === '*' || peek() === '/') v = src[at++] === '*' ? v * factor() : v / factor();
    return v;
  }
  function factor() {
    if (peek() === '-') {
      at++;
      return -factor();
    }
    if (peek() === '+') {
      at++;
      return factor();
    }
    if (peek() === '(') {
      at++;
      const v = expr();
      if (src[at++] !== ')') throw new Error('unclosed');
      return v;
    }
    const match = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(at));
    if (!match) throw new Error('not a number');
    at += match[0].length;
    return parseFloat(match[0]);
  }
  try {
    const v = expr();
    return at === src.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
