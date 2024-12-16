const parseIsFavorite = (isFavorite) =>
	typeof isFavorite === "boolean" ? isFavorite : null;

const parseType = (type) =>
	["personal", "work", "home"].includes(type) ? type : null;

export const parseFilterParams = (query) => {
	const { isFavorite, contactType } = query;

	const parsedIsFavorite = parseIsFavorite(isFavorite);
	const parsedType = parseType(contactType);

	return {
		isFavorite: parsedIsFavorite,
		type: parsedType,
	};
};