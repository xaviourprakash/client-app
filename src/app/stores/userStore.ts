/** @format */
import {
	makeObservable,
	action,
	computed,
	observable,
	runInAction,
} from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { IUser, IUserFormValues } from './../models/user';
import { RootStore } from './rootStore';

export default class UserStore {
	@observable rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this);
	}

	@observable user: IUser | null = null;

	//To check user is logged in
	@computed get isLoggedIn() {
		return !!this.user;
	}

	@action login = async (values: IUserFormValues) => {
		try {
			const user = await agent.User.login(values);

			//Enforces that any modification to the state must happen inside of an action.
			runInAction(() => {
				this.user = user;
			});

			this.rootStore.commonStore.setToken(user.token);
			this.rootStore.modalStore.closeModal();
			history.push('/activities');
		} catch (error) {
			throw error;
		}
	};

	@action register = async (values: IUserFormValues) => {
		try {
			const user = await agent.User.register(values);
			this.rootStore.commonStore.setToken(user.token);
			this.rootStore.modalStore.closeModal();
			history.push('/activities');
		} catch (error) {
			throw error;
		}
	};

	@action getUser = async () => {
		try {
			const user = await agent.User.currentUser();

			//Enforces that any modification to the state must happen inside of an action.
			runInAction(() => {
				this.user = user;
			});
		} catch (error) {
			console.log(error);
		}
	};

	@action logout = () => {
		this.rootStore.commonStore.setToken(null);
		this.user = null;
		history.push('/');
	};
}
