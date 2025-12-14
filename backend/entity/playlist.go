package entity

import "gorm.io/gorm"

type Playlist struct {
	gorm.Model
	Title    string  `json:"title"`
	MemberID uint    `json:"member_id"`
	Member   *Member `gorm:"foreignKey:MemberID" json:"member"`
	Sounds   []Sound `gorm:"many2many:sound_playlists" json:"sounds"`
}
