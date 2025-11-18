import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import './App.css'
import ImportCalc from "./SoybeansImport.jsx";
import SoybeansExport from "./SoybeansExport.jsx"

function Soybeans() {

    const [activeTab, setActiveTab] = useState('import');



    return (
        <div className={'container'}>

            <h1>Soybean Parities</h1>
            <p> Import & Export Tool</p>

            <div className={'tabContainer'}>
                <button onClick={() => setActiveTab('export')} className={`${activeTab === 'export' ? 'tabActive' : 'tabInactive'}`}>Export Parity</button>
                <button onClick={() => setActiveTab('import')} className={`${activeTab === 'import' ? 'tabActive' : 'tabInactive'}`}>Import Parity</button>
            </div>
            {activeTab === 'import' ? (
                <ImportCalc />
            ) : (
                <SoybeansExport />
            )}
        </div>
    );
}
export default Soybeans