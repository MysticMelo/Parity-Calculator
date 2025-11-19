import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import "./App.css"

function SoybeansExport() {

    // === Defaults tailored for SOYBEANS ===
    // Export parameters (SA vs US/BRAZ delivered markets)
    const [exportParams, setExportParams] = useState({
        // FX
        spotRate: 17.3,
        forwardMultiplier: 0.0016, // s/s = 0.0016 (SA vs US interest diff)
    })

    const bushelsPerTon = 36.7413;



    // === Date helpers per spec: Today() to the 20th of target months ===
    // const targetMonths = ['Dec', 'Mar', 'May', 'Jul']
    // const monthIndexMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
    //
    // const today = useMemo(() => new Date(), [])

    // const schedule = useMemo(() => {
    //     const year = today.getFullYear()
    //     const results = []
    //
    //     targetMonths.forEach((label) => {
    //         const mIdx = monthIndexMap[label]
    //         // 20th of month (this year or next, whichever is next on the calendar)
    //         let d = new Date(year, mIdx, 20)
    //         if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    //             d = new Date(year + 1, mIdx, 20)
    //         }
    //         const msPerDay = 1000 * 60 * 60 * 24
    //         const days = Math.max(0, Math.round((d.getTime() - today.getTime()) / msPerDay))
    //         results.push({ label, date: d, days })
    //     })
    //
    //     return results
    // }, [today])

    const [monthlyParams, setMonthlyParams] = useState({
        DEC: {SAFEX: 7302, BASIS: 500, DAYS: 32, FOBBING: 350, CBOT: 11.1, US_PREMIE: 1.03, US_FREIGHT: 39, BRAZ_PREMIE: 1.5, BRAZ_FREIGHT: 39, SA_FREIGHT: 25 },
        MAR: {SAFEX: 1000, BASIS: 100, DAYS: 60, FOBBING: 100, CBOT: 100, US_PREMIE: 50, US_FREIGHT: 50, BRAZ_PREMIE: 50, BRAZ_FREIGHT: 50, SA_FREIGHT: 50 },
        MAY: {SAFEX: 1000, BASIS: 100, DAYS: 90, FOBBING: 100, CBOT: 100, US_PREMIE: 50, US_FREIGHT: 50, BRAZ_PREMIE: 50, BRAZ_FREIGHT: 50, SA_FREIGHT: 50 },

    })

    const calculateForMonth = (month) => {
        const {SAFEX, BASIS, DAYS, FOBBING, CBOT, US_PREMIE, US_FREIGHT, BRAZ_PREMIE, BRAZ_FREIGHT, SA_FREIGHT} = monthlyParams[month];

        const forwardRate = DAYS * exportParams.forwardMultiplier + exportParams.spotRate;

        const US_FOB = (CBOT + US_PREMIE) * bushelsPerTon;
        console.log("US_FOB", US_FOB)
        const BRAZ_FOB = (CBOT + BRAZ_PREMIE) * bushelsPerTon // $/t
        console.log("BRAZ_FOB", BRAZ_FOB)

        const US_CIF = US_FOB + US_FREIGHT // $/t
        const BRAZ_CIF = BRAZ_FOB + BRAZ_FREIGHT // $/t

        const CIF_destination = (SAFEX + BASIS + FOBBING) / forwardRate + SA_FREIGHT // $/t

        // Diffs in $/t per spec
        const US_MAL_INDO = CIF_destination - US_CIF
        const BRAZ_CHINA = CIF_destination - BRAZ_CIF

        // Convert diffs to Rand/t
        const US_R_PER_T = US_MAL_INDO * forwardRate
        const BRAZ_R_PER_T = BRAZ_CHINA * forwardRate

        return {
            SAFEX,
            month,
            DAYS,
            forwardRate,
            US_MAL_INDO,
            BRAZ_CHINA,
            US_R_PER_T,
            BRAZ_R_PER_T
        }
    }
    const handleMonthlyChange = (month, param, value) => {
        setMonthlyParams(prev => ({
            ...prev,
            [month]: {
                ...prev[month],
                [param]: parseFloat(value)
            }
        }));
    };


    // === Calculations: EXPORT ===
    // const calculateExport = () => {
    //     const results = []
    //
    //     for (let i = 0; i < schedule.length; i++) {
    //         const { label: month, days } = schedule[i]
    //
    //         const forwardRate = days * exportParams.forwardMultiplier + exportParams.spotRate
    //
    //         const US_FOB = (exportParams.CBOT + exportParams.US_PREMIE) * exportParams.bushelsPerTon // $/t
    //         const BRAZ_FOB = (exportParams.CBOT + exportParams.BRAZ_PREMIE) * exportParams.bushelsPerTon // $/t
    //
    //         const US_CIF = US_FOB + exportParams.US_FREIGHT // $/t
    //         const BRAZ_CIF = BRAZ_FOB + exportParams.BRAZ_FREIGHT // $/t
    //
    //         const CIF_destination = (exportParams.SAFEX + exportParams.BASIS + exportParams.FOBBING) / forwardRate + exportParams.SA_FREIGHT // $/t
    //
    //         // Diffs in $/t per spec
    //         const US_MAL_INDO = CIF_destination - US_CIF
    //         const BRAZ_CHINA = CIF_destination - BRAZ_CIF
    //
    //         // Convert diffs to Rand/t
    //         const US_R_PER_T = US_MAL_INDO * forwardRate
    //         const BRAZ_R_PER_T = BRAZ_CHINA * forwardRate
    //
    //         results.push({
    //             month,
    //             days,
    //             forwardRate: forwardRate.toFixed(4),
    //             // USD/t diffs
    //             diff_US_MAL_INDO_USD: US_MAL_INDO.toFixed(2),
    //             diff_BRAZ_CHINA_USD: BRAZ_CHINA.toFixed(2),
    //             // Rand/t diffs
    //             diff_US_MAL_INDO_R: US_R_PER_T.toFixed(2),
    //             diff_BRAZ_CHINA_R: BRAZ_R_PER_T.toFixed(2)
    //         })
    //     }
    //
    //     return results
    // }

    // const exportResults = useMemo(() => calculateExport(), [exportParams, schedule])

    const handleExportChange = (field, value) => {
        setExportParams((prev) => ({
            ...prev,
            [field]: parseFloat(value)
        }))
    }

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
                                            'US': results.US_R_PER_T,
                                            'BRAZ': results.US_MAL_INDO,
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
                                        <Line type="monotone" dataKey="US" stroke="#f59e0b" strokeWidth={2} />
                                        <Line type="monotone" dataKey="SAFEX (R/t)" stroke="#8b5cf6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="BRAZ" stroke="#ef4444" strokeWidth={2} />
                                        {/* Exchange rate */}
                                        {/*<Line type="monotone" dataKey="Forward Rate (R/$)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />*/}
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
                                            {[
                                                { label: 'Forward Rate (R/$)', key: 'forwardRate' },
                                                { label: 'US (R/t)', key: 'US_R_PER_T' },
                                                { label: 'BRAZ (R/t)', key: 'BRAZ_R_PER_T' },
                                                { label: 'US ($/t)', key: 'US_MAL_INDO' },
                                                { label: 'BRAZ ($/t)', key: 'BRAZ_CHINA' }

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
                                                    {['SAFEX', 'BASIS', 'DAYS', 'FOBBING', 'CBOT', 'US_PREMIE', 'US_FREIGHT', 'BRAZ_PREMIE', 'BRAZ_FREIGHT', 'SA_FREIGHT'].map(param => (
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

                </div>

        </section>
    )
}

export default SoybeansExport