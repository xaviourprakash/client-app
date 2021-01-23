/** @format */

import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Modal } from 'semantic-ui-react';
import { rootStoreContext } from '../../stores/rootStore';

const ModelContainer = () => {
	const rootStore = useContext(rootStoreContext);
	const {
		modal: { open, body },
		closeModal,
	} = rootStore.modalStore;

	return (
		<Modal open={open} onClose={closeModal} size='mini'>
			<Modal.Content>{body}</Modal.Content>
		</Modal>
	);
};

export default observer(ModelContainer);
