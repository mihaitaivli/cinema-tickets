import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it("should throw InvalidPurchaseException if accountId is not provided", () => {
    expect(() => {
      ticketService.purchaseTickets();
    }).toThrow(InvalidPurchaseException);
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are not provided", () => {
    expect(() => {
      ticketService.purchaseTickets(1);
    }).toThrow(InvalidPurchaseException);
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are invalid", () => {
    expect(() => {
      ticketService.purchaseTickets(1, {});
    }).toThrow(InvalidPurchaseException);
  });
});
