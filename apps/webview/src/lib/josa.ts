/** 받침에 맞춘 조사 (을/를, 은/는, 이/가, 와/과, 로/으로) */
export function josa(word: string, pair: '을/를' | '은/는' | '이/가' | '와/과' | '으로/로') {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return word + pair.split('/')[1];
  const jong = code % 28;
  const [withFinal, without] = pair.split('/') as [string, string];
  // '으로/로'는 ㄹ 받침도 '로'
  if (pair === '으로/로') return word + (jong === 0 || jong === 8 ? without : withFinal);
  return word + (jong ? withFinal : without);
}
