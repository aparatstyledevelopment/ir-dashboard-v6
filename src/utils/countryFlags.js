export const COUNTRY_FLAGS = {
  SE: '🇸🇪',
  NO: '🇳🇴',
  US: '🇺🇸',
  GB: '🇬🇧',
  SA: '🇸🇦',
  DK: '🇩🇰',
  DE: '🇩🇪',
  FI: '🇫🇮',
  FR: '🇫🇷',
  CH: '🇨🇭',
  JP: '🇯🇵',
  NL: '🇳🇱',
  IE: '🇮🇪',
  LU: '🇱🇺',
};

export function flagFor(code) {
  return COUNTRY_FLAGS[code] || '';
}
