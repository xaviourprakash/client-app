/** @format */

import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingComponent = ({
	inverted = true,
	content,
}: {
	inverted?: boolean;
	content?: string;
}) => {
	return (
		<div>
			<Dimmer active inverted={inverted}>
				<Loader content={content} />
			</Dimmer>
		</div>
	);
};

export default LoadingComponent;
