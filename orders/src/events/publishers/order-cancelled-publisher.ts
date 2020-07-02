import { Subjects, Publisher, OrderCancelledEvent } from '@kntickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}