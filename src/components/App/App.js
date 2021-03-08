// React imports
import React, {Suspense, useState, useEffect} from "react";
import {Route, Switch, useLocation} from "react-router-dom";

// component improts
import {routes, sidebarRoutes, newSidebarRoutes} from "./routes";
import NotFound from "../Pages/NotFound/index";
import {PathFileContext} from "../Contexts/contexts";

// scss import
import "./App.scss";

// other module imports
import Sidebar from "../Organisms/Sidebar/index";

// other file imports

// export the default function
export default function App() {
	const location = useLocation();
	const [routeIndex, setRouteIndex] = useState();

	useEffect(() => {
		console.log(location);
		console.log(routes[routes.findIndex(el => el.path === location.pathname)]);
		setRouteIndex(routes[routes.findIndex(el => el.path === location.pathname)]);
	}, [location]);

	return (
		<div className="App">
			<div className="App--Sidebar">
				<PathFileContext.Provider value={routes[routeIndex] ?  routes[routeIndex].files : []}>
					<Sidebar sidebarRoutes={sidebarRoutes} newSidebarRoutes={newSidebarRoutes} currentPath={location.pathname}/>
				</PathFileContext.Provider>
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
