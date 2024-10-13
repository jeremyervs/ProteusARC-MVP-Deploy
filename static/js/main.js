// ... (previous code remains unchanged)

function updateChart(data = null) {
    const changeTitle = changeTitleInput.value || 'Sample Change';
    const chartData = data || tempValues.flatMap(v => [100 - v, v]);

    const dataConfig = {
        labels: chartLabels,
        datasets: [{
            label: changeTitle,
            data: chartData,
            fill: true,
            backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(99, 179, 237, 0.4)' : 'rgba(74, 144, 226, 0.2)',
            borderColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            borderWidth: 0,
            pointRadius: 0,
            pointHoverRadius: 0,
        }]
    };

    if (chart) {
        chart.data = dataConfig;
        updateChartColors();
    } else {
        const ctx = document.getElementById('radarChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'radar',
            data: dataConfig,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: getGridColor
                        },
                        grid: {
                            color: getGridColor
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 25,
                            color: getTextColor,
                            backdropColor: 'transparent',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: window.innerWidth < 768 ? 10 : 12,
                                weight: 'normal'
                            },
                            showLabelBackdrop: false
                        },
                        pointLabels: {
                            font: {
                                family: "'Poppins', sans-serif",
                                size: window.innerWidth < 768 ? 12 : 14,
                                weight: 'normal'
                            },
                            color: getTextColor
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Change Pattern Visualization',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: window.innerWidth < 768 ? 18 : 20,
                            weight: 'bold'
                        },
                        color: getTextColor
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }

    // ... (rest of the function remains unchanged)
}

// ... (rest of the file remains unchanged)
