package models

import (
	"server/config"
	"gorm.io/gorm"
)

type Question struct {
	gorm.Model
	MissionID uint   `json:"mission_id" gorm:"index;not null"`
	Question  string `json:"q" gorm:"not null"`
	Options   string `json:"options" gorm:"type:text;not null"` // JSON array string e.g. ["A", "B", "C"]
	Correct   int    `json:"correct" gorm:"not null"`           // Index of correct option (0-based)
	XP        int    `json:"xp" gorm:"default:10"`
}

func MigrateQuestions() {
	config.DB.AutoMigrate(&Question{})
}
