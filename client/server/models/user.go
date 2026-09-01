package models

import (
	"server/config"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ExplorerName string `gorm:"unique;not null" json:"explorer_name"`
	Email        string `gorm:"unique;not null" json:"email"`
	Password     string `gorm:"not null" json:"password"`
	Role         string `gorm:"default:'student'" json:"role"` // student, faculty, admin
	XP           int    `gorm:"default:0" json:"xp"`
}

func MigrateUsers() {
	config.DB.AutoMigrate(&User{})
}
