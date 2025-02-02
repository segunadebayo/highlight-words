import type { HighlightWords } from '.'; // eslint-disable-line import/no-cycle

// We need escape certain characters before creating the RegExp
// https://github.com/sindresorhus/escape-string-regexp
const escapeRegexp = (term: string): string =>
  term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`);

const regexpQuery = ({
  terms,
  matchExactly = false
}: Readonly<HighlightWords.Query>): string => {
  if (typeof terms !== 'string') {
    throw new TypeError('Expected a string');
  }

  const escapedTerms = escapeRegexp(terms.trim());
  return `(${matchExactly ? escapedTerms : escapedTerms.split(' ').join('|')})`;
};

const buildRegexp = ({
  terms,
  matchExactly = false
}: Readonly<HighlightWords.Query>): RegExp => {
  try {
    const fromString = /^([/~@;%#'])(.*?)\1([gimsuy]*)$/.exec(terms);
    if (fromString) {
      return new RegExp(fromString[2], fromString[3]);
    }

    return new RegExp(regexpQuery({ terms, matchExactly }), 'ig');
  } catch {
    throw new TypeError('Expected terms to be either a string or a RegExp!');
  }
};

export { regexpQuery };

export default buildRegexp;
