using MediatR;
using Microsoft.Extensions.Logging;
using khalilResume.Domain.Products.Events;

namespace khalilResume.Application.Features.Products.EventHandlers;

public sealed class ProductCreatedEventHandler(ILogger<ProductCreatedEventHandler> logger)
    : INotificationHandler<ProductCreatedEvent>
{
    public Task Handle(ProductCreatedEvent notification, CancellationToken ct)
    {
        logger.LogInformation("Domain Event Handled: Product Created with Id {ProductId}, Sku: {Sku}",
            notification.ProductId, notification.Sku);

        return Task.CompletedTask;
    }
}