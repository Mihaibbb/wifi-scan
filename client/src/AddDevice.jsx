import { useState } from "react";
import "./AddDevice.css";

const AddDevice = () => {

    const [devicesFound, setDeviceFound] = useState([]);

    const startCheck = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };
    };

    const findDevice = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };
    };

    return (
        <div className="add-device-container">

        </div>
    );
};

export default AddDevice;