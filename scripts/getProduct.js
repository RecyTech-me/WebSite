const ck = "ck_c5a1e8445362be842b3e4d766c3fc609d1ae6f44";
const cs = "cs_1fa42e36c953954ed8db9ef366640cd93635ecf0";
const api_url = "https://shop.recytech.me/wp-json/wc/v3/products";

async function getProducts() {
    try {
        const auth = btoa(ck + ":" + cs);
        const response = await fetch(api_url, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + auth
            }
        });

        if (!response.ok) {
            throw new Error("Erreur HTTP: " + response.status);
        } else {
            const products = await response.json();

            // Filtrer ceux en stock
            const inStock = products.filter(p => p.stock_status === "instock");

            // Date de creation du plus recent au plus ancien
            const sorted = inStock.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

            // Garder seulement les 4 premiers
            const selected = sorted.slice(0, 4);

            // Extraire uniquement les champs utile
            const result = selected.map(p => ({
                name: p.name,
                price: p.price,
                link: p.permalink,
                image: p.images.length ? p.images[0].src : null
            }));

            ChangeProduct(result);
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
}
getProducts();

const titles = document.querySelectorAll(".product-title");
const pricesTxt = document.querySelectorAll(".product-starting-price");
const btns = document.querySelectorAll(".product-button");
const productCards = document.querySelectorAll(".product");

function ChangeProduct(products) {
    products.forEach((p, i) => {
        if (p){
            titles[i].textContent = p.name;
            pricesTxt[i].textContent = `À partir de ${p.price} CHF`;
            btns[i].onclick = () => window.location.href = p.link;
            productCards[i].style.backgroundImage = `url('${p.image}')`;
        };
    });
}