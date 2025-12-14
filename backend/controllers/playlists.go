package controllers

import (
	"fmt"
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// สร้าง Playlist พร้อมเพิ่มเพลงเข้าทันที
func CreatePlaylist(c *gin.Context) {

	var body entity.Playlist

	if err := c.ShouldBindJSON((&body)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request body"})
		return
	}

	db := configs.DB()

	for _, item := range body.Sounds {
		// ตรวจเช็ค SoundID
		var sound entity.Sound
		db.Where("id = ?", item.ID).First(&sound)
		fmt.Printf("SoundId: %v\n", sound.ID)
		if sound.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "sound not found"})
			return
		}
	}

	// สร้าง Play
	playlist := entity.Playlist{
		Title:    body.Title,
		MemberID: body.MemberID,
		Sounds:   body.Sounds,
	}

	db.Create(&playlist)

	c.JSON(http.StatusCreated, playlist)

}

// GET /playlists
func FindPlaylists(c *gin.Context) {
	var Playlists []entity.Playlist

	// parameter creator_id
	MemberID := c.Query("member_id")

	if MemberID != "" {
		if err := configs.DB().Preload("Sounds").Preload("Member").Raw("SELECT * FROM playlists WHERE member_id=?", MemberID).Find(&Playlists).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := configs.DB().Preload("Sounds").Preload("Member").Raw("SELECT * FROM playlists").Find(&Playlists).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, Playlists)
}

// PUT /playlist/:id
func UpdatePlaylist(c *gin.Context) {
	var Playlist entity.Playlist
	if err := c.ShouldBindJSON(&Playlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := configs.DB().Where("id = ?", Playlist.ID).First(&Playlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := configs.DB().Save(&Playlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

// GET /playlist/:id
func FindPlaylistById(c *gin.Context) {
	var Playlist entity.Playlist
	id := c.Param("id")
	if tx := configs.DB().Preload("Sounds").Preload("Member").Where("id = ?", id).First(&Playlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, Playlist)
}

// DELETE /Playlist/:id
func DeletePlaylistById(c *gin.Context) {
	id := c.Param("id")
	if tx := configs.DB().Exec("DELETE FROM playlists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
