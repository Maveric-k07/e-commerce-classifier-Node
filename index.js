import express, { urlencoded } from 'express';
import { google } from 'googleapis';
import axios from 'axios';
import fetch from "node-fetch";
// import { load } from "cheerio";
const Ecommerce = ["shopify", "woo_commerce", "wordpress", "bigcommerce", "magento"]

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});


// let result = '';

// const getRawData = (URL) => {
//     return fetch(URL)
//         .then((response) => response.text())
//         .then((data) => {
//             return data;
//         });
// };

// const elementIfShopify = "#bd > table > tbody > tr > td.tech_main > p:nth-child(11) > a";
// const elementIfBigcommerce = "#bd > table > tbody > tr > td.tech_main > p:nth-child(22) > a";
// const elementIfMagnetoAndWoo = "#bd > table > tbody > tr > td.tech_main > p:nth-child(15) > a";
// const elementIfPageNotFound = '#bd > table > tbody > tr > td.tech_main > h1'
// const getCategory = async(URL, element) => {
//     const categoryRawData = await getRawData(URL);

//     // parsing the data
//     const $ = load(categoryRawData);
//     // const element = elementIfMagnetoAndWoo;

//     // const category = $(element);

//     // return category.text();

//     if ($(elementIfShopify).text().toLowerCase() === 'Shopify'.toLowerCase()) {
//         return "Shopify";
//     } else if ($(elementIfBigcommerce).text().toLowerCase() === 'Bigcommerce'.toLowerCase()) {
//         return "Bigcommerce";
//     } else if ($(elementIfMagnetoAndWoo).text().toLowerCase() === 'Magento'.toLowerCase() || $(elementIfMagnetoAndWoo).text().toLowerCase() === 'WooCommerce'.toLowerCase()) {
//         return $(elementIfMagnetoAndWoo).text();
//     } else {
//         return "Others"
//     }

// };



const getCategory = async(URL) => {
    let data = '{"url":  "' + URL + '"}';

    const options = {
        method: 'POST',
        url: 'https://klazify-iab-categorization.p.rapidapi.com/3rdparty/categorize',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '6e0dfd692dmshf01b4eb1a80062cp125399jsn5b1c598bdcf2',
            'X-RapidAPI-Host': 'klazify-iab-categorization.p.rapidapi.com'
        },
        data: data
    };

    const func = axios.request(options).then(function(response) {
        var found = false;
        var i, j;
        for (i = 0; i < Ecommerce.length; i++) {
            for (j = 0; j < response.data.objects.company.tech.length; j++) {
                if (Ecommerce[i] === response.data.objects.company.tech[j]) {
                    found = true
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        if (found) {
            return Ecommerce[i].toUpperCase();
        } else {
            return "OTHERS"
        }
    }).catch(function(error) {
        return "NOT WORKING";
    });
    return func;
};


app.post('/', async(req, res) => {

    const { sheetlink } = req.body;

    let capturedId = sheetlink.match(/\/d\/(.+)\//);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // create client instance
    const client = await auth.getClient();

    //instance of sheets api
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = capturedId[1];

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
    });

    const array = getRows.data.values;
    const n = array.length;

    var newArray = [
        ['Categories'],
    ];

    for (var i = 1; i < n; i++) {
        var temp = array[i];
        var website = temp[0];
        // var URL = "https://w3techs.com/sites/info/";
        // var afterRegex = website.replace(/.+\/\/|www.|shop./g, '');
        // URL += afterRegex;

        var category = await getCategory(website);
        newArray.push([category.replace("WORDPRESS", "WOO_COMMERCE")]);
    }

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!B:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: newArray,
        },
    });

    res.send("Websites categorized! Check your google sheets for the updated categories.");

});

app.listen(port, () => console.log(`Server Running on port: http://localhost:${port}`));