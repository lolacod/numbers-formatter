import './App.css';
import Formatter from './Formatter';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar'


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
        <Navbar bg="light">
          <Navbar.Text>
            © {new Date().getFullYear()} Genial Studio
          </Navbar.Text>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <a href="https://github.com/lolacod/numbers-formatter">
              <img
                src="GitHub-Mark-32px.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="GitHub"
              />
            </a>
          </Navbar.Collapse>          
        </Navbar>        
    </Container>
  );
}

export default App;
