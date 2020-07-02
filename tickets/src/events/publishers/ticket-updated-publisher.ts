import { Publisher, Subjects, TicketUpdatedEvent } from '@kntickets/common'

export class TicketUpdatedPublisher extends Publisher <TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}