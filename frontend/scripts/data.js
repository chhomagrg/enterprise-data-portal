
document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Access Denied! Please log in.");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/data/protected-data", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (response.ok) {
            displayData(data);
        } else {
            alert(data.message || "Failed to fetch data.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data.");
    }
});


fetch("./data/maxx_energy_data.xlsx")
    .then(response => response.arrayBuffer())
    .then(data => {
        var workbook = XLSX.read(data, { type: 'array' });

        // Load data for Plant 5
        var sheetPlant5 = workbook.Sheets["Plant5"];
        var jsonDataPlant5 = XLSX.utils.sheet_to_json(sheetPlant5, { header: 1 });

        // Load data for Plant 6
        var sheetPlant6 = workbook.Sheets["Plant6"];
        var jsonDataPlant6 = XLSX.utils.sheet_to_json(sheetPlant6, { header: 1 });

        console.log("Plant 5 Data:", jsonDataPlant5);
        console.log("Plant 6 Data:", jsonDataPlant6);

        // Extract values for Plant 5
        var headersPlant5 = jsonDataPlant5[0];
        var valuesPlant5 = jsonDataPlant5.slice(1);

        var sourceKeysPlant5 = valuesPlant5.map(row => row[0]);  
        var dcPowerPlant5 = valuesPlant5.map(row => row[1]);    
        var acPowerPlant5 = valuesPlant5.map(row => row[2]);    

        // Extract values for Plant 6
        var headersPlant6 = jsonDataPlant6[0];
        var valuesPlant6 = jsonDataPlant6.slice(1);

        var sourceKeysPlant6 = valuesPlant6.map(row => row[0]);  
        var dcPowerPlant6 = valuesPlant6.map(row => row[1]);    
        var acPowerPlant6 = valuesPlant6.map(row => row[2]);    

        // Define traces for Plant 5
        var traceDCPlant5 = {
            x: sourceKeysPlant5,
            y: dcPowerPlant5,
            type: 'bar',
            name: 'DC Power',
            marker: { color: '#1f77b4' }
        };

        var traceACPlant5 = {
            x: sourceKeysPlant5,
            y: acPowerPlant5,
            type: 'bar',
            name: 'AC Power',
            marker: { color: '#ff7f0e' }
        };

        // Define traces for Plant 6
        var traceDCPlant6 = {
            x: sourceKeysPlant6,
            y: dcPowerPlant6,
            type: 'bar',
            name: 'DC Power',
            marker: { color: '#2ca02c' }
        };

        var traceACPlant6 = {
            x: sourceKeysPlant6,
            y: acPowerPlant6,
            type: 'bar',
            name: 'AC Power',
            marker: { color: '#d62728' }
        };

        // Define the Grand Total values for Plant 5 & Plant 6
var grandTotalPlant5DC = 3147.426211;
var grandTotalPlant5AC = 307.8027523;

var grandTotalPlant6DC = 246.70196088761864;
var grandTotalPlant6AC = 241.27782520062243;

// Define layout for Plant 5
var layoutPlant5 = {
    xaxis: { title: 'Source Key', tickangle: 25, tickfont: { size: 10 } },
    yaxis: { title: 'Power (W)' },
    barmode: 'group',
    autosize: true,
    responsive: true,
    margin: { l: 50, r: 30, t: 80, b: 150 },
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.2 },

    // Annotation for Grand Total (Top Left)
    annotations: [{
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1.25,
        text: `<b>Grand Total:</b> <br> DC: ${grandTotalPlant5DC.toFixed(2)} <br> AC: ${grandTotalPlant5AC.toFixed(2)}`,
        showarrow: false,
        font: { size: 16, color: "#333" },
        align: "left",
        bgcolor: "#AEC6CF",
        bordercolor: "#ccc",
        borderwidth: 1,
        borderpad: 5,
    }]
};

// Define layout for Plant 6 
var layoutPlant6 = {
    xaxis: { title: 'Source Key', tickangle: 25, tickfont: { size: 10 } },
    yaxis: { title: 'Power (W)' },
    barmode: 'group',
    autosize: true,
    responsive: true,
    margin: { l: 50, r: 30, t: 80, b: 150 },
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.2 },

    // Annotation for Grand Total in Plant 6
    annotations: [{
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1.25,
        text: `<b>Grand Total:</b> <br> DC: ${grandTotalPlant6DC.toFixed(2)} <br> AC: ${grandTotalPlant6AC.toFixed(2)}`,
        showarrow: false,
        font: { size: 16, color: "#333" },
        align: "left",
        bgcolor: "#AEC6CF",
        bordercolor: "#ccc",
        borderwidth: 1,
        borderpad: 5,
    }]
};

// Plot the charts
Plotly.newPlot('chart-plant5', [traceDCPlant5, traceACPlant5], layoutPlant5);
Plotly.newPlot('chart-plant6', [traceDCPlant6, traceACPlant6], layoutPlant6);

        
    })
    .catch(error => {
        console.error("Error fetching the Excel file:", error);
    });
