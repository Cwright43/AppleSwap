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

    <Container >
      <HashRouter>
         <style>{'body { background-color: red; }'}</style>
        <Navigation  />
        <hr />
        
        <h5 className='my-4 text-left text-warning'>Total DAPP in DAPP / USD Pool: <strong>{parseFloat(balance1).toFixed(2)}</strong> tokens</h5>
        <h5 className='my-4 text-left text-warning'>Total USD in DAPP / USD Pool: <strong>{parseFloat(balance2).toFixed(2)}</strong> tokens</h5>
            <hr className="hr hr-blurry" />
        <h5 className='my-4 text-left text-warning'>Total APPL in APPL / USD Pool: <strong>{parseFloat(appleBalance).toFixed(2)}</strong> tokens</h5>
        <h5 className='my-4 text-left text-warning'>Total USD in APPL / USD Pool: <strong>{parseFloat(usdBalance).toFixed(2)}</strong> tokens</h5>
            <hr className="hr hr-blurry" />
        <h5 className='my-4 text-left text-warning'>Total DAPP in DAPP / APPL Pool: <strong>{parseFloat(dappBalance).toFixed(2)}</strong> tokens</h5>
        <h5 className='my-4 text-left text-warning'>Total APPL in DAPP / APPL Pool: <strong>{parseFloat(appleBalance2).toFixed(2)}</strong> tokens</h5>
            <hr className="hr hr-blurry" />
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
  )
}

export default App;
