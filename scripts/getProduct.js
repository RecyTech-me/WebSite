const ck = "ck_c5a1e8445362be842b3e4d766c3fc609d1ae6f44";
const cs = "cs_1fa42e36c953954ed8db9ef366640cd93635ecf0";
const apiUrl = "https://shop.recytech.me/wp-json/wc/v3/products";

const productsGrid = document.getElementById("productsGrid");

const maxProducts = 4;

async function getProducts() {
    
        const products = await fetchProducts();
        const inStock = products.filter((p) => p.stock_status === "instock");
        const sorted = inStock.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
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
        const auth = btoa(`${ck}:${cs}`);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${auth}`
            }
        });

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


function getProductCardHtml(imageUrl, name, description, price, link) {
    return `
        <div class="product-card">
            <div class="product-img" style="background-image: url('${imageUrl}')"></div>
            <div class="product-info">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="product-price">${price ? `À partir de ${price} CHF` : "Prix sur demande"}</div>
                <a href="${link}" class="btn">Voir les détails</a>
            </div>
        </div>
    `;
}

getProducts();
