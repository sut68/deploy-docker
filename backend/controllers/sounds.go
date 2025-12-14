package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /create sound
func CreateSound(c *gin.Context) {

	var body entity.Sound

	if err := c.ShouldBindJSON((&body)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request body"})
		return
	}

	db := configs.DB()

	// ตรวจอสบ Sound Type ID
	var soundType entity.SoundType
	if tx := db.Where("id = ?", body.SoundTypeID).First(&soundType); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	// ตรวจสอบ CreatorID
	var creator entity.Creator
	if tx := configs.DB().Where("id = ?", body.CreatorID).First(&creator); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	// บันทึกลงฐานข้อมูล
	if err := configs.DB().Model(&entity.Sound{}).Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, body)
}

// GET /sounds
func FindSounds(c *gin.Context) {
	var sounds []entity.Sound

	// parameter creator_id
	CreatorId := c.Query("creator_id")

	if CreatorId != "" {
		if err := configs.DB().Preload("Creator").Preload("SoundType").Preload("Ratings").Raw("SELECT * FROM sounds WHERE creator_id=?", CreatorId).Find(&sounds).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := configs.DB().Preload("Creator").Preload("SoundType").Preload("Ratings").Raw("SELECT * FROM sounds").Find(&sounds).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, sounds)
}

// PUT /sound/:id
func UpdateSound(c *gin.Context) {
	var sound entity.Sound
	if err := c.ShouldBindJSON(&sound); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := configs.DB().Where("id = ?", sound.ID).First(&sound); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := configs.DB().Save(&sound).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

// GET /sound/:id
func FindSoundById(c *gin.Context) {
	var sound entity.Sound
	id := c.Param("id")
	if tx := configs.DB().Preload("SoundType").Preload("Creator").Preload("Ratings").Where("id = ?", id).First(&sound); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, sound)
}

// DELETE /sound/:id
func DeleteSoundById(c *gin.Context) {
	id := c.Param("id")
	if tx := configs.DB().Exec("DELETE FROM sounds WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
