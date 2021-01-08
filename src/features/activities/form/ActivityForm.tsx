/** @format */

import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { IActivityFormValues } from '../../../app/models/activity';
import React, { useEffect, useContext, useState } from 'react';
import { activityStoreContext } from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from './../../../app/common/form/TextInput';
import { TextAreaInput } from './../../../app/common/form/TextAreaInput';
import { SelectInput } from './../../../app/common/form/SelectInput';
import { category } from './../../../app/common/options/categoryOptions';
import { DateInput } from './../../../app/common/form/DateInput';

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
	const activityStore = useContext(activityStoreContext);
	const {
		createActivity,
		editActivity,
		submitting,
		activity: initialFormState,
		loadActivity,
		clearActivity,
	} = activityStore;

	//To set initial state for activity form (which is empty) on load
	const [activity, setActivity] = useState<IActivityFormValues>({
		id: undefined,
		title: '',
		category: '',
		description: '',
		date: undefined,
		city: '',
		venue: '',
	});

	useEffect(() => {
		//To populate the activity form by activity id on edit
		const activityId = match.params.id;
		if (activityId && activity.id) {
			loadActivity(activityId).then(
				() => initialFormState && setActivity(initialFormState),
			);
		}

		//ComponentWillUnMount process
		return () => {
			clearActivity();
		};
	}, [
		clearActivity,
		loadActivity,
		initialFormState,
		match.params.id,
		activity.id,
	]);

	// const handleSubmit = () => {
	// 	if (activity.id.length === 0) {
	// 		//Here GUID will be auto generated from client side
	// 		let newActivity = { ...activity, id: uuid() };
	// 		createActivity(newActivity).then(() => {
	// 			//To redirect to activity details page after create
	// 			history.push(`/activities/${newActivity.id}`);
	// 		});
	// 	} else
	// 		editActivity(activity).then(() => {
	// 			//To redirect to activity details page after edit
	// 			history.push(`/activities/${activity.id}`);
	// 		});
	// };

	const handleFinalFormSubmit = (values: any) => {
		console.log(values);
	};

	return (
		<Grid>
			<Grid.Column width={10}>
				<Segment clearing>
					<FinalForm
						onSubmit={handleFinalFormSubmit}
						render={({ handleSubmit }) => (
							<Form onSubmit={handleSubmit}>
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
									floated='right'
									positive
									type='submit'
									content='Submit'
								/>
								<Button
									onClick={() => history.push('/activities')}
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
