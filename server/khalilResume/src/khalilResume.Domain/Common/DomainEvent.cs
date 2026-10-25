using MediatR;

namespace khalilResume.Domain.Common;

public abstract record DomainEvent : INotification;