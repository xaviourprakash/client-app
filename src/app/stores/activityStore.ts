/** @format */

import {
	action,
	computed,
	makeObservable,
	observable,
	configure,
	runInAction,
} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from './../models/activity';

//To strict the state of an object can only be set within @action
configure({ enforceActions: 'always' });

class ActivityStore {
	@observable target = '';
	@observable loadingInitial = false;
	@observable submitting = false;
	@observable activity: IActivity | null = null;

	//Dynamic keyed observable map for activity list from MobX - which has additional functionality
	@observable activityRegistry = new Map();

	constructor() {
		makeObservable(this);
	}

	@computed get activitiesByDate() {
		return this.groupActivitiesByDate(
			Array.from(this.activityRegistry.values()),
		);
	}

	@action loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activities = await agent.Activities.list();

			//Enforces that any modification to the state must happen inside of an action.
			runInAction(() => {
				activities.forEach((activity) => {
					activity.date = new Date(activity.date);
					this.activityRegistry.set(activity.id, activity);
				});
				this.loadingInitial = false;
			});
		} catch (error) {
			//Enforces that any modification to the state must happen inside of an action.
			runInAction(() => {
				this.loadingInitial = false;
			});
			console.log(error);
		}
	};

	@action loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			this.activity = activity;
		} else {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				runInAction(() => {
					activity.date = new Date(activity.date);
					this.activity = activity;
					this.loadingInitial = false;
				});
			} catch (error) {
				runInAction(() => {
					this.loadingInitial = false;
				});
				console.log(error);
			}
		}
	};

	@action clearActivity = () => {
		this.activity = null;
	};

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.submitting = false;
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			console.log(error);
		}
	};

	@action editActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.activity = activity;
				this.submitting = false;
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			console.log(error);
		}
	};

	@action deleteActivity = async (
		event: SyntheticEvent<HTMLButtonElement>,
		id: string,
	) => {
		this.submitting = true;
		this.target = event.currentTarget.name;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.submitting = false;
				this.target = '';
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
				this.target = '';
			});
			console.log(error);
		}
	};

	//Private methods
	getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	groupActivitiesByDate = (activities: IActivity[]) => {
		const sortedActivities = activities.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);

		return Object.entries(
			sortedActivities.reduce((activities, activity) => {
				const date = activity.date.toISOString().split('T')[0];
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];
				return activities;
			}, {} as { [key: string]: IActivity[] }),
		);
	};
}

export const activityStoreContext = createContext(new ActivityStore());
