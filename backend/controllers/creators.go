package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// GET /creators
func FindCreators(c *gin.Context) {
	var creators []entity.Creator
	if err := configs.DB().Raw("SELECT * FROM creators").Find(&creators).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, creators)
}

// GET /creator/:id
func FindCreatorById(c *gin.Context) {
	var creator entity.Creator
	id := c.Param("id")
	if tx := configs.DB().Where("id = ?", id).First(&creator); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, creator)
}

// DELETE /creator/:id
func DeleteCreatorById(c *gin.Context) {
	id := c.Param("id")
	if tx := configs.DB().Exec("DELETE FROM creators WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
