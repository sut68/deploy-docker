package main

import (
	"example.com/go-example-api/configs"
	"example.com/go-example-api/controllers"
	"github.com/gin-gonic/gin"
)

const PORT = "8080"

func main() {
	configs.ConnectionDB()
	configs.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("/")
	{
		// router.Use(middlewares.Authorizes())
		// {
		// Member routes
		router.GET("/members", controllers.FindMembers)
		router.GET("/member/:id", controllers.FindMemberById)
		router.DELETE("/member/:id", controllers.DeleteMemberById)

		// Creator routes
		router.GET("/creators", controllers.FindCreators)
		router.GET("/creator/:id", controllers.FindCreatorById)
		router.DELETE("/creator/:id", controllers.DeleteCreatorById)

		// Sound routes
		router.POST("/new-sound", controllers.CreateSound)
		router.GET("/sounds", controllers.FindSounds)
		router.PUT("/sound/update", controllers.UpdateSound)
		router.GET("/sound/:id", controllers.FindSoundById)
		router.DELETE("/sound/:id", controllers.DeleteSoundById)

		// Rating routes
		router.POST("/new-rating", controllers.CreateRating)
		router.POST("/ratings", controllers.FindRatings)

		// Playlist routes
		router.POST("/new-playlist", controllers.CreatePlaylist)
		router.PUT("/playlist/update", controllers.UpdatePlaylist)
		router.GET("/playlists", controllers.FindPlaylists)
		router.GET("/playlist/:id", controllers.FindPlaylistById)
		router.DELETE("/playlist/:id", controllers.DeletePlaylistById)

		// List Sound in playlist routes
		router.POST("/add-to-playlist", controllers.AddToPlaylist)
		router.POST("/remove-out-from-playlist/:sound_playlist", controllers.AddToPlaylist)

		// Histories routes
		router.POST("/new-history", controllers.CreateHistory)
		router.GET("/histories", controllers.FindHistories)
		router.DELETE("/history/:id", controllers.DeleteHistoryById)

		// Sound Types
		router.GET("/sound-types", controllers.FindSoundTypes)
		// }
	}

	// Signup routes
	r.POST("/member/signup", controllers.CreateMember)
	r.POST("/creator/signup", controllers.CreateCreator)

	// Login routes
	r.POST("/member/auth", controllers.LoginMember)
	r.POST("/creator/auth", controllers.LoginCreator)

	// Run the server go run main.go
	r.Run("localhost: " + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
