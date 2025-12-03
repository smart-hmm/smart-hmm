package rabbitmqqueue

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	amqp "github.com/rabbitmq/amqp091-go"
	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
)

func (r *RabbitMQ) setPrefetch(prefetch int) error {
	return r.channel.Qos(
		prefetch,
		0,
		false,
	)
}

func (r *RabbitMQ) ConsumeWithWorkers(
	ctx context.Context,
	topic string,
	handler queueports.HandlerFunc,
	opts queueports.ConsumeOptions,
) error {
	if err := r.declare(topic); err != nil {
		return err
	}

	if err := r.setPrefetch(opts.Prefetch); err != nil {
		return err
	}

	msgs, err := r.channel.Consume(
		topic,
		"",
		false, // manual ack
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	jobChan := make(chan amqp.Delivery)
	wg := sync.WaitGroup{}

	for i := 0; i < opts.Concurrency; i++ {
		wg.Add(1)

		go func(workerID int) {
			defer wg.Done()

			for msg := range jobChan {
				var payload queueports.Message

				if err := json.Unmarshal(msg.Body, &payload); err != nil {
					log.Println("invalid payload → DLQ")
					msg.Nack(false, false)
					continue
				}

				err := handler(ctx, payload)
				if err != nil {
					retry := getRetryCount(msg)

					if retry >= opts.RetryLimit {
						log.Printf("DLQ after %d retries\n", retry)
						msg.Nack(false, false) // send to DLQ
						continue
					}

					incrementRetry(&msg)
					msg.Nack(false, true) // requeue
					continue
				}

				msg.Ack(false)
			}
		}(i)
	}

	go func() {
		defer close(jobChan)

		for {
			select {
			case <-ctx.Done():
				log.Println("queue consumer shutdown")
				return

			case msg := <-msgs:
				jobChan <- msg
			}
		}
	}()

	go func() {
		<-ctx.Done()
		wg.Wait()
	}()

	return nil
}
