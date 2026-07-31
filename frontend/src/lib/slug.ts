export function slugify(season: string) {
    return season.toLowerCase().replaceAll(" ", "-");
};

export function unslugify(slug: string) {
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};