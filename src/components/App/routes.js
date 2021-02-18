// react imports
import {lazy} from "react";

// component imports
const Home = lazy(() => import("../Pages/Home/index"));


// export the default array of routes
export const routes =  [
	/*{
		path: "/lyrics",
		component: Lyrics
	}*/

	{
		path: "/",
		component: Home
	}
]

export const sidebarRoutes = [
	{
		categoryName: "Editors",
		subCategories: [
			{
				name: "Lyrics",
				path: "/lyrics"
			},
			{
				name: "Ini",
				path: "/ini"
			}
		]
	},
	{
		categoryName: "Diff reducer",
		subCategories: [
			{
				name: "main",
				path: "/diffReducer"
			}
		]
	}
]
