import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Charts from './Charts';

// UI Features
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Card Display Features
import Button from 'react-bootstrap/Button' 
import Card from 'react-bootstrap/Card' 
import Collapse from 'react-bootstrap/Collapse'
import ListGroup from 'react-bootstrap/ListGroup'

// Token Icons
import T1Icon from '../T1-Icon.png';
import T2Icon from '../T2-Icon.jpg';
import T3Icon from '../T3-Icon.jpg';
import TokenPair from '../TokenPair.jpg';
import TokenPair2 from '../TokenPair2.png';
import TokenPair3 from '../TokenPair3.png';
import backgroundimage from '../AppleBackground.png';

import wethIcon from '../WETH.png';
import daiIcon from '../DAI.png';

// ABIs: Import your contract ABIs here
import AMM_ABI from '../abis/AMM.json'
import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
import config from '../config.json';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM,
} from '../store/interactions'

function App() {

  // Set Token Addresses
    const [usd, setUSD] = useState(null)
    const [dapp, setDapp] = useState(null)
    const [apple, setApple] = useState(null)
    
  // Set Address for DAPP / USD Pool
    const [amm, setAMM] = useState(null)

  // Set Address for APPL / USD Pool
    const [appleAppleUSD, setAppleAppleUSD] = useState(null)
    
  // Set Address for DAPP / APPL Pool
    const [appleDappApple, setAppleDappApple] = useState(null)

  // Set User Account
    const [account, setAccount] = useState(null)

  // Load Account APPL Balance Individually
    const [dappAccountBalance, setDappAccountBalance] = useState(0)
    const [usdAccountBalance, setUSDAccountBalance] = useState(0)
    const [appleAccountBalance, setAppleAccountBalance] = useState(0)

  // Set Balances for DAPP / USD
    const [balance1, setBalance1] = useState(0)
    const [balance2, setBalance2] = useState(0)
  
  // Set Balances for APPL / USD
    const [appleBalance, setAppleBalance] = useState(0)
    const [usdBalance, setUSDBalance] = useState(0)
  
  // Set Balances for DAPP / APPL
    const [dappBalance, setDappBalance] = useState(0)
    const [appleBalance2, setAppleBalance2] = useState(0)

  // Set rate values for each trading pair
    const [rate1, setRate1] = useState(null)
    const [rate2, setRate2] = useState(null)
    const [rate3, setRate3] = useState(null) 

  // Variables for Card Functionality
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

  // Call active token balances dynamically
    const token1 = useSelector(state => state.amm.token1)
    const token2 = useSelector(state => state.amm.token2)

  // Set Chain ID for Network
    const chainId = useSelector(state => state.provider.chainId)

    const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    // Initiate provider
      const provider = await loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
      const chainId = await loadNetwork(provider, dispatch)
    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)

    // Reload page when network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })

    // Fetch current account from Metamask when changed
      window.ethereum.on('accountsChanged', async () => {
        await loadAccount(dispatch)
      })

    // Initiate contracts
      await loadTokens(provider, chainId, dispatch)
      await loadAMM(provider, chainId, dispatch)

    // Load tokens
      let usd = new ethers.Contract(config[1].usd.address, TOKEN_ABI, provider)
      setUSD(usd)
      
      let dapp = new ethers.Contract(config[1].dapp.address, TOKEN_ABI, provider)
      setDapp(dapp)
      
      let apple = new ethers.Contract(config[1].apple.address, TOKEN_ABI, provider)
      setApple(apple)

    // Load APPL Balance Individually
      let dappAccountBalance = await dapp.balanceOf(accounts[0])
      dappAccountBalance = ethers.utils.formatUnits(dappAccountBalance, 18)
      setDappAccountBalance(dappAccountBalance)
      
      let usdAccountBalance = await usd.balanceOf(accounts[0])
      usdAccountBalance = ethers.utils.formatUnits(usdAccountBalance, 18)
      setUSDAccountBalance(usdAccountBalance)
      
      let appleAccountBalance = await apple.balanceOf(accounts[0])
      appleAccountBalance = ethers.utils.formatUnits(appleAccountBalance, 18)
      setAppleAccountBalance(appleAccountBalance)
    
    // Load Dapp DAPP / USD Pool Address
      const amm = new ethers.Contract(config[1].amm.address, AMM_ABI, provider)
      setAMM(amm)
    
    // Load Dapp APPL / USD Pool Address
      const appleAppleUSD = new ethers.Contract(config[1].appleAppleUSD.address, AMM_ABI, provider)
      setAppleAppleUSD(appleAppleUSD)
    
    // Load Dapp DAPP / APPL Pool Address
      const appleDappApple = new ethers.Contract(config[1].appleDappApple.address, AMM_ABI, provider)
      setAppleDappApple(appleDappApple)
          
    // Load Balances for DAPP / USD
      let balance1 = await dapp.balanceOf(amm.address)
      balance1 = ethers.utils.formatUnits(balance1, 18)
      setBalance1(balance1)
      
      let balance2 = await usd.balanceOf(amm.address)
      balance2 = ethers.utils.formatUnits(balance2, 18)
      setBalance2(balance2)
    
    // Load Balances for APPL / USD
      let appleBalance = await apple.balanceOf(appleAppleUSD.address)
      appleBalance = ethers.utils.formatUnits(appleBalance, 18)
      setAppleBalance(appleBalance)
    
      let usdBalance = await usd.balanceOf(appleAppleUSD.address)
      usdBalance = ethers.utils.formatUnits(usdBalance, 18)
      setUSDBalance(usdBalance)
    
    // Load Balances for DAPP / APPL
      let dappBalance = await dapp.balanceOf(appleDappApple.address)
      dappBalance = ethers.utils.formatUnits(dappBalance, 18)
      setDappBalance(dappBalance)
    
      let appleBalance2 = await apple.balanceOf(appleDappApple.address)
      appleBalance2 = ethers.utils.formatUnits(appleBalance2, 18)
      setAppleBalance2(appleBalance2)
    
      setRate1((balance2 / balance1))
      setRate2((usdBalance / appleBalance))
      setRate3((appleBalance2 / dappBalance))
  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return(

<div  style={{
      backgroundImage: `url(${backgroundimage})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh'
      }}>
    <Container>
      <HashRouter>
         <style>{'body { background-color: red; }'}</style>
        <Navigation  />
        <>
  <Row>
    <Col>
      <Button
        onClick={() => setOpen1(!open1)}
        aria-controls="example-collapse-text"
        aria-expanded={open1}
        className='my-4'
      >
        (1) DAPP / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open1} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'red' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="dapptoken"
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(balance1).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="USDtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(balance2).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/usd-pair"
                src={TokenPair}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(rate1).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
          </div>
        </Collapse>
      </div>
    </Col>
    <Col>
      <Button
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        className='my-4'
      >
        (2) APPL / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open2} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'red' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appltoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="usdtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(usdBalance).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appl/usd-pair"
                src={TokenPair2}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(rate2).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
          </div>
        </Collapse>
      </div>
    </Col>
    <Col>
      <Button
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
        className='my-4'
      >
        (3) DAPP / APPL 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open3} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'red' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapptoken"
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appletoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance2).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/apple-pair"
                src={TokenPair3}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(rate3).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
          </div>
        </Collapse>
      </div>
    </Col>
    </Row>
    </>
        <Tabs />
        <Routes>
        <Route exact path="/" element={<Swap 
                                          dappAccountBalance={dappAccountBalance}
                                          usdAccountBalance={usdAccountBalance}
                                          appleAccountBalance={appleAccountBalance}
                                          rate1={rate1}
                                          rate2={rate2}
                                          rate3={rate3}
                                          />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </HashRouter>
    </Container>

   </div>
  )
}

export default App;
