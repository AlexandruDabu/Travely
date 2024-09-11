export const truncateBio = (bio: string | undefined) => {
    if (!bio) return 'A passionate traveler with no bio, just looking around.';
    return bio.length > 200 ? `${bio.substring(0, 255)}...` : bio;
};

export const truncateName=(name: string, truncateNumber: number) => {
    return name.length > 26 ? `${name?.substring(0, truncateNumber)}...` : name;
}