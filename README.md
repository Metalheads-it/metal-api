# Metal API

Metal API is a RESTful API developed in TypeScript, designed to fetch data from the Encyclopedia Metallum website ([https://www.metal-archives.com/](https://www.metal-archives.com/)). Unlike many other REST APIs available on GitHub, this software does not create a local copy of all the data from Encyclopedia Metallum. Instead, it directly accesses the website, retrieving data through scraping and available endpoints, and converts the data into usable JSON objects.

## Features

-   Direct data access from Encyclopedia Metallum
-   Data retrieval through web scraping and API endpoints
-   Conversion of raw data into JSON objects
-   Built with TypeScript for robust type checking and maintainability

## Installation

To install and set up Metal API, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/Metalheads-it/metal-api.git
    ```

2. Navigate to the project directory:

    ```bash
    cd metal-api
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables by copying the example file and configuring it:

    ```bash
    cp .env.example .env
    ```

5. Compile the application:

    ```bash
    npm run build
    ```

6. Launch the application locally

    ```bash
    npm run dist
    ```

## Usage

To use the Metal API once you've launched the application, make HTTP requests to the endpoints provided. Here is an example using `curl`:

```bash
curl -X GET 'http://localhost:3000/bands/search?band={artistName}'
```

Replace {artistName} with the name of the artist you want to retrieve information about.

## License

This project is licensed under the GPL-3.0 License. See the LICENSE file for more details.

## Contact

For any questions or inquiries, please open an issue on the GitHub repository.
