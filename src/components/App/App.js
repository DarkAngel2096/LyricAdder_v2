// React imports
import React, {Suspense, useEffect} from "react";
import {Route, Switch, useLocation} from "react-router-dom";

// component improts
import {routes} from "./routes";

// css import
import "./App.scss";

// other module imports
import Sidebar from "../Organisms/Sidebar/index";

// other file imports

// export the default function
export default function App() {
	let location = useLocation();

	useEffect(() => {
		console.log(location);
	}, [location]);

	return (
		<div className="App">
			<Sidebar/>
			<Suspense fallback={<h1>Loading...</h1>}>
				<Switch>
					{routes.map((route, index) => {
						return <Route exact path={route.path} component={route.component} key={`route-${index}`}/>
					})}
				</Switch>
			</Suspense>
		</div>
	);
}
