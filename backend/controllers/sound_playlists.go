package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /add-to-playlist
func AddToPlaylist(c *gin.Context) {
	var SoundPlaylist entity.SoundPlaylist

	if err := c.ShouldBindJSON(&SoundPlaylist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := configs.DB()

	// ตรวจอสบ Sound ID
	var sound entity.Sound
	if tx := db.Where("id = ?", SoundPlaylist.SoundID).First(&sound); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	// ตรวจสอบ Playlist ID
	var playlist entity.Playlist
	if tx := db.Where("id = ?", SoundPlaylist.PlaylistID).First(&playlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	// บันทึกลงฐานข้อมูล SoundPlaylist
	if err := db.Create(&SoundPlaylist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "created successful"})
}

// DELETE /remove-out-from-playlist/:id
func RemoveOutFromPlaylistById(c *gin.Context) {
	id := c.Param("sound_playlist")
	if tx := configs.DB().Exec("DELETE FROM sound_playlists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
