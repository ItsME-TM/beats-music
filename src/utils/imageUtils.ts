export const getSongImage = (song: any, fallbackUrl: string = "/images/music-player.png"): string => {
  if (!song) return fallbackUrl;

  // Handle if image is an array
  if (Array.isArray(song.image)) {
    // Try to get highest quality (usually last or specific indices)
    // Common sizes: 500x500 (index 2), 150x150 (index 1), 50x50 (index 0)
    const imgObj = song.image[2] || song.image[1] || song.image[0];
    
    if (imgObj) {
      if (typeof imgObj === 'string') return imgObj;
      if (imgObj.link) return imgObj.link;
      if (imgObj.url) return imgObj.url; // Some APIs return url instead of link
    }
  } 
  // Handle if image is a single string
  else if (typeof song.image === 'string' && song.image.length > 0) {
    return song.image;
  }
  
  // If we found nothing or empty strings, return fallback
  return fallbackUrl;
};

export const getDownloadUrl = (song: any): string => {
    if (!song) return "";
    
    if (Array.isArray(song.downloadUrl)) {
        // Try highest quality: 320kbps (4), 160kbps (3 or 2), 96kbps (1), 48kbps (0)
        // Indices can vary, usually last is best.
        const urlObj = song.downloadUrl[4] || song.downloadUrl[3] || song.downloadUrl[2] || song.downloadUrl[1] || song.downloadUrl[0];
        if (urlObj) {
            if (typeof urlObj === 'string') return urlObj;
            if (urlObj.link) return urlObj.link;
            if (urlObj.url) return urlObj.url;
        }
    }
    
    return "";
}
