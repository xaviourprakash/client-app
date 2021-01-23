/** @format */

import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { Segment } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import { Image } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Fragment, useContext } from 'react';
import { rootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';

const HomePage = () => {
	const rootStore = useContext(rootStoreContext);
	const { isLoggedIn, user } = rootStore.userStore;
	const { openModal } = rootStore.modalStore;
	return (
		<Segment inverted textAlign='center' vertical className='masthead'>
			<Container text>
				<Header as='h1' inverted>
					<Image
						size='massive'
						src='/assets/logo.png'
						alt='logo'
						style={{ marginBottom: 12 }}
					/>
					Reactivities
				</Header>
				{isLoggedIn && user ? (
					<Fragment>
						<Header
							as='h2'
							inverted
							content={`Welcome back ${user.displayName}`}
						/>
						<Button as={Link} to='/activities' size='huge' inverted>
							Go to activities!
						</Button>
					</Fragment>
				) : (
					<Fragment>
						<Header as='h2' inverted content='Welcome to Reactivities' />
						<Button
							onClick={() => openModal(<LoginForm />)}
							size='huge'
							inverted>
							Login
						</Button>
						<Button
							onClick={() => openModal(<RegisterForm />)}
							size='huge'
							inverted>
							Register
						</Button>
					</Fragment>
				)}
			</Container>
		</Segment>
	);
};

export default observer(HomePage);
