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
            console.log("User authenticated. Loading visualizations...");
            loadVisualizations();
            loadTableauDashboard();
            
            // Add resize listener only after authentication
            window.addEventListener("resize", resizeTableauIframe);
        } else {
            console.warn("Authentication failed:", data.message);
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

            var sheetPlant5 = workbook.Sheets["Plant5"];
            var jsonDataPlant5 = XLSX.utils.sheet_to_json(sheetPlant5, { header: 1 });

            var sheetPlant6 = workbook.Sheets["Plant6"];
            var jsonDataPlant6 = XLSX.utils.sheet_to_json(sheetPlant6, { header: 1 });

            // REMOVE rows 24, 26, and 27 
            jsonDataPlant5 = jsonDataPlant5.filter((row, index) => ![23, 25, 26].includes(index));
            jsonDataPlant6 = jsonDataPlant6.filter((row, index) => ![23, 25, 26].includes(index));

            var sourceKeysPlant5 = jsonDataPlant5.slice(1).map(row => row[0]);  
            var dcPowerPlant5 = jsonDataPlant5.slice(1).map(row => row[1]);    
            var acPowerPlant5 = jsonDataPlant5.slice(1).map(row => row[2]);    

            var sourceKeysPlant6 = jsonDataPlant6.slice(1).map(row => row[0]);  
            var dcPowerPlant6 = jsonDataPlant6.slice(1).map(row => row[1]);    
            var acPowerPlant6 = jsonDataPlant6.slice(1).map(row => row[2]);    

            var traceDCPlant5 = { x: sourceKeysPlant5, y: dcPowerPlant5, type: 'bar', name: 'DC Power', marker: { color: '#1f77b4' } };
            var traceACPlant5 = { x: sourceKeysPlant5, y: acPowerPlant5, type: 'bar', name: 'AC Power', marker: { color: '#ff7f0e' } };

            var traceDCPlant6 = { x: sourceKeysPlant6, y: dcPowerPlant6, type: 'bar', name: 'DC Power', marker: { color: '#2ca02c' } };
            var traceACPlant6 = { x: sourceKeysPlant6, y: acPowerPlant6, type: 'bar', name: 'AC Power', marker: { color: '#d62728' } };

            var layoutPlant5 = {
                xaxis: { title: 'Source Key', tickangle: 25, tickfont: { size: 10 } },
                yaxis: { title: 'Power (W)' },
                barmode: 'group',
                autosize: true,
                responsive: true,
                margin: { l: 50, r: 30, t: 80, b: 150 },
                legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.2 },
            };

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

            // window resize event listener to ensure responsiveness
            window.addEventListener("resize", () => {
                Plotly.Plots.resize("chart-plant5");
                Plotly.Plots.resize("chart-plant6");
            });
        })
        .catch(error => console.error("Error loading Excel data:", error));
}

//Load Tableau 
function loadTableauDashboard() {
    var iframe = document.getElementById("tableauFrame");
    var tableauURL = "https://public.tableau.com/views/Visuals1_17410175283500/Dashboard2?:embed=yes&:showVizHome=no&:tabs=no&:toolbar=yes";

    if (!iframe) {
        console.error("Tableau iframe not found.");
        return;
    }

    console.log("Loading Tableau...");
    iframe.src = tableauURL;
}

// Function to resize Tableau iframe dynamically
function resizeTableauIframe() {
    var iframe = document.getElementById("tableauFrame");
    if (iframe) {
        iframe.style.height = window.innerHeight * 0.75 + "px";
    }
}


