import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import * as numberFormatting from './formatting/numberFormatter';

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
        formattedText = numberFormatting.formatDelimitedTable(event.target.value, formatting, columns, this.state.delimiter);
      } else { 
        formattedText = numberFormatting.formatText(event.target.value, formatting);
      }
      
      
      return {inputText:event.target.value, formattedText: formattedText, formatting: state.formatting };
    });
  }

  handleFormattingChange(event) {
    this.setState(state => {
      let formatting = this.getNumberFormatter(event.target.value);
      var formattedText = numberFormatting.formatText(state.inputText, formatting);
      return { formattedText: formattedText, formatting:event.target.value }});
  }

  handleDelimiterChange(event) {
    if (event.target === undefined || this.state.tableMode === false) {
      return this.state;
    }
    
    if (event.target.value && event.target.value !== '\\' && event.target.value !== '\\t' && event.target.value.length > 1) {
      this.setState(state => {
        return {...state, "errors":{...state.errors, "delimiter":"Delimiter must be only 1 character"}}
      });
    } else {
      this.setState(state => {
        let delimiter = event.target.value;
        if (delimiter === '\\t') {
          delimiter = '\t';
        }
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
      "humanReadable": numberFormatting.formatNumberAsHumanReadable,
      "wCommas": numberFormatting.formatNumberWithCommas
    }

    return formattingDictionary[formattingType];
  }

  getFormattedText(text, formatting, tableMode, columnsString, delimiter) {
    let formatter = this.getNumberFormatter(formatting);
    var formattedText = "";
    if (tableMode) {
      let columns = columnsString.split(',').map(x => parseInt(x));
      formattedText = numberFormatting.formatDelimitedTable(text, formatter, columns, delimiter);
    } else {
      formattedText = numberFormatting.formatText(text, formatter);
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
              <div>
                <br/>
              </div>
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
                    placeholder="1 Char or \t for tab" 
                    onChange={this.handleDelimiterChange}
                    value={this.state.delimiter}
                    disabled={!this.state.tableMode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.delimiter}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Row} >
                <Form.Label column sm={3}>
                  Columns
                </Form.Label>
                <Col sm={8}>
                  <Form.Control type="" placeholder="0,1,..." 
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

export default Formatter;