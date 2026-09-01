package controllers

import (
	"encoding/json"
	"net/http"
	"server/config"
	"server/models"
	"server/services"
	"strings"

	"github.com/gin-gonic/gin"
)

// CaseItem defines student's active case layout
type CaseItem struct {
	ID       uint   `json:"id"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Progress int    `json:"progress"`
	Status   string `json:"status"`
	IconKey  string `json:"iconKey"`
	Domain   string `json:"domain"`
}

type SubmitInput struct {
	Score int `json:"score"`
}

type ChatInput struct {
	Message string                 `json:"message" binding:"required"`
	History []services.ChatMessage `json:"history"`
}

type MissionInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Difficulty  string `json:"difficulty"`
	XPReward    int    `json:"xp_reward"`
	Status      string `json:"status"`
	DomainKey   string `json:"domain_key"`
}

type QuestionInput struct {
	MissionID uint     `json:"mission_id" binding:"required"`
	Question  string   `json:"q" binding:"required"`
	Options   []string `json:"options" binding:"required"`
	Correct   int      `json:"correct"`
	XP        int      `json:"xp"`
}

type MaterialInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Subject     string `json:"subject"`
	URL         string `json:"url" binding:"required"`
}

type AnnouncementInput struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

// GetCases returns active cases from database with user-specific progress
func GetCases(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusOK, gin.H{"cases": []CaseItem{}})
		return
	}

	var dbMissions []models.Mission
	if err := config.DB.Order("order_index ASC").Find(&dbMissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch missions"})
		return
	}

	var progress []models.UserProgress
	config.DB.Where("user_id = ?", userID).Find(&progress)

	progressMap := make(map[uint]models.UserProgress)
	for _, p := range progress {
		progressMap[p.MissionID] = p
	}

	var cases []CaseItem
	prevCompleted := true

	for i, m := range dbMissions {
		p, ok := progressMap[m.ID]
		status := "LOCKED"
		progVal := 0

		if ok {
			progVal = p.Progress
			if p.Status == "Completed" {
				status = "COMPLETED"
			} else {
				status = "ACTIVE"
			}
		} else {
			if i == 0 || prevCompleted {
				status = "ACTIVE"
			}
		}

		iconKey := "database"
		switch m.DomainKey {
		case "HTML5", "CSS3":
			iconKey = "web"
		case "JS":
			iconKey = "ai"
		case "DBMS":
			iconKey = "database"
		case "AI":
			iconKey = "system"
		}

		cases = append(cases, CaseItem{
			ID:       m.ID,
			Title:    m.Title,
			Subtitle: m.Description,
			Progress: progVal,
			Status:   status,
			IconKey:  iconKey,
			Domain:   m.DomainKey,
		})

		prevCompleted = ok && p.Status == "Completed"
	}

	c.JSON(http.StatusOK, gin.H{"cases": cases})
}

// GetMissions returns all missions with user-specific progress
func GetMissions(c *gin.Context) {
	userID, exists := c.Get("user_id")
	var progress []models.UserProgress
	if exists {
		config.DB.Where("user_id = ?", userID).Find(&progress)
	}

	progressMap := make(map[uint]models.UserProgress)
	for _, p := range progress {
		progressMap[p.MissionID] = p
	}

	var dbMissions []models.Mission
	if err := config.DB.Order("order_index ASC").Find(&dbMissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch missions"})
		return
	}

	type ClientMission struct {
		ID       uint   `json:"id"`
		Title    string `json:"title"`
		Subtitle string `json:"subtitle"`
		Progress int    `json:"progress"`
		XP       int    `json:"xp"`
		Color    string `json:"color"`
		IconKey  string `json:"iconKey"`
	}

	var missions []ClientMission
	for _, m := range dbMissions {
		prog := 0
		p, ok := progressMap[m.ID]
		if ok {
			prog = p.Progress
		}

		color := "cyan"
		switch m.DomainKey {
		case "HTML5":
			color = "cyan"
		case "CSS3":
			color = "purple"
		case "JS":
			color = "yellow"
		case "DBMS":
			color = "red"
		case "AI":
			color = "green"
		}

		missions = append(missions, ClientMission{
			ID:       m.ID,
			Title:    m.DomainKey,
			Subtitle: m.Title,
			Progress: prog,
			XP:       m.XPReward,
			Color:    color,
			IconKey:  strings.ToLower(m.DomainKey),
		})
	}

	c.JSON(http.StatusOK, gin.H{"missions": missions})
}

// GetMissionQuestions fetches the quiz questions for a mission
func GetMissionQuestions(c *gin.Context) {
	missionID := c.Param("id")

	var dbQuestions []models.Question
	if err := config.DB.Where("mission_id = ?", missionID).Find(&dbQuestions).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Questions not found"})
		return
	}

	type QuestionResponse struct {
		ID       uint     `json:"id"`
		Question string   `json:"q"`
		Options  []string `json:"options"`
		Correct  int      `json:"correct"`
		XP       int      `json:"xp"`
	}

	var questions []QuestionResponse
	for _, q := range dbQuestions {
		var options []string
		_ = json.Unmarshal([]byte(q.Options), &options)

		questions = append(questions, QuestionResponse{
			ID:       q.ID,
			Question: q.Question,
			Options:  options,
			Correct:  q.Correct,
			XP:       q.XP,
		})
	}

	// Fallback to seed questions if none exist
	if len(questions) == 0 {
		c.JSON(http.StatusOK, gin.H{"questions": []QuestionResponse{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"questions": questions})
}

// SubmitMissionAnswer awards score, saves progress, updates user stats and unlocks achievements
func SubmitMissionAnswer(c *gin.Context) {
	missionID := c.Param("id")
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input SubmitInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input payload"})
		return
	}

	var mission models.Mission
	if err := config.DB.First(&mission, missionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Mission not found"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	// Save student progress
	var progress models.UserProgress
	err := config.DB.Where("user_id = ? AND mission_id = ?", userID, mission.ID).First(&progress).Error
	alreadyCompleted := false

	if err != nil {
		// Create new progress record
		progress = models.UserProgress{
			UserID:    user.ID,
			MissionID: mission.ID,
			Progress:  100,
			Score:     input.Score,
			Status:    "Completed",
		}
		config.DB.Create(&progress)
	} else {
		if progress.Status == "Completed" {
			alreadyCompleted = true
		}
		progress.Progress = 100
		progress.Score = input.Score
		progress.Status = "Completed"
		config.DB.Save(&progress)
	}

	// Award rewards only on first completion
	xpGained := 0
	gemsGained := 0
	if !alreadyCompleted {
		xpGained = mission.XPReward
		gemsGained = 30 // Flat completion gem reward
		user.XP += xpGained
		user.Gems += gemsGained
		user.Level = CalculateLevel(user.XP)
		config.DB.Save(&user)
	}

	CheckAndUnlockAchievements(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"message":     "Mission Completed Successfully!",
		"xp_gained":   xpGained,
		"gems_gained": gemsGained,
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

// GetStatus returns dummy system status details
func GetStatus(c *gin.Context) {
	status := []gin.H{
		{"key": "database", "title": "Database", "value": "Online"},
		{"key": "security", "title": "Security", "value": "Protected"},
		{"key": "network", "title": "Network", "value": "Connected"},
		{"key": "ai_core", "title": "AI Core", "value": "Running"},
	}
	c.JSON(http.StatusOK, gin.H{"status": status})
}

// GetLeaderboard returns rankings of all explorers
func GetLeaderboard(c *gin.Context) {
	var users []models.User
	if err := config.DB.Where("role = ?", "explorer").Order("xp DESC").Limit(10).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch leaderboard"})
		return
	}

	type RankItem struct {
		ExplorerName string `json:"explorer_name"`
		XP           int    `json:"xp"`
		Rank         int    `json:"rank"`
		Level        int    `json:"level"`
	}

	var leaderboard []RankItem
	for idx, u := range users {
		leaderboard = append(leaderboard, RankItem{
			ExplorerName: u.ExplorerName,
			XP:           u.XP,
			Rank:         idx + 1,
			Level:        u.Level,
		})
	}

	c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboard})
}

// AIChat forwards a bounded conversation to the server-side Groq agent.
func AIChat(c *gin.Context) {
	var input ChatInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid prompt"})
		return
	}

	if len([]rune(input.Message)) > 4000 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Prompt is too long"})
		return
	}

	systemPrompt := "You are Archie, Exploria's patient AI learning companion. Help students learn HTML, CSS, JavaScript, SQL, databases, cybersecurity, and AI. Explain concepts clearly, use short examples, ask a guiding question when useful, and give hints instead of directly solving active quiz questions. Never claim to access private accounts, grades, or system data. Keep answers under 250 words unless the student asks for detail."
	if role, exists := c.Get("role"); exists && role == "faculty" {
		systemPrompt = "You are Archie, Exploria's faculty course-design assistant. Help faculty create clear, accurate learning missions and quiz questions for HTML, CSS, JavaScript, SQL, databases, cybersecurity, and AI. When asked, produce structured mission drafts with title, objective, description, domain, difficulty, suggested XP, and learning outcomes. Produce quiz questions with one unambiguous correct answer, plausible options, an explanation, difficulty, and suggested XP. Improve or validate existing content, identify ambiguity, misconceptions, and alignment with the learning objective. Never invent student records, grades, or system data. Keep answers concise and ready to copy into Exploria unless the faculty member asks for detail."
	}

	messages := []services.ChatMessage{{
		Role:    "system",
		Content: systemPrompt,
	}}
	for _, message := range input.History {
		if (message.Role == "user" || message.Role == "assistant") && strings.TrimSpace(message.Content) != "" {
			message.Content = strings.TrimSpace(message.Content)
			if len([]rune(message.Content)) <= 4000 {
				messages = append(messages, message)
			}
		}
	}
	messages = append(messages, services.ChatMessage{Role: "user", Content: strings.TrimSpace(input.Message)})
	if len(messages) > 13 {
		messages = append(messages[:1], messages[len(messages)-12:]...)
	}

	reply, err := services.AskGroq(c.Request.Context(), messages)
	if err != nil {
		if services.IsGroqNotConfigured(err) {
			c.JSON(http.StatusServiceUnavailable, gin.H{"message": "AI agent is not configured. Set GROQ_API_KEY on the server."})
			return
		}
		c.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"message": "AI agent could not complete the request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reply": reply})
}

// GetFacultyStats aggregates dashboard totals
func GetFacultyStats(c *gin.Context) {
	var studentCount int64
	config.DB.Model(&models.User{}).Where("role = ?", "explorer").Count(&studentCount)

	var activeMissionsCount int64
	config.DB.Model(&models.Mission{}).Where("status = ?", "Active").Count(&activeMissionsCount)

	var completedMissionsCount int64
	config.DB.Model(&models.UserProgress{}).Where("status = ?", "Completed").Count(&completedMissionsCount)

	var averageXp float64
	config.DB.Model(&models.User{}).Where("role = ?", "explorer").Select("COALESCE(AVG(xp), 0)").Row().Scan(&averageXp)

	c.JSON(http.StatusOK, gin.H{
		"totalStudents":     studentCount,
		"activeMissions":    activeMissionsCount,
		"completedMissions": completedMissionsCount,
		"averageXp":         int(averageXp),
	})
}

// GetStudents monitors explorer progress
func GetStudents(c *gin.Context) {
	var students []models.User
	if err := config.DB.Where("role = ?", "explorer").Order("xp DESC").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch student directories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"students": students})
}

// GetFacultyAchievements returns the achievement catalog and student unlock counts.
func GetFacultyAchievements(c *gin.Context) {
	var students []models.User
	if err := config.DB.Where("role = ?", "explorer").Order("explorer_name ASC").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch student achievements"})
		return
	}

	type studentAchievement struct {
		StudentID    uint                 `json:"student_id"`
		StudentName  string               `json:"student_name"`
		Achievements []models.Achievement `json:"achievements"`
	}

	result := make([]studentAchievement, 0, len(students))
	for _, student := range students {
		var achievements []models.Achievement
		if err := config.DB.Table("achievements").
			Joins("JOIN user_achievements ON user_achievements.achievement_id = achievements.id").
			Where("user_achievements.user_id = ?", student.ID).
			Order("achievements.id ASC").
			Find(&achievements).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch student achievements"})
			return
		}
		result = append(result, studentAchievement{StudentID: student.ID, StudentName: student.ExplorerName, Achievements: achievements})
	}

	c.JSON(http.StatusOK, gin.H{"student_achievements": result})
}

// CreateMission posts a new mission
func CreateMission(c *gin.Context) {
	var input MissionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid mission payload"})
		return
	}

	facultyID, _ := c.Get("user_id")

	var count int64
	config.DB.Model(&models.Mission{}).Count(&count)

	mission := models.Mission{
		Title:       input.Title,
		Description: input.Description,
		Difficulty:  input.Difficulty,
		XPReward:    input.XPReward,
		Status:      input.Status,
		FacultyID:   facultyID.(uint),
		DomainKey:   input.DomainKey,
		OrderIndex:  int(count),
	}

	if err := config.DB.Create(&mission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create mission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mission created successfully", "mission": mission})
}

// UpdateMission updates an existing mission
func UpdateMission(c *gin.Context) {
	missionID := c.Param("id")
	var mission models.Mission
	if err := config.DB.First(&mission, missionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Mission not found"})
		return
	}

	var input MissionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid mission payload"})
		return
	}

	mission.Title = input.Title
	mission.Description = input.Description
	mission.Difficulty = input.Difficulty
	mission.XPReward = input.XPReward
	mission.Status = input.Status
	mission.DomainKey = input.DomainKey

	if err := config.DB.Save(&mission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update mission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mission updated successfully", "mission": mission})
}

// DeleteMission deletes a mission
func DeleteMission(c *gin.Context) {
	missionID := c.Param("id")
	if err := config.DB.Delete(&models.Mission{}, missionID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete mission"})
		return
	}

	config.DB.Where("mission_id = ?", missionID).Delete(&models.Question{})

	c.JSON(http.StatusOK, gin.H{"message": "Mission deleted successfully"})
}

// CreateQuestion creates a quiz question
func CreateQuestion(c *gin.Context) {
	var input QuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid question payload"})
		return
	}

	optionsJSON, err := json.Marshal(input.Options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to compile options"})
		return
	}

	question := models.Question{
		MissionID: input.MissionID,
		Question:  input.Question,
		Options:   string(optionsJSON),
		Correct:   input.Correct,
		XP:        input.XP,
	}

	if err := config.DB.Create(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save question"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question added successfully", "question": question})
}

// UpdateQuestion updates a question
func UpdateQuestion(c *gin.Context) {
	questionID := c.Param("id")
	var question models.Question
	if err := config.DB.First(&question, questionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Question not found"})
		return
	}

	var input QuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid question payload"})
		return
	}

	optionsJSON, err := json.Marshal(input.Options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to compile options"})
		return
	}

	question.Question = input.Question
	question.Options = string(optionsJSON)
	question.Correct = input.Correct
	question.XP = input.XP

	if err := config.DB.Save(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update question"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question updated successfully", "question": question})
}

// DeleteQuestion deletes a question
func DeleteQuestion(c *gin.Context) {
	questionID := c.Param("id")
	if err := config.DB.Delete(&models.Question{}, questionID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete question"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question deleted successfully"})
}

// CreateMaterial posts study resources
func CreateMaterial(c *gin.Context) {
	var input MaterialInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid material payload"})
		return
	}

	facultyID, _ := c.Get("user_id")

	material := models.Material{
		FacultyID:   facultyID.(uint),
		Title:       input.Title,
		Description: input.Description,
		Subject:     input.Subject,
		URL:         input.URL,
	}

	if err := config.DB.Create(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save study material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Study material posted successfully", "material": material})
}

// DeleteMaterial deletes study resource
func DeleteMaterial(c *gin.Context) {
	materialID := c.Param("id")
	if err := config.DB.Delete(&models.Material{}, materialID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete study material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Study material deleted successfully"})
}

// GetMaterials retrieves study resource list
func GetMaterials(c *gin.Context) {
	var materials []models.Material
	config.DB.Order("created_at DESC").Find(&materials)
	c.JSON(http.StatusOK, gin.H{"materials": materials})
}

// CreateAnnouncement posts faculty announcements
func CreateAnnouncement(c *gin.Context) {
	var input AnnouncementInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid announcement payload"})
		return
	}

	facultyID, _ := c.Get("user_id")

	announcement := models.Announcement{
		FacultyID: facultyID.(uint),
		Title:     input.Title,
		Content:   input.Content,
	}

	if err := config.DB.Create(&announcement).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to post announcement"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement posted successfully", "announcement": announcement})
}

// DeleteAnnouncement removes faculty announcements
func DeleteAnnouncement(c *gin.Context) {
	announcementID := c.Param("id")
	if err := config.DB.Delete(&models.Announcement{}, announcementID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete announcement"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement deleted successfully"})
}

// GetAnnouncements retrieves announcement feed
func GetAnnouncements(c *gin.Context) {
	var announcements []models.Announcement
	config.DB.Order("created_at DESC").Find(&announcements)
	c.JSON(http.StatusOK, gin.H{"announcements": announcements})
}
