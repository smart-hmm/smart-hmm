package queueports

import "context"

type ConsumeOptions struct {
	Prefetch    int
	Concurrency int
	RetryLimit  int
}

type WorkerConsumer interface {
	ConsumeWithWorkers(
		ctx context.Context,
		topic string,
		handler HandlerFunc,
		opts ConsumeOptions,
	) error
}
