// eslint-disable-next-line import/prefer-default-export
export const minimizeString = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

export const fromSun = (sun) => Number(sun) / 1000000;
