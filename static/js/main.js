function updateChartFont() {
    if (chart) {
        chart.options.plugins.title.font = {
            family: "'Poppins', sans-serif",
            size: window.innerWidth < 768 ? 18 : 20,
            weight: 'bold'
        };
        
        chart.options.scales.r.pointLabels.font = {
            family: "'Poppins', sans-serif",
            size: window.innerWidth < 768 ? 12 : 14,
            weight: 'normal'
        };
        
        chart.options.scales.r.ticks.font = {
            family: "'Poppins', sans-serif",
            size: window.innerWidth < 768 ? 10 : 12,
            weight: 'normal'
        };
        
        chart.update();
    }
}

function updateChart() {
    // ... (existing code)

    updateAnalysisSummary();
    chartProcessed = true;
    gradientsProcessed = true;
    titleChanged = false;
    updateChartButton.classList.remove('needs-update');
    analyzeScenarioButton.disabled = false;
    analyzeScenarioButton.title = "Analyze the current scenario";
    aiButtonHint.style.display = "none";

    const aiAnalysisResult = document.getElementById('aiAnalysisResult');
    aiAnalysisResult.innerHTML = '';

    const lineChart = document.getElementById('lineChart');
    if (lineChart) {
        lineChart.style.display = 'none';
    }

    updateChartFont();
}

window.addEventListener('resize', updateChartFont);