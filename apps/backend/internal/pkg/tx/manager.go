package tx

import "context"

type Manager interface {
	WithTx(ctx context.Context, fn func(txCtx context.Context) error) error
}
