
// window.addEventListener('scroll', function () {
//     const scrollPosition = window.scrollY;
//     const parallax = document.querySelector('#parallaxContainer::before');
//     parallax.style.transform = `translateY(${scrollPosition * 0.6}px)`;
// });


//save the data
function saveData(coins) {
    const json = JSON.stringify(coins);
    localStorage.setItem("data", json);

}

//Clean Ui
function cleenUI() {
    const inputTextBox = document.getElementById("inputTextBox");
    inputTextBox.value = "";
    console.log("cleen Ui..")
}



//serching coin...fron imput text and click button...
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {
    const coinfinder = document.getElementById("coinfinder");
    const inputTextBox = document.getElementById("inputTextBox");
    const dataSearch = inputTextBox.value.trim().toLowerCase();
    const divContainer = document.getElementById("divContainer");
    const divAboute = document.getElementById("divAboute");
    const liveReportSection = document.getElementById("liveReportSection");


    console.log('click on Search btn')
    console.log('Search:' + dataSearch)

    divContainer.style.display = "none";
    divAboute.style.display = "none";
    liveReportSection.style.display = "none";

    coinfinder.style.display = "block";
    coinfinder.innerHTML = "";

    const json = localStorage.getItem("data");
    if (json) {
        const data = JSON.parse(json);
        coinfinder.innerHTML = "";
        let found = false;

        for (const id in data) {
            if (data[id]) {
                const coinData = data[id];
                const coinName = coinData.name.toLowerCase();


                if (coinName.includes(dataSearch)) {
                    console.log("Search...")

                    const newCoinDiv = document.createElement("div");
                    newCoinDiv.classList.add("coin-item");

                    newCoinDiv.innerHTML = `
                    <h3>${coinData.name}</h3> 
                    <img src="${coinData.image}" alt="${coinData.name} logo" width="50">
                    <p>Price: ${coinData.current_price} USD</p> 
                    `

                    coinfinder.appendChild(newCoinDiv);
                    found = true;
                }
            }
        }
        if (!found) {
            coinfinder.innerHTML = "<p>No coins found..</p>"
        }
    } else {
        console.log("No data found in localStorage.");
        coinfinder.innerHTML = "<p>No coins found..</p>"
    }


});

document.getElementById("homeButton").addEventListener("click", function () {
    location.reload();
});



async function showCoins() {
    try {
        console.log("Refresh the web...")
        const coins = await getCoinsFromWeb();
        cleenUI();
        saveData(coins)
        displayCoins(coins);




    } catch (err) {
        console.error("Error fetching or displaying coins:", err);
        alert("An error occurred: " + err.message);
    }
}

//Api get data coins (100) from web 
async function getCoinsFromWeb() {
    const apiKey = "";
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
    try {
        const response = await axios.get(url);
        const coins = response.data;
        return coins;
    } catch (error) {
        alert('read from local data')
        loadFromData();
    }
}






// show the coins 
function displayCoins(coins) {
    const divContainer = document.getElementById("divContainer");
    divContainer.innerHTML = "";

    if (!coins || !Array.isArray(coins)) {
        divContainer.innerHTML = "<p>No coins found or invalid data.</p>";
        return;
    }

    coins.forEach(coin => {
        const coinDiv = document.createElement("div");
        coinDiv.classList.add("coinCard");

        coinDiv.innerHTML = `
            
            <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
            <img src="${coin.image}" alt="${coin.name} logo" width="50">
            <p>Price: ${coin.current_price} USD</p>
            <label class="toggle-container">
                <input type="checkbox" class="coinToggle" data-id="${coin.id}" data-name="${coin.name}">
                <span class="slider"></span>
            </label>
            <button class="moreInfoBtn" id="btn-${coin.id}">More Info</button>
        `;

        coinDiv.querySelector(".coinToggle").addEventListener("change", (event) => {
            handleToggle(event, coin.id, coin.name);
        });
        coinDiv.querySelector('.moreInfoBtn').addEventListener('click', () => {
            showMoreInfo(coin.id);
        });

        divContainer.appendChild(coinDiv);
    });
}

// select max 5 coins 
function handleToggle(event, coinId, coinName) {
    if (event.target.checked) {
        if (selectedCoins.length >= 5) {
            alert("You can only select up to 5 coins.");
            event.target.checked = false; // Prevent selection
        } else {
            selectedCoins.push({ id: coinId, name: coinName });
        }
    } else {
        selectedCoins = selectedCoins.filter(coin => coin.id !== coinId);
    }

    console.log("Selected Coins:", selectedCoins);
}


// show moe infoe about coins
async function showMoreInfo(coinId) {
    try {
        console.log("Fetching info for coin:", coinId); // Debug log
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        const response = await axios.get(url);
        const coinDetails = response.data;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
           <div class="modalContent">
                <span class="closeButton">&times;</span>  
                <h2>${coinDetails.name}</h2>
                <p>${coinDetails.description?.en || "No description available"}</p>
                <p>Market Cap: $${coinDetails.market_data.market_cap.usd.toLocaleString()}</p>
                <p>24h High: $${coinDetails.market_data.high_24h.usd.toLocaleString()}</p>
                <p>24h Low: $${coinDetails.market_data.low_24h.usd.toLocaleString()}</p>
                <p>Circulating Supply: ${coinDetails.market_data.circulating_supply.toLocaleString()}</p>
                <p>Total Supply: ${coinDetails.market_data.total_supply?.toLocaleString() || "N/A"}</p>
            
              
                        `;

        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.closeButton');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

    } catch (error) {
        console.error("Error fetching coin details:", error);
        alert("Error fetching details for this coin.");
    }
}





let selectedCoins = [];  // Array to track selected coins

function handleToggle(event, coinId, coinName) {
    if (event.target.checked) {

        if (selectedCoins.length >= 5) {

            showSwitchModal(coinId, coinName, event.target);


        } else {
            selectedCoins.push({ id: coinId, name: coinName });
        }
    } else {
        // Remove the coin from the selectedCoins array if unchecked
        selectedCoins = selectedCoins.filter(coin => coin.id !== coinId);
    }

    console.log("Selected Coins:", selectedCoins);  // Log selected coins
}

function showSwitchModal(newCoinId, newCoinName, checkbox) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modalContent">
            <p>You have already selected 5 coins. Do you want to replace one?</p>
            <div id="selectedCoinsList"></div>
            <button id="cancelSwitch">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    const selectedCoinsList = modal.querySelector("#selectedCoinsList");
    selectedCoins.forEach(coin => {
        const coinOption = document.createElement("div");
        coinOption.innerHTML = `
            <span>${coin.name}</span>
            <button class="switchCoin" data-id="${coin.id}">Switch</button>
        `;
        console.log()
        selectedCoinsList.appendChild(coinOption);
    });

    modal.querySelector("#cancelSwitch").addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    modal.querySelectorAll(".switchCoin").forEach(button => {
        button.addEventListener("click", (e) => {
            const oldCoinId = e.target.dataset.id;
            selectedCoins = selectedCoins.filter(coin => coin.id !== oldCoinId);
            selectedCoins.push({ id: newCoinId, name: newCoinName });

            const oldCheckbox = document.querySelector(`input[data-id='${oldCoinId}']`);
            if (oldCheckbox) {
                oldCheckbox.checked = false;
            }

            checkbox.checked = true;

            document.body.removeChild(modal);
            console.log("Selected Coins:", selectedCoins);
        });
    });
}









// Call showCoins when the page loads
window.addEventListener('DOMContentLoaded', showCoins);
