// React imports
import React, {Suspense, useState, useEffect} from "react";
import {Route, Switch, useLocation} from "react-router-dom";

// component imports
import {routes} from "./routes";
import NotFound from "../Pages/NotFound/index";
import {PathFileContext} from "../OtherJS/contexts";
import Sidebar from "../Organisms/Sidebar/index";

// scss import
import "./App.scss";

// other module imports
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";

// other file imports

// a thing to add in the Font Awesome stuff to the project
library.add(fas);

// export the default function
export default function App() {
	const location = useLocation();
	const [routeFiles, setRouteFiles] = useState({});

	useEffect(() => {
		console.log(location);
		setRouteFiles(routes[routes.findIndex(el => el.path === location.pathname)].files || {});
	}, [location]);

	return (
		<div className="App">
			<div className="App--Sidebar">
				<PathFileContext.Provider value={routeFiles}>
					<Sidebar routes={routes} currentPath={location.pathname}/>
				</PathFileContext.Provider>
			</div>
			<div className="App--MainPage">
				<Suspense fallback={<h1>Loading...</h1>}>
					<Switch>
						{routes.map((route, index) => {
							if (route.component) {
								return <Route exact path={route.path} component={route.component} key={`route-${index}`}/>
							} else return null;
						})}
						<Route component={NotFound}/>
					</Switch>
				</Suspense>
			</div>
		</div>
	);
}
