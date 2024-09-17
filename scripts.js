let intervalId;
const fs = 500;
const duration = 1;
const updateInterval = 70;
const incrementStep = fs * updateInterval / 50000;
let start = 0;
let end = fs * duration;
let totalPoints;
let times, ecgValues;

document.getElementById('file-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csvData = event.target.result;
            processData(csvData);
        };
        reader.readAsText(file);
    }
});

function processData(csvData) {
    const data = d3.csvParse(csvData);
    totalPoints = data.length;

    times = data.map(d => +d.time);
    ecgValues = data.map(d => +d.ecg_value);

    document.getElementById('heart-rate').textContent = calculateHeartRate(ecgValues) + ' bpm';
    document.getElementById('spo2').textContent = calculateSpo2() + ' %';

    const trace = {
        x: times.slice(start, end),
        y: ecgValues.slice(start, end),
        type: 'scatter',
        mode: 'lines',
        name: 'ECG Data',
        line: {
            color: 'lime',
            width: 2
        }
    };

    const layout = {
        plot_bgcolor: '#000',
        paper_bgcolor: '#000',
        margin: { t: 10 },
        xaxis: {
            title: {
                text: 'Time (s)',
                font: {
                    color: 'white'
                }
            },
            tickcolor: 'white',
            tickfont: {
                color: 'white'
            },
            gridcolor: '#333',
            range: [0, duration]
        },
        yaxis: {
            title: {
                text: 'ECG Value',
                font: {
                    color: 'white'
                }
            },
            tickcolor: 'white',
            tickfont: {
                color: 'white'
            },
            gridcolor: '#333',
            nticks: 10
        }
    };

    Plotly.newPlot('plot', [trace], layout);
}

const toggleButton = document.getElementById('toggle');
toggleButton.addEventListener('click', function() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        toggleButton.textContent = 'Start';
    } else {
        intervalId = setInterval(updatePlot, updateInterval);
        toggleButton.textContent = 'Stop';
    }
});

document.getElementById('restart').addEventListener('click', function() {
    clearInterval(intervalId);
    intervalId = null;
    start = 0;
    end = fs * duration;
    Plotly.update('plot', {
        x: [times.slice(start, end)],
        y: [ecgValues.slice(start, end)]
    });
    toggleButton.textContent = 'Start';
});

function updatePlot() {
    start += incrementStep;
    end += incrementStep;

    if (end > totalPoints) {
        clearInterval(intervalId);
        intervalId = null;
        toggleButton.textContent = 'Start';
        return;
    }

    const update = {
        x: [times.slice(start, end)],
        y: [ecgValues.slice(start, end)],
        line: { shape: 'spline', smoothing: 0.3, color: "lime" }
    };

    Plotly.relayout('plot', {
        xaxis: { range: [times[start], times[end - 1]] }
    });

    Plotly.update('plot', update, {
        xaxis: {
            range: [times[start], times[end - 1]]
        },
        yaxis: {
            range: [Math.min(...ecgValues.slice(start, end)), Math.max(...ecgValues.slice(start, end))]
        }
    });
}

function calculateHeartRate(ecgValues) {
    return Math.floor(Math.random() * (100 - 60 + 1)) + 60; 
}

function calculateSpo2() {
   
    return Math.floor(Math.random() * (100 - 95 + 1)) + 95; 
}
