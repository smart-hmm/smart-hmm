package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/ai/domain"
)

type OllamaClient struct {
	baseURL       string
	generateModel string
	embedModel    string
	httpClient    *http.Client
}

type ollamaEmbedRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
}

type ollamaEmbedResponse struct {
	Embedding []float32 `json:"embedding"`
}

type ollamaGenerateRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type ollamaGenerateResponse struct {
	Response string `json:"response"`
}

func NewOllamaClient(baseURL, generateModel, embedModel string) *OllamaClient {
	if baseURL == "" {
		baseURL = "http://localhost:11434"
	}
	return &OllamaClient{
		baseURL:       baseURL,
		generateModel: generateModel,
		embedModel:    embedModel,
		httpClient: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

func (c *OllamaClient) Embed(ctx context.Context, text string) ([]float32, error) {
	body, err := json.Marshal(ollamaEmbedRequest{
		Model:  c.embedModel,
		Prompt: text,
	})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/api/embeddings",
		bytes.NewReader(body),
	)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("ollama embed error: status %d", resp.StatusCode)
	}

	var out ollamaEmbedResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}

	return out.Embedding, nil
}

func (c *OllamaClient) Generate(ctx context.Context, systemPrompt, userPrompt string) (string, error) {
	fullPrompt := systemPrompt + "\n\nUser:\n" + userPrompt

	body, err := json.Marshal(ollamaGenerateRequest{
		Model:  c.generateModel,
		Prompt: fullPrompt,
		Stream: false,
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/api/generate",
		bytes.NewReader(body),
	)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return "", fmt.Errorf("ollama generate error: status %d", resp.StatusCode)
	}

	var out ollamaGenerateResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", err
	}

	return out.Response, nil
}

var _ domain.LLM = (*OllamaClient)(nil)
var _ domain.Embedder = (*OllamaClient)(nil)
