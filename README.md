# Alegra test

Hi there!

I hope you are doing well. In this project, you can find a feature to consume the Alegra API and displays a list of sellers and images based on the customer's wish.

For frontend, I used Vue and Vuex. As a developer always looking to improve the code quality, I have integrated TypeScript and ESLint as well.

## Links
- [Demo](https://imagenes-mundo.netlify.app/)


## Features
- Image Search: Users can search for inspiring images using a search term.
- Invoice Creation: Users can create invoices by filling out a form with required details.
- Dynamic Data Fetching: Integrates with external APIs to fetch and display data.

## Technologies 💻


- Vue 3
- TypeScript
- Vuex
- SCSS
- Vue Router
- Axios
- Vue3 Carousel

## Author

- **Sergio Penagos** 🔥
  - [LinkedIn](https://www.linkedin.com/in/analyst-sergio-penagos)
  - [GitHub](https://github.com/gioudi)
  - [GitHub2](https://github.com/SergioVass)
  - 

## Installation

### Prerequisites
- Node.js (version 14.x or higher recommended)
- npm (version 6.x or higher)

1. Clone the repository: `git clone https://github.com/gioudi/alegra-test-vue-typescript.git`
2. Navigate to the project directory: `cd alegra-test-vue-typescript`
3. Install dependencies:
    `npm install`
4. Build prod:
    `npm run build`
5. Lint and fix files
    `npm run lint --fix`

## Usage

### Search for Images

- Navigate to the search page.
- Enter a search term in the input field.
- Click the "Buscar" button to fetch images.

### Select a winner
- Navigate to list of images
- Vote the best image
- If a seller get 20 points, the game finish

### Create an invoice
- Navigate to the invoice creation page.
- Fill out the form with the required details.
- Click the "Crear factura" button to submit the form.

## Strcuture

- alegra-test-vue-typescript/
  - public/
  - src/
    - assets/
    - components/
      - CarouselFile.vue
      - ErrorFile.vue
      - LoadingFile.vue
    - store/
      - index.ts
      - modules/
        - images.ts
        - invoices.ts
    - views/
      - LandingPage.vue
      - ImageList.vue
      - InvoiceForm.vue
    - App.vue
    - main.ts
    - router/
      - index.ts
  - .gitignore
  - package.json
  - README.md
  - tsconfig.json


## License
This project is licensed under the MIT License. See the LICENSE file for more information.


