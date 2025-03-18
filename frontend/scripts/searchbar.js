document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        }
    }

    searchBtn.addEventListener("click", performSearch);

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });
});
