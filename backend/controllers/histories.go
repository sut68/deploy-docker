package controllers

import (
	"net/http"
	"time"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /new-history
func CreateHistory(c *gin.Context) {
	var Payload entity.History

	if err := c.ShouldBindJSON(&Payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := configs.DB().Model(&entity.History{}).Create(&entity.History{
		MemberID: Payload.MemberID,
		SoundID:  Payload.SoundID,
		PlayedAt: time.Now(),
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "created successful"})
}

// GET /histories
func FindHistories(c *gin.Context) {
	var Histories []entity.History

	// parameter member_id
	MemberId := c.Query("member_id")

	if MemberId != "" {
		if err := configs.DB().Preload("Sound").Preload("Member").Raw("SELECT * FROM histories WHERE member_id=?", MemberId).Find(&Histories).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := configs.DB().Preload("Sound").Preload("Member").Raw("SELECT * FROM histories").Find(&Histories).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, Histories)
}

// DELETE /history/:id
func DeleteHistoryById(c *gin.Context) {
	id := c.Param("id")
	if tx := configs.DB().Exec("DELETE FROM histories WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
