/** @format */

import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {
	Route,
	withRouter,
	RouteComponentProps,
	Switch,
} from 'react-router-dom';
import NavBar from '../../features/nav/NavBar';
import 'semantic-ui-css/semantic.min.css';
import ActivityDashboard from './../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import LoginForm from '../../features/user/LoginForm';
import NotFound from './NotFound';
import HomePage from './../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import { rootStoreContext } from '../stores/rootStore';
import ModelContainer from './../common/modals/ModelContainer';

const App = ({ location }: RouteComponentProps) => {
	const rootStore = useContext(rootStoreContext);
	const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
	const { getUser } = rootStore.userStore;

	useEffect(() => {
		if (token) {
			getUser().finally(() => setAppLoaded());
		} else {
			setAppLoaded();
		}
	}, [setAppLoaded, token, appLoaded, getUser]);

	return (
		<Fragment>
			<ModelContainer />
			<ToastContainer position='bottom-right' />
			<Route exact path='/' component={HomePage} />
			<Route
				path={'/(.+)'} //To load the home page as stand alone page, which is outside the Nav bar
				render={() => (
					<Fragment>
						<NavBar />
						<Container style={{ marginTop: '7em' }}>
							<Switch>
								<Route exact path='/activities' component={ActivityDashboard} />
								<Route
									exact
									path='/activities/:id'
									component={ActivityDetails}
								/>
								<Route
									key={location.key}
									exact
									path={['/createActivity', '/manage/:id']}
									component={ActivityForm}
								/>
								<Route component={LoginForm} path='/login' />
								<Route component={NotFound} />
							</Switch>
						</Container>
					</Fragment>
				)}
			/>
		</Fragment>
	);
};

//To get an access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component.
//withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
export default withRouter(observer(App));
