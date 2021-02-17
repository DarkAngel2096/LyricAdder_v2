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
