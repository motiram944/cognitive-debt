/**
 * Logic to compare two sets of analysis results and calculate deltas.
 */

function compareResults(baseResults, targetResults) {
    const fileMap = new Map();
    const diffs = {
        files: [],
        metrics: {
            score: { before: 0, after: 0, delta: 0 },
            functionLength: { before: 0, after: 0, delta: 0 },
            nestingDepth: { before: 0, after: 0, delta: 0 },
            parameterCount: { before: 0, after: 0, delta: 0 },
            dependencies: { before: 0, after: 0, delta: 0 },
            loc: { before: 0, after: 0, delta: 0 }
        },
        newFiles: 0,
        deletedFiles: 0,
        modifiedFiles: 0,
        overallChangePercent: 0,
        status: 'unchanged' // improved/degraded/unchanged
    };

    // Index base results
    baseResults.forEach(r => {
        if (r.success) fileMap.set(r.filePath, { base: r });
    });

    // Match with target results
    targetResults.forEach(r => {
        if (!r.success) return;

        const existing = fileMap.get(r.filePath) || {};
        fileMap.set(r.filePath, { ...existing, target: r });
    });

    // Calculate Diff per File
    let totalScoreDelta = 0;
    let consideredFiles = 0;

    for (const [path, { base, target }] of fileMap.entries()) {
        if (base && target) {
            // MODIFIED FILE
            const fileDiff = calculateFileDiff(base, target);
            if (fileDiff.hasChange) {
                diffs.files.push(fileDiff);
                diffs.modifiedFiles++;
                totalScoreDelta += fileDiff.deltaScore;
                consideredFiles++;

                // Aggregate metrics
                aggregateMetrics(diffs.metrics, base.metrics, target.metrics);
            }
        } else if (target && !base) {
            // NEW FILE
            diffs.newFiles++;
            const fileDiff = {
                file: path,
                status: 'new',
                changePercent: 100,
                reasons: ['New file added'],
                deltaScore: -target.scoreData.score // "Cost" of new debt
            };
            diffs.files.push(fileDiff);
            aggregateMetrics(diffs.metrics, emptyMetrics(), target.metrics);
        } else if (base && !target) {
            // DELETED FILE
            diffs.deletedFiles++;
            const fileDiff = {
                file: path,
                status: 'deleted',
                changePercent: 0,
                reasons: ['File deleted'],
                deltaScore: base.scoreData.score // "Gain" of removing debt
            };
            diffs.files.push(fileDiff);
            aggregateMetrics(diffs.metrics, base.metrics, emptyMetrics());
        }
    }

    // Determine Status
    if (diffs.metrics.score.delta < 0) diffs.status = 'degraded';
    else if (diffs.metrics.score.delta > 0) diffs.status = 'improved';

    // Sort files by impact (negative delta score is bad)
    diffs.files.sort((a, b) => a.deltaScore - b.deltaScore);

    return diffs;
}

function calculateFileDiff(base, target) {
    const baseScore = base.scoreData.score;
    const targetScore = target.scoreData.score;
    const deltaScore = targetScore - baseScore;

    // Detect meaningful changes
    const reasons = [];
    if (target.metrics.functionLength.averageLength > base.metrics.functionLength.averageLength + 5) {
        reasons.push(`Avg function length increased (+${target.metrics.functionLength.averageLength - base.metrics.functionLength.averageLength})`);
    }
    if (target.metrics.nestingDepth.maxDepth > base.metrics.nestingDepth.maxDepth) {
        reasons.push(`Max nesting depth increased to ${target.metrics.nestingDepth.maxDepth}`);
    }
    if (target.metrics.parameterCount.maxParams > base.metrics.parameterCount.maxParams) {
        reasons.push(`Parameter count increased`);
    }
    if (target.metrics.dependencies.totalImports > base.metrics.dependencies.totalImports + 2) {
        reasons.push(`Coupling increased (+${target.metrics.dependencies.totalImports - base.metrics.dependencies.totalImports} imports)`);
    }
    if (target.metrics.namingClarity.unclearPercent > base.metrics.namingClarity.unclearPercent) {
        reasons.push(`Naming clarity degraded`);
    }

    return {
        file: base.filePath,
        status: 'modified',
        deltaScore,
        changePercent: baseScore > 0 ? Math.round(((targetScore - baseScore) / baseScore) * 100) : 0,
        reasons,
        hasChange: deltaScore !== 0 || reasons.length > 0
    };
}

function aggregateMetrics(global, base, target) {
    global.score.before += 0; // Score aggregation is complex, skipped for simple sum

    // Function Length (Avg is hard to sum, using LOC instead)
    global.loc.before += base.loc || 0;
    global.loc.after += target.loc || 0;
    global.loc.delta = global.loc.after - global.loc.before;

    // Nesting (Summing max depths isn't perfect but shows trend)
    global.nestingDepth.before += base.nestingDepth ? base.nestingDepth.maxDepth : 0;
    global.nestingDepth.after += target.nestingDepth ? target.nestingDepth.maxDepth : 0;
    global.nestingDepth.delta = global.nestingDepth.after - global.nestingDepth.before;

    // Imports
    global.dependencies.before += base.dependencies ? base.dependencies.totalImports : 0;
    global.dependencies.after += target.dependencies ? target.dependencies.totalImports : 0;
    global.dependencies.delta = global.dependencies.after - global.dependencies.before;
}

function emptyMetrics() {
    return {
        functionLength: { averageLength: 0 },
        nestingDepth: { maxDepth: 0 },
        parameterCount: { maxParams: 0 },
        dependencies: { totalImports: 0 },
        namingClarity: { unclearPercent: 0 },
        loc: 0
    };
}

module.exports = { compareResults };
