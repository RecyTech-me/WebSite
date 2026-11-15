const shopBaseUrl = "https://shop.recytech.me";
const apiUrl = `${shopBaseUrl}/api/products`;

const productsGrid = document.getElementById("productsGrid");

const maxProducts = 4;

async function getProducts() {
    const products = await fetchProducts();
    const inStock = products.filter((p) => p.stock_status === "instock").filter((p) => p.status === "publish");

    const sorted = inStock.sort(() => Math.random() - 0.5);
    const selected = sorted.slice(0, maxProducts);

    const productsHtml = selected.map((p) => getProductCardHtml(
        p.images.length ? p.images[0].src : null,
        p.name,
        p.short_description,
        p.price,
        p.permalink
    )).join("");

    productsGrid.innerHTML = productsHtml;
}

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products: ", error);
        return [];
    }
}

function stripHtml(value) {
    const temp = document.createElement("template");
    temp.innerHTML = String(value || "");
    return (temp.content.textContent || "").trim();
}

function safeProductUrl(value, { shopOnly = false } = {}) {
    try {
        const url = new URL(String(value || ""), `${shopBaseUrl}/`);
        if (url.protocol !== "https:" || url.username || url.password) return "";
        if (shopOnly && url.origin !== shopBaseUrl) return "";
        return url.href;
    } catch {
        return "";
    }
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getProductCardHtml(imageUrl, name, description, price, link) {
    const safeName = escapeHtml(name);
    const safeDescription = escapeHtml(stripHtml(description));
    const safeLink = escapeHtml(safeProductUrl(link, { shopOnly: true }) || `${shopBaseUrl}/`);
    const safePrice = price ? `À partir de ${escapeHtml(price)} CHF` : "Prix sur demande";
    const image = safeProductUrl(imageUrl);
    const safeImage = image
        ? `<img src="${escapeHtml(image)}" alt="${safeName}" loading="lazy" referrerpolicy="no-referrer">`
        : "";

    return `
        <div class="product-card">
            <div class="product-img">${safeImage}</div>
            <div class="product-info">
                <h3>${safeName}</h3>
                <p>${safeDescription}</p>
                <div class="product-price">${safePrice}</div>
                <a href="${safeLink}" class="btn">Voir les détails</a>
            </div>
        </div>
    `;
}

getProducts();
