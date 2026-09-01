package models

import (
	"server/config"
	"gorm.io/gorm"
)

type Material struct {
	gorm.Model
	FacultyID   uint   `json:"faculty_id"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`
	Subject     string `json:"subject" gorm:"default:'General'"`
	URL         string `json:"url" gorm:"not null"`
}

func MigrateMaterials() {
	config.DB.AutoMigrate(&Material{})
}
