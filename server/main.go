package main

import (
	"log"
	"os"
	"server/config"
	"server/controllers"
	"server/middleware"
	"server/models"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		if fallbackErr := godotenv.Load("server/.env"); fallbackErr != nil {
			log.Println("No .env file found; using process environment variables")
		}
	}

	// Initialize Database Connection
	config.ConnectDatabase()

	// Sync database schemas
	models.MigrateUsers()
	models.MigrateMissions()
	models.MigrateQuestions()
	models.MigrateProgress()
	models.MigrateAchievements()
	models.MigrateMaterials()
	models.MigrateAnnouncements()

	// Seed Initial Data
	SeedInitialData()

	r := gin.Default()

	// CORS Middleware to allow your React application to talk to the backend
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public Routes
	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)

	// Protected Routes (Required Authentication)
	auth := r.Group("/api")
	auth.Use(middleware.AuthRequired())
	{
		auth.GET("/profile", controllers.GetProfile)
		auth.PUT("/profile", controllers.UpdateProfile)
		auth.POST("/student/claim-daily", controllers.ClaimDaily)
		auth.GET("/student/achievements", controllers.GetAchievements)

		auth.GET("/cases", controllers.GetCases)
		auth.GET("/missions", controllers.GetMissions)
		auth.GET("/missions/:id/questions", controllers.GetMissionQuestions)
		auth.POST("/missions/:id/submit", controllers.SubmitMissionAnswer)

		auth.GET("/status", controllers.GetStatus)
		auth.GET("/leaderboard", controllers.GetLeaderboard)
		auth.POST("/ai/chat", controllers.AIChat)

		auth.GET("/materials", controllers.GetMaterials)
		auth.GET("/announcements", controllers.GetAnnouncements)

		// Faculty Specific Management Routes
		faculty := auth.Group("/faculty")
		faculty.Use(middleware.RoleRequired("faculty"))
		{
			faculty.GET("/stats", controllers.GetFacultyStats)
			faculty.GET("/students", controllers.GetStudents)
			faculty.GET("/achievements", controllers.GetFacultyAchievements)

			faculty.POST("/missions", controllers.CreateMission)
			faculty.PUT("/missions/:id", controllers.UpdateMission)
			faculty.DELETE("/missions/:id", controllers.DeleteMission)

			faculty.POST("/questions", controllers.CreateQuestion)
			faculty.PUT("/questions/:id", controllers.UpdateQuestion)
			faculty.DELETE("/questions/:id", controllers.DeleteQuestion)

			faculty.POST("/materials", controllers.CreateMaterial)
			faculty.DELETE("/materials/:id", controllers.DeleteMaterial)

			faculty.POST("/announcements", controllers.CreateAnnouncement)
			faculty.DELETE("/announcements/:id", controllers.DeleteAnnouncement)
		}
	}

	// Run the backend server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}

