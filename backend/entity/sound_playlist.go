package entity

type SoundPlaylist struct {
	ID         uint      `gorm:"primarykey"`
	PlaylistID uint      `json:"playlist_id"`
	Playlist   *Playlist `gorm:"foreignKey:PlaylistID" json:"playlist"`
	SoundID    uint      `json:"sound_id"`
	Sound      *Sound    `gorm:"foreignKey:SoundID" json:"sound"`
}
