/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import './app/layout/styles.css';
import 'react-widgets/dist/css/react-widgets.css';
import App from './app/layout/App';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from './app/layout/ScrollToTop';
import dateFnsLocalizer from 'react-widgets-date-fns';

new dateFnsLocalizer();

//Below can be imported to agent.ts and use history.push() method
//to redirect users to notfound page in the event for 404
export const history = createBrowserHistory();

ReactDOM.render(
	//<Router> is low level router component which synchronize history
	//with a state management lib like Redux and MobX
	<Router history={history}>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</Router>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
