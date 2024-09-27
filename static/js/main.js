document.addEventListener('DOMContentLoaded', function() {
    const gradients = [
        { label: 'EN(P1)', def: 'Change that originates from within the system or entity, driven by internal factors such as organizational policies, personal motivations, or inherent dynamics.' },
        { label: 'EX(P2)', def: 'Change that originates from outside the system or entity, influenced by external forces such as market trends, regulations, or environmental factors.' },
        { label: 'ST(P3)', def: 'Incremental change that maintains the core structure or identity, resulting in a state that remains recognizable over time.' },
        { label: 'TR(P4)', def: 'Significant and fundamental change that alters the system or entity in a way that it becomes completely new or unrecognizable.' },
        { label: 'TX(P5)', def: 'A one-time event or action that is implemented and concluded quickly, with immediate effects.' },
        { label: 'CN(P6)', def: 'An ongoing process of change that evolves over time, requiring sustained effort and adaptation.' },
        { label: 'IN(P7)', def: 'Change initiated by a single person or a small group, often characterized by leadership or heroic efforts that drive the transformation.' },
        { label: 'CO(P8)', def: 'Change that emerges from the collective action of a larger group or society, involving widespread participation and consensus.' },
        { label: 'PA(P9)', def: 'Change achieved through peaceful and non-confrontational means, such as dialogue, negotiation, or gradual reforms.' },
        { label: 'VI(P10)', def: 'Change that occurs through conflict, force, or aggressive actions, often involving revolutions, wars, or significant upheaval.' },
        { label: 'TD(P11)', def: 'Change initiated by those in positions of authority or leadership, typically through directives, policies, or executive orders.' },
        { label: 'BU(P12)', def: 'Change that starts at the grassroots level, driven by individuals or groups at the lower levels of an organization or society.' },
        { label: 'DO(P13)', def: 'Change led by a single entity or group exerting control, often characterized by a hierarchical or authoritative approach.' },
        { label: 'PT(P14)', def: 'Change that is driven by collaborative efforts and shared decision-making, emphasizing equality and mutual support among participants.' },
        { label: 'TN(P15)', def: 'Change that follows current patterns or fads, often temporary and reactive to the present environment.' },
        { label: 'VI(P16)', def: 'Change guided by a long-term strategic outlook, aiming for transformative outcomes that may reshape the future.' },
        { label: 'AC(P17)', def: 'Change that results from unforeseen events or mistakes, leading to unexpected outcomes or innovations.' },
        { label: 'DE(P18)', def: 'Change that is carefully planned and executed, based on extensive research, strategy, and intentional actions.' }
    ];

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
                                    size: window.innerWidth < 768 ? 10 : 12
                                },
                                showLabelBackdrop: false
                            },
                            pointLabels: {
                                font: {
                                    size: window.innerWidth < 768 ? 10 : 12
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
                                size: window.innerWidth < 768 ? 16 : 18
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
    }
});