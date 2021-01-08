/** @format */

import { useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';

const ScrollToTop = ({ children }: any) => {
	//useLocation, which returns the current location object. This is useful any time you need to know the current URL.
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return children;
};

export default withRouter(ScrollToTop);
