import React, { Fragment, ReactNode } from 'react';

type Props = {
  number: number;
  children: ReactNode;
};
export default function Skeletons({ children, number }: Props) {
  return new Array(number).fill(1).map((_, index) => <Fragment key={index}>{children}</Fragment>);
}
