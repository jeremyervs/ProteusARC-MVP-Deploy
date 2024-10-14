// ... (previous code remains unchanged)

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

// ... (rest of the code remains unchanged)

// Make sure to call updateChartFont when creating or updating the chart
function updateChart() {
    // ... (existing updateChart code)
    
    updateChartFont();
}

// ... (rest of the code remains unchanged)
