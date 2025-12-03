package rediscache

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/smart-hmm/smart-hmm/internal/config"
	cacheports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/cache"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

type RedisService struct {
	client *redis.Client
}

var _ cacheports.Cache = (*RedisService)(nil)

func NewRedisService(cfg *config.Config) *RedisService {
	slog := logger.GetSugaredLogger(cfg)
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Address,
		Password: "",
		DB:       0,
	})
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		slog.Fatalf("ping Redis error: %v", err.Error())
	}
	return &RedisService{client}
}

func (r *RedisService) Set(ctx context.Context, key string, value any) error {
	return r.client.Set(ctx, key, value, 0).Err()
}

func (r *RedisService) SetTTL(ctx context.Context, key string, value any, ttl time.Duration) error {
	return r.client.Set(ctx, key, value, ttl).Err()
}

func (r *RedisService) Get(ctx context.Context, key string, dest any) (bool, error) {
	val, err := r.client.Get(ctx, key).Result()

	if err != nil {
		if err == redis.Nil {
			return false, nil
		}
		return false, err
	}

	if err := json.Unmarshal([]byte(val), dest); err != nil {
		return false, err
	}

	return true, nil
}
