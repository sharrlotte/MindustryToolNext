'use client';

import React from 'react';

import { reportError } from '@/lib/error';

import ErrorMessage from './error-message';

interface Props {
	label?: string;
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

	componentDidCatch(error: Error, _errorInfo: React.ErrorInfo): void {
		this.setState({ error });
		console.error({ [this.props.label ?? 'error']: this.props.children });
		reportError(error);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorMessage error={this.state.error} />;
		}

		return this.props.children;
	}
}
