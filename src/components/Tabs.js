import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4'>
      <LinkContainer to="/">
        <Nav.Link className='text-warning'>Swap</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/deposit">
        <Nav.Link className='text-warning'>Deposit</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/withdraw">
        <Nav.Link className='text-warning'>Withdraw</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/charts">
        <Nav.Link className='text-warning'>Charts</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}

export default Tabs;
