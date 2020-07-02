import { Publisher } from './base-publisher'
import { TicketCreatedEvent} from './ticket-created-event'
import { Subjects } from './subjects'

export class TicketsCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}