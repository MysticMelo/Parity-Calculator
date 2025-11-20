import React, { useState } from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import './App.css'

function MaizeImport() {

    const [importParams, setImportParams] = useState({
        spotRate: 17.55,
        forwardMultiplier: 0.0032,
    });

    const bushelsPerTon = 39.3683;

    const [monthlyParams, setMonthlyParams] = useState({
        DEC: { SAFEX: 2946, CBOT: 3.94, ARG_BASIS: 1.25, FOBBING: 220, CT_FREIGHT: 25, PE_FREIGHT: 30, DBN_FREIGHT: 30,
            TPT_CT: 250, TPT_PE: 150, TPT_DBN: 80, QUALITY: 150, BASIS_CT: 750, BASIS_PE: 500, BASIS_DBN: 150, Days: 32 },
        MAR: { SAFEX: 3061, CBOT: 3.94, ARG_BASIS: 1.25, FOBBING: 220, CT_FREIGHT: 25, PE_FREIGHT: 30, DBN_FREIGHT: 30,
            TPT_CT: 250, TPT_PE: 150, TPT_DBN: 80, QUALITY: 150, BASIS_CT: 750, BASIS_PE: 500, BASIS_DBN: 150, Days: 60 },
        MAY: { SAFEX: 3118, CBOT: 3.94, ARG_BASIS: 1.25, FOBBING: 220, CT_FREIGHT: 25, PE_FREIGHT: 30, DBN_FREIGHT: 30,
            TPT_CT: 250, TPT_PE: 150, TPT_DBN: 80, QUALITY: 150, BASIS_CT: 750, BASIS_PE: 500, BASIS_DBN: 150, Days: 90 }
    });

    const calculateForMonth = (month) => {

        const {SAFEX, CBOT, ARG_BASIS, FOBBING, CT_FREIGHT, PE_FREIGHT, DBN_FREIGHT,
            TPT_CT, TPT_PE, TPT_DBN, QUALITY, BASIS_CT, BASIS_PE, BASIS_DBN, Days} = monthlyParams[month];

        const forwardRate = (Days * importParams.forwardMultiplier) + importParams.spotRate;
        const FOB = (CBOT + ARG_BASIS) * bushelsPerTon;
        const CIF_CT = FOB + CT_FREIGHT;
        const CIF_PE = FOB + PE_FREIGHT;
        const CIF_DBN = FOB + DBN_FREIGHT;
        const RT_CT = CIF_CT * forwardRate;
        const RT_PE = CIF_PE * forwardRate;
        const RT_DBN = CIF_DBN * forwardRate;
        const EX_HAWE_CT = RT_CT + FOBBING;
        const EX_HAWE_PE = RT_PE + FOBBING;
        const EX_HAWE_DBN = RT_DBN + FOBBING;
        const DEL_PLANT_CT = EX_HAWE_CT + TPT_CT + QUALITY;
        const DEL_PLANT_PE = EX_HAWE_PE + TPT_PE + QUALITY;
        const DEL_PLANT_DBN = EX_HAWE_DBN + TPT_DBN + QUALITY;
        const DAP_PRYS_CT = SAFEX + BASIS_CT;
        const DAP_PRYS_PE = SAFEX + BASIS_PE;
        const DAP_PRYS_DBN = SAFEX + BASIS_DBN;
        const VERSKIL_CT = DAP_PRYS_CT - DEL_PLANT_CT;
        const VERSKIL_PE = DAP_PRYS_PE - DEL_PLANT_PE;
        const VERSKIL_DBN = DAP_PRYS_DBN - DEL_PLANT_DBN;

        return {
            forwardRate,
            SAFEX,
            VERSKIL_CT,
            VERSKIL_PE,
            VERSKIL_DBN
        }

    }

    // const calculateImport = () => {
    //     const results = [];
    //     const days = [45];
    //     const months = ["Dec"];
    //
    //     for (let i = 0; i < days.length; i++) {
    //         const day = days[i];
    //         const month = months[i];
    //
    //         const forwardRate = (day * importParams.forwardMultiplier) + importParams.spotRate;
    //         const FOB = (importParams.CBOT + importParams.ARG_BASIS) * importParams.bushelsPerTon;
    //         const CIF_CT = FOB + importParams.CT_FREIGHT;
    //         const CIF_PE = FOB + importParams.PE_FREIGHT;
    //         const CIF_DBN = FOB + importParams.DBN_FREIGHT;
    //         const RT_CT = CIF_CT * forwardRate;
    //         const RT_PE = CIF_PE * forwardRate;
    //         const RT_DBN = CIF_DBN * forwardRate;
    //         const EX_HAWE_CT = RT_CT + importParams.FOBBING;
    //         const EX_HAWE_PE = RT_PE + importParams.FOBBING;
    //         const EX_HAWE_DBN = RT_DBN + importParams.FOBBING;
    //         const DEL_PLANT_CT = EX_HAWE_CT + importParams.TPT_CT + importParams.QUALITY;
    //         const DEL_PLANT_PE = EX_HAWE_PE + importParams.TPT_PE + importParams.QUALITY;
    //         const DEL_PLANT_DBN = EX_HAWE_DBN + importParams.TPT_DBN + importParams.QUALITY;
    //         const DAP_PRYS_CT = importParams.SAFEX + importParams.BASIS_CT;
    //         const DAP_PRYS_PE = importParams.SAFEX + importParams.BASIS_PE;
    //         const DAP_PRYS_DBN = importParams.SAFEX + importParams.BASIS_DBN;
    //         const VERSKIL_CT = DAP_PRYS_CT - DEL_PLANT_CT;
    //         const VERSKIL_PE = DAP_PRYS_PE - DEL_PLANT_PE;
    //         const VERSKIL_DBN = DAP_PRYS_DBN - DEL_PLANT_DBN;
    //
    //         results.push({
    //             month,
    //             forwardRate: forwardRate.toFixed(4),
    //             KAAP: VERSKIL_CT.toFixed(2),
    //             PE: VERSKIL_PE.toFixed(2),
    //             DBN: VERSKIL_DBN.toFixed(2)
    //         });
    //     }
    //
    //     return results;
    // };
    // const importResults = calculateImport();

    const handleImportChange = ((field, value) => {
        setImportParams(prev => ({
            ...prev,
            [field]: parseFloat(value)}));
    })

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
        <div>

            <div style={{display: 'flex', width: '100%', gap: '10px', justifyContent:'center'}}>
                {/* Export Chart */}
                <div className={'card'} style={{width: '70%'}}>
                    <h2 className={'cardTitle'}>Import Parities</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={['DEC', 'MAR', 'MAY'].map(month => {
                            const results = calculateForMonth(month);
                            return {
                                month,
                                'SAFEX (R/t)' : results.SAFEX,
                                'KAAP (R/t)' : results.VERSKIL_CT,
                                'PE (R/t)' : results.VERSKIL_PE,
                                'DBN (R/t)' : results.VERSKIL_DBN
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
                            {/* Dollar values */}
                            {/*<Line type="monotone" dataKey="CIF ($/t)" stroke="#3b82f6" strokeWidth={2} />*/}
                            <Line type="monotone" dataKey="KAAP (R/t)" stroke="#10b981" strokeWidth={2} />
                            <Line type="monotone" dataKey="PE (R/t)" stroke="#f59e0b" strokeWidth={2} />
                            <Line type="monotone" dataKey="DBN (R/t)" stroke="#ef4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="SAFEX (R/t)" stroke="#8b5cf6" strokeWidth={2} />
                            {/* Exchange rate */}
                            {/*<Line type="monotone" dataKey="Forward Rate (R/$)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />*/}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/* Results for Each Month */}
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
                            {[
                                { label: 'Forward Rate (R/$)', key: 'forwardRate' },
                                { label: 'KAAP (R/t)', key: 'VERSKIL_CT' },
                                { label: 'PE (R/t)', key: 'VERSKIL_PE' },
                                { label: 'DBN (R/t)', key: 'VERSKIL_DBN' }
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

            {/* Combined Parameters Card */}
            <div className={'card'}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>
                    Import Parameters
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
                            {Object.entries(importParams).map(([key, value]) => (
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
                                        onChange={(e) => handleImportChange(key, e.target.value)}
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
                                    {['SAFEX', 'CBOT', 'ARG_BASIS', 'FOBBING', 'CT_FREIGHT', 'PE_FREIGHT', 'DBN_FREIGHT',
                                        'TPT_CT', 'TPT_PE', 'TPT_DBN', 'QUALITY', 'BASIS_CT', 'BASIS_PE', 'BASIS_DBN', 'Days'].map(param => (
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
    )
}

export default MaizeImport