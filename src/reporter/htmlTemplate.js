/**
 * HTML Template for Cognitive Debt Report
 * Single-file template with embedded CSS/JS for offline use.
 */

module.exports = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cognitive Debt Report - ${data.date}</title>
    <style>
        :root {
            --bg-dark: #0f111a;
            --bg-card: #1a1d2d;
            --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0;
            --accent-green: #00ff9d;
            --accent-blue: #3b82f6; /* Distinct Blue */
            --accent-purple: #bd00ff;
            --accent-red: #ff4757;
            --accent-yellow: #ffa502;
            --divider: #2a2d3d;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--divider);
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(90deg, var(--accent-green), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .meta {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        /* Summary Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .card {
            background-color: var(--bg-card);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-title {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .card-value {
            font-size: 2rem;
            font-weight: 700;
        }

        .grade-excellent { color: var(--accent-green); }
        .grade-good { color: var(--accent-blue); }
        .grade-fair { color: var(--accent-yellow); }
        .grade-poor { color: var(--accent-red); }

        /* Charts */
        .charts-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .chart-container {
            background-color: var(--bg-card);
            border-radius: 12px;
            padding: 1.5rem;
            height: 300px;
        }

        @media (max-width: 768px) {
            .charts-row { grid-template-columns: 1fr; }
        }

        /* File List */
        .file-list {
            background-color: var(--bg-card);
            border-radius: 12px;
            overflow: hidden;
        }

        .table-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 50px;
            padding: 1rem 1.5rem;
            background-color: rgba(0, 0, 0, 0.2);
            font-weight: 600;
            color: var(--text-secondary);
        }

        .file-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 50px;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--divider);
            align-items: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .file-row:hover {
            background-color: rgba(255, 255, 255, 0.02);
        }

        .file-details {
            grid-column: 1 / -1;
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background-color: rgba(0, 0, 0, 0.1);
        }

        .file-details.open {
            max-height: 1000px;
            padding: 1.5rem;
            border-bottom: 1px solid var(--divider);
        }

        .progress-bar {
            height: 6px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            width: 100px;
        }

        .progress-fill {
            height: 100%;
            border-radius: 3px;
        }

        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            background-color: rgba(255, 255, 255, 0.1);
        }

        .issue-item {
            display: flex;
            gap: 1rem;
            padding: 0.5rem 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .issue-line {
            font-family: monospace;
            color: var(--accent-purple);
        }

        .expand-icon {
            transition: transform 0.3s;
        }
        
        .file-row.active .expand-icon {
            transform: rotate(180deg);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>Cognitive Debt Report</h1>
                <div class="meta">Generated on ${new Date(data.date).toLocaleString()}</div>
            </div>
            <a href="https://github.com/motiram944/cognitive-debt" target="_blank" style="color: var(--text-secondary); text-decoration: none;">v${data.version}</a>
        </header>

        <div class="stats-grid">
            <div class="card">
                <div class="card-title">Average Score</div>
                <div class="card-value grade-${data.summary.averageGrade.toLowerCase()}">
                    ${data.summary.averageScore}/100
                </div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${data.summary.averageGrade}</div>
            </div>
            <div class="card">
                <div class="card-title">Total Files</div>
                <div class="card-value">${data.summary.totalFiles}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${data.summary.totalLoc} lines of code</div>
            </div>
            <div class="card">
                <div class="card-title">Est. Time to Understand</div>
                <div class="card-value" style="color: var(--accent-purple)">${data.summary.totalTime}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">Total effort required</div>
            </div>
            <div class="card">
                <div class="card-title">Issues Found</div>
                <div class="card-value" style="color: var(--accent-red)">${data.summary.totalIssues}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">Across all files</div>
            </div>
        </div>

        <div class="charts-row">
            <div class="chart-container">
                <canvas id="scoreDistribution"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="timeDistribution"></canvas>
            </div>
        </div>

        <div class="file-list">
            <div class="table-header">
                <div>File Path</div>
                <div>Score</div>
                <div>Grade</div>
                <div>Time</div>
                <div>Issues</div>
                <div></div>
            </div>
            ${data.files.map((file, index) => `
                <div class="file-row" onclick="toggleDetails(${index})">
                    <div style="font-family: monospace; overflow: hidden; text-overflow: ellipsis;">${file.path}</div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${file.score}%; background-color: var(--accent-${getScoreColorInfo(file.grade)})"></div>
                        </div>
                        ${file.score}
                    </div>
                    <div><span class="badge" style="color: var(--accent-${getScoreColorInfo(file.grade)})">${file.grade}</span></div>
                    <div style="color: var(--accent-purple)">${file.timeToUnderstand}</div>
                    <div>${file.issueCount}</div>
                    <div class="expand-icon">▼</div>
                </div>
                <div class="file-details" id="details-${index}">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 1.5rem;">
                        <div>
                            <h4 style="margin-top: 0;">Metrics</h4>
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; font-size: 0.9rem;">
                                <div>Function Length</div>
                                <div>${file.metrics.functionLength.average} lines avg</div>
                                <div>Nesting Depth</div>
                                <div>${file.metrics.nestingDepth.max} levels max</div>
                                <div>Parameters</div>
                                <div>${file.metrics.parameterCount.max} max</div>
                            </div>
                        </div>
                        <div>
                            <h4 style="margin-top: 0;">Top Issues</h4>
                            ${file.issues.length ? file.issues.map(issue => `
                                <div class="issue-item">
                                    <span class="issue-line">Line ${issue.line}</span>
                                    <span>${issue.description}</span>
                                </div>
                            `).join('') : '<div style="color: var(--text-secondary)">No major issues found.</div>'}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Chart.js from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Interactive Logic
        function toggleDetails(index) {
            const details = document.getElementById('details-' + index);
            const row = details.previousElementSibling;
            
            if (details.classList.contains('open')) {
                details.classList.remove('open');
                row.classList.remove('active');
            } else {
                details.classList.add('open');
                row.classList.add('active');
            }
        }

        // Prepare Data for Time Chart
        // Sort files by complexity/time (simple metric: inverse score * loc)
        const fileNames = ${JSON.stringify(data.files.map(f => f.path.split('/').pop()))};
        const timeValues = ${JSON.stringify(data.files.map(f => parseTime(f.timeToUnderstand)))};
        
        // Score Distribution Chart
        const ctxScore = document.getElementById('scoreDistribution').getContext('2d');
        new Chart(ctxScore, {
            type: 'bar',
            data: {
                labels: ['Excellent (80-100)', 'Good (60-79)', 'Fair (40-59)', 'Poor (0-39)'],
                datasets: [{
                    label: 'Files',
                    data: [${data.chartData.excellent}, ${data.chartData.good}, ${data.chartData.fair}, ${data.chartData.poor}],
                    backgroundColor: [
                        '#00ff9d',
                        '#3b82f6', // Distinct Blue
                        '#ffa502',
                        '#ff4757'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Score Distribution',
                        color: '#e0e0e0',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#a0a0a0', precision: 0 }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0' }
                    }
                }
            }
        });

        // Time Distribution Chart
        const ctxTime = document.getElementById('timeDistribution').getContext('2d');
        new Chart(ctxTime, {
            type: 'bar',
            data: {
                labels: fileNames.slice(0, 10), // Top 10 files
                datasets: [{
                    label: 'Time to Understand (min)',
                    data: timeValues.slice(0, 10),
                    backgroundColor: '#bd00ff',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Most Complex Files (Time)',
                        color: '#e0e0e0',
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#a0a0a0' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0' }
                    }
                }
            }
        });
    </script>
</body>
</html>`;

function getScoreColorInfo(grade) {
    if (grade === 'Excellent') return 'green';
    if (grade === 'Good') return 'blue';
    if (grade === 'Fair') return 'yellow';
    return 'red';
}

// Helper to parse "20 min" to 20 for server-side chart data prep
function parseTime(str) {
    if (!str) return 0;
    if (str.includes('<')) return 0.5;
    let min = 0;
    if (str.includes('hr')) {
        const parts = str.split(' ');
        // Very basic parser assuming format "X hr Y min"
        if (parts.length >= 2) min += parseInt(parts[0]) * 60;
        if (parts.length >= 4) min += parseInt(parts[2]);
    } else {
        min = parseInt(str);
    }
    return min || 0;
}
