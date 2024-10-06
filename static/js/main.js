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

    const chartLabels = [
        'EN (P1)', 'EX (P2)', 'ST (P3)', 'TR (P4)', 'TX (P5)', 'CN (P6)', 'IN (P7)', 'CO (P8)',
        'PA (P9)', 'VI (P10)', 'TD (P11)', 'BU (P12)', 'DO (P13)', 'PT (P14)', 'TN (P15)', 'VI (P16)',
        'AC (P17)', 'DE (P18)'
    ];

    const gradientValuesLabels = [
        'Endogenous (P1)', 'Exogenous (P2)', 'Stable (P3)', 'Transformational (P4)', 'Transactional (P5)',
        'Continuing (P6)', 'Individual (P7)', 'Community (P8)', 'Passive (P9)', 'Violent (P10)',
        'Top Down (P11)', 'Bottom Up (P12)', 'Dominant (P13)', 'Partnership (P14)', 'Trend (P15)',
        'Vision (P16)', 'Accidental (P17)', 'Deliberate (P18)'
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
    const resetButton = document.getElementById('resetButton');
    const advancedHeader = document.querySelector('.advanced-header');
    const advancedContent = document.querySelector('.advanced-content');
    const changeDescriptionInput = document.getElementById('changeDescription');
    const knowledgeRadios = document.getElementsByName('knowledge');
    const timelineRadios = document.getElementsByName('timeline');

    let chart = null;
    let tempValues = Array(gradients.length / 2).fill(50);
    let chartProcessed = false;

    analyzeScenarioButton.disabled = true;
    analyzeScenarioButton.title = "Process gradients first to enable AI Analysis";

    const buttonGroup = document.querySelector('.button-group');
    const aiButtonHint = document.createElement('div');
    aiButtonHint.id = 'aiButtonHint';
    aiButtonHint.textContent = "Process gradients to enable AI Analysis";
    aiButtonHint.style.display = "block";
    buttonGroup.insertAdjacentElement('afterend', aiButtonHint);

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

        if (i % 4 === 2 || i % 4 === 3) {
            slider.classList.add('slider-rtl');
        }

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
            indicateChartNeedsUpdate();
        });
    }

    gradients.forEach(gradient => {
        const definitionP = document.createElement('p');
        definitionP.innerHTML = `<strong>${gradient.label}:</strong> ${gradient.def}`;
        gradientDefinitions.appendChild(definitionP);
    });

    viewDirections.addEventListener('click', function() {
        directionsPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function() {
        directionsPopup.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == directionsPopup) {
            directionsPopup.style.display = 'none';
        }
    });

    updateChartButton.addEventListener('click', function() {
        if (validateInputs()) {
            updateChart();
            chartProcessed = true;
            analyzeScenarioButton.disabled = false;
            analyzeScenarioButton.title = "Analyze the current scenario";
            aiButtonHint.style.display = "none";
        }
    });

    analyzeScenarioButton.addEventListener('click', function() {
        if (chartProcessed) {
            analyzeScenario();
        }
    });

    exportButton.addEventListener('click', showExportOptions);

    resetButton.addEventListener('click', resetSliders);

    advancedHeader.addEventListener('click', function() {
        advancedContent.style.display = advancedContent.style.display === 'none' ? 'block' : 'none';
        this.classList.toggle('open');
    });

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
        return document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    }

    function updateChartColors() {
        if (chart) {
            chart.options.scales.r.grid.color = getGridColor();
            chart.options.scales.r.ticks.color = getTextColor();
            chart.options.scales.r.pointLabels.color = getTextColor();
            chart.options.plugins.title.color = getTextColor();
            chart.update();
        }
    }

    function updateChart() {
        const changeTitle = changeTitleInput.value || 'Untitled Change';

        const data = {
            labels: chartLabels,
            datasets: [{
                label: changeTitle,
                data: tempValues.flatMap(v => [100 - v, v]),
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
                                    size: window.innerWidth < 768 ? 10 : 12
                                },
                                showLabelBackdrop: false
                            },
                            pointLabels: {
                                font: {
                                    family: "'Poppins', sans-serif",
                                    size: window.innerWidth < 768 ? 12 : 14
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

        updateAnalysisSummary();
        chartProcessed = true;
        updateChartButton.classList.remove('needs-update');
        analyzeScenarioButton.disabled = false;
    }

    function updateAnalysisSummary() {
        const changeTitle = changeTitleInput.value || 'Untitled Change';
        const summary = document.getElementById('analysisSummary');
        summary.innerHTML = `<h3>Gradient Values for "${changeTitle}"</h3>`;
        gradientValuesLabels.forEach((label, index) => {
            const value = index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)];
            summary.innerHTML += `
                <div class="summary-item">
                    <p><strong>${label}:</strong> ${value}%</p>
                </div>
            `;
        });
    }

    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        updateChartColors();
        if (chartProcessed) {
            updateChart();
        }
    });

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

        document.addEventListener('click', (e) => {
            if (!exportOptions.contains(e.target) && e.target !== exportButton) {
                document.body.removeChild(exportOptions);
            }
        });
    }

    function exportResults(format) {
        const changeTitle = changeTitleInput.value || 'Untitled Change';

        if (format === 'csv') {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += `Change Title: ${changeTitle}\n\n`;
            csvContent += "Gradient,Value\n";
            gradientValuesLabels.forEach((label, index) => {
                const value = index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)];
                csvContent += `"${label}",${value}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            downloadFile(encodedUri, `${changeTitle}_analysis.csv`);
        } else if (format === 'json') {
            const jsonContent = {
                changeTitle,
                results: gradientValuesLabels.map((label, index) => ({
                    gradient: label,
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

    function createLineChart(aiBaseline, userValues) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        
        if (window.lineChart instanceof Chart) {
            window.lineChart.destroy();
        }

        const labels = gradientValuesLabels.map(label => label.split(' (')[0]);
        const aiData = aiBaseline;
        const userData = userValues;

        console.log("Chart Labels:", labels);
        console.log("AI Baseline Data:", aiData);
        console.log("User Data:", userData);

        window.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'AI Baseline',
                        data: aiData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    },
                    {
                        label: 'User',
                        data: userData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90,
                            font: {
                                size: 8
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'AI Baseline vs User Values',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return gradientValuesLabels[context[0].dataIndex];
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return `${datasetLabel}: ${value}%`;
                            }
                        }
                    },
                    legend: {
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    function getAdvancedOptions() {
        const description = changeDescriptionInput.value.trim();
        let knowledge = '';
        let timeline = '';

        for (const radio of knowledgeRadios) {
            if (radio.checked) {
                knowledge = radio.value;
                break;
            }
        }

        for (const radio of timelineRadios) {
            if (radio.checked) {
                timeline = radio.value;
                break;
            }
        }

        return { description, knowledge, timeline };
    }

    function validateInputs() {
        if (!changeTitleInput.value.trim()) {
            showPopup('Please enter a title for the change.');
            return false;
        }
        return true;
    }

    function analyzeScenario() {
        if (!validateInputs()) return;

        if (!chartProcessed) {
            showPopup('Please process gradients first.');
            return;
        }

        const changeTitle = changeTitleInput.value.trim();
        const gradientValues = gradients.map((gradient, index) => ({
            gradient: gradient.label,
            value: index % 2 === 0 ? 100 - tempValues[index/2] : tempValues[Math.floor(index/2)]
        }));

        const advancedOptions = getAdvancedOptions();

        const aiAnalysisResult = document.getElementById('aiAnalysisResult');
        aiAnalysisResult.innerHTML = `
            <div class="loading-message">
                <p><span class="loading-spinner"></span>Generating AI analysis… Please wait.</p>
            </div>`;

        scrollToAIAnalysis();

        fetch('/analyze_scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                changeTitle: changeTitle,
                gradientValues: gradientValues,
                description: advancedOptions.description,
                knowledge: advancedOptions.knowledge,
                timeline: advancedOptions.timeline
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                aiAnalysisResult.innerHTML = `<p class="error-message">Error: ${data.error}</p>`;
            } else {
                console.log("Full AI Analysis Text:", data.analysis);

                aiAnalysisResult.innerHTML = `
                    <h4>AI Analysis for "${changeTitle}"</h4>
                    <br>
                    <div class="analysis-content">${data.analysis.replace(/\n/g, '<br>')}</div>
                    <canvas id="lineChart" style="width:100%;height:400px;"></canvas>
                `;

                const aiBaselineMatch = data.analysis.match(/BASELINE ANALYSIS:([\s\S]*?)(?:OVERALL SUMMARY|$)/);
                let aiBaselineValues = [];
                if (aiBaselineMatch) {
                    const baselineText = aiBaselineMatch[1];
                    console.log("Extracted Baseline Text:", baselineText);

                    aiBaselineValues = gradientValuesLabels.map(label => {
                        const gradientName = label.split(' (')[0];
                        const regexPattern = new RegExp(`${gradientName}:\\s*(\\d+)`, 'i');
                        const match = baselineText.match(regexPattern);
                        const value = match ? parseInt(match[1]) : 0;
                        console.log(`Matched Gradient: ${gradientName}, Value: ${value}`);
                        return value;
                    });
                }

                console.log("Final AI Baseline Values:", aiBaselineValues);
                console.log("User Values:", gradientValues.map(g => g.value));

                createLineChart(aiBaselineValues, gradientValues.map(g => g.value));
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            aiAnalysisResult.innerHTML = '<p class="error-message">An error occurred while analyzing the scenario. Please try again.</p>';
        });
    }

    function scrollToAIAnalysis() {
        const aiAnalysisElement = document.querySelector('.ai-analysis-card');
        if (aiAnalysisElement) {
            aiAnalysisElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function resetSliders() {
        document.querySelectorAll('.slider').forEach(slider => {
            slider.value = 50;
            updatePercentages(slider);
        });
        tempValues = Array(gradients.length / 2).fill(50);
        if (chart) {
            chart.data.datasets[0].data = tempValues.flatMap(v => [100 - v, v]);
            chart.update();
        }
        updateAnalysisSummary();
        document.getElementById('aiAnalysisResult').innerHTML = '';
        document.getElementById('lineChart').style.display = 'none';
        chartProcessed = false;
        analyzeScenarioButton.disabled = true;
        analyzeScenarioButton.title = "Process gradients first to enable AI Analysis";
        aiButtonHint.style.display = "block";
        indicateChartNeedsUpdate();
    }

    function indicateChartNeedsUpdate() {
        updateChartButton.classList.add('needs-update');
        chartProcessed = false;
        analyzeScenarioButton.disabled = true;
        aiButtonHint.style.display = "block";
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <p>${message}</p>
                <button class="close-popup-btn">OK</button>
            </div>
        `;
        document.body.appendChild(popup);

        const closeBtn = popup.querySelector('.close-popup-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }

    window.addEventListener('resize', () => {
        if (chart) {
            chart.options.scales.r.ticks.font.size = window.innerWidth < 768 ? 10 : 12;
            chart.options.scales.r.pointLabels.font.size = window.innerWidth < 768 ? 12 : 14;
            chart.options.plugins.title.font.size = window.innerWidth < 768 ? 18 : 20;
            chart.update();
        }
    });

    updateChart();
});