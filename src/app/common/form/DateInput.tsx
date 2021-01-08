/** @format */

import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';

interface IProps
	extends FieldRenderProps<Date, HTMLInputElement>,
		FormFieldProps {
	id?: string;
}

export const DateInput = ({
	input,
	width,
	messages,
	date = false,
	time = false,
	placeholder,
	meta: { touched, error },
	...rest
}: IProps) => {
	return (
		<Form.Field error={touched && !!error} width={width}>
			<DateTimePicker
				messages={messages}
				placeholder={placeholder}
				value={input.value || null}
				onChange={input.onChange}
				{...rest}
			/>
			{touched && error && (
				<Label basic color='red'>
					{error}
				</Label>
			)}
		</Form.Field>
	);
};
