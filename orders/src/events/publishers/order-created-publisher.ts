import { Publisher, OrderCreatedEvent, Subjects} from '@kntickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
