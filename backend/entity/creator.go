package entity

import "gorm.io/gorm"

type Creator struct {
	gorm.Model
	Username string `gorm:"uniqueIndex" json:"username"`
	Password string `json:"password"`
	Email    string `gorm:"uniqueIndex" json:"email"`
}
