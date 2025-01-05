import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
	const isKnownOrder = Object.values(SORT_ORDER).includes(sortOrder);

	if (isKnownOrder) return sortOrder;

	return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
	const sortKey = "name";

	if (sortBy === sortKey) return sortBy;

	return "_id";
};

export const parseSortParams = (query) => {
	const { sortBy, sortOrder } = query;

	const parsedSortBy = parseSortBy(sortBy);
	const parsedSortOrder = parseSortOrder(sortOrder);

	return {
		sortBy: parsedSortBy,
		sortOrder: parsedSortOrder,
	};
};