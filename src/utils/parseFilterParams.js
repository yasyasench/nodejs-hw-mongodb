const parseIsFavourite = (isFavourite) =>
	typeof isFavourite === "boolean" ? isFavourite : null;

const parseType = (type) =>
	["personal", "work", "home"].includes(type) ? type : null;

export const parseFilterParams = (query) => {
	const { isFavourite, contactType } = query;

	const parsedIsFavourite = parseIsFavourite(isFavourite);
	const parsedType = parseType(contactType);

	return {
		isFavourite: parsedIsFavourite,
		type: parsedType,
	};
};