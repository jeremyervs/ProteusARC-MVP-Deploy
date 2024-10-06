document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    function updateChart() {
        // ... existing code ...

        if (chart) {
            chart.data = data;
            updateChartColors();
        } else {
            const ctx = document.getElementById('radarChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'radar',
                data: data,
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
                                    weight: 'bold'
                                },
                                showLabelBackdrop: false
                            },
                            pointLabels: {
                                font: {
                                    family: "'Poppins', sans-serif",
                                    size: window.innerWidth < 768 ? 12 : 14,
                                    weight: 'bold'
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

        // ... rest of the function ...
    }

    // ... rest of the existing code ...
});
