package rabbitmqqueue

import (
	"context"
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
)

type RabbitMQ struct {
	conn    *amqp.Connection
	channel *amqp.Channel
}

var _ queueports.QueueService = (*RabbitMQ)(nil)

func NewRabbitMQ(dsn string) (*RabbitMQ, error) {
	conn, err := amqp.Dial(dsn)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	return &RabbitMQ{
		conn:    conn,
		channel: ch,
	}, nil
}

func (r *RabbitMQ) declare(topic string) error {
	mainQueue := topic
	retryQueue := topic + ".retry"
	dlq := topic + ".dlq"

	_, err := r.channel.QueueDeclare(
		mainQueue,
		true, false, false, false,
		amqp.Table{
			"x-dead-letter-exchange":    "",
			"x-dead-letter-routing-key": retryQueue,
		},
	)
	if err != nil {
		return err
	}

	_, err = r.channel.QueueDeclare(
		retryQueue,
		true, false, false, false,
		amqp.Table{
			"x-message-ttl":             5000,
			"x-dead-letter-exchange":    "",
			"x-dead-letter-routing-key": mainQueue,
		},
	)
	if err != nil {
		return err
	}

	_, err = r.channel.QueueDeclare(
		dlq,
		true, false, false, false,
		nil,
	)
	return err
}

func (r *RabbitMQ) Publish(ctx context.Context, topic string, msg queueports.Message) error {
	if err := r.declare(topic); err != nil {
		return err
	}

	body, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return r.channel.PublishWithContext(
		ctx,
		"",
		topic,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}

func (r *RabbitMQ) PublishDelay(ctx context.Context, topic string, msg queueports.Message, delaySeconds int) error {
	body, _ := json.Marshal(msg)

	return r.channel.PublishWithContext(
		ctx,
		"",
		topic,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Expiration:  fmt.Sprintf("%d", delaySeconds*1000),
		},
	)
}

func (r *RabbitMQ) Consume(ctx context.Context, topic string, handler queueports.HandlerFunc) error {
	if err := r.declare(topic); err != nil {
		return err
	}

	msgs, err := r.channel.Consume(
		topic,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case msg := <-msgs:
				var payload queueports.Message
				if err := json.Unmarshal(msg.Body, &payload); err != nil {
					msg.Nack(false, false)
					continue
				}

				err := handler(ctx, payload)
				if err != nil {
					msg.Nack(false, true) // retry
					continue
				}

				msg.Ack(false)
			}
		}
	}()

	return nil
}

func (r *RabbitMQ) Ack(ctx context.Context, msg queueports.Message) error {
	return nil
}

func (r *RabbitMQ) Nack(ctx context.Context, msg queueports.Message, requeue bool) error {
	return nil
}

func (r *RabbitMQ) Close() error {
	if r.channel != nil {
		_ = r.channel.Close()
	}
	if r.conn != nil {
		return r.conn.Close()
	}
	return nil
}
