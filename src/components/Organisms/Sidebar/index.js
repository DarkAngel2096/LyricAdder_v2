// React imports
import React from "react";
import {Link} from "react-router-dom";

// component improts

// scss import
import "./index.scss";

// other module imports

// other file imports

// export the default function
export default function Sidebar({sidebarRoutes, ...props}) {

	return (
		<div className="Sidebar">
			<div className="Sidebar--Header">
				<h2>LyricAdder v2</h2>
			</div>
			{sidebarRoutes && sidebarRoutes.map((category) => {
				return (
					<div className="Sidebar--Categories" key={category.categoryName}>
						<h3>{category.categoryName}</h3>
						{category.subCategories && category.subCategories.map((button) => {
							return (
								<div className="Sidebar--Button" key={button.name}>
									<Link to={button.path}>{button.name}</Link>
								</div>
							)
						})}
					</div>
				)
			})}
			<div className="Sidebar--Footer">
				<h5>Created by: DarkAngel2096</h5>
				<p>Version: 2.0.0</p>
			</div>
		</div>
	)
}
