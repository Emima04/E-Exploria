package controllers

import (
	"net/http"
	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt" //  Correct path (note the "/x/")
)

// RegisterInput defines the expected frontend JSON payload
type RegisterInput struct {
	ExplorerName string `json:"explorer_name" binding:"required"`
	Email        string `json:"email" binding:"required"`
	Password     string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input RegisterInput

	// Validate input format
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password safely
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not secure password"})
		return
	}

	// Prepare user record
	user := models.User{
		ExplorerName: input.ExplorerName,
		Email:        input.Email,
		Password:     string(hashedPassword),
	}

	// Save to database
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Explorer name or email already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Welcome Explorer! Profile created successfully."})
}
