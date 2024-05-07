import axios from 'axios';
import { JSDOM } from 'jsdom';

const scrape = async (req, res) => {
    try {
        const { keyword } = req.query;
        const amazonURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}&ref=nb_sb_noss_1`;

        // Checking if keyword is provided
        if (!keyword) return res.status(400).json({ message: 'Please provide a keyword' });

        // Making a GET request to the Amazon URL and storing the HTML response
        const { data: html } = await axios.get(amazonURL, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });

        // Creating a DOM object from the HTML response
        const dom = new JSDOM(html);

        // Selecting all elements with the attribute [data-component-type="s-search-result"]
        const elements = dom.window.document.querySelectorAll('[data-component-type="s-search-result"]');

        const response = [];
        elements.forEach(element => {
            let product = {};
            const name = element.querySelector('.a-link-normal .a-text-normal');
            product.name = name ? name.textContent : '';
            const review = element.querySelector('.a-link-normal .s-underline-text');
            product.reviews = review ? review.textContent : '';
            const rating = element.querySelector('.a-icon-star-small .a-icon-alt');
            product.rating = rating ? rating.textContent : '';
            const image = element.querySelector('.s-image');
            product.image = image ? image.src : '';

            // Checking if all properties of the product object have a valid value, and if so, adding the product to the response array
            if (Object.values(product).every(property => property !== '' && property !== null))
                response.push(product);
        });

        // Sending a successful response with the extracted product data
        return res.status(200).json(response);
    } catch (error) {
        // Handling errors and sending an internal server error response
        console.error('Error:', error);
        res.send('Internal Server Error');
    }
};

export { scrape }; // Exporting the scrape function to be used elsewhere
