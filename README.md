# Order Manager - HuongGiang

This is a simple web application for managing product orders. It provides a user-friendly interface to browse products, add them to a cart, and place an order. The order data is then saved to a Google Sheet.

## Features

*   Product listing with search functionality.
*   Shopping cart to add and manage selected products.
*   Order form for customer information.
*   Automatic calculation of totals, including discounts and VAT.
*   Integration with Google Sheets to save order data.

## Deployment

This application is designed to be deployed on Cloudflare Pages via GitHub.

### Google Apps Script Setup

1.  Create a new Google Sheet.
2.  Go to `Extensions > Apps Script`.
3.  Paste the content of `google-apps-script.js` into the script editor.
4.  Deploy the script as a web app:
    *   Click `Deploy > New deployment`.
    *   Select `Web app` as the type.
    *   In the configuration, set `Execute as` to `Me` and `Who has access` to `Anyone`.
    *   Click `Deploy`.
5.  Copy the generated Web app URL.

### Frontend Setup

1.  Open `script.js`.
2.  Find the `scriptURL` constant.
3.  Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with the URL you copied from the Apps Script deployment.

### GitHub and Cloudflare Pages

1.  Create a new repository on GitHub and push the project files.
2.  Log in to your Cloudflare account.
3.  Go to `Workers & Pages` and click `Create application`.
4.  Select the `Pages` tab and connect your GitHub account.
5.  Choose the repository you created.
6.  Follow the setup instructions to deploy your site.