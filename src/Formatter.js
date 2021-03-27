import React from 'react'

class Formatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formattedText: "" };
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
  }

  handleInputTextChange(event) {
    var formatted = formatText(event.target.value);
    this.setState({ formattedText: formatted });
  }

  render() {
    return (
      <div>
        <label>Input Text</label>
        <div>
          <textarea rows="20" cols="50" onChange={this.handleInputTextChange} />
        </div>
        <label>Formatted Text</label>
        <div>
          <textarea rows="20" cols="50" value={this.state.formattedText} />
        </div>
      </div>
    )
  }
}

function isDigit(char) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return digits.includes(char);
}

function formatText(input) {
  // 1 - Not a number
  // 2 - number
  // 3 - number with decimal point, no need to format after decimal point.
  // 4 - number with dash (-) in it, so the whole number should not be formatted.
  var state = 1;
  var startIndex = -1;
  for (var i = 0; i < input.length; i++) {
    if (isDigit(input[i]) && state === 1) {
      startIndex = i;
      state = 2;
    }
    else if ('.' === input[i] && state === 2 && (i + 1 < input.length) && isDigit(input[i + 1])) {
      state = 3;
    } else if ('-' === input[i] && state === 2 && (i + 1 < input.length) && isDigit(input[i + 1])) {
      state = 4;
    } else if (!isDigit(input[i])) {
      if (state === 2 || state === 3) {
        var foundNumber = input.slice(startIndex, i);
        foundNumber = formatNumber(foundNumber);
        input = input.slice(0, startIndex) + foundNumber + input.slice(i);
      }
      state = 1;
      startIndex = -1;
    }
  }

  if (state === 2 || state === 3) {
    foundNumber = input.slice(startIndex, i);
    foundNumber = formatNumber(foundNumber);
    input = input.slice(0, startIndex) + foundNumber + input.slice(i);
  }

  return input;
}

function formatNumber(numberString) {
  return formatNumberAsHumanReadable(numberString);
}

function formatNumberWithCommas(numberString) {
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

function formatWithLocale(numberString){
  const locale = "en-US";
  const number = Number.parseFloat(numberString,20);
  return number.toLocaleString(locale);
}

function formatNumberAsHumanReadable(numberString) {
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
  if (number === NaN) {
    return null;
  }
  if (number == 0) {
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









export default Formatter;