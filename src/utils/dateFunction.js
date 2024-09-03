export function formatReleaseDate(date) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatDateOfBirth(dateStr) {
    const date = new Date(dateStr);

    // Format the date to "Month Day, Year"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}