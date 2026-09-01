package services

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

const defaultGroqModel = "openai/gpt-oss-20b"

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type groqRequest struct {
	Model       string        `json:"model"`
	Messages    []ChatMessage `json:"messages"`
	Temperature float64       `json:"temperature"`
	MaxTokens   int           `json:"max_tokens"`
}

type groqResponse struct {
	Choices []struct {
		Message ChatMessage `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

var errGroqNotConfigured = errors.New("groq is not configured")

func AskGroq(ctx context.Context, messages []ChatMessage) (string, error) {
	apiKey := strings.TrimSpace(os.Getenv("GROQ_API_KEY"))
	if apiKey == "" {
		return "", errGroqNotConfigured
	}

	model := strings.TrimSpace(os.Getenv("GROQ_MODEL"))
	if model == "" {
		model = defaultGroqModel
	}

	payload := groqRequest{
		Model:       model,
		Messages:    messages,
		Temperature: 0.4,
		MaxTokens:   500,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("encode Groq request: %w", err)
	}

	requestCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()
	request, err := http.NewRequestWithContext(requestCtx, http.MethodPost, "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create Groq request: %w", err)
	}
	request.Header.Set("Authorization", "Bearer "+apiKey)
	request.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return "", fmt.Errorf("call Groq: %w", err)
	}
	defer response.Body.Close()

	responseBody, err := io.ReadAll(io.LimitReader(response.Body, 1<<20))
	if err != nil {
		return "", fmt.Errorf("read Groq response: %w", err)
	}

	var result groqResponse
	if err := json.Unmarshal(responseBody, &result); err != nil {
		return "", fmt.Errorf("decode Groq response: %w", err)
	}
	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		if result.Error != nil && result.Error.Message != "" {
			return "", fmt.Errorf("Groq API: %s", result.Error.Message)
		}
		return "", fmt.Errorf("Groq API returned HTTP %d", response.StatusCode)
	}
	if len(result.Choices) == 0 {
		return "", errors.New("Groq returned an empty response")
	}

	content := removeThinkingBlock(result.Choices[0].Message.Content)
	if content == "" {
		return "", errors.New("Groq returned an empty response")
	}
	return content, nil
}

func removeThinkingBlock(content string) string {
	content = strings.TrimSpace(content)
	for {
		start := strings.Index(strings.ToLower(content), "<think>")
		if start == -1 {
			return strings.TrimSpace(content)
		}
		endOffset := strings.Index(strings.ToLower(content[start:]), "</think>")
		if endOffset == -1 {
			return ""
		}
		end := start + endOffset + len("</think>")
		content = strings.TrimSpace(content[:start] + content[end:])
	}
}

func IsGroqNotConfigured(err error) bool {
	return errors.Is(err, errGroqNotConfigured)
}
