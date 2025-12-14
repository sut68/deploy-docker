package entity

import "gorm.io/gorm"

type Sound struct {
	gorm.Model
	Title       string     `json:"title"`
	Artist      string     `json:"artist"`
	SoundTypeID uint       `json:"sound_type_id"`
	SoundType   *SoundType `gorm:"foreignKey:SoundTypeID"`
	CreatorID   uint       `json:"creator_id"`
	Creator     *Creator   `gorm:"foreignKey:CreatorID" json:"creator"`
	Ratings     []Rating   `gorm:"foreignKey:SoundID" json:"ratings"`
}
