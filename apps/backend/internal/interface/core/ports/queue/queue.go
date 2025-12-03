package queueports

import "context"

type Message struct {
	ID        string
	Topic     string
	Body      []byte
	Headers   map[string]string
	Retry     int
	Timestamp int64
}

type Producer interface {
	Publish(ctx context.Context, topic string, msg Message) error
	PublishDelay(ctx context.Context, topic string, msg Message, delaySeconds int) error
	Close() error
}

type Consumer interface {
	Consume(ctx context.Context, topic string, handler HandlerFunc) error
	Close() error
}

type HandlerFunc func(ctx context.Context, msg Message) error

type Acker interface {
	Ack(ctx context.Context, msg Message) error
	Nack(ctx context.Context, msg Message, requeue bool) error
}

type QueueService interface {
	Producer
	Consumer
	Acker

	ConsumeWithWorkers(
		ctx context.Context,
		topic string,
		handler HandlerFunc,
		opts ConsumeOptions,
	) error
}
