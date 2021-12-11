import * as numberFormatter from './numberFormatter';

test('Test simple no formatting', () => {
  expect(numberFormatter.formatText("a", numberFormatter.formatNumberWithCommas)).toBe("a");
});

test('Format 1000 -> 1,000', () => {
  expect(numberFormatter.formatText("1000", numberFormatter.formatNumberWithCommas)).toBe("1,000");
});

test('Format 1000 -> 1K', () => {
  expect(numberFormatter.formatText("1000", numberFormatter.formatNumberAsHumanReadable)).toBe("1K");
});

test('Format 10000 -> 10K', () => {
  expect(numberFormatter.formatText("10000", numberFormatter.formatNumberAsHumanReadable)).toBe("10K");
});

test('Format 100000 -> 100K', () => {
  expect(numberFormatter.formatText("100000", numberFormatter.formatNumberAsHumanReadable)).toBe("100K");
});

test('Format 1000000 -> 1M', () => {
  expect(numberFormatter.formatText("1000000", numberFormatter.formatNumberAsHumanReadable)).toBe("1M");
});

test('Format 10000000 -> 10M', () => {
  expect(numberFormatter.formatText("10000000", numberFormatter.formatNumberAsHumanReadable)).toBe("10M");
});

test('Format 100000000 -> 100M', () => {
  expect(numberFormatter.formatText("100000000", numberFormatter.formatNumberAsHumanReadable)).toBe("100M");
});

test('Format 1000000000 -> 1G', () => {
  expect(numberFormatter.formatText("1000000000", numberFormatter.formatNumberAsHumanReadable)).toBe("1G");
});

test('Format 1000 -> 1K', () => {
  expect(numberFormatter.formatText("-1000", numberFormatter.formatNumberAsHumanReadable)).toBe("-1K");
});

test('Format "s 1000 sdk 2344"-> "s 1K sdk 2.34K"', () => {
  expect(numberFormatter.formatText("s 1000 sdk 2344", numberFormatter.formatNumberAsHumanReadable)).toBe("s 1K sdk 2.34K");
});

test('Format "s 1000 sdk 2345"-> "s 1K sdk 2.35K"', () => {
  expect(numberFormatter.formatText("s 1000 sdk 2345", numberFormatter.formatNumberAsHumanReadable)).toBe("s 1K sdk 2.35K");
});

test('Format table test', () => {
  expect(numberFormatter.formatDelimitedTable(`
col1,col2,col3
1293891283,1212391023,12389123
  `, numberFormatter.formatNumberAsHumanReadable,[0,2],',')).toBe(`
col1,col2,col3
1.29G,1212391023,12.39M
  `);
});