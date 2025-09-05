const express = require("express");
const app = express();
const find = require("local-devices");
const wifi = require("node-wifi");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const database = require("./makedb")
wifi.init({
    iface: null
});

wifi.scan((err, networks) => {
    if (!err) {
        console.log(networks);
    }
});

find().then(devices => {
    console.log(devices);
});

const createDatabase = async () => {
    
    let sql = "CREATE DATABASE IF NOT EXISTS ??";
    try {
        await database.query(sql, ["people_status"]);
        await database.query("USE ??;", ["people_status"]);
        await createTable();
    } catch (e) {
        console.log(e);
    }

};

const createTable = async () => {
    let sql = "CREATE TABLE IF NOT EXISTS ?? ( ";
    sql += "id int(11) primary key auto_increment not null, ";
    sql += "mac varchar(128) not null, ";
    sql += "ip varchar(128) not null, ";
    sql += "name varchar(128) not null, ";
    sql += "present boolean not null );";
    await database.query(sql, ["devices"]);
};

(async () => {
    await createDatabase();    
})();

app.post("/get-devices", (req, res) => {
    const { ssid, password } = req.body;
    wifi.connect({ ssid, password }, () => {
        setTimeout(async () => {
            try {
                const devices = await find();
                console.log(devices);
                const devicesUpdated = await Promise.all(devices.map(async device => {
                    let sql = "SELECT * FROM ?? WHERE mac = ?"
                    const foundDeviceInDatabase = await database.query(sql, ["people_status.devices", device.mac]);
                    return {
                        ...device,
                        name: await foundDeviceInDatabase && await foundDeviceInDatabase.length === 1 ? foundDeviceInDatabase[0].name : device.name,
                        saved: await foundDeviceInDatabase && await foundDeviceInDatabase.length === 1
                    } 
                }));

                res.status(200).json({
                    success: true,
                    devices: devicesUpdated
                });

            } catch (e) {
                console.log(e);
                res.status(404).json({ success: false, message: "An error occured." });
            }
        }, 1500);
    });
});

app.post("/get-new-device", (req, res) => {
    const { ssid, password, oldDevices } = req.body;
    wifi.connect({ ssid, password }, () => {
        setTimeout(async () => {
            const newDevices = await find();
            const differentDevice = newDevices.find(device => {
                return oldDevices.some(oldDevice => device.mac === oldDevice.mac);
            });
            if (!differentDevice) return res.status(200).json({ success: false, message: "Device was not found!" });
            res.status(200).json({ success: true, device: differentDevice });

        }, 1500);
    });
});

app.post("/insert-devices", async (req, res) => {
    const { devices } = req.body;
    try {
        await Promise.all(devices.map(async device => {
      
            try {
                let sql = "SELECT * FROM ?? WHERE mac = ?";
                const foundDevice = await database.query(sql, ["people_status.devices", device.mac]);
                if (await foundDevice && await foundDevice.length) {
                    sql = "UPDATE ?? SET name = ? WHERE mac = ?";
                    await database.query(sql, ["people_status.devices", device.name, device.mac]);
                } else {
                    sql = "INSERT INTO ?? (mac, ip, name, present) VALUES (?, ?, ?, ?);";
                    await database.query(sql, ["people_status.devices", device.mac, device.ip, device.name, false]);
                }
            } catch (e) {
                console.log(e);
            }
      
        }));

        res.status(200).json({ success: true, message: "Updated successfully!" });

    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occurred." });
    } 
});

app.delete("/remove-device/:mac", async (req, res) => {
    const { mac } = req.params;
    try {   
        let sql = "DELETE FROM ?? WHERE mac = ?";
        const deleted = await database.query(sql, ["people_status.devices", mac]);
        if (await deleted) return res.status(200).json({ success: true, message: "Device deleted successfully!" });
    } catch (e) {
        console.log(e);
    }
});

app.post("/request-devices-status", async (req, res) => {
    
    try {
        const nearbyDevices = await find();
        if (!nearbyDevices) return res.status(200).json({ success: false, message: "No devices found." });

        let sql = "SELECT * FROM ??";
        const dbDevices = await database.query(sql, "people_status.devices");

        dbDevices.forEach(dbDevice => {
            const foundStatus = nearbyDevices.some(nearbyDevice => nearbyDevice.mac === dbDevice.mac);
            (async () => {
                sql = "UPDATE ?? SET present = ? WHERE mac = ?";
                await database.query(sql, ["people_status.devices", foundStatus, dbDevice.mac]);
            })();
        });

        res.status(200).json({ success: true });

    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured!" });
    }
});

app.post("/get-db-data", async (req, res) => {
    try {
        let sql = "SELECT * FROM ??";
        const devices = await database.query(sql, ["people_status.devices"]);
        res.status(200).json({ success: true, devices: await devices });
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured!" });
    }
});


app.post("/status-by-name", async (req, res) => {
    const { name } = req.body;
    console.log(name);
    try {
        let sql = "SELECT * FROM ?? WHERE name = ?";
        const result = await database.query(sql, ["people_status.devices", name]);
        console.log(await result);
        if (await result && await result.length) return res.status(200).json({ status: await result[0].present });
        res.status(404).json({ success: false, message: "Device not found!" });
    } catch (e) {
        console.log(e);
    }
});


app.listen(8000, () => console.log("Server started!"));