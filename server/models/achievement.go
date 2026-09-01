package models

import (
	"server/config"
	"gorm.io/gorm"
)

type Achievement struct {
	gorm.Model
	Key         string `json:"key" gorm:"unique;not null"` // e.g. "first_mission", "streak_7", "xp_1000", "missions_10"
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description" gorm:"not null"`
	Icon        string `json:"icon" gorm:"default:'Trophy'"`
}

type UserAchievement struct {
	gorm.Model
	UserID        uint `json:"user_id" gorm:"uniqueIndex:idx_user_achievement;not null"`
	AchievementID uint `json:"achievement_id" gorm:"uniqueIndex:idx_user_achievement;not null"`
}

func MigrateAchievements() {
	config.DB.AutoMigrate(&Achievement{})
	config.DB.AutoMigrate(&UserAchievement{})
}
