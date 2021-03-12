// react imports
import React from "react";
import {Link} from "react-router-dom";

// component improts

// scss import
import "./index.scss"

// other module imports
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// other file imports

// export the default function
export default function Navbar({items, activeItem, collapsed, ...props}) {

	return (
		<div className="Navbar">
			{items && items.map((item, index) => {

				return (
					<div className={`Navbar--Item ${activeItem === item.path ? "active" : ""}`} key={`NavItem-${index}`}>
					<Link to={{pathname: item.path}}>
						<FontAwesomeIcon icon={item.icon} className="Navbar--Item--Icon"/>
							<p className={`${collapsed ? "collapsed" : ""}`}>{item.name}</p>
						</Link>
					</div>
				)
			})}
		</div>
	)
}
