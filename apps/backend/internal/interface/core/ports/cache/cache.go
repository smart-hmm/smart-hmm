package cacheports

import (
	"context"
	"time"
)

type Cache interface {
	Set(ctx context.Context, key string, value any) error
	SetTTL(ctx context.Context, key string, value any, ttl time.Duration) error
	Get(ctx context.Context, key string, dest any) (bool, error)
}
