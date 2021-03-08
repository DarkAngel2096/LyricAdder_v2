// react imports
import React from "react";
import {Link} from "react-router-dom";

// component improts

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function Navbar({items, ...props}) {

	return (
		<div className="Navbar">
			{items && items.map((item, index) => {

				return (
					<div className="Navbar--Item" key={`NavItem-${index}`}>
						<Link to={{pathname: item.path}}>
							<p>{item.name}</p>
						</Link>
					</div>
				)
			})}
		</div>
	)
}
