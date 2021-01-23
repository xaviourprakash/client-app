/** @format */

import { Grid } from 'semantic-ui-react';
import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RouteComponentProps } from 'react-router-dom';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import { rootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
	id: string;
}

const ActivityDetails = ({
	match,
	history,
}: RouteComponentProps<DetailParams>) => {
	const rootStore = useContext(rootStoreContext);
	const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

	useEffect(() => {
		loadActivity(match.params.id);
	}, [loadActivity, match.params.id, history]);

	if (loadingInitial)
		return <LoadingComponent content='Loading activities...' />;

	if (!activity) return <h2>Activity not found</h2>;

	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityDetailedHeader activity={activity} />
				<ActivityDetailedInfo activity={activity} />
				<ActivityDetailedChat />
			</Grid.Column>
			<Grid.Column width={6}>
				<ActivityDetailedSidebar />
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityDetails);
