export interface Guest {
    guestId?: number;
    name: string;
    email: string;
    isGoing: boolean;
    isUndecided?: boolean;
    eventId?: number;
    eventGuid: string;
}
