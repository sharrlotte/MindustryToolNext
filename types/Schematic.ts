import { ItemRequirement } from './ItemRequirement';
import { Like } from './Like';

export default interface Schematic {
	id: string;
	name: string;
	authorId: string;
	description: string;
	requirement: ItemRequirement[];
	tags: string[];
	like: number;
	height: number;
	width: number;
	verifyAdmin: string;
	userLike: Like;
}
