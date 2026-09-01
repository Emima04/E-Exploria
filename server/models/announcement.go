package models

import (
	"server/config"
	"gorm.io/gorm"
)

type Announcement struct {
	gorm.Model
	FacultyID uint   `json:"faculty_id"`
	Title     string `json:"title" gorm:"not null"`
	Content   string `json:"content" gorm:"type:text;not null"`
}

func MigrateAnnouncements() {
	config.DB.AutoMigrate(&Announcement{})
}
