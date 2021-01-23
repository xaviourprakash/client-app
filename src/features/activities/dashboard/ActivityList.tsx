/** @format */

import { Item, Label } from 'semantic-ui-react';
import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { rootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const ActivityList = () => {
	const rootStore = useContext(rootStoreContext);
	const { activitiesByDate } = rootStore.activityStore;

	return (
		<Fragment>
			{activitiesByDate.map(([group, activities]) => (
				<Fragment key={group}>
					<Label size='large' color='blue'>
						{format(group, 'iiii do MMMM')}
					</Label>
					<Item.Group divided>
						{activities.map((activity) => (
							<ActivityListItem key={activity.id} activity={activity} />
						))}
					</Item.Group>
				</Fragment>
			))}
		</Fragment>
	);
};

export default observer(ActivityList);
