import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.scss';
import App from './components/App/App';
import ErrorBoundary from './components/App/ErrorBoundary';

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<Router>
				<App />
			</Router>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root')
);
