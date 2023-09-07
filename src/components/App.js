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

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM
} from '../store/interactions'

function App() {

  const [token1Balance, setToken1Balance] = useState(0)
  const [token2Balance, setToken2Balance] = useState(0)
  const [amm, setAMM] = useState(0)

  const token1 = useSelector(state => state.amm.token1)
  const token2 = useSelector(state => state.amm.token2)

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

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

        <h5 className='my-4 text-left text-warning'>Total DAPP in Liquidity: <strong>{parseFloat(token1).toFixed(2)}</strong> tokens</h5>
        <h5 className='my-4 text-left text-warning'>Total USD in Liquidity: <strong>{parseFloat(token2).toFixed(2)}</strong> tokens</h5>

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Swap />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

      </HashRouter>
    </Container>
  )
}

export default App;
