import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";

const SINGLE_INFANT_TICKET = new TicketTypeRequest("INFANT", 1)

describe("TicketService", () => {
  let ticketService;
  const accountId = 1;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it("should throw InvalidPurchaseException if accountId is not provided", () => {
    t = () => ticketService.purchaseTickets();
    
    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("An accountId is required");
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are not provided", () => {
    t = () => ticketService.purchaseTickets(accountId);

    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("The array of ticketTypeRequests cannot be empty");
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are invalid", () => {
    t = () => ticketService.purchaseTickets(accountId, {});

    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("ticketTypeRequests must be an instance of TicketTypeRequest");
  });

  it("should throw InvalidPurchaseException if no adult ticket is purchased", () => {
    t = () => ticketService.purchaseTickets(accountId, SINGLE_INFANT_TICKET);
    
    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("At least one adult ticket must be purchased");
  });
});
