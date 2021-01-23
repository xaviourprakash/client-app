/** @format */

import { createContext } from 'react';
import { observable, makeObservable, configure } from 'mobx';
import ActivityStore from './activityStore';
import UserStore from './userStore';
import CommonStore from './commonStore';
import ModalStore from './modalStore';

//To strict the state of an object can only be set within @action
configure({ enforceActions: 'always' });

export class RootStore {
	@observable activityStore: ActivityStore;
	@observable userStore: UserStore;
	@observable commonStore: CommonStore;
	@observable modalStore: ModalStore;

	constructor() {
		this.activityStore = new ActivityStore(this);
		this.userStore = new UserStore(this);
		this.commonStore = new CommonStore(this);
		this.modalStore = new ModalStore(this);

		makeObservable(this);
	}
}

export const rootStoreContext = createContext(new RootStore());
