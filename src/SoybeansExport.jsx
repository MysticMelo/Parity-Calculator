import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import "./App.css"

function SoybeansExport() {

    // === Defaults tailored for SOYBEANS ===
    // Export parameters (SA vs US/BRAZ delivered markets)
    const [exportParams, setExportParams] = useState({
        // FX
        spotRate: 18.00,
        forwardMultiplier: 0.0016, // s/s = 0.0016 (SA vs US interest diff)

        // Board & premiums (US / Brazil)
        CBOT: 10.80, // $/bu (illustrative)
        US_PREMIE: 1.35, // $/bu – Fryers Oilseed Report
        BRAZ_PREMIE: 1.10, // $/bu – Fryers Oilseed Report

        // Conversion
        bushelsPerTon: 36.7413, // fixed for soybeans

        // Domestic (Rand) side
        SAFEX: 9500, // R/ton (illustrative)
        BASIS: 600, // R/ton – cost into the port (reference sheet)
        FOBBING: 200, // R/ton – loading cost (reference sheet)
        SA_FREIGHT: 35, // $/ton – destination freight from SA

        // External route freights in $/t
        US_FREIGHT: 28, // $/t (e.g., US→MAL/INDO)
        BRAZ_FREIGHT: 26 // $/t (e.g., BRAZ→CHINA)
    })



    // === Date helpers per spec: Today() to the 20th of target months ===
    const targetMonths = ['Dec', 'Mar', 'May', 'Jul']
    const monthIndexMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }

    const today = useMemo(() => new Date(), [])

    const schedule = useMemo(() => {
        const year = today.getFullYear()
        const results = []

        targetMonths.forEach((label) => {
            const mIdx = monthIndexMap[label]
            // 20th of month (this year or next, whichever is next on the calendar)
            let d = new Date(year, mIdx, 20)
            if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                d = new Date(year + 1, mIdx, 20)
            }
            const msPerDay = 1000 * 60 * 60 * 24
            const days = Math.max(0, Math.round((d.getTime() - today.getTime()) / msPerDay))
            results.push({ label, date: d, days })
        })

        return results
    }, [today])

    // === Calculations: EXPORT ===
    const calculateExport = () => {
        const results = []

        for (let i = 0; i < schedule.length; i++) {
            const { label: month, days } = schedule[i]

            const forwardRate = days * exportParams.forwardMultiplier + exportParams.spotRate

            const US_FOB = (exportParams.CBOT + exportParams.US_PREMIE) * exportParams.bushelsPerTon // $/t
            const BRAZ_FOB = (exportParams.CBOT + exportParams.BRAZ_PREMIE) * exportParams.bushelsPerTon // $/t

            const US_CIF = US_FOB + exportParams.US_FREIGHT // $/t
            const BRAZ_CIF = BRAZ_FOB + exportParams.BRAZ_FREIGHT // $/t

            const CIF_destination = (exportParams.SAFEX + exportParams.BASIS + exportParams.FOBBING) / forwardRate + exportParams.SA_FREIGHT // $/t

            // Diffs in $/t per spec
            const US_MAL_INDO = CIF_destination - US_CIF
            const BRAZ_CHINA = CIF_destination - BRAZ_CIF

            // Convert diffs to Rand/t
            const US_R_PER_T = US_MAL_INDO * forwardRate
            const BRAZ_R_PER_T = BRAZ_CHINA * forwardRate

            results.push({
                month,
                days,
                forwardRate: forwardRate.toFixed(4),
                // USD/t diffs
                diff_US_MAL_INDO_USD: US_MAL_INDO.toFixed(2),
                diff_BRAZ_CHINA_USD: BRAZ_CHINA.toFixed(2),
                // Rand/t diffs
                diff_US_MAL_INDO_R: US_R_PER_T.toFixed(2),
                diff_BRAZ_CHINA_R: BRAZ_R_PER_T.toFixed(2)
            })
        }

        return results
    }


    const exportResults = useMemo(() => calculateExport(), [exportParams, schedule])

    const handleExportChange = (field, value) => {
        setExportParams((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }))
    }

    return (
        <section>

                <div>
                        <div>
                            {/* Export Chart */}
                            <div className={'card'}>
                                <h2 className={'cardTitle'}>Export Parity Differences</h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={exportResults}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="black" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {/* USD/t lines */}
                                        <Line type="monotone" dataKey="diff_US_MAL_INDO_USD" stroke="#3b82f6" strokeWidth={2} name="US→MAL/INDO ($/t)" />
                                        <Line type="monotone" dataKey="diff_BRAZ_CHINA_USD" stroke="#10b981" strokeWidth={2} name="BRAZ→CHINA ($/t)" />
                                        {/* Rand/t lines */}
                                        <Line type="monotone" dataKey="diff_US_MAL_INDO_R" stroke="#f59e0b" strokeWidth={2} name="US→MAL/INDO (R/t)" />
                                        <Line type="monotone" dataKey="diff_BRAZ_CHINA_R" stroke="#8b5cf6" strokeWidth={2} name="BRAZ→CHINA (R/t)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Export Results Table */}
                            <div className={'card'}>
                                <h2 className={'cardTitle'}>Export Results</h2>
                                <div className={'tableContainer'}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th className={'thRight'}>Days</th>
                                            <th className={'thRight'}>Forward Rate</th>
                                            <th className={'thRight'}>US→MAL/INDO ($/t)</th>
                                            <th className={'thRight'}>BRAZ→CHINA ($/t)</th>
                                            <th className={'thRight'}>US→MAL/INDO (R/t)</th>
                                            <th className={'thRight'}>BRAZ→CHINA (R/t)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {exportResults.map((r, idx) => (
                                            <tr key={idx}>
                                                <td>{r.month}</td>
                                                <td className={'tdRight'}>{r.days}</td>
                                                <td className={'tdRight'}>{r.forwardRate}</td>
                                                <td className={'tdRight'}>{r.diff_US_MAL_INDO_USD}</td>
                                                <td className={'tdRight'}>{r.diff_BRAZ_CHINA_USD}</td>
                                                <td className={'tdRight'}>{r.diff_US_MAL_INDO_R}</td>
                                                <td className={'tdRight'}>{r.diff_BRAZ_CHINA_R}</td>
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

                </div>

        </section>
    )
}

export default SoybeansExport