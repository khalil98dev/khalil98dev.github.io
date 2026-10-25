using MediatR;
using Microsoft.EntityFrameworkCore;
using khalilResume.Application.Common.Interfaces;
using khalilResume.Application.Features.Products.Dtos;
using khalilResume.Domain.Common.Results;
using khalilResume.Domain.Products;

namespace khalilResume.Application.Features.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
{
    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery query, CancellationToken ct)
    {
        var product = await context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == query.Id, ct);

        if (product is null)
        {
            return ProductErrors.ProductNotFound;
        }

        return new ProductDto(product.Id, product.Name, product.Sku, product.Price);
    }
}