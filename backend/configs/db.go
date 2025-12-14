package configs

import (
	"example.com/go-example-api/entity"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa-example.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database
}

func SetupDatabase() {

	// Migrate the schema
	db.AutoMigrate(
		&entity.Creator{},
		&entity.History{},
		&entity.Member{},
		&entity.Playlist{},
		&entity.Rating{},
		&entity.SoundPlaylist{},
		&entity.SoundType{},
		&entity.Sound{},
	)

	password, _ := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	// Member
	db.Model(&entity.Member{}).Create(&entity.Member{
		Username: "demo",
		Password: string(password),
		Email:    "demo@email.com",
	})

	// Creator
	db.Model(&entity.Creator{}).Create(&entity.Member{
		Username: "Clash",
		Password: string(password),
		Email:    "clash@email.com",
	})
	db.Model(&entity.Creator{}).Create(&entity.Member{
		Username: "Potato",
		Password: string(password),
		Email:    "patato@email.com",
	})
	db.Model(&entity.Creator{}).Create(&entity.Member{
		Username: "Khemkonez",
		Password: string(password),
		Email:    "khemkonez@email.com",
	})

	// Sound Type
	db.Model(&entity.SoundType{}).Create(&entity.SoundType{
		Name: "Pop",
	})
	db.Model(&entity.SoundType{}).Create(&entity.SoundType{
		Name: "Rock",
	})
	db.Model(&entity.SoundType{}).Create(&entity.SoundType{
		Name: "HipHop",
	})

	// Sound
	db.Model(&entity.Sound{}).Create(&entity.Sound{
		Title:       "ขอเช็ดน้ำตา",
		Artist:      "Clash",
		SoundTypeID: 2, // สมมติว่า 2 คือ Rock
		CreatorID:   1, // สมมติว่า 1 คือ Clash
	})
	db.Model(&entity.Sound{}).Create(&entity.Sound{
		Title:       "เธอยัง",
		Artist:      "Potato",
		SoundTypeID: 1, // สมมติว่า 1 คือ Pop
		CreatorID:   2, // สมมติว่า 2 คือ Potato
	})

}
