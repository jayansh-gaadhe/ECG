document.addEventListener('DOMContentLoaded', function () {
    const windowSize = 50; // Number of points to display on the graph
    let times = [];
    let values = [];

    // Function to fetch ECG data from server
    async function fetchData() {
        try {
            const response = await fetch('http://localhost:3000/ecg-data');
            const data = await response.json(); // Parse the JSON data from the server
            if (data.length > 0) {
                console.log('Data fetched:', data); // Debugging fetched data
                updateGraph(data); // Call the function to update the graph
            }
        } catch (error) {
            console.error('Error fetching ECG data:', error);
        }
    }

    // Function to update the graph dynamically
    function updateGraph(data) {
        // Add new data to the arrays
        data.forEach(d => {
            const time = new Date(d.timestamp * 1000).toLocaleTimeString(); // Convert timestamp to time
            times.push(time);
            values.push(d.value);
        });

        // Maintain the sliding window
        if (times.length > windowSize) {
            times = times.slice(-windowSize); // Keep only the last `windowSize` timestamps
            values = values.slice(-windowSize); // Keep only the last `windowSize` values
        }

        // Update the plot dynamically
        const update = {
            x: [times],
            y: [values]
        };

        const layout = {
            plot_bgcolor: '#000',
            paper_bgcolor: '#000',
            margin: { t: 10 },
            xaxis: {
                title: {
                    text: 'Time',
                    font: {
                        color: 'white'
                    }
                },
                tickcolor: 'white',
                tickfont: {
                    color: 'white'
                },
                gridcolor: '#333'
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

        // Render or update the graph
        Plotly.react('plot', [{
            x: times,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: 'lime',
                width: 2
            }
        }], layout);
    }

    // Periodically fetch new data every second
    setInterval(fetchData, 1000);
});
