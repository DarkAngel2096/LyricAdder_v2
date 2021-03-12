// React imports
import React, {useState} from "react";
import {useHistory} from "react-router-dom";

// component improts
import DirectorySelector from "../DirectorySelector/index";
import Navbar from "../../Components/Navbar/index";

// scss import
import "./index.scss";

// other module imports
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// other file imports

// export the default function
export default function Sidebar({sidebarRoutes, currentPath, ...props}) {
	const history = useHistory();

	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className={`Sidebar ${collapsed ? "Sidebar--Collapsed" : ""}`}>
			<div className={`Sidebar--Header`} onClick={() => history.push("/")}>
				<FontAwesomeIcon icon="home" className={!collapsed ? "collapsed" : ""}/>
				<h2 className={collapsed ? "collapsed" : ""}>LyricAdder v2</h2>
			</div>
			<div className="Sidebar--Navbar">
				<Navbar items={sidebarRoutes} activeItem={currentPath} collapsed={collapsed}/>
			</div>
			<div className={`Sidebar--DirectorySelector ${collapsed ? "collapsed" : ""}`}>
				<DirectorySelector />
			</div>
			<div className="Sidebar--Collapse" onClick={() => {setCollapsed(!collapsed)}}>
				<FontAwesomeIcon icon="chevron-right" rotation={collapsed ? 0 : 180}/>
			</div>
		</div>
	)
}
