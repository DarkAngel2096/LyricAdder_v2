// React imports
import React, {Suspense, useEffect} from "react";
import {Route, Switch, useLocation} from "react-router-dom";

// component improts
import {routes, sidebarRoutes} from "./routes";
import NotFound from "../Pages/NotFound/index";

// scss import
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
			<div className="App--Sidebar">
				<Sidebar sidebarRoutes={sidebarRoutes}/>
			</div>
			<div className="App--MainPage">
				<Suspense fallback={<h1>Loading...</h1>}>
					<Switch>
						{routes.map((route, index) => {
							return <Route exact path={route.path} component={route.component} key={`route-${index}`}/>
						})}
						<Route component={NotFound}/>
					</Switch>
				</Suspense>
			</div>
		</div>
	);
}
