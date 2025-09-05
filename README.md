# WiFi Device Scanner and Manager

A Node.js backend service to scan nearby WiFi devices, manage device presence status, and store device info in a MySQL database. Uses `express` for the server, `node-wifi` for WiFi operations, and `local-devices` to find devices on the network.

## Project Description

This project provides an API to:

- Scan available WiFi networks and connect to a specified SSID.
- Identify devices connected to the network and keep track of their presence.
- Store device info (MAC address, IP, name, and presence status) in a MySQL database.
- Update and delete device info dynamically via REST API endpoints.

It's useful for monitoring the presence of devices (e.g., people or assets) on a network in real-time.

## Features

- WiFi network scanning
- Connect to WiFi programmatically
- Discover devices on the local network
- MySQL database integration for device storage
- RESTful API endpoints for device management
- Cross-Origin Resource Sharing (CORS) enabled for frontend integration


## Installation

1. Clone the repository:

```bash
git clone https://github.com/Mihaibbb/wifi-scan
cd wifi-scan
```

2. Install dependencies:

```bash
npm install
```

3. Setup MySQL database:

The app will automatically create a database and the necessary table on the first run if it doesn't exist.
4. Configure your MySQL connection details in `makedb.js` (not included in this snippet, but necessary for the database connection).

## Usage

Start the server:

```bash
node index.js
```

The server listens on port `8000`.

### Available Endpoints

- `POST /get-devices`
Connects to the specified WiFi and returns the list of devices on the network, enriched with names from the database if available.
**Request Body:**

```json
{ "ssid": "yourSSID", "password": "yourPassword" }
```

- `POST /get-new-device`
Connects to WiFi and returns a new device not included in the provided old device list.
**Request Body:**

```json
{ "ssid": "yourSSID", "password": "yourPassword", "oldDevices": [] }
```

- `POST /insert-devices`
Inserts or updates device records in the database.
**Request Body:**

```json
{ "devices": [{ "mac": "xx:xx:xx:xx:xx", "ip": "xxx.xxx.xxx.xxx", "name": "Device Name" }] }
```

- `DELETE /remove-device/:mac`
Deletes a device from the database based on MAC address.
- `POST /request-devices-status`
Updates presence status of devices by scanning the network and comparing with the database.
- `POST /get-db-data`
Retrieves all devices stored in the database.
- `POST /status-by-name`
Checks presence status of a device by name.
**Request Body:**

```json
{ "name": "Device Name" }
```


## Dependencies

- [express](https://www.npmjs.com/package/express) - Web framework
- [local-devices](https://www.npmjs.com/package/local-devices) - Find devices on the local network
- [node-wifi](https://www.npmjs.com/package/node-wifi) - Manage WiFi connections
- [cors](https://www.npmjs.com/package/cors) - Enable CORS middleware
- MySQL (via your `makedb` database connection module)


## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

***

This README covers all necessary aspects: project purpose, setup, usage, API endpoints, dependencies, and contribution guidance, formatted for easy reading and quick understanding.[^1][^3][^7]
<span style="display:none">[^10][^2][^4][^5][^6][^8][^9]</span>

<div style="text-align: center">⁂</div>

[^1]: https://www.archbee.com/blog/readme-creating-tips

[^2]: https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express

[^3]: https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/

[^4]: https://blog.heyday.xyz/implementing-cors-in-your-node-express-app-1bdffc4eaa48

[^5]: https://data.research.cornell.edu/data-management/sharing/readme/

[^6]: https://www.geeksforgeeks.org/node-js/how-to-allow-cors-in-express/

[^7]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes

[^8]: https://expressjs.com/en/resources/middleware/cors.html

[^9]: https://www.makeareadme.com

[^10]: https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

