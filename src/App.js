import './App.css';
import Formatter from './Formatter';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {
  return (
    <Container>
        <Row className="justify-content-center">
          <Col>
            <h1>Human Readable Numbers</h1>
          </Col>
        </Row>
        <Row>
          <br/>
        </Row>
        <Row>
          <Formatter/>
        </Row>
    </Container>

  );
}

export default App;
