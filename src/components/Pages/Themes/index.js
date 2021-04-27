// react imports
import React, {useState, useEffect} from "react";

// component improts
import Page from "../../Organisms/Page/index";

// scss import
import "./index.scss"

// other module imports

// other file imports
import * as themeJSON from "../../App/DefaultThemes.json";

// export the default function
export default function Themes() {
	const [currentTheme, setCurrentTheme] = useState(null);
	const [customThemes, setCustomThemes] = useState(null);

	// on first call get themes data from config
	useEffect(() => {
		let data = window.api.toMainSync("syncGetThemes");
		setCurrentTheme(data.current);
		setCustomThemes(data.customThemes);
	}, []);

	// function to set the theme values to root
	useEffect(() => {
		if (themeJSON.default) {
			let root = document.documentElement;

			for (let [key, value] of Object.entries(themeJSON.default[currentTheme ? currentTheme.default : "dark"])) {
				root.style.setProperty(`--${key}`, value);
			}
		}
	}, [currentTheme]);

	// function to handle default theme change
	const handleDefaultThemeChange = (data) => {
		let current = JSON.parse(JSON.stringify(currentTheme));
		current.default = data.target.value;
		setCurrentTheme(current);
	}

	return (
		<Page name="Themes">
			<h1>Welcome to custom themes!</h1>
			<div className="ThemeSelector">
				<form>
					<label htmlFor="ThemeSelect">Select default theme:</label>
					<select className="ThemeSelect" defaultValue={themeJSON.default || ""} onChange={handleDefaultThemeChange}>
						{themeJSON && Object.keys(themeJSON.default).map(key => {
							return <option value={key} key={key}>{key}</option>
						})}
					</select>
				</form>
			</div>
		</Page>
	)
}
