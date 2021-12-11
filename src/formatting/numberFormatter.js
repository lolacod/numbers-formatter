let digits = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function isDigit(char) {
  return digits.has(char);
}

export function isWordSeparating(char) {
  const separators = [' ', '\n', ','];
  return separators.includes(char);
}

export function formatText(input, numberFormatter) {
  let decimalSeparator = '.';
  let negativeNumberChar = '-';
  // possible states: newWord, number, other, negativeNumber
  let stateNewWord = 0;
  let stateNumber = 1;
  let stateNegativeNumber = 2;
  let stateOther = 3;

  var state = stateNewWord;
  var startIndex = -1;
  var decimalSeparatorFound = false;
  for(var i = 0; i < input.length; i++) {
    let currentChar = input[i];
    
    if ((state === stateNewWord || state === stateNegativeNumber) && isDigit(currentChar)) {
      state = stateNumber;
      startIndex = i;
    } else if (state === stateNumber && currentChar === decimalSeparator) {
      if (decimalSeparatorFound) {
        // Means that current string is not a number
        state = stateOther
      } else {
        decimalSeparatorFound = true;
      }
    } else if (state === stateNewWord && currentChar === negativeNumberChar) {
      state = stateNegativeNumber
    } else if (isWordSeparating(currentChar) ) {
      if (state === stateNumber) {
        let foundNumber = input.slice(startIndex, i);
        let formattedNumber = numberFormatter(foundNumber);
        input = input.slice(0, startIndex) + formattedNumber + input.slice(i);
        i = i + (formattedNumber.length - foundNumber.length);
        decimalSeparatorFound = false;
      }
      state = stateNewWord;
    } else if(!isWordSeparating(currentChar) && !isDigit(currentChar)) {
      state = stateOther;
    }
  }

  if (state === stateNumber) {
    let foundNumber = input.slice(startIndex, i);
    let formattedNumber = numberFormatter(foundNumber);
    input = input.slice(0, startIndex) + formattedNumber + input.slice(i);
    i = i + (formattedNumber.length - foundNumber.length);
  }

  return input
}
/**
 * 
 * @param {String} input Text to identify number, and transform them to human readable format
 * @param {*} numberFormatter Formatter to use when transforming the numbers to human readable format.
 * @param {*} columnsToFormat Columns that should be transformed.
 * @param {*} delimiter The delimiter that is used to identify that each column.
 * @returns 
 */
export function formatDelimitedTable(input, numberFormatter, columnsToFormat, delimiter) {
  var currentColumn = 0;
  var columnStart = 0;
  var i=0;
  var processedResult = "";
  var intermediateResult = "";
  var formattedColumn = "";
  while(i < input.length) {
    let currentChar = input[i];
    if (columnsToFormat.includes(currentColumn) && currentChar !== delimiter) {
      formattedColumn = formatText(input.slice(columnStart, i+1), numberFormatter);
      intermediateResult = formattedColumn;
    } else {
      intermediateResult += currentChar;
    }
    
    if (currentChar === delimiter || currentChar === '\n') {
      if (currentChar === delimiter) {
        currentColumn++;
      } else {
        currentColumn = 0;
      }
      
      columnStart = i+1;
      processedResult += intermediateResult;
      intermediateResult = "";
      formattedColumn = "";
    }
    i++;
  }

  return processedResult + intermediateResult;
}

export function formatNumberWithCommas(numberString) {
  let decimalIndex = numberString.indexOf('.');
  var decimalValue = decimalIndex > -1 ? numberString.slice(decimalIndex) : '';
  numberString = decimalIndex > -1 ? numberString.slice(0, decimalIndex) : numberString;
  var commas = Math.floor(numberString.length / 3.0);
  commas = commas * 3 === numberString.length ? commas - 1 : commas;
  for (var i = 0; i < commas; i++) {
    let commaIndex = numberString.length - ((i + 1) * 3) - i;
    numberString = numberString.slice(0, commaIndex) + ',' + numberString.slice(commaIndex);
  }

  return numberString + decimalValue;  
}

export function formatNumberAsHumanReadable(numberString) {
  // known SI prefixes, multiple of 3
  // Taken from: https://github.com/cerberus-ab/human-readable-numbers/blob/master/src/index.js
  var PREFIXES = {
    '24': 'Y',
    '21': 'Z',
    '18': 'E',
    '15': 'P',
    '12': 'T',
    '9': 'G',
    '6': 'M',
    '3': 'K',
    '0': '',
  };

  let number = Number(numberString);
  if (isNaN(number)) {
    return null;
  }
  if (number === 0) {
    return 0;  
  }

  var exponent = Math.floor(Math.log10(number));
  exponent = Math.min(3 * Math.floor(exponent / 3), 24)
  
  const newNumber = number / Math.pow(10, exponent);
  if (Number.isInteger(newNumber)) {
    return newNumber + PREFIXES[exponent];  
  }
  else {
    return newNumber.toFixed(2) + PREFIXES[exponent];
  } 
}