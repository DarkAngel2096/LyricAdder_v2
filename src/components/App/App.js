// React imports
import React, { Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// component imports
import { routes } from "./routes";
//import NotFound from "../Pages/NotFound/index";
import { ThemeContext, PathFileContext, FileDataContext } from "../OtherJS/contexts";
import Sidebar from "../Organisms/Sidebar/index";

// scss import
import "./App.scss";

// other module imports
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// other file imports
import * as themeJSON from "./DefaultThemes.json";

// a thing to add in the Font Awesome stuff to the project
library.add(fas);

// export the default function
export default function App() {
	// for the location changes and route files used
	const location = useLocation();
	const [routeFiles, setRouteFiles] = useState({});

	// states for theme things
	const [currentTheme, setCurrentTheme] = useState({});
	const [customThemes, setCustomThemes] = useState({});
	const [defaultThemes] = useState(themeJSON.default);

	// states for file data
	// @todo add in other and not just chart
	const [chartData, setChartData] = useState({});

	// effect for changing files needed on location change
	useEffect(() => {
		setRouteFiles(routes[routes.findIndex(el => el.path === location.pathname)].files || {});
	}, [location]);

	// effect for getting the theme stuff from the main process and setting to states
	useEffect(() => {
		let data = window.api.toMainSync("syncGetThemes");
		setCurrentTheme(data.current);
		setCustomThemes(data.customThemes);
	}, []);

	// test for listening of data
	useEffect(() => {
		window.api.listenToMain("chartData", (evnt, message) => {
			if (typeof message === "object" && message !== null) {
				setChartData(message);
			}
		});
	}, []);

	// effect which triggers on theme chage
	useEffect(() => {
		// check if defaultThemes isn't empty, nor currentTheme
		if (defaultThemes && currentTheme) {
			// get the document root
			let root = document.documentElement;

			// get the currently used default and custom theme
			let defaultTheme = defaultThemes[currentTheme.default || "dark"];
			let customTheme = JSON.parse(JSON.stringify(currentTheme.custom ? customThemes[currentTheme.custom] : {}));

			// loop through the default theme selected
			for (let [key, value] of Object.entries(defaultTheme)) {
				root.style.setProperty(`--${key}`, customTheme[key] || value);
				delete customTheme[key];
			}

			// has a small check for if custom theme keys were unused
			if (Object.keys(customTheme).length > 0) {
				console.log("found unused keys in custom theme: ", customTheme);
			}

			// after looping through, send the changes to main
			window.api.toMain("setConfigTheme", currentTheme)
		} else {
			console.log("no theme set...", currentTheme);
		}
	// eslint-disable-next-line
	}, [currentTheme]);

	return (
		<div className="App">
			<div className="App--Sidebar">
				<PathFileContext.Provider value={routeFiles}>
					<Sidebar routes={routes} currentPath={location.pathname}/>
				</PathFileContext.Provider>
			</div>
			<div className="App--MainPage">
				<Suspense fallback={<h1>Loading...</h1>}>
					<ThemeContext.Provider value={{currentTheme, setCurrentTheme, customThemes, defaultThemes}}>
						<FileDataContext.Provider value={{chartData}}>
							<Routes>
								{routes.map((route, index) => {
									if (route.component) {
										return <Route path={route.path} element={<route.component />} key={`route-${index}`}/>
									} else return null;
								})}
							</Routes>
						</FileDataContext.Provider>
					</ThemeContext.Provider>
				</Suspense>
			</div>
		</div>
	);
}
