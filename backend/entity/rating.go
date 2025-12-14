package entity

import "gorm.io/gorm"

type Rating struct {
	gorm.Model
	Score    uint    `json:"score"`
	SoundID  uint    `json:"sound_id"`
	Sound    *Sound  `gorm:"foreignKey:SoundID" json:"sound"`
	MemberID uint    `json:"member_id"`
	Member   *Member `gorm:"foreignKey:MemberID" json:"member"`
}
