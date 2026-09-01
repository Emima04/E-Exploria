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
	Role         string `gorm:"default:'explorer'" json:"role"` // explorer, faculty, admin
	XP           int    `gorm:"default:0" json:"xp"`
	Level        int    `gorm:"default:1" json:"level"`
	Streak       int    `gorm:"default:0" json:"streak"`
	Gems         int    `gorm:"default:0" json:"gems"`
	LastActive   string `gorm:"default:''" json:"last_active"`
}

func MigrateUsers() {
	config.DB.AutoMigrate(&User{})
}
