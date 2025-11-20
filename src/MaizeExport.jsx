import React, {useState} from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import './App.css';



function MaizeExport() {


    // Export parameters
    const [exportParams, setExportParams] = useState({
        spotRate: 17.55,
        forwardMultiplier: 0.0024,
    });

    const [monthlyParams, setMonthlyParams] = useState({
        DEC: {SAFEX: 2946, CBOT: 4.34, BASIS: 200, PORT: 220, US_PREMIE_PNW: 1.30, US_PREMIE_GULF: 0.98, BRAZ_PREMIE: 1.15,
            ARG_PREMIE: 1.03, SA_FREIGHT: 30, PNW_FREIGHT: 25, GULF_FREIGHT: 30, BRAZ_JAP_FREIGHT: 28, BRAZ_SK_FREIGHT: 26,
            ARG_FREIGHT: 27, DAYS: 30},
        MAR: {SAFEX: 3061, CBOT: 4.46, BASIS: 300, PORT: 220, US_PREMIE_PNW: 1.30, US_PREMIE_GULF: 0.98, BRAZ_PREMIE: 1.15,
            ARG_PREMIE: 1.03, SA_FREIGHT: 30, PNW_FREIGHT: 25, GULF_FREIGHT: 30, BRAZ_JAP_FREIGHT: 28, BRAZ_SK_FREIGHT: 26,
            ARG_FREIGHT: 27, DAYS: 60},
        MAY: {SAFEX: 3118, CBOT: 4.454, BASIS: 200, PORT: 220, US_PREMIE_PNW: 1.30, US_PREMIE_GULF: 0.98, BRAZ_PREMIE: 1.15,
            ARG_PREMIE: 1.03, SA_FREIGHT: 30, PNW_FREIGHT: 25, GULF_FREIGHT: 30, BRAZ_JAP_FREIGHT: 28, BRAZ_SK_FREIGHT: 26,
            ARG_FREIGHT: 27, DAYS: 90},

    })

    const bushelsPerTon = 39.3683;

    const calculateForMonth = (month) => {
        const { SAFEX, CBOT, BASIS, PORT, US_PREMIE_PNW, US_PREMIE_GULF, BRAZ_PREMIE,
            ARG_PREMIE, SA_FREIGHT, PNW_FREIGHT, GULF_FREIGHT, BRAZ_JAP_FREIGHT, BRAZ_SK_FREIGHT,
            ARG_FREIGHT, DAYS } = monthlyParams[month];

        const forwardRate = ( DAYS * exportParams.forwardMultiplier) + exportParams.spotRate;
        const FOB_PNW = (CBOT + US_PREMIE_PNW) * bushelsPerTon;
        const FOB_GULF = (CBOT + US_PREMIE_GULF) * bushelsPerTon;
        const FOB_BRAZ = (CBOT + BRAZ_PREMIE) * bushelsPerTon;
        const FOB_ARG = (CBOT + ARG_PREMIE) * bushelsPerTon;
        const FOB = SAFEX + BASIS + PORT;
        const FOB_DURBAN_USD = FOB / forwardRate;
        const SA_CIF = FOB_DURBAN_USD + SA_FREIGHT;
        const PNW_CIF = FOB_PNW + PNW_FREIGHT;
        const GULF_CIF = FOB_GULF + GULF_FREIGHT;
        const BRAZ_JC_CIF = FOB_BRAZ + BRAZ_JAP_FREIGHT;
        const BRAZ_SK_CIF = FOB_BRAZ + BRAZ_SK_FREIGHT;
        const ARG_CIF = FOB_ARG + ARG_FREIGHT;
        const diff_SA_PNW = SA_CIF - PNW_CIF;
        const diff_SA_GULF = SA_CIF - GULF_CIF;
        const diff_SA_BRAZ_JC = SA_CIF - BRAZ_JC_CIF;
        const diff_SA_BRAZ_SK = SA_CIF - BRAZ_SK_CIF;
        const diff_SA_ARG = SA_CIF - ARG_CIF;

        return {
            forwardRate,
            SAFEX,
            diff_SA_ARG,
            diff_SA_PNW,
            diff_SA_GULF,
            diff_SA_BRAZ_JC,
            diff_SA_BRAZ_SK

        }
    }

    // const calculateExport = () => {
    //     const results = [];
    //
    //     for (let i = 0; i < daysInBetween.length; i++) {
    //         const days = daysInBetween[i];
    //         const month = months[i];
    //
    //         const forwardRate = (days * exportParams.forwardMultiplier) + exportParams.spotRate;
    //         const FOB_PNW = (exportParams.CBOT + exportParams.US_PREMIE_PNW) * exportParams.bushelsPerTon;
    //         const FOB_GULF = (exportParams.CBOT + exportParams.US_PREMIE_GULF) * exportParams.bushelsPerTon;
    //         const FOB_BRAZ = (exportParams.CBOT + exportParams.BRAZ_PREMIE) * exportParams.bushelsPerTon;
    //         const FOB_ARG = (exportParams.CBOT + exportParams.ARG_PREMIE) * exportParams.bushelsPerTon;
    //         const FOB = exportParams.SAFEX + exportParams.BASIS + exportParams.PORT;
    //         const FOB_DURBAN_USD = FOB / forwardRate;
    //         const SA_CIF = FOB_DURBAN_USD + exportParams.SA_FREIGHT;
    //         const PNW_CIF = FOB_PNW + exportParams.PNW_FREIGHT;
    //         const GULF_CIF = FOB_GULF + exportParams.GULF_FREIGHT;
    //         const BRAZ_JC_CIF = FOB_BRAZ + exportParams.BRAZ_JAP_FREIGHT;
    //         const BRAZ_SK_CIF = FOB_BRAZ + exportParams.BRAZ_SK_FREIGHT;
    //         const ARG_CIF = FOB_ARG + exportParams.ARG_FREIGHT;
    //
    //         results.push({
    //             month,
    //             days,
    //             forwardRate: forwardRate.toFixed(4),
    //             diff_SA_PNW: (SA_CIF - PNW_CIF).toFixed(2),
    //             diff_SA_GULF: (SA_CIF - GULF_CIF).toFixed(2),
    //             diff_SA_BRAZ_JC: (SA_CIF - BRAZ_JC_CIF).toFixed(2),
    //             diff_SA_BRAZ_SK: (SA_CIF - BRAZ_SK_CIF).toFixed(2),
    //             diff_SA_ARG: (SA_CIF - ARG_CIF).toFixed(2)
    //         });
    //     }
    //
    //     return results;
    // };
    //
    // const exportResults = calculateExport();


    const handleExportChange = ((field, value) => {
        setExportParams(prev => ({
            ...prev,
            [field]: parseFloat(value)}));
    });

    const handleMonthlyChange = (month, param, value) => {
        setMonthlyParams(prev => ({
            ...prev,
            [month]: {
                ...prev[month],
                [param]: parseFloat(value)
            }
        }));
    };


return (

    <section>

        <div>
            <div>
                <div className={'results-container'}>
                    {/* Export Chart */}
                    <div className={'card'}>
                        <h2 className={'cardTitle'}>Export Parity Differences</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={['DEC', 'MAR', 'MAY'].map(month => {
                                const results = calculateForMonth(month);
                                return {
                                    month,
                                    'SA vs ARG': results.diff_SA_ARG,
                                    'SA vs PNW': results.diff_SA_PNW,
                                    'SA vs GULF' : results.diff_SA_GULF,
                                    'SA vs BRAZ/SK' : results.diff_SA_BRAZ_SK,
                                    'SA vs BRAZ/JAPAN/CHINA' : results.diff_SA_BRAZ_JC,
                                    'SAFEX (R/t)': results.SAFEX
                                };
                            })}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#475569" />
                                <YAxis stroke="#475569" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="SA vs ARG" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="SA vs PNW" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="SA vs GULF" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="SA vs BRAZ/SK" stroke="#f59e0b" strokeWidth={2} />
                                <Line type="monotone" dataKey="SA vs BRAZ/JAPAN/CHINA" stroke="#ef4444" strokeWidth={2} />
                                <Line type="monotone" dataKey="SAFEX (R/t)" stroke="#8b5cf6" strokeWidth={2} />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Export Results Table */}
                    <div className={'card'} style={{width:"50%"}}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>
                            Calculated Results by Month
                        </h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                                        Metric
                                    </th>
                                    {['DEC', 'MAR', 'MAY'].map(month => (
                                        <th key={month} style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #cbd5e1', fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>
                                            {month}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {/*'SA vs ARG': results.diff_SA_ARG,*/}
                                {/*'SA vs PNW': results.diff_SA_PNW,*/}
                                {/*'SA vs GULF' : results.diff_SA_GULF,*/}
                                {/*'SA vs BRAZ/SK' : results.diff_SA_BRAZ_SK,*/}
                                {/*'SA vs BRAZ/JAPAN/CHINA' : results.diff_SA_BRAZ_JC,*/}
                                {/*'SAFEX (R/t)': results.SAFEX*/}
                                {/*};*/}
                                {[
                                    { label: 'Forward Rate', key: 'forwardRate' },
                                    { label: 'SA vs ARG', key: 'diff_SA_ARG' },
                                    { label: 'SA vs PNW', key: 'diff_SA_PNW' },
                                    { label: 'SA vs GULF', key: 'diff_SA_GULF' },
                                    { label: 'SA vs BRAZ/SK', key: 'diff_SA_BRAZ_SK' },
                                    { label: 'SA vs BRAZ/JAPAN/CHINA', key: 'diff_SA_BRAZ_JC' }

                                ].map((row, i) => (
                                    <tr key={row.key} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155' }}>
                                            {row.label}
                                        </td>
                                        {['DEC', 'MAR', 'MAY'].map(month => {
                                            const results = calculateForMonth(month);
                                            const value = results[row.key];
                                            return (
                                                <td key={month} style={{
                                                    padding: '12px',
                                                    textAlign: 'right',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    fontSize: '14px',
                                                    color: value < 0 ? '#dc2626' : '#334155',
                                                    fontWeight: '500'
                                                }}>
                                                    {value.toFixed(2)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Export Parameters */}
                <div className={'card'}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>
                        Export Parameters
                    </h2>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        {/* General Parameters */}
                        <div style={{  }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginTop: 0, marginBottom: '16px' }}>
                                General
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '16px'
                            }}>
                                {Object.entries(exportParams).map(([key, value]) => (
                                    <div key={key}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#475569',
                                            marginBottom: '6px'
                                        }}>
                                            {key}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={value}
                                            onChange={(e) => handleExportChange(key, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Parameters */}
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '24px', width: '100%' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginTop: 0, marginBottom: '16px' }}>
                                Monthly Values
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {['DEC', 'MAR', 'MAY'].map(month => (
                                    <div key={month} style={{
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <h4 style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#2563eb',
                                            marginTop: 0,
                                            marginBottom: '12px',
                                            textAlign: 'center'
                                        }}>
                                            {month}
                                        </h4>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: '12px'
                                        }}>
                                        {['SAFEX', 'CBOT', 'BASIS', 'PORT', 'US_PREMIE_PNW', 'US_PREMIE_GULF', 'BRAZ_PREMIE',
                                            'ARG_PREMIE', 'SA_FREIGHT', 'PNW_FREIGHT', 'GULF_FREIGHT', 'BRAZ_JAP_FREIGHT', 'BRAZ_SK_FREIGHT',
                                            'ARG_FREIGHT', 'DAYS'].map(param => (
                                            <div key={param} style={{ marginBottom: '10px' }}>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#475569',
                                                    marginBottom: '4px'
                                                }}>
                                                    {param}
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={monthlyParams[month][param]}
                                                    onChange={(e) => handleMonthlyChange(month, param, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 8px',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </section>

)
}

export default MaizeExport