package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /new-rating
func CreateRating(c *gin.Context) {
	var Rating entity.Rating

	if err := c.ShouldBindJSON(&Rating); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := configs.DB().Create(&Rating).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "created successful"})
}

// GET /ratings
func FindRatings(c *gin.Context) {
	var Ratings []entity.Rating

	// parameter member_id
	SoundId := c.Query("sound_id")

	if SoundId != "" {
		if err := configs.DB().Preload("Sound").Preload("Member").Raw("SELECT * FROM ratings WHERE member_id=?", SoundId).Find(&Ratings).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "must be parameter 'sound_id'"})
		return
	}

	c.JSON(http.StatusOK, Ratings)
}
