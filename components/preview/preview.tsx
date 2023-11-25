import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

function Preview({ className, children, ...props }: CardProps) {
	return (
		<Card
			className={cn('flex justify-center items-center w-preview min-h-preview animate-appear overflow-hidden', className)}
			{...props}
		>
			{children}
		</Card>
	);
}
interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function Header({ className, children }: HeaderProps) {
	return (
		<div className={cn('overflow-hidden capitalize w-preview h-8 bg-opacity-50 flex px-2', className)}>
			<span className='m-auto'>{children}</span>
		</div>
	);
}
interface ImageProps extends React.HTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
}

function PImage({ className, src, alt }: ImageProps) {
	return (
		<Image
			className={cn('w-preview h-preview', className)}
			src={src}
			alt={alt}
			width={576}
			height={576}
			priority
		/>
	);
}

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

function Actions({ children }: ActionsProps) {
	return <section className='w-full flex justify-around items-center px-1'>{children}</section>;
}

interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

function Description({ children }: DescriptionProps) {
	return <section className='w-full flex items-center py-2 flex-col'>{children}</section>;
}

Preview.Header = Header;
Preview.Actions = Actions;
Preview.Image = PImage;
Preview.Description = Description;

export default Preview;
