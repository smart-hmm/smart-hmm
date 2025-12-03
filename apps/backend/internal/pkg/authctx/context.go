package authctx

import "context"

type ctxKey string

const userIDKey ctxKey = "user_id"

// WithUserID stores a user ID in context.
func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

// UserID extracts a user ID from context if present.
func UserID(ctx context.Context) (string, bool) {
	v, ok := ctx.Value(userIDKey).(string)
	return v, ok
}
