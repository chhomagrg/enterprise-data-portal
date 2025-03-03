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
            // User is authenticated, proceed with loading the visualizations
            loadVisualizations();
            loadTableauDashboard();
        } else {
            alert(data.message || "Authentication failed. Redirecting...");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching authentication data.");
        window.location.href = "index.html";
    }
});

// Function to load and render Plotly visualizations
function loadVisualizations() {
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

            // Extract values for Plant 5
            var sourceKeysPlant5 = jsonDataPlant5.slice(1).map(row => row[0]);  
            var dcPowerPlant5 = jsonDataPlant5.slice(1).map(row => row[1]);    
            var acPowerPlant5 = jsonDataPlant5.slice(1).map(row => row[2]);    

            // Extract values for Plant 6
            var sourceKeysPlant6 = jsonDataPlant6.slice(1).map(row => row[0]);  
            var dcPowerPlant6 = jsonDataPlant6.slice(1).map(row => row[1]);    
            var acPowerPlant6 = jsonDataPlant6.slice(1).map(row => row[2]);    

            // Define traces for Plant 5
            var traceDCPlant5 = { x: sourceKeysPlant5, y: dcPowerPlant5, type: 'bar', name: 'DC Power', marker: { color: '#1f77b4' } };
            var traceACPlant5 = { x: sourceKeysPlant5, y: acPowerPlant5, type: 'bar', name: 'AC Power', marker: { color: '#ff7f0e' } };

            // Define traces for Plant 6
            var traceDCPlant6 = { x: sourceKeysPlant6, y: dcPowerPlant6, type: 'bar', name: 'DC Power', marker: { color: '#2ca02c' } };
            var traceACPlant6 = { x: sourceKeysPlant6, y: acPowerPlant6, type: 'bar', name: 'AC Power', marker: { color: '#d62728' } };

            // Define layout for Plant 5
            var layoutPlant5 = {
                xaxis: { title: 'Source Key', tickangle: 25, tickfont: { size: 10 } },
                yaxis: { title: 'Power (W)' },
                barmode: 'group',
                autosize: true,
                responsive: true,
                margin: { l: 50, r: 30, t: 80, b: 150 },
                legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.2 },
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
            };

            // Plot the charts
            Plotly.newPlot('chart-plant5', [traceDCPlant5, traceACPlant5], layoutPlant5);
            Plotly.newPlot('chart-plant6', [traceDCPlant6, traceACPlant6], layoutPlant6);
        })
        .catch(error => console.error("Error loading Excel data:", error));
}

// Function to load Tableau dashboard only if the user is authenticated
function loadTableauDashboard() {
    var divElement = document.getElementById('vizContainer');
    if (!divElement) {
        console.error("Tableau container not found.");
        return;
    }

    var vizElement = divElement.getElementsByTagName('object')[0];

    // Resize the Tableau visualization dynamically
    function resizeViz() {
        let width = divElement.offsetWidth;

        if (width > 800) { 
            vizElement.style.width = "100%";
            vizElement.style.height = (width * 0.75) + "px";
        } else if (width > 500) { 
            vizElement.style.width = "100%";
            vizElement.style.height = (width * 0.75) + "px";
        } else { 
            vizElement.style.width = "100%";
            vizElement.style.height = (width * 1.77) + "px";
        }
    }

    window.addEventListener("resize", resizeViz);
    resizeViz(); // Call function on load

    // Load the Tableau script dynamically
    var scriptElement = document.createElement("script");
    scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
}
