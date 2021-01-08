/** @format */

import { Item, Label } from 'semantic-ui-react';
import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { activityStoreContext } from '../../../app/stores/activityStore';
import ActivityListItem from './ActivityListItem';

const ActivityList = () => {
	const activityStore = useContext(activityStoreContext);
	const { activitiesByDate } = activityStore;

	return (
		<Fragment>
			{activitiesByDate.map(([group, activities]) => (
				<Fragment key={group}>
					<Label size='large' color='blue'>
						{group}
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
