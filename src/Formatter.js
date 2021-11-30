import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';



class Formatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputText:"", formattedText: "", formatting: "humanReadable", tableMode:false, delimiter:"", columns:"", errors:{} };
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleFormattingChange = this.handleFormattingChange.bind(this);
    this.handleDelimiterChange = this.handleDelimiterChange.bind(this);
    this.handleColumnsListChange = this.handleColumnsListChange.bind(this);
  }

  handleInputTextChange(event) {
    this.setState(state => {
      let formatting = this.getNumberFormatter(this.state.formatting);
      var formattedText = "";
      if (this.state.tableMode) {
        let columns = this.state.columns.split(',').map(x => parseInt(x));
        formattedText = formatDelimitedTable(event.target.value, formatting, columns, this.state.delimiter);
      } else {
        formattedText = formatText(event.target.value, formatting);
      }
      
      
      return {inputText:event.target.value, formattedText: formattedText, formatting: state.formatting };
    });
  }

  handleFormattingChange(event) {
    this.setState(state => {
      let formatting = this.getNumberFormatter(event.target.value);
      var formattedText = formatText(state.inputText, formatting);
      return { formattedText: formattedText, formatting:event.target.value }});
  }

  handleDelimiterChange(event) {
    if (event.target === undefined || this.state.tableMode === false) {
      return this.state;
    }

    if (event.target.value && event.target.value.length > 1) {
      this.setState(state => {
        return {...state, "errors":{...state.errors, "delimiter":"Delimiter must be only 1 character"}}
      });
    } else {
      this.setState(state => {
        let delimiter = event.target.value;
        let formattedText = this.getFormattedText(state.inputText, this.state.formatting, 
          state.tableMode, state.columns, delimiter);
        
        return {...state, formattedText:formattedText, "delimiter":delimiter}
      });
    }
  }

  handleColumnsListChange(event) {
    let validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
    let value = event.target.value;
    for (var i = 0; i < value.length; i++) {
      if (! validChars.includes(value.charAt(i))) {
        this.setState(state => {
          return {...state, "errors":{...this.state.errors, "columns":"Must include only digits or ','"}};
        });
      } else {
        let columns = event.target.value;
        this.setState( state => {
          let formattedText = this.getFormattedText(state.inputText, this.state.formatting, 
            state.tableMode, columns, state.delimiter);
          return {...state,formattedText:formattedText, "columns":columns, "errors":{...this.state.errors, "columns":""}};
          
        });
      }
    }
  }

  getNumberFormatter(formattingType) {
    const formattingDictionary = {
      "humanReadable": formatNumberAsHumanReadable,
      "wCommas": formatNumberWithCommas
    }

    return formattingDictionary[formattingType];
  }

  getFormattedText(text, formatting, tableMode, columnsString, delimiter) {
    let formatter = this.getNumberFormatter(formatting);
    var formattedText = "";
    if (tableMode) {
      let columns = columnsString.split(',').map(x => parseInt(x));
      formattedText = formatDelimitedTable(text, formatter, columns, delimiter);
    } else {
      formattedText = formatText(text, formatter);
    }

    return formattedText;
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
              <textarea rows="15" cols="60" onChange={this.handleInputTextChange} wrap="soft"/>
            </div>
          </Col>
          <Col>
            <Row>
              <ToggleButtonGroup name="formatter" type="radio" vertical="true" size="sm" value={this.state.formatting}>
              <ToggleButton type="radio" name="formatter" value="humanReadable" variant="outline-success" onChange={this.handleFormattingChange}>
                Human Readable
              </ToggleButton>
              <ToggleButton type="radio" name="formatter" value="wCommas" variant="outline-success" onChange={this.handleFormattingChange}>
                With Commas
              </ToggleButton>
            </ToggleButtonGroup> 
            </Row>
            <Row>
              <br/>
            </Row>
            <Row>
              <ToggleButton
                className="mb-2"
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
                checked={this.state.tableMode}
                value="1"
                onChange={e=> this.setState({ ...this.state, tableMode: e.currentTarget.checked})}
              >
               {' '} Table Mode
            </ToggleButton>
            </Row>
            <Row>
              <div>
                <br/>
              </div>
            </Row>
            <Row>
              <Form.Group as={Row} >
                <Form.Label column sm={3}>
                  Delimiter
                </Form.Label>
                <Col sm={8}>
                  <Form.Control 
                    type="delimiter" 
                    placeholder="1 Char" 
                    onChange={this.handleDelimiterChange}
                    value={this.state.delimiter}
                    disabled={!this.state.tableMode}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Row} >
                <Form.Label column sm={3}>
                  Columns
                </Form.Label>
                <Col sm={8}>
                  <Form.Control type="" placeholder="Columns to format" 
                    isInvalid={!!this.state.errors.columns}
                    onChange={this.handleColumnsListChange}
                    disabled={!this.state.tableMode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.columns}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </Row>            
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
  const separators = [' ', '\n', ','];
  return separators.includes(char);
}

function formatText(input, numberFormatter) {
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
        let formattedNumber = numberFormatter(foundNumber);
        input = input.slice(0, startIndex) + formattedNumber + input.slice(i);
        i = i + (formattedNumber.length - foundNumber.length);
        decimalSeparatorFound = false;
      }
      state = 'newWord';
    } else if(!isWordSeparating(currentChar) && !isDigit(currentChar)) {
      state = 'other';
    }
  }

  if (state === 'number') {
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
function formatDelimitedTable(input, numberFormatter, columnsToFormat, delimiter) {
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


export default Formatter;