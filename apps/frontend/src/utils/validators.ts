// Simple BR masks & validators
export function onlyDigits(s: string) { return (s || '').replace(/\D+/g, ''); }

export function formatCNPJ(v: string) {
  const d = onlyDigits(v).slice(0,14);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function validateCNPJ(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 14 || /^([0-9])\1+$/.test(c)) return false;
  // Mod 11
  const calc = (slice: number) => {
    let sum = 0, pos = slice - 7;
    for (let i = slice; i >= 1; i--) {
      sum += Number(c[slice - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const res = sum % 11;
    return res < 2 ? 0 : 11 - res;
  }
  const d1 = calc(12);
  const d2 = calc(13);
  return d1 === Number(c[12]) && d2 === Number(c[13]);
}

export function formatCPF(v: string) {
  const d = onlyDigits(v).slice(0,11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2');
}

export function validateCPF(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 11 || /^([0-9])\1+$/.test(c)) return false;
  const calc = (base: number) => {
    let sum = 0;
    for (let i = 0; i < base; i++) sum += Number(c[i]) * (base + 1 - i);
    let res = (sum * 10) % 11;
    return res === 10 ? 0 : res;
  }
  const d1 = calc(9);
  const d2 = calc(10);
  return d1 === Number(c[9]) && d2 === Number(c[10]);
}

export function formatCEP(v: string) {
  const d = onlyDigits(v).slice(0,8);
  return d.replace(/(\d{5})(\d)/, '$1-$2');
}
export function validateCEP(v: string) {
  return /^\d{5}-?\d{3}$/.test(v.trim());
}

export function formatPhoneBR(v: string) {
  const d = onlyDigits(v).slice(0,11);
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return d
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}
export function validatePhoneBR(v: string) {
  const d = onlyDigits(v);
  return d.length === 10 || d.length === 11;
}

export function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function formatUF(v: string) {
  return (v || '').toUpperCase().slice(0,2);
}
export function validateUF(v: string) {
  return /^[A-Z]{2}$/.test((v || '').toUpperCase());
}