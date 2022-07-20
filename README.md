# E-commerce-classifier-Node
This is a **NodeJs** project for access a google sheet and categorizing the websites into various e-commerce brands.

## Made with NodeJs, express and EJS

## How to use the website
First step is to share the google sheet **editor** access to: <br />
```website-classifer@website-classifier-356808.iam.gserviceaccount.com``` <br />
Make sure that the access provided is the ```editor``` access, otherwise the website cannot access your google sheet.

Make sure that your google sheet is in the following format: 
![This is an image](/assets/excel.jpeg)

On the website: <br /> 
Enter your google sheet link in the input box and hit submit. Wait for a few seconds for the sheet to be updated. You should see a success message when the 
sheet is updated. Go back to your google sheet to see the output.

## Working 
1. Get your own Google credentials file from the [Google dev console](https://console.cloud.google.com/) and create your API key for ```Google sheets```. <br />
2. Move the credential file given from the console to the ```credentials.json``` file in the ```src``` directory. <br />
3. Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the required dependencies in the `package.json` file.<br />
4. Clone the project on your device and initialise npm using `npm init` in cmd.<br />
5. Install the dependencies using the `npm i` command.<br />
6. Create your own Rapid API key at [Rapid API](https://rapidapi.com/zyla-labs-zyla-labs-default/api/klazify-iab-categorization/)
6. Use `npm start` to start the project.<br />


## About the project
This Nodejs/express project makes use of the ```googleapis``` npm package to access and modify a google sheet using the ```spreadsheetId```. <br />


## Credits
[Akhileshwar Gurram](https://github.com/Maveric-k07)
