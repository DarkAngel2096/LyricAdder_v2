// react imports
import {lazy} from "react";

// component imports
const Home = lazy(() => import("../Pages/Home/index"));
const LyricsEditor = lazy(() => import("../Pages/LyricsEditor/index"));

// export the default array of routes
export const routes =  [ {
		path: "/lyrics/editor",
		component: LyricsEditor,
		files: ["chart", "ini"]
	}, {
		path: "/",
		component: Home
	}
]

export const sidebarRoutes = [ {
		name: "Lyrics Editor",
		path: "/lyrics/editor",
		icon: "edit"
	}, {
		name: "Lyrics Preview",
		path: "/lyrics/preview",
		icon: "music"
	}, {
		name: "Ini Editor",
		path: "/ini/editor",
		icon: "file-alt"
	}, {
		name: "Settings",
		path: "/settings",
		icon: "cog"
	}, {
		name: "Themes",
		path: "/themes",
		icon: "user-edit"
	}
]
