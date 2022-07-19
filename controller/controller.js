const axios = require('axios');


let checkShopify = async(website) => {
    var isShopify = true;
    try {
        const response = await axios.get('https://shopify-store-scraper.p.rapidapi.com/shopify-products', {
                params: {
                    url: website,
                    page: '1'
                },
                headers: {
                    'X-RapidAPI-Key': '9a9b676b01msh5b93379aa1e08eap127dfajsncb3605f32695',
                    'X-RapidAPI-Host': 'shopify-store-scraper.p.rapidapi.com'
                }
            })
            .then(function(response) {
                if (response.data.message) {
                    isShopify = false;
                } 
            })
    } catch (error) {
        isShopify = false;
    }

    return isShopify;
}

export default checkShopify;
