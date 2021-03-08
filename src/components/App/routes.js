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
		title: "Lyrics Editor",
		itemId: "/lyrics/editor"
	}, {
		title: "Lyrics Preview",
		itemId: "/lyrics/preview"
	}, {
		title: "Ini Editor",
		itemId: "/ini/editor"
	}, {
		title: "Settings",
		itemId: "/settings"
	}, {
		title: "Themes",
		itemId: "/themes"
	}
]

export const newSidebarRoutes = [ {
		name: "Lyrics Editor",
		path: "/lyrics/editor"
	}, {
		name: "Lyrics Preview",
		path: "/lyrics/preview"
	}, {
		name: "Ini Editor",
		path: "/ini/editor"
	}, {
		name: "Settings",
		path: "/settings"
	}, {
		name: "Themes",
		path: "/themes"
	}
]
