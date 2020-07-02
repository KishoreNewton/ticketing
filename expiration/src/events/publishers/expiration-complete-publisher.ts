import { Subjects, Publisher, ExpirationCompleteEvent } from '@kntickets/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}