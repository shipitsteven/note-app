import React from 'react'
import './App.css'
import { StateContainer } from './components/StateContainer'

function App(): React.ReactElement<any> {
    return (
        <div className="App">
            <StateContainer />
        </div>
    )
}

export default App
