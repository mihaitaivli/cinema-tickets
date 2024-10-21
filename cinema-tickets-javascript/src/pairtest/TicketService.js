import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    // basic checks
    if (!accountId) {
      throw new InvalidPurchaseException("An accountId is required");
    }

    if (!ticketTypeRequests.length) {
      throw new InvalidPurchaseException(
        "The array of ticketTypeRequests cannot be empty"
      );
    }

    for (const ticketTypeRequest of ticketTypeRequests) {
      if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException(
          "ticketTypeRequests must be an instance of TicketTypeRequest"
        );
      }
    }
  }
}
