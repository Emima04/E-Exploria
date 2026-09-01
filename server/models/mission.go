package models

import (
	"server/config"

	"gorm.io/gorm"
)

type Mission struct {
	gorm.Model

	Title       string `gorm:"not null" json:"title"`
	Description string `gorm:"type:text" json:"description"`

	Difficulty  string `gorm:"default:'Easy'" json:"difficulty"`

	XPReward    int    `gorm:"default:100" json:"xp_reward"`

	Status      string `gorm:"default:'Active'" json:"status"`

	FacultyID   uint   `json:"faculty_id"`
	DomainKey   string `json:"domain_key" gorm:"default:'HTML5'"` // HTML5, CSS3, JS, DBMS, AI
	OrderIndex  int    `json:"order_index" gorm:"default:0"`
}

func MigrateMissions() {
	config.DB.AutoMigrate(&Mission{})
}