/** @format */

import React from 'react';
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';

interface IProps {
	error: AxiosResponse;
	text?: string;
}

export const ErrorMessage = ({ error, text }: IProps) => {
	return (
		<Message error>
			<Message.Header>{error.status}</Message.Header>
			{error.data && Object.keys(error.data.errors).length > 0 && (
				<Message.List>
					{Object.values(error.data.errors)
						.flat()
						.map((err: any, i) => (
							<Message.Item key={i}>{err}</Message.Item>
						))}
				</Message.List>
			)}
			{text && <Message.Content content={text} />}
		</Message>
	);
};
