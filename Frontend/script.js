const BACKEND_URL = "https://url-shortener-uvqs.onrender.com";
const resultBox = document.getElementById("result");

async function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value.trim();

    if (!longUrl) {
        resultBox.style.display = "block";
        resultBox.innerHTML = "Please enter a valid URL.";
        return;
    }

    resultBox.style.display = "none";

    try {
        const response = await fetch(`${BACKEND_URL}/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: longUrl })
        });

        const data = await response.json();
        const shortUrl = BACKEND_URL + data.short_url;

        resultBox.innerHTML = `
            <a href="${shortUrl}" target="_blank">${shortUrl}</a>
            <button onclick="copyUrl('${shortUrl}', this)">Copy</button>
        `;
        resultBox.style.display = "block";

    } catch (error) {
        resultBox.style.display = "block";
        resultBox.innerHTML = "Something went wrong. Please try again.";
    }
}

function copyUrl(url, btn) {
    navigator.clipboard.writeText(url);
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Copy", 2000);
}
