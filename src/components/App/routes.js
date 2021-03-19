// react imports
import {lazy} from "react";

// component imports
const Home = lazy(() => import("../Pages/Home/index"));
const LyricsEditor = lazy(() => import("../Pages/LyricsEditor/index"));

/* explanation for the routes
	required is "path" and "component" tags

	if "name" is missing, it won't show up in the navbar
	if "icon" is missing, a questionmark will be shown
	if "files" is set, as object, it defines what's needed for the page
*/

// export all the routes
export const routes = [ {
		path: "/",
		component: Home
	}, {
		path: "/lyrics/editor",
		component: LyricsEditor,
		name: "Lyrics Editor",
		icon: "edit",
		files: {chart: ["events"]}
	}, {
		path: "/lyrics/preview",
		name: "Lyrics Preview",
		icon: "music"
	}, {
		path: "/ini/editor",
		name: "Ini Editor",
		icon: "file-alt"
	}, {
		path: "/settings",
		name: "Settings",
		icon: "cog"
	}, {
		path: "/themes",
		name: "Themes",
		icon: "user-edit",
		files: {something: ["crazy..."]}
	}
]
