using MediatR;
using khalilResume.Application.Features.Products.Dtos;
using khalilResume.Domain.Common.Results;

namespace khalilResume.Application.Features.Products.Commands.CreateProduct;

public sealed record CreateProductCommand(string Name, string Sku, decimal Price)
    : IRequest<Result<ProductDto>>;