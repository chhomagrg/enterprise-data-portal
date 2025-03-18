document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");
    const queryText = document.getElementById("queryText");
    const resultsContainer = document.getElementById("results");

    queryText.textContent = query;

    const dataItems = [
        "Solar Energy Trends",
        "Real-time Power Data",
        "Battery Storage Insights",
        "Renewable Energy Policies",
        "Global Energy Reports"
    ];

    const filteredResults = dataItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredResults.length > 0) {
        filteredResults.forEach(result => {
            const div = document.createElement("div");
            div.classList.add("result-item");
            div.textContent = result;
            resultsContainer.appendChild(div);
        });
    } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
    }
});
