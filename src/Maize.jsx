import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './App.css'

function Maize() {
  const [activeTab, setActiveTab] = useState('export');

    // Export parameters
    const [exportParams, setExportParams] = useState({
        spotRate: 17.55,
        forwardMultiplier: 0.0024,
        CBOT: 3.94,
        US_PREMIE_PNW: 1.30,
        US_PREMIE_GULF: 0.98,
        BRAZ_PREMIE: 1.15,
        ARG_PREMIE: 1.03,
        bushelsPerTon: 39.3683,
        SAFEX: 3985,
        BASIS: 180,
        PORT: 50,
        SA_FREIGHT: 30,
        PNW_FREIGHT: 25,
        GULF_FREIGHT: 30,
        BRAZ_JAP_FREIGHT: 28,
        BRAZ_SK_FREIGHT: 26,
        ARG_FREIGHT: 27
    });

    // Import parameters
    const [importParams, setImportParams] = useState({
        spotRate: 17.55,
        forwardMultiplier: 0.0032,
        CBOT: 3.94,
        ARG_BASIS: 1.25,
        bushelsPerTon: 39.3683,
        CT_FREIGHT: 25,
        PE_FREIGHT: 30,
        DBN_FREIGHT: 30,
        FOBBING: 220,
        TPT_CT: 250,
        TPT_PE: 150,
        TPT_DBN: 80,
        QUALITY: 150,
        SAFEX: 3985,
        BASIS_CT: 750,
        BASIS_PE: 500,
        BASIS_DBN: 150
    });

    const daysInBetween = [45, 140, 201, 262];
    const months = ["Dec", "Mar", "May", "Jul"];

    // Calculate export results
    const calculateExport = () => {
        const results = [];

        for (let i = 0; i < daysInBetween.length; i++) {
            const days = daysInBetween[i];
            const month = months[i];

            const forwardRate = (days * exportParams.forwardMultiplier) + exportParams.spotRate;
            const FOB_PNW = (exportParams.CBOT + exportParams.US_PREMIE_PNW) * exportParams.bushelsPerTon;
            const FOB_GULF = (exportParams.CBOT + exportParams.US_PREMIE_GULF) * exportParams.bushelsPerTon;
            const FOB_BRAZ = (exportParams.CBOT + exportParams.BRAZ_PREMIE) * exportParams.bushelsPerTon;
            const FOB_ARG = (exportParams.CBOT + exportParams.ARG_PREMIE) * exportParams.bushelsPerTon;
            const FOB = exportParams.SAFEX + exportParams.BASIS + exportParams.PORT;
            const FOB_DURBAN_USD = FOB / forwardRate;
            const SA_CIF = FOB_DURBAN_USD + exportParams.SA_FREIGHT;
            const PNW_CIF = FOB_PNW + exportParams.PNW_FREIGHT;
            const GULF_CIF = FOB_GULF + exportParams.GULF_FREIGHT;
            const BRAZ_JC_CIF = FOB_BRAZ + exportParams.BRAZ_JAP_FREIGHT;
            const BRAZ_SK_CIF = FOB_BRAZ + exportParams.BRAZ_SK_FREIGHT;
            const ARG_CIF = FOB_ARG + exportParams.ARG_FREIGHT;

            results.push({
                month,
                days,
                forwardRate: forwardRate.toFixed(4),
                diff_SA_PNW: (SA_CIF - PNW_CIF).toFixed(2),
                diff_SA_GULF: (SA_CIF - GULF_CIF).toFixed(2),
                diff_SA_BRAZ_JC: (SA_CIF - BRAZ_JC_CIF).toFixed(2),
                diff_SA_BRAZ_SK: (SA_CIF - BRAZ_SK_CIF).toFixed(2),
                diff_SA_ARG: (SA_CIF - ARG_CIF).toFixed(2)
            });
        }

        return results;
    };

    // Calculate import results
    const calculateImport = () => {
        const results = [];
        const days = [45];
        const months = ["Dec"];

        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const month = months[i];

            const forwardRate = (day * importParams.forwardMultiplier) + importParams.spotRate;
            const FOB = (importParams.CBOT + importParams.ARG_BASIS) * importParams.bushelsPerTon;
            const CIF_CT = FOB + importParams.CT_FREIGHT;
            const CIF_PE = FOB + importParams.PE_FREIGHT;
            const CIF_DBN = FOB + importParams.DBN_FREIGHT;
            const RT_CT = CIF_CT * forwardRate;
            const RT_PE = CIF_PE * forwardRate;
            const RT_DBN = CIF_DBN * forwardRate;
            const EX_HAWE_CT = RT_CT + importParams.FOBBING;
            const EX_HAWE_PE = RT_PE + importParams.FOBBING;
            const EX_HAWE_DBN = RT_DBN + importParams.FOBBING;
            const DEL_PLANT_CT = EX_HAWE_CT + importParams.TPT_CT + importParams.QUALITY;
            const DEL_PLANT_PE = EX_HAWE_PE + importParams.TPT_PE + importParams.QUALITY;
            const DEL_PLANT_DBN = EX_HAWE_DBN + importParams.TPT_DBN + importParams.QUALITY;
            const DAP_PRYS_CT = importParams.SAFEX + importParams.BASIS_CT;
            const DAP_PRYS_PE = importParams.SAFEX + importParams.BASIS_PE;
            const DAP_PRYS_DBN = importParams.SAFEX + importParams.BASIS_DBN;
            const VERSKIL_CT = DAP_PRYS_CT - DEL_PLANT_CT;
            const VERSKIL_PE = DAP_PRYS_PE - DEL_PLANT_PE;
            const VERSKIL_DBN = DAP_PRYS_DBN - DEL_PLANT_DBN;

            results.push({
                month,
                forwardRate: forwardRate.toFixed(4),
                KAAP: VERSKIL_CT.toFixed(2),
                PE: VERSKIL_PE.toFixed(2),
                DBN: VERSKIL_DBN.toFixed(2)
            });
        }

        return results;
    };


    const exportResults = calculateExport();
    const importResults = calculateImport();

    const handleExportChange = ((field, value) => {
        setExportParams(prev => ({...prev, [field]: parseFloat(value) || 0}));
    })

    const handleImportChange = ((field, value) => {
        setImportParams(prev => ({...prev, [field]: parseFloat(value) || 0}));
    })


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
                    <div>
                        {/* Export Chart */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Export Parity ($/mt)</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={exportResults}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="black" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="diff_SA_PNW" stroke="#3b82f6" strokeWidth={2} name="SA vs PNW" />
                                    <Line type="monotone" dataKey="diff_SA_GULF" stroke="#10b981" strokeWidth={2} name="SA vs GULF" />
                                    <Line type="monotone" dataKey="diff_SA_BRAZ_JC" stroke="#f59e0b" strokeWidth={2} name="SA vs BRAZ JC" />
                                    <Line type="monotone" dataKey="diff_SA_BRAZ_SK" stroke="#ef4444" strokeWidth={2} name="SA vs BRAZ SK" />
                                    <Line type="monotone" dataKey="diff_SA_ARG" stroke="#8b5cf6" strokeWidth={2} name="SA vs ARG" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Export Results Table */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Export Results</h2>
                            <div className={'tableContainer'}>
                                <table >
                                    <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th className={'thRight'}>Days</th>
                                        <th className={'thRight'}>Forward Rate</th>
                                        <th className={'thRight'}>SA vs PNW</th>
                                        <th className={'thRight'}>SA vs GULF</th>
                                        <th className={'thRight'}>SA vs BRAZ JC</th>
                                        <th className={'thRight'}>SA vs BRAZ SK</th>
                                        <th className={'thRight'}>SA vs ARG</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {exportResults.map((result, idx) => (
                                        <tr key={idx} >
                                            <td >{result.month}</td>
                                            <td className={'tdRight'}>{result.days}</td>
                                            <td className={'tdRight'}>{result.forwardRate}</td>
                                            <td className={'tdRight'}>{result.diff_SA_PNW}</td>
                                            <td className={'tdRight'}>{result.diff_SA_GULF}</td>
                                            <td className={'tdRight'}>{result.diff_SA_BRAZ_JC}</td>
                                            <td className={'tdRight'}>{result.diff_SA_BRAZ_SK}</td>
                                            <td className={'tdRight'}>{result.diff_SA_ARG}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Export Parameters */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Export Parameters</h2>
                            <div className={'grid'}>
                                {Object.entries(exportParams).map(([key, value]) => (
                                    <div key={key} className={'inputGroup'}>
                                        <label className={'label'}>{key}</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={value}
                                            onChange={(e) => handleExportChange(key, e.target.value)}
                                            className={'input'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div>

                        {/* Import Chart */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Import Parity Differences (R/mt)</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={importResults}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="KAAP" stroke="#3b82f6" strokeWidth={2} name="Cape Town" />
                                    <Line type="monotone" dataKey="PE" stroke="#10b981" strokeWidth={2} name="Port Elizabeth" />
                                    <Line type="monotone" dataKey="DBN" stroke="#f59e0b" strokeWidth={2} name="Durban" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Import Results Table */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Import Results</h2>
                            <div className={'tableContainer'}>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th className={'thRight'}>Forward Rate</th>
                                        <th className={'thRight'}>KAAP (CT)</th>
                                        <th className={'thRight'}>PE</th>
                                        <th className={'thRight'}>DBN</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {importResults.map((result, idx) => (
                                        <tr key={idx} >
                                            <td>{result.month}</td>
                                            <td className={'tdRight'}>{result.forwardRate}</td>
                                            <td className={'tdRight'}>{result.KAAP}</td>
                                            <td className={'tdRight'}>{result.PE}</td>
                                            <td className={'tdRight'}>{result.DBN}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Import Parameters */}
                        <div className={'card'}>
                            <h2 className={'cardTitle'}>Import Parameters</h2>
                            <div className={'grid'}>
                                {Object.entries(importParams).map(([key, value]) => (
                                    <div key={key} className={'inputGroup'}>
                                        <label className={'label'}>{key}</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={value}
                                            onChange={(e) => handleImportChange(key, e.target.value)}
                                            className={'input'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </div>


    </section>
  )
}

export default Maize