func SeedInitialData() {
	// 1. Seed Achievements
	var countAchievements int64
	config.DB.Model(&models.Achievement{}).Count(&countAchievements)
	if countAchievements == 0 {
		achievements := []models.Achievement{
			{Key: "first_mission", Title: "🏆 First Mission", Description: "Completed your first decryption mission", Icon: "Trophy"},
			{Key: "streak_7", Title: "🔥 7 Day Streak", Description: "Maintained a streak for 7 consecutive days", Icon: "Flame"},
			{Key: "xp_1000", Title: "⭐ 1000 XP", Description: "Amassed over 1,000 learning experience points", Icon: "Star"},
			{Key: "missions_10", Title: "🎯 10 Missions Completed", Description: "Decrypted 10 system nodes", Icon: "Target"},
		}
		for _, ach := range achievements {
			config.DB.Create(&ach)
		}
		log.Println("✅ Achievements Seeded Successfully")
	}

	// 2. Seed Missions & Questions
	var countMissions int64
	config.DB.Model(&models.Mission{}).Count(&countMissions)
	if countMissions == 0 {
		missions := []models.Mission{
			{Title: "HTML Dungeon", Description: "Learn the core markup tags and structural frameworks of the World Wide Web.", Difficulty: "Easy", XPReward: 100, Status: "Active", DomainKey: "HTML5", OrderIndex: 0},
			{Title: "CSS Castle", Description: "Configure layout layout rules, style cascading overrides, and custom matrix grids.", Difficulty: "Easy", XPReward: 120, Status: "Active", DomainKey: "CSS3", OrderIndex: 1},
			{Title: "JavaScript Forest", Description: "Establish scripting logic triggers, scope variables, and loop iteration engines.", Difficulty: "Medium", XPReward: 150, Status: "Active", DomainKey: "JS", OrderIndex: 2},
			{Title: "Database Breach", Description: "Recover missing relational data catalogs and inspect query filter blocks.", Difficulty: "Hard", XPReward: 200, Status: "Active", DomainKey: "DBMS", OrderIndex: 3},
			{Title: "AI Nexus", Description: "Debug deep model neural pathways and correct evaluation weight anomalies.", Difficulty: "Hard", XPReward: 250, Status: "Active", DomainKey: "AI", OrderIndex: 4},
		}

		questionsMap := map[string][]models.Question{
			"HTML5": {
				{Question: "What does HTML stand for?", Options: `["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Multi Language"]`, Correct: 0, XP: 20},
				{Question: "Which HTML tag is used for the largest heading?", Options: `["<heading>", "<h6>", "<h1>"]`, Correct: 2, XP: 20},
				{Question: "What is the correct tag for a line break?", Options: `["<br>", "<lb>", "<break>"]`, Correct: 0, XP: 20},
				{Question: "Which attribute is used to provide alternative text for an image?", Options: `["alt", "src", "title"]`, Correct: 0, XP: 20},
				{Question: "How do you create a hyperlink in HTML?", Options: `["<a href='url'>Link</a>", "<link url='url'>Link</link>", "<hyperlink src='url'>Link</hyperlink>"]`, Correct: 0, XP: 20},
			},
			"CSS3": {
				{Question: "What does CSS stand for?", Options: `["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"]`, Correct: 1, XP: 24},
				{Question: "Where in an HTML document is the correct place to refer to an external style sheet?", Options: `["In the <body> section", "At the end of the document", "In the <head> section"]`, Correct: 2, XP: 24},
				{Question: "Which property changes text color?", Options: `["font-color", "color", "text-color"]`, Correct: 1, XP: 24},
				{Question: "How do you make all paragraphs bold?", Options: `["p { font-weight: bold; }", "p { text-weight: bold; }", "p { font: bold; }"]`, Correct: 0, XP: 24},
				{Question: "Which property controls the space between lines of text?", Options: `["line-height", "spacing", "text-height"]`, Correct: 0, XP: 24},
			},
			"JS": {
				{Question: "How do you write 'Hello World' in an alert box?", Options: `["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');"]`, Correct: 2, XP: 30},
				{Question: "How do you create a function in JavaScript?", Options: `["function myFunction()", "function:myFunction()", "function = myFunction()"]`, Correct: 0, XP: 30},
				{Question: "Which keyword declares a block-scoped variable?", Options: `["var", "let", "const"]`, Correct: 1, XP: 30},
				{Question: "What is the result of 2 + '2'?", Options: `["4", "22", "TypeError"]`, Correct: 1, XP: 30},
				{Question: "How do you start a for loop?", Options: `["for i = 0; i < 5; i++", "for (let i = 0; i < 5; i++)", "for (i < 5; i++)"]`, Correct: 1, XP: 30},
			},
			"DBMS": {
				{Question: "What does SQL stand for?", Options: `["Structured Query Language", "Strong Question Language", "Structured Question Layout"]`, Correct: 0, XP: 40},
				{Question: "Which SQL statement is used to extract data from a database?", Options: `["EXTRACT", "GET", "SELECT"]`, Correct: 2, XP: 40},
				{Question: "Which clause is used to filter rows?", Options: `["WHERE", "FILTER", "ORDER BY"]`, Correct: 0, XP: 40},
				{Question: "Which SQL statement adds new rows to a table?", Options: `["INSERT INTO", "ADD ROW", "UPDATE TABLE"]`, Correct: 0, XP: 40},
				{Question: "What keyword updates existing data in a table?", Options: `["MODIFY", "UPDATE", "CHANGE"]`, Correct: 1, XP: 40},
			},
			"AI": {
				{Question: "What does AI stand for?", Options: `["Advanced Interface", "Artificial Intelligence", "Auto Increment"]`, Correct: 1, XP: 50},
				{Question: "Which field focuses on training machines with data?", Options: `["Machine Learning", "Network Design", "Database Management"]`, Correct: 0, XP: 50},
				{Question: "Which type of learning uses labeled examples?", Options: `["Supervised", "Unsupervised", "Reinforced"]`, Correct: 0, XP: 50},
				{Question: "What is a neural network inspired by?", Options: `["The human brain", "A web browser", "A database"]`, Correct: 0, XP: 50},
				{Question: "Which activation function maps values between 0 and 1?", Options: `["Sigmoid", "ReLU", "Tanh"]`, Correct: 0, XP: 50},
			},
		}

		for _, m := range missions {
			config.DB.Create(&m)
			if qList, ok := questionsMap[m.DomainKey]; ok {
				for _, q := range qList {
					q.MissionID = m.ID
					config.DB.Create(&q)
				}
			}
		}
		log.Println("✅ Missions and Questions Seeded Successfully")
	}
}
