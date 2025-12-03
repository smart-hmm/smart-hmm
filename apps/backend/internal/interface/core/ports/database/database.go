package databaseport

import "context"

type Database interface {
	Open(ctx context.Context) error
	Close(ctx context.Context) error
	Ping(ctx context.Context) error
}
