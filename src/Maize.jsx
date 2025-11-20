import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './App.css'
import MaizeExport from './MaizeExport.jsx'
import MaizeImport from './MaizeImport.jsx'

function Maize() {
  const [activeTab, setActiveTab] = useState('export');
    // const daysInBetween = [45, 140, 201, 262];
    // const months = ["Dec", "Mar", "May", "Jul"];



    return (
    <section>
        <div className={'container'}>
            <div>
                <h1>Maize Parities</h1>
                <p> Import & Export Tool</p>

                <div className={'tabContainer'}>
                    <button onClick={() => setActiveTab('export')} className={`${activeTab === 'export' ? 'tabActive' : 'tabInactive'}`}>Export Parity</button>
                    <button onClick={() => setActiveTab('import')} className={`${activeTab === 'import' ? 'tabActive' : 'tabInactive'}`}>Import Parity</button>
                </div>

                {activeTab === 'export' ? (
                    <MaizeExport />
                ) : (
                    <MaizeImport />
                )}
            </div>
        </div>


    </section>
  )
}

export default Maize
