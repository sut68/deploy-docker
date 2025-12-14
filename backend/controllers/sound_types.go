package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

func FindSoundTypes(c *gin.Context) {
	var soundTypes []entity.SoundType

	if err := configs.DB().Find(&soundTypes).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, soundTypes)
}
