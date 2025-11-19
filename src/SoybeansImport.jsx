import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import './App.css'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

function ImportCalc() {

    const [importParams, setImportParams] = useState({
        spotRate: 17.57,
        forwardMultiplier: 0.0032,
    });

    const [monthlyParams, setMonthlyParams] = useState({
        DEC: { ARG_FOB: 434, SAFEX: 7303, BASIS: 250, FOBBING: 200, FREIGHT: 29, TPT: 350, Days: 32 },
        MAR: { ARG_FOB: 400, SAFEX: 7330, BASIS: 150, FOBBING: 320, FREIGHT: 55, TPT: 130, Days: 120 },
        MAY: { ARG_FOB: 400, SAFEX: 7293, BASIS: 100, FOBBING: 340, FREIGHT: 55, TPT: 130, Days: 180 },
    });

    const handleImportChange = (key, value) => {
        setImportParams(prev => ({
            ...prev,
            [key]: parseFloat(value)
        }));
    };

    const handleMonthlyChange = (month, param, value) => {
        setMonthlyParams(prev => ({
            ...prev,
            [month]: {
                ...prev[month],
                [param]: parseFloat(value)
            }
        }));
    };

    const calculateForMonth = (month) => {
        const { ARG_FOB, SAFEX, BASIS, FOBBING, FREIGHT, TPT, Days } = monthlyParams[month];

        const CIF = ((ARG_FOB + FREIGHT) * (8/100)) + (ARG_FOB + FREIGHT);

        const forwardRate = Days * importParams.forwardMultiplier + importParams.spotRate;

        const RT = CIF * forwardRate;

        const HAWE = RT + FOBBING + TPT;

        const basisSafex = HAWE - (SAFEX + BASIS);
        const final_price = basisSafex / forwardRate;

        return {
            forwardRate,
            CIF,
            RT,
            HAWE,
            basisSafex,
            final_price,
            SAFEX
        };
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
                                'Import Cost (R/t)': results.basisSafex,
                                'Final Price ($/t)': results.final_price,
                                'Forward Rate (R/$)' : results.forwardRate,
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
                            {/* Dollar values */}
                            {/*<Line type="monotone" dataKey="CIF ($/t)" stroke="#3b82f6" strokeWidth={2} />*/}
                            {/*<Line type="monotone" dataKey="Final Price ($/t)" stroke="#10b981" strokeWidth={3} />*/}
                            {/* Rand values */}
                            {/*<Line type="monotone" dataKey="RT (R/t)" stroke="#f59e0b" strokeWidth={2} />*/}
                            <Line type="monotone" dataKey="SAFEX (R/t)" stroke="#8b5cf6" strokeWidth={2} />
                            <Line type="monotone" dataKey="Import Cost (R/t)" stroke="#ef4444" strokeWidth={2} />
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
                                { label: 'CIF ($/t)', key: 'CIF' },
                                { label: 'RT (R/t)', key: 'RT' },
                                { label: 'Hawe (R/t)', key: 'HAWE' },
                                { label: 'Import Cost (R/t)', key: 'basisSafex' },
                                { label: 'Import Cost ($/t)', key: 'final_price' }
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
                                        {['ARG_FOB', 'SAFEX', 'BASIS', 'FOBBING', 'FREIGHT', 'TPT', 'Days'].map(param => (
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    );
}
export default ImportCalc