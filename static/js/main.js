document.addEventListener('DOMContentLoaded', function() {
    const gradients = [
        { label: 'Endogenous', def: 'Change that originates from within the system or entity, driven by internal factors such as organizational policies, personal motivations, or inherent dynamics.' },
        { label: 'Exogenous', def: 'Change that originates from outside the system or entity, influenced by external forces such as market trends, regulations, or environmental factors.' },
        { label: 'Stable', def: 'Incremental change that maintains the core structure or identity, resulting in a state that remains recognizable over time.' },
        { label: 'Transformational', def: 'Significant and fundamental change that alters the system or entity in a way that it becomes completely new or unrecognizable.' },
        { label: 'Transactional', def: 'A one-time event or action that is implemented and concluded quickly, with immediate effects.' },
        { label: 'Continuing', def: 'An ongoing process of change that evolves over time, requiring sustained effort and adaptation.' },
        { label: 'Individual', def: 'Change initiated by a single person or a small group, often characterized by leadership or heroic efforts that drive the transformation.' },
        { label: 'Community', def: 'Change that emerges from the collective action of a larger group or society, involving widespread participation and consensus.' },
        { label: 'Passive', def: 'Change achieved through peaceful and non-confrontational means, such as dialogue, negotiation, or gradual reforms.' },
        { label: 'Violent', def: 'Change that occurs through conflict, force, or aggressive actions, often involving revolutions, wars, or significant upheaval.' },
        { label: 'Top Down', def: 'Change initiated by those in positions of authority or leadership, typically through directives, policies, or executive orders.' },
        { label: 'Bottom Up', def: 'Change that starts at the grassroots level, driven by individuals or groups at the lower levels of an organization or society.' },
        { label: 'Dominant', def: 'Change led by a single entity or group exerting control, often characterized by a hierarchical or authoritative approach.' },
        { label: 'Partnership', def: 'Change that is driven by collaborative efforts and shared decision-making, emphasizing equality and mutual support among participants.' },
        { label: 'Trend', def: 'Change that follows current patterns or fads, often temporary and reactive to the present environment.' },
        { label: 'Vision', def: 'Change guided by a long-term strategic outlook, aiming for transformative outcomes that may reshape the future.' },
        { label: 'Accidental', def: 'Change that results from unforeseen events or mistakes, leading to unexpected outcomes or innovations.' },
        { label: 'Deliberate', def: 'Change that is carefully planned and executed, based on extensive research, strategy, and intentional actions.' }
    ];

    const slidersContainer = document.getElementById('sliders');
    const updateChartButton = document.getElementById('updateChartButton');
    const analyzeScenarioButton = document.getElementById('analyzeScenarioButton');
    const changeTitleInput = document.getElementById('changeTitle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const exportButton = document.getElementById('exportButton');
    const viewDirections = document.getElementById('viewDirections');
    const directionsPopup = document.getElementById('directionsPopup');
    const closePopup = document.querySelector('.close-popup');
    const gradientDefinitions = document.getElementById('gradientDefinitions');

    let chart = null;
    let tempValues = Array(gradients.length / 2).fill(50);

    // Create sliders
    for (let i = 0; i < gradients.length; i += 2) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        const labels = document.createElement('div');
        labels.className = 'slider-labels';
        labels.innerHTML = `
            <span>${gradients[i].label}</span>
            <span>${gradients[i+1].label}</span>
        `;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 50;
        slider.className = 'slider';
        slider.id = `slider-${i/2}`;

        const percentDisplay = document.createElement('div');
        percentDisplay.className = 'percent-display';
        percentDisplay.innerHTML = `
            <span id="${slider.id}-left-percent">50%</span>
            <span id="${slider.id}-right-percent">50%</span>
        `;

        sliderContainer.appendChild(labels);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(percentDisplay);
        slidersContainer.appendChild(sliderContainer);

        slider.addEventListener('input', function() {
            updatePercentages(this);
            tempValues[parseInt(this.id.split('-')[1])] = parseInt(this.value);
        });
    }

    // Populate gradient definitions
    gradients.forEach(gradient => {
        const definitionP = document.createElement('p');
        definitionP.innerHTML = `<strong>${gradient.label}:</strong> ${gradient.def}`;
        gradientDefinitions.appendChild(definitionP);
    });

    // View Directions click event
    viewDirections.addEventListener('click', function() {
        directionsPopup.style.display = 'block';
    });

    // Close popup
    closePopup.addEventListener('click', function() {
        directionsPopup.style.display = 'none';
    });

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == directionsPopup) {
            directionsPopup.style.display = 'none';
        }
    });

    // Update chart
    updateChartButton.addEventListener('click', function() {
        updateChart();
    });

    // Analyze scenario
    analyzeScenarioButton.addEventListener('click', function() {
        analyzeScenario();
    });

    // Export functionality
    exportButton.addEventListener('click', showExportOptions);

    function updatePercentages(slider) {
        const value = slider.value;
        const leftPercent = 100 - value;
        const rightPercent = value;
        const sliderId = slider.id;
        document.getElementById(`${sliderId}-left-percent`).textContent = `${leftPercent}%`;
        document.getElementById(`${sliderId}-right-percent`).textContent = `${rightPercent}%`;
    }

    function getTextColor() {
        return document.body.classList.contains('dark-mode') ? '#ffffff' : '#333333';
    }

    function getGridColor() {
        return document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }

    function updateChart() {
        const changeTitle = changeTitleInput.value || 'Untitled Change';

        const data = {
            labels: gradients.map(g => g.label),
            datasets: [{
                label: changeTitle,
                data: tempValues.flatMap(v => [100 - v, v]),
                fill: true,
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderColor: 'rgba(74, 144, 226, 1)',
                pointBackgroundColor: 'rgba(74, 144, 226, 1)',
                borderWidth: 2,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(74, 144, 226, 1)'
            }]
        };

        if (chart) {
            chart.data = data;
            chart.options.scales.r.grid.color = getGridColor();
            chart.options.scales.r.ticks.color = getTextColor();
            chart.options.scales.r.pointLabels.color = getTextColor();
            chart.options.plugins.title.color = getTextColor();
            chart.update();
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
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: {
                                stepSize: 25,
                                color: getTextColor
                            },
                            pointLabels: {
                                font: {
                                    size: 12
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
                                size: 18
                            },
                            color: getTextColor
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Generate analysis summary
        const summary = document.getElementById('analysisSummary');
        summary.innerHTML = `<h3>Analysis Summary for "${changeTitle}"</h3>`;
        gradients.forEach((gradient, index) => {
            const value = index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)];
            summary.innerHTML += `
                <div class="summary-item">
                    <p><strong>${gradient.label}:</strong> ${value}%</p>
                </div>
            `;
        });
    }

    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        if (chart) {
            chart.options.scales.r.grid.color = getGridColor();
            chart.update();
        }
        updateChart(); // Update chart colors based on dark mode
    });

    // Show export options
    function showExportOptions() {
        const exportOptions = document.createElement('div');
        exportOptions.className = 'export-options';
        exportOptions.innerHTML = `
            <h3>Export Options</h3>
            <button id="exportCSV">Export as CSV</button>
            <button id="exportJSON">Export as JSON</button>
        `;
        document.body.appendChild(exportOptions);

        document.getElementById('exportCSV').addEventListener('click', () => exportResults('csv'));
        document.getElementById('exportJSON').addEventListener('click', () => exportResults('json'));

        // Close export options when clicking outside
        document.addEventListener('click', (e) => {
            if (!exportOptions.contains(e.target) && e.target !== exportButton) {
                document.body.removeChild(exportOptions);
            }
        });
    }

    // Export functionality
    function exportResults(format) {
        const changeTitle = changeTitleInput.value || 'Untitled Change';

        if (format === 'csv') {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += `Change Title: ${changeTitle}\n\n`;
            csvContent += "Gradient,Value\n";
            gradients.forEach((gradient, index) => {
                const value = index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)];
                csvContent += `"${gradient.label}",${value}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            downloadFile(encodedUri, `${changeTitle}_analysis.csv`);
        } else if (format === 'json') {
            const jsonContent = {
                changeTitle,
                results: gradients.map((gradient, index) => ({
                    gradient: gradient.label,
                    value: index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)]
                }))
            };
            const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, `${changeTitle}_analysis.json`);
            URL.revokeObjectURL(url);
        }
    }

    function downloadFile(url, filename) {
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function analyzeScenario() {
        const changeTitle = changeTitleInput.value || 'Untitled Change';
        const gradientValues = gradients.map((gradient, index) => ({
            gradient: gradient.label,
            value: index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)]
        }));

        fetch('/analyze_scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                changeTitle: changeTitle,
                gradientValues: gradientValues
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                const aiAnalysisResult = document.getElementById('aiAnalysisResult');
                aiAnalysisResult.innerHTML = `
                    <h3>AI Analysis for "${changeTitle}"</h3>
                    <p>${data.analysis}</p>
                `;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while analyzing the scenario. Please try again.');
        });
    }

    // Initial chart update
    setTimeout(updateChart, 0);
});
