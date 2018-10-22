SELECT songs.artist, songs.song, songs.year, albums.album, albums.year
FROM songs
INNER JOIN albums ON songs.artist = albums.artist AND songs.year = albums.year;
