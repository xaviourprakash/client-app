/** @format */

import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from './../../../app/common/form/TextInput';
import { TextAreaInput } from './../../../app/common/form/TextAreaInput';
import { SelectInput } from './../../../app/common/form/SelectInput';
import { category } from './../../../app/common/options/categoryOptions';
import { DateInput } from './../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { ActivityFormValues } from './../../../app/models/activity';
import {
	combineValidators,
	isRequired,
	composeValidators,
	hasLengthGreaterThan,
} from 'revalidate';
import { rootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
	title: isRequired({ message: 'The title is required' }),
	category: isRequired({ message: 'The category is required' }),
	description: composeValidators(
		isRequired({ message: 'The description is required' }),
		hasLengthGreaterThan(4)({
			message: 'Description needs to be at least 5 characters',
		}),
	)(),
	city: isRequired({ message: 'The city is required' }),
	venue: isRequired({ message: 'The venue is required' }),
	date: isRequired({ message: 'The date is required' }),
	time: isRequired({ message: 'The time is required' }),
});

interface DetailParams {
	id: string;
}

//Below problems are addressed in this component
//When edit button clicked, populate the activity form
//Retain the activity detail state after refresh
//Display empty activity form when create button is clicked
const ActivityForm = ({
	match,
	history,
}: RouteComponentProps<DetailParams>) => {
	const rootStore = useContext(rootStoreContext);
	const {
		submitting,
		loadActivity,
		createActivity,
		editActivity,
	} = rootStore.activityStore;

	//To set initial state for activity form (which is empty) on load
	const [activity, setActivity] = useState(new ActivityFormValues());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		//To populate the activity form by activity id on edit
		const activityId = match.params.id;
		if (activityId) {
			setLoading(true);
			loadActivity(activityId)
				.then((activity) => setActivity(new ActivityFormValues(activity)))
				.finally(() => setLoading(false));
		}
	}, [loadActivity, match.params.id]);

	const handleFinalFormSubmit = (values: any) => {
		const dateAndTime = combineDateAndTime(values.date, values.time);
		const { date, time, ...activity } = values;
		activity.date = dateAndTime;
		if (!activity.id) {
			let newActivity = {
				...activity,
				id: uuid(),
			};
			createActivity(newActivity);
		} else {
			editActivity(activity);
		}
	};

	return (
		<Grid>
			<Grid.Column width={10}>
				<Segment clearing>
					<FinalForm
						validate={validate}
						initialValues={activity}
						onSubmit={handleFinalFormSubmit}
						render={({ handleSubmit, invalid, pristine }) => (
							//invalid -> Disable submit button if the form has invalid data
							//pristine -> Disable submit button if it is true whenever the form is completely empty.
							//It's false when at least something has been written, if the form has been touched in any way
							<Form onSubmit={handleSubmit} loading={loading}>
								<Field
									name='title'
									placeholder='Title'
									value={activity.title}
									component={TextInput}
								/>
								<Field
									name='description'
									placeholder='Description'
									value={activity.description}
									rows={3}
									component={TextAreaInput}
								/>
								<Field
									name='category'
									placeholder='Category'
									value={activity.category}
									component={SelectInput}
									options={category}
								/>
								<Form.Group widths='equal'>
									<Field
										name='date'
										date={true}
										placeholder='Date'
										value={activity.date}
										component={DateInput}
									/>
									<Field
										name='time'
										time={true}
										placeholder='Time'
										value={activity.time}
										component={DateInput}
									/>
								</Form.Group>
								<Field
									name='city'
									placeholder='City'
									value={activity.city}
									component={TextInput}
								/>
								<Field
									name='venue'
									placeholder='Venue'
									value={activity.venue}
									component={TextInput}
								/>
								<Button
									loading={submitting}
									disabled={loading || invalid || pristine}
									floated='right'
									positive
									type='submit'
									content='Submit'
								/>
								<Button
									onClick={
										activity.id
											? () => history.push(`/activities/${activity.id}`)
											: () => history.push('/activities')
									}
									disabled={loading}
									floated='right'
									type='button'
									content='Cancel'
								/>
							</Form>
						)}
					/>
				</Segment>
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityForm);
