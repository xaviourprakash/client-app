/** @format */

import {
	makeObservable,
	action,
	computed,
	observable,
	runInAction,
} from 'mobx';
import { SyntheticEvent } from 'react';
import { history } from '../..';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { IActivity } from './../models/activity';
import { RootStore } from './rootStore';
import { toast } from 'react-toastify';

export default class ActivityStore {
	@observable rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this);
	}

	@observable target = '';
	@observable loadingInitial = false;
	@observable submitting = false;
	@observable activity: IActivity | null = null;
	@observable loading = false;

	//Dynamic keyed observable map for activity list from MobX - which has additional functionality
	@observable activityRegistry = new Map();

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
					activity.attendees = activity.userActivities;

					setActivityProps(activity, this.rootStore.userStore.user!);
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
			return activity;
		} else {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				runInAction(() => {
					setActivityProps(activity, this.rootStore.userStore.user!);
					this.activity = activity;
					this.activityRegistry.set(activity.id, activity);
					this.loadingInitial = false;
				});
				return activity;
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
			const attendee = createAttendee(this.rootStore.userStore.user!);
			attendee.isHost = true;
			let attendees = [];
			attendees.push(attendee);
			activity.attendees = attendees;
			activity.isHost = true;
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.submitting = false;
			});
			history.push(`/activities/${activity.id}`);
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
			history.push(`/activities/${activity.id}`);
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

	@action attendActivity = async () => {
		const attendee = createAttendee(this.rootStore.userStore.user!);
		this.loading = true;
		try {
			await agent.Activities.attend(this.activity!.id);
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees.push(attendee);
					this.activity.isGoing = true;
					this.activityRegistry.set(this.activity.id, this.activity);
					this.loading = false;
				}
			});
		} catch (error) {
			runInAction(() => {
				this.loading = false;
			});
			toast.error('Problem signing up to activity');
		}
	};

	@action cancelAttendance = async () => {
		this.loading = true;
		try {
			await agent.Activities.unattend(this.activity!.id);
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees = this.activity.attendees.filter(
						(a) => a.username !== this.rootStore.userStore.user!.userName,
					);
					this.activity.isGoing = false;
					this.activityRegistry.set(this.activity.id, this.activity);
					this.loading = false;
				}
			});
		} catch (error) {
			runInAction(() => {
				this.loading = false;
			});
			toast.error('Problem cancelling attendance');
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
