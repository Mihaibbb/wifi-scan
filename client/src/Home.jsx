import { useEffect, useState } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [devices, setDevices] = useState([]);
    const [devicesName, setDevicesName] = useState([]);
    const [databaseDevices, setDatabaseDevices] = useState([]);

    const navigation = useNavigate();

    const getDevices = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        try {
            const request = await fetch("http://localhost:8000/get-devices", options);
            const response = await request.json();
            setDevices(await response.devices);

        } catch (e) {
            console.log(e);
        }
    };

    const requestUpdate = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        try {
            const request = await fetch("http://localhost:8000/request-devices-status", options);
            const response = await request.json();
            if (!await response.success) console.log("Error!");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        (async () => {
            await getDevices();
            await getDatabaseDevices();
        })();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            await requestUpdate();
            await getDatabaseDevices();
            await getDevices();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!(devices && devices.length)) return;
        console.log(devices);
        devices.forEach(device => {
            setDevicesName(currDeviceNames => [...currDeviceNames, device.name]);
        });

    }, [devices]);

    const changeDbStatus = async (idx) => {
        if (devices[idx].saved) await removeFromDb(devices[idx].macAddress);
        else addToDb(devices[idx]);
        setDevices(currDevices => {
            return currDevices.map((device, deviceIdx) => {
                if (deviceIdx === idx)  return {
                    ...device,
                    saved: device?.saved ? !device.saved : false
                };
                   
                return device;
            })
        });
    };

    const addToDb = async (device) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    devices: [device]
                })
            };
            
            const request = await fetch("http://localhost:8000/insert-devices", options);
            const response = await request.json();
            if (await response.success) window.location.reload();
        } catch (e) {
            console.log(e);
        }
    };

    const removeFromDb = async (macAddress) => {
        try {
            const options = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const request = await fetch(`http://localhost:8000/remove-device/${macAddress}`, options);
            const response = await request.json();
            if (await response.success) window.location.reload();

        } catch (e) {
            console.log(e);
        }
    };

    const getDatabaseDevices = async () => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const request = await fetch("http://localhost:8000/get-db-data", options);
            const response = await request.json();
            if (await response.success) setDatabaseDevices(await response.devices);

        } catch (e) {
            console.log(e);
        }
    };

    const addDevice = () => navigation("/add-device");

    return (
        <div className="home">
            <h2 className="title">Lista Dispozitive</h2>

            <table className="table-devices">

                <tr className="first-row">
                    <th className="elem">
                        <p>MAC</p>
                    </th>

                    <th className="elem">
                        <p>IP</p>
                    </th>

                    <th className="elem">
                        <p>Nume</p>
                    </th>
                   
                    <th className="elem">
                        <p>Salvat</p>
                    </th>
                </tr>

                {devices && devices.length > 0 && devices.map((device, idx) => (
                    <tr className="device-row" key={idx}>

                        <th className="elem">
                            <p>{device.mac}</p>
                        </th>

                        <th className="elem">
                            <p>{device.ip}</p>
                        </th>

                        <th className="elem">
                            <input 
                                type="text" 
                                className="device-name" 
                                value={devicesName[idx]}
                                onChange={e => {
                                    setDevicesName(currNames => currNames.map((currName, nameIdx) => nameIdx === idx ? e.target.value : currName))
                                }}
                            />
                        </th>

                        <th className="elem">
                            <FontAwesomeIcon 
                                icon={faPlus} 
                                className="save-icon" 
                                onClick={async () => await addToDb({
                                    ...device,
                                    name: devicesName[idx]
                                })}
                            />
                        </th>

                    </tr>
                ))}

                
            </table>

            <h2 className="title">Lista Dispozitive Salvate</h2>

            <table className="table-devices">

                <tr className="first-row">
                    <th className="elem">
                        <p>MAC</p>
                    </th>

                    <th className="elem">
                        <p>IP</p>
                    </th>

                    <th className="elem">
                        <p>Nume</p>
                    </th>
                   
                    <th className="elem">
                        <p>Prezent</p>
                    </th>

                    <th className="elem">
                        <p>Sterge</p>
                    </th>
                </tr>

                {databaseDevices && databaseDevices.length > 0 && databaseDevices.map((device, idx) => (
                    <tr className="device-row" key={idx}>

                        <th className="elem">
                            <p>{device.mac}</p>
                        </th>
                        
                        <th className="elem">
                            <p>{device.ip}</p>
                        </th>

                        <th className="elem">
                            <p>{device.name}</p>
                        </th>

                        <th className="elem">
                            <FontAwesomeIcon 
                                icon={device.present ? faCheck : faTimes} 
                                className="saved-icon" 
                            />
                        </th>

                        <th className="elem">
                            <FontAwesomeIcon 
                                icon={faTimes}
                                className="remove-icon"
                                onClick={async () => await removeFromDb(device.mac)}
                            />
                        </th>

                    </tr>
                ))}

                
            </table>
        </div>
    );
};

export default Home;