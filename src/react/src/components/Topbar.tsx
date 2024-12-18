import React, { useEffect, useState } from "react";
import './Topbar.css';
import "boxicons/css/boxicons.min.css";
import defaultImage from "../img/default.png";


const Topbar: React.FC = () => {
    const [userImage, setUserImage] = useState(defaultImage);

    useEffect(() => {
        const storedImage = sessionStorage.getItem("user_image");
        if (storedImage) {
            setUserImage(storedImage);
        } else {
            setUserImage(defaultImage);
        }
    }, []);

    return (
        <div className="topbar">
            <div className="title">
                <span className="toptitle">PC Studio</span>
            </div>
            <div className="user">
            <img
                id="userImage"
                src={userImage}
                alt="User Profile Picture"
                className="userImage"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage; 
                }}
            />
            </div>
        </div>
    );
};

export default Topbar;