import React from 'react';

import { getLoggedErrorMessage } from '@/lib/utils';
import { reportError } from '@/query/api';
import axiosInstance from '@/query/config/config';

import * as Sentry from '@sentry/nextjs';

import ErrorMessage from './error-message';

interface Props {
	children: React.ReactNode;
}

type State =
	| {
			hasError: false;
			error?: Error;
	  }
	| {
			hasError: true;
			error: Error;
	  };

export class CatchError extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componwentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.log(error);
		console.log(errorInfo);
		this.setState({ error });
		reportError(axiosInstance, getLoggedErrorMessage(error as any));
		Sentry.captureException(error);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorMessage error={this.state.error} />;
		}
		return this.props.children;
	}
}
