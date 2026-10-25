using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using khalilResume.Application.Common.Interfaces;
using khalilResume.Application.Features.Products.Dtos;
using khalilResume.Domain.Common.Results;
using khalilResume.Domain.Products;

namespace khalilResume.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler(
    IAppDbContext context,
    HybridCache cache,
    ILogger<CreateProductCommandHandler> logger)
    : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    public async Task<Result<ProductDto>> Handle(CreateProductCommand command, CancellationToken ct)
    {
        var skuNormalized = command.Sku.Trim().ToUpperInvariant();

        var exists = await context.Products.AnyAsync(p => p.Sku == skuNormalized, ct);
        if (exists)
        {
            logger.LogWarning("Aborted: Product with SKU {Sku} already exists.", skuNormalized);
            return ProductErrors.SkuAlreadyExists;
        }

        var productResult = Product.Create(Guid.NewGuid(), command.Name, skuNormalized, command.Price);
        if (productResult.IsError)
        {
            return productResult.Errors;
        }

        var product = productResult.Value;
        context.Products.Add(product);
        await context.SaveChangesAsync(ct);

        await cache.RemoveByTagAsync("products", ct);

        logger.LogInformation("Product {ProductId} successfully created.", product.Id);

        return new ProductDto(product.Id, product.Name, product.Sku, product.Price);
    }
}