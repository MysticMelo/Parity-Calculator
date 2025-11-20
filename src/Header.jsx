import {Link} from 'react-router-dom'
import { NavLink } from "react-router-dom";

import './Header.css'
function Header (){


    return (
        <>
        <div className="header-container">
            <div className="header">
                <img src="https://raw.githubusercontent.com/MysticMelo/seeker/refs/heads/master/public/Seek19.png" alt="Logo" className="logo"/>

            </div>
        </div>

        <div className="menu">
            <ul>
                <li>
                    <NavLink
                        to="/Parity-Calculator/"
                        end
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Maize 🌽
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/Parity-Calculator/soybeans"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Soybeans 🌱
                    </NavLink>
                </li>
            </ul>
        </div>
            </>


)
}

export default  Header