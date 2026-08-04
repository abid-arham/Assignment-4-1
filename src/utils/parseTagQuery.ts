export const parseTagQuery = (tags: unknown): string[] => {
    const values = Array.isArray(tags) ? tags : [tags];

    return values.flatMap((value) => {
        if (typeof value !== "string") {
            return [];
        }

        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return [];
        }

        try {
            const parsedValue: unknown = JSON.parse(trimmedValue);

            if (Array.isArray(parsedValue)) {
                return parsedValue.filter((tag): tag is string => typeof tag === "string")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
            }

            if (typeof parsedValue === "string") {
                return parsedValue.trim() ? [parsedValue.trim()] : [];
            }
        } catch {
            // A regular query parameter such as ?tags=typescript is not JSON.
        }

        return trimmedValue.split(",").map((tag) => tag.trim()).filter(Boolean);
    });
};