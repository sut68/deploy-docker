package entity

import (
	"time"

	"gorm.io/gorm"
)

type History struct {
	gorm.Model
	PlayedAt time.Time `json:"played_at"`
	SoundID  uint      `json:"sound_id"`
	Sound    *Sound    `gorm:"foreignKey:SoundID" json:"sound"`
	MemberID uint      `json:"member_id"`
	Member   *Member   `gorm:"foreignKey:MemberID" json:"member"`
}
