package entity

import "gorm.io/gorm"

type Member struct {
	gorm.Model
	Username  string    `gorm:"uniqueIndex" json:"username"`
	Password  string    `json:"password"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	Histories []History `gorm:"foreignKey:MemberID" json:"histories"`
}
