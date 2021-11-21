// react imports
import React, {useContext} from "react";

// component improts
import Page from "../../Organisms/Page/index";
import { ThemeContext } from "../../OtherJS/contexts";

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function Themes() {
	const themeContext = useContext(ThemeContext);

	// function to handle default theme change
	const handleDefaultThemeChange = (data) => {
		let current = JSON.parse(JSON.stringify(themeContext.currentTheme));
		current.default = data.target.value;
		themeContext.setCurrentTheme(current);
	}

	// function to handle custom theme change
	const handleCustomThemeChange = (data) => {
		let current = JSON.parse(JSON.stringify(themeContext.currentTheme));
		current.custom = data.target.value === "None" ? null : data.target.value;
		themeContext.setCurrentTheme(current);
	}

	return (
		<Page name="Themes">
			<h1>Welcome to custom themes!</h1>
			<div className="ThemeSelectors">
				<label htmlFor="ThemeSelectors--Default--Label">Select default theme: </label>
				<select
					className="ThemeSelectors--Default"
					defaultValue={themeContext.currentTheme.default || ""}
					onChange={handleDefaultThemeChange}>
					{themeContext.defaultThemes && Object.keys(themeContext.defaultThemes).map(key => {
						return <option value={key} key={key}>{key}</option>
					})}
				</select>
				{Object.keys(themeContext.customThemes).length > 0 && (
					<>
						<label htmlFor="ThemeSelectors--Custom--Label">Select custom theme: </label>
						<select
							className="ThemeSelectors--Custom"
							defaultValue={themeContext.currentTheme.custom || ""}
							onChange={handleCustomThemeChange}>
							<option value={null}>None</option>
							{themeContext.customThemes && Object.keys(themeContext.customThemes).map(key => {
								return <option value={key} key={key}>{key}</option>
							})}
						</select>
					</>
				)}
			</div>
		</Page>
	)
}
