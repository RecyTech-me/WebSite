const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");

const script = fs.readFileSync(path.join(__dirname, "../scripts/getProduct.js"), "utf8");

test("product descriptions are inert while extracting text, including image handlers", async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());
    const page = await browser.newPage();
    let hostileRequests = 0;
    await page.route("https://attacker.example/**", async (route) => {
        hostileRequests++;
        await route.abort();
    });
    await page.route("https://shop.recytech.me/api/products", (route) => route.fulfill({
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify([{
            name: '<img src=x onerror="window.auditXss=true">',
            short_description: '<img src="https://attacker.example/pixel" onerror="window.auditXss=true">Portable <b>testé</b>',
            images: [], price: "100", permalink: "https://shop.recytech.me/products/portable",
            stock_status: "instock", status: "publish",
        }]),
    }));
    await page.setContent('<div id="productsGrid"></div>');
    await page.addScriptTag({ content: script });
    await page.waitForSelector(".product-card");
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => window.auditXss), undefined);
    assert.equal(hostileRequests, 0, "Stripping HTML must not fetch embedded images");
    assert.equal(await page.locator(".product-info p").textContent(), "Portable testé");
    assert.equal(await page.locator(".product-info h3 img").count(), 0);
});

test("product links reject executable URLs and off-site destinations", async (t) => {
    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());
    const page = await browser.newPage();
    await page.setContent('<div id="productsGrid"></div>');
    await page.addScriptTag({ content: script.replace(/\ngetProducts\(\);\s*$/, "") });
    for (const value of ["javascript:alert(1)", "data:text/html,test", "//attacker.example/", "https://shop.recytech.me@attacker.example/", "https://attacker.example/"]) {
        const href = await page.evaluate((value) => {
            const template = document.createElement("template");
            template.innerHTML = getProductCardHtml("javascript:alert(1)", "Produit", "Texte", "10", value);
            return { href: template.content.querySelector("a").getAttribute("href"), images: template.content.querySelectorAll("img").length };
        }, value);
        assert.equal(href.href, "https://shop.recytech.me/");
        assert.equal(href.images, 0);
    }
});
