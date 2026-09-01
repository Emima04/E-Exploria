package models

import (
	"server/config"
	"gorm.io/gorm"
)

type UserProgress struct {
	gorm.Model
	UserID    uint   `json:"user_id" gorm:"uniqueIndex:idx_user_mission;not null"`
	MissionID uint   `json:"mission_id" gorm:"uniqueIndex:idx_user_mission;not null"`
	Progress  int    `json:"progress" gorm:"default:0"` // 0 to 100
	Score     int    `json:"score" gorm:"default:0"`
	Status    string `json:"status" gorm:"default:'Started'"` // Started, Completed
}

func MigrateProgress() {
	config.DB.AutoMigrate(&UserProgress{})
}
