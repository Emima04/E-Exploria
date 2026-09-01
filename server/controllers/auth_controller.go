package controllers

import (
	"log"
	"net/http"
	"server/config"
	"server/middleware"
	"server/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	ExplorerName string `json:"explorer_name" binding:"required"`
	Email        string `json:"email" binding:"required"`
	Password     string `json:"password" binding:"required"`
	Role         string `json:"role"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ProfileUpdateInput struct {
	ExplorerName string `json:"explorer_name" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
}

func CalculateLevel(xp int) int {
	if xp < 500 {
		return 1
	}
	return 1 + (xp / 500)
}

func Register(c *gin.Context) {
	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please provide a valid explorer name, email, and password"})
		return
	}

	if input.Role == "" {
		input.Role = "explorer"
	}

	validRoles := map[string]bool{
		"explorer": true,
		"faculty":  true,
	}

	if !validRoles[input.Role] {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid role. Allowed values are explorer or faculty."})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not secure password"})
		return
	}

	user := models.User{
		ExplorerName: input.ExplorerName,
		Email:        input.Email,
		Password:     string(hashedPassword),
		Role:         input.Role,
		XP:           0,
		Level:        1,
		Streak:       0,
		Gems:         0,
		LastActive:   "",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Explorer name or email already exists"})
		return
	}

	msg := "Profile created successfully."
	if user.Role == "faculty" {
		msg = "Welcome Faculty! Profile created successfully."
	} else {
		msg = "Welcome Explorer! Profile created successfully."
	}

	c.JSON(http.StatusOK, gin.H{"message": msg, "role": user.Role})
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please provide email and password"})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		log.Printf("auth: login failed - user not found for email=%s\n", input.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password."})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		log.Printf("auth: login failed - password mismatch for email=%s\n", input.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password."})
		return
	}

	// Generate standard JWT
	token, err := middleware.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not generate authentication session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome back Explorer!",
		"token":   token,
		"user": gin.H{
			"explorer_name": user.ExplorerName,
			"email":         user.Email,
			"role":          user.Role,
			"xp":            user.XP,
			"level":         user.Level,
			"streak":        user.Streak,
			"gems":          user.Gems,
			"last_active":   user.LastActive,
		},
	})
}

func GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"explorer_name": user.ExplorerName,
			"email":         user.Email,
			"role":          user.Role,
			"xp":            user.XP,
			"level":         user.Level,
			"streak":        user.Streak,
			"gems":          user.Gems,
			"last_active":   user.LastActive,
		},
	})
}

func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input ProfileUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please provide a valid name and email"})
		return
	}

	input.ExplorerName = strings.TrimSpace(input.ExplorerName)
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	if input.ExplorerName == "" || input.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Name and email cannot be empty"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Profile not found"})
		return
	}

	var duplicate models.User
	if err := config.DB.Where("(explorer_name = ? OR email = ?) AND id <> ?", input.ExplorerName, input.Email, user.ID).First(&duplicate).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Name or email is already in use"})
		return
	}

	user.ExplorerName = input.ExplorerName
	user.Email = input.Email
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "user": gin.H{
		"explorer_name": user.ExplorerName,
		"email":         user.Email,
		"role":          user.Role,
		"xp":            user.XP,
		"level":         user.Level,
		"streak":        user.Streak,
		"gems":          user.Gems,
		"last_active":   user.LastActive,
	}})
}

func ClaimDaily(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	todayStr := time.Now().Format("2006-01-02")
	if user.LastActive == todayStr {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Daily reward already claimed today!"})
		return
	}

	user.XP += 100
	user.Gems += 20
	user.Level = CalculateLevel(user.XP)

	if user.LastActive == "" {
		user.Streak = 1
	} else {
		yesterdayStr := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
		if user.LastActive == yesterdayStr {
			user.Streak += 1
		} else {
			user.Streak = 1
		}
	}
	user.LastActive = todayStr

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to claim reward"})
		return
	}

	CheckAndUnlockAchievements(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Daily chest decrypted! +100 XP, +20 Gems claimed.",
		"user": gin.H{
			"explorer_name": user.ExplorerName,
			"email":         user.Email,
			"role":          user.Role,
			"xp":            user.XP,
			"level":         user.Level,
			"streak":        user.Streak,
			"gems":          user.Gems,
			"last_active":   user.LastActive,
		},
	})
}

func GetAchievements(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var userAch []models.UserAchievement
	if err := config.DB.Where("user_id = ?", userID).Find(&userAch).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"achievements": []models.Achievement{}})
		return
	}

	var achIDs []uint
	for _, ua := range userAch {
		achIDs = append(achIDs, ua.AchievementID)
	}

	if len(achIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"achievements": []models.Achievement{}})
		return
	}

	var achievements []models.Achievement
	config.DB.Find(&achievements, achIDs)

	c.JSON(http.StatusOK, gin.H{"achievements": achievements})
}

func CheckAndUnlockAchievements(userID uint) {
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return
	}

	var missionsCompletedCount int64
	config.DB.Model(&models.UserProgress{}).Where("user_id = ? AND status = 'Completed'", userID).Count(&missionsCompletedCount)

	achievementsList := []struct {
		Key         string
		Title       string
		Description string
		Icon        string
		Condition   bool
	}{
		{Key: "first_mission", Title: "🏆 First Mission", Description: "Completed your first decryption mission", Icon: "Trophy", Condition: missionsCompletedCount >= 1},
		{Key: "streak_7", Title: "🔥 7 Day Streak", Description: "Maintained a streak for 7 consecutive days", Icon: "Flame", Condition: user.Streak >= 7},
		{Key: "xp_1000", Title: "⭐ 1000 XP", Description: "Amassed over 1,000 learning experience points", Icon: "Star", Condition: user.XP >= 1000},
		{Key: "missions_10", Title: "🎯 10 Missions Completed", Description: "Decrypted 10 system nodes", Icon: "Target", Condition: missionsCompletedCount >= 10},
	}

	for _, ach := range achievementsList {
		if ach.Condition {
			var dbAch models.Achievement
			if err := config.DB.Where("key = ?", ach.Key).First(&dbAch).Error; err != nil {
				dbAch = models.Achievement{
					Key:         ach.Key,
					Title:       ach.Title,
					Description: ach.Description,
					Icon:        ach.Icon,
				}
				config.DB.Create(&dbAch)
			}

			var userAch models.UserAchievement
			err := config.DB.Where("user_id = ? AND achievement_id = ?", userID, dbAch.ID).First(&userAch).Error
			if err != nil {
				userAch = models.UserAchievement{
					UserID:        userID,
					AchievementID: dbAch.ID,
				}
				config.DB.Create(&userAch)
			}
		}
	}
}
