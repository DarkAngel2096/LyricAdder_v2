// react imports
import React from "react";

// component improts

// scss import
import "./index.scss";

// other module imports

// other file imports

// export the default function
export default function Page({children, name}) {

	return (
		<div className={`Page--${name}`}>
			<h1 className={`Page--Header`}>{name}</h1>
			{children}
		</div>
	)
}
