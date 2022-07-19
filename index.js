import express, { urlencoded } from 'express';
import { google } from 'googleapis';
// const axios = require('axios');
import fetch from "node-fetch";
import { load } from "cheerio";


const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

const getRawData = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

const elementIfShopify = "#bd > table > tbody > tr > td.tech_main > p:nth-child(11) > a";
const elementIfBigcommerce = "#bd > table > tbody > tr > td.tech_main > p:nth-child(22) > a";
const elementIfMagnetoAndWoo = "#bd > table > tbody > tr > td.tech_main > p:nth-child(15) > a";

const getCategory = async(URL, element) => {
    const categoryRawData = await getRawData(URL);

    // parsing the data
    const $ = load(categoryRawData);
    // const element = elementIfMagnetoAndWoo;

    const category = $(element);
    
    return category.text();

};

app.post('/', async (req, res) => {

    const { sheetlink } = req.body;

    let capturedId = sheetlink.match(/\/d\/(.+)\//);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    
    // create client instance
    const client = await auth.getClient();

    //instance of sheets api
    const googleSheets = google.sheets({version: "v4", auth: client});

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
    
    for (var i = 1; i < n; i++){
        var temp = array[i];
        var website = temp[0];
        var URL = "https://w3techs.com/sites/info/";
        var afterRegex = website.replace(/.+\/\/|www.|/g, '');
        URL += afterRegex;
       
        var category = await getCategory(URL, elementIfShopify);
        
        newArray.push([category]);
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

    res.send("Websites categories!");

});

app.listen(port, () => console.log(`Server Running on port: http://localhost:${port}`));