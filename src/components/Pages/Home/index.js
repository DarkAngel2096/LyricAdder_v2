// react imports
import React from "react";

// component improts
import Page from "../../Organisms/Page/index";

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function Home() {

	return (
		<Page name="Home">
			<div className="content">
				<h1>Welcome to LyricAdder v2</h1>
				<p>
				OH... Here we go again...?!<br/>
				A LOT has changed, things should run a bit better and look a bit prettier too, hopefully...<br/><br/>
				If anything breaks, or you have any ideas or thoughts,<br/>
				PLEASE let me know, either by DM or on the LA Discord server<br/>
				DarkAngel2096#0681 or <a href="https://discord.gg/bt2ntwx">Server link</a>
				</p>
				<div className="changelog">

				</div>
			</div>
		</Page>
	)
}
