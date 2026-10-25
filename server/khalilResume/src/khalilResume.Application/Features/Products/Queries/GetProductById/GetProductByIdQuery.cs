using khalilResume.Application.Common.Interfaces;
using khalilResume.Application.Features.Products.Dtos;
using khalilResume.Domain.Common.Results;

namespace khalilResume.Application.Features.Products.Queries.GetProductById;

public sealed record GetProductByIdQuery(Guid Id) : ICachedQuery<Result<ProductDto>>
{
    public string CacheKey => $"product-{Id}";
    public string[] Tags => ["products"];
    public TimeSpan Expiration => TimeSpan.FromMinutes(5);
}