using khalilResume.Domain.Common;

namespace khalilResume.Domain.Products.Events;

public sealed record ProductCreatedEvent(Guid ProductId, string Name, string Sku) : DomainEvent;