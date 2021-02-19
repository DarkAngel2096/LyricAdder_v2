// react imports
import {lazy} from "react";

// component imports
const Home = lazy(() => import("../Pages/Home/index"));
const LyricsEditor = lazy(() => import("../Pages/LyricsEditor/index"));

// export the default array of routes
export const routes =  [ {
		path: "/lyrics/editor",
		component: LyricsEditor
	}, {
		path: "/",
		component: Home
	}
]

export const sidebarRoutes = [ {
		title: "Home",
		itemId: "/"
	}, {
		title: "Lyrics",
		itemId: "/lyrics",
		subNav: [ {
				title: "Editor",
				itemId: "/lyrics/editor"
			}, {
				title: "Preview",
				itemId: "/lyrics/preview"
			}
		]
	}, {
		title: "Ini",
		itemId: "/ini",
		subNav: [ {
				title: "Editor",
				itemId: "/ini/editor"
			}
		]
	}, {
		title: "Chart stuff",
		itemId: "/chart",
		subNav: [ {
				title: "Diff reducer",
				itemId: "/chart/diffReducer"
			}
		]
	}, {
		title: "Settings",
		itemId: "/settings",
		subNav: [ {
				title: "General",
				itemId: "/settings/general"
			}, {
				title: "Themes",
				itemId: "/settings/themes"
			}
		]
	}
]
