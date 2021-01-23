/** @format */

import { RootStore } from './rootStore';
import { makeObservable, observable, action } from 'mobx';

export default class ModalStore {
	@observable rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this);
	}

	//observable.shallow is to observe the complex component to one level deep,
	//instead of observing the component to complete deep
	//i.e, body property will not be observed deeply as it may contain another component
	@observable.shallow modal = {
		open: false,
		body: null,
	};

	@action openModal = (content: any) => {
		this.modal.open = true;
		this.modal.body = content;
	};

	@action closeModal = () => {
		this.modal.open = false;
		this.modal.body = null;
	};
}
