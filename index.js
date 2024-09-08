const express = require("express")
const puppeteer = require("puppeteer")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
// port 5000

app.use(cors())

app.get("/api/ranking", async (req, res) => {
    try {
        const browser = await puppeteer.launch()
        let page = await browser.newPage()
        await page.goto("https://www.fundsexplorer.com.br/ranking", {waitUntil: "networkidle2"})

        const funds = await page.evaluate(() => {
            const data = []
            const rows = document.querySelectorAll("tbody.default-fiis-table__container__table__body tr")

            rows.forEach((row) => {
                const fundName = row.querySelector('td[data-collum="collum-post_title"] a')?.textContent.trim() || "N/A"
                const currentPrice = row.querySelector('td[data-collum="collum-valor"]')?.textContent.trim() || "N/A"
                const dividendYield = row.querySelector('td[data-collum="collum-yeld"]')?.textContent.trim() || "N/A"
                const priceChange = row.querySelector('td[data-collum="collum-variacao_cotacao_mes"]')?.textContent.trim() || "N/A"

                if (currentPrice !== "N/A") {
                    data.push({fundName, currentPrice, dividendYield, priceChange})
                }
            })

            return data
        })

        await browser.close()
        res.json(funds)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

app.get("/api/ranking/:name", async (req, res) => {
    try {
        const {name} = req.params
        const browser = await puppeteer.launch()
        let page = await browser.newPage()
        await page.goto("https://www.fundsexplorer.com.br/ranking", {waitUntil: "networkidle2"})

        const funds = await page.evaluate(() => {
            const data = []
            const rows = document.querySelectorAll("tbody.default-fiis-table__container__table__body tr")

            rows.forEach((row) => {
                const fundName = row.querySelector('td[data-collum="collum-post_title"] a')?.textContent.trim() || "N/A"
                const currentPrice = row.querySelector('td[data-collum="collum-valor"]')?.textContent.trim() || "N/A"
                const dividendYield = row.querySelector('td[data-collum="collum-yeld"]')?.textContent.trim() || "N/A"
                const priceChange = row.querySelector('td[data-collum="collum-variacao_cotacao_mes"]')?.textContent.trim() || "N/A"

                if (currentPrice !== "N/A") {
                    let newData = {fundName, currentPrice, dividendYield, priceChange}
                    data.push(newData)
                }
            })

            return data
        })

        await browser.close()
        res.json(funds.filter(({fundName})=> fundName == name.toUpperCase()))
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

app.listen(port, () => {
    console.log(`Backend server running on: ${port}`)
})
