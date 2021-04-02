import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';


class Formatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputText:"", formattedText: "", formatting: "humanReadable" };
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleFormattingChange = this.handleFormattingChange.bind(this);
  }

  handleInputTextChange(event) {
    this.setState(state => {
      let formatting = this.getNumberFormatter(this.state.formatting);
      var formattedText = formatText(event.target.value, formatting);
      return {inputText:event.target.value, formattedText: formattedText, formatting: state.formatting };
    });
  }

  handleFormattingChange(event) {
    this.setState(state => {
      let formatting = this.getNumberFormatter(event.target.value);
      var formattedText = formatText(state.inputText, formatting);   
      return {formattedText: formattedText, formatting:event.target.value}})
  }

  getNumberFormatter(formattingType) {
    const formattingDictionary = {
      "humanReadable": formatNumberAsHumanReadable,
      "wCommas": formatNumberWithCommas
    }

    return formattingDictionary[formattingType];
  }
  
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <label>Your text goes here:</label>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <textarea rows="15" cols="60" onChange={this.handleInputTextChange} />
            </div>
          </Col>
          <Col>
            <ToggleButtonGroup name="formatter" type="radio" vertical="true" size="sm" value={this.state.formatting}>
            <ToggleButton type="radio" name="formatter" value="humanReadable" variant="outline-success" onChange={this.handleFormattingChange}>
              Human Readable
            </ToggleButton>
            <br/>
            <ToggleButton type="radio" name="formatter" value="wCommas" variant="outline-success" onChange={this.handleFormattingChange}>
              With Commas
            </ToggleButton>
          </ToggleButtonGroup> 
          </Col>
        </Row>
        <br/>
        <label>Same text with formatted numbers:</label>
        <div>
          <textarea rows="15" cols="60" value={this.state.formattedText} readOnly />
        </div>
      </Container>
    )
  }
}

function isDigit(char) {
  // Check if digit
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return digits.includes(char);
}

function isWordSeparating(char) {
  const separators = [' ', '\n']
  return separators.includes(char);
}


function formatText(input, numberFormatter) {
  let states = ['newWord', 'number', 'other'];
  let decimalSeparator = '.';

  var state = 'newWord';
  var startIndex = -1;
  var decimalSeparatorFound = false;
  for(var i = 0; i < input.length; i++) {
    let currentChar = input[i];
    if (state === 'newWord' && isDigit(currentChar)) {
      state = 'number';
      startIndex = i;
    } else if (state === 'number' && currentChar === decimalSeparator) {
      if (decimalSeparatorFound) {
        // Means that current string is not a number
        state = 'other'
      } else {
        decimalSeparatorFound = true;
      }
    } else if (isWordSeparating(currentChar) ) {
      if (state === 'number') {
        let foundNumber = input.slice(startIndex, i);
        let formatteNumber = numberFormatter(foundNumber);
        input = input.slice(0, startIndex) + formatteNumber + input.slice(i);
        i = i + (formatteNumber.length - foundNumber.length);
      }
      state = 'newWord';
    } else if(!isWordSeparating(currentChar) && !isDigit(currentChar)) {
      state = 'other';
    }
  }

  if (state === 'number') {
    let foundNumber = input.slice(startIndex, i);
    let formatteNumber = numberFormatter(foundNumber);
    input = input.slice(0, startIndex) + formatteNumber + input.slice(i);
    i = i + (formatteNumber.length - foundNumber.length);
  }

  return input
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