const ck = "ck_c5a1e8445362be842b3e4d766c3fc609d1ae6f44";
const cs = "cs_1fa42e36c953954ed8db9ef366640cd93635ecf0";
const apiUrl = "https://shop.recytech.me/wp-json/wc/v3/products";

const productCards = document.querySelectorAll(".product-card");
const titles = document.querySelectorAll(".product-info h3");
const pricesTxt = document.querySelectorAll(".product-price");
const btns = document.querySelectorAll(".product-info .btn");
const productImages = document.querySelectorAll(".product-img");

async function getProducts() {
    if (!productCards.length) {
        return;
    }

    try {
        const auth = btoa(`${ck}:${cs}`);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${auth}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const products = await response.json();

        const inStock = products.filter((p) => p.stock_status === "instock");
        const sorted = inStock.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        const selected = sorted.slice(0, 4);

        const result = selected.map((p) => ({
            name: p.name,
            price: p.price,
            link: p.permalink,
            image: p.images.length ? p.images[0].src : null
        }));

        updateProducts(result);
    } catch (error) {
        console.error("Erreur:", error);
    }
}

function updateProducts(products) {
    products.forEach((p, i) => {
        if (!p || !titles[i] || !pricesTxt[i] || !btns[i] || !productImages[i]) {
            return;
        }

        titles[i].textContent = p.name;
        pricesTxt[i].textContent = p.price ? `À partir de ${p.price} CHF` : "Prix sur demande";
        btns[i].href = p.link;

        if (p.image) {
            productImages[i].style.backgroundImage = `url('${p.image}')`;
            productImages[i].classList.add("has-image");
        }
    });
}

getProducts();
