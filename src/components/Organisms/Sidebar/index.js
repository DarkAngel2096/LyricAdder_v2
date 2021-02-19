// React imports
import React from "react";
import {useHistory} from "react-router-dom";

// component improts
import DirectorySelector from "./../DirectorySelector/index";

// scss import
import "./index.scss";

// other module imports
import {Navigation} from "react-minimal-side-navigation";

// other file imports

// export the default function
export default function Sidebar({sidebarRoutes, currentPath, ...props}) {
	const history = useHistory();

	return (
		<div className="Sidebar">
			<div className="Sidebar--Header">
				<h2>LyricAdder v2</h2>
			</div>
			<div className="Sidebar--Items">
				<Navigation
					activeItemId={currentPath}
					onSelect={({itemId}) => {
						console.log(itemId);
						history.push(itemId);
					}}
					items={sidebarRoutes}/>
			</div>
			<div className="Sidebar--DirectorySelector">
				<DirectorySelector />
			</div>
			<div className="Sidebar--Footer">
				<h5>Created by: DarkAngel2096</h5>
				<p>Version: 2.0.0</p>
			</div>
		</div>
	)
}
