import React from "react";
import "./App.css";

function Logo() {

    return(
        <div className="logo">
            <img className="logo-img" src="data:image/png;base64,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" alt="logo-img"></img>
            <p className="logo-text">FAST <br>
            </br>FORWARD</p>
        </div>
    );
}
export default Logo;