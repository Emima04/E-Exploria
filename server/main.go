package main

import (
	"server/config"
	"server/controllers"
	"server/models"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Database Connection
	config.ConnectDatabase()

	// Sync database schemas
	models.MigrateUsers()

	r := gin.Default()

	// CORS Middleware to allow your React application to talk to the backend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Change if your React port is different
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Auth Route
	r.POST("/api/register", controllers.Register)

	// Run the backend server
	r.Run(":8080")
}
