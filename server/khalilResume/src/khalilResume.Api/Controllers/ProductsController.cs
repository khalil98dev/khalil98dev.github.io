using MediatR;
using Microsoft.AspNetCore.Mvc;
using khalilResume.Application.Features.Products.Commands.CreateProduct;
using khalilResume.Application.Features.Products.Dtos;
using khalilResume.Application.Features.Products.Queries.GetProductById;
using khalilResume.Contracts.Requests.Products;

namespace khalilResume.Api.Controllers;

[Route("api/v{version:apiVersion}/[controller]")]
public class ProductsController(ISender sender) : ApiController
{
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest request, CancellationToken ct)
    {
        var command = new CreateProductCommand(request.Name, request.Sku, request.Price);
        var result = await sender.Send(command, ct);

        return result.Match<ActionResult<ProductDto>>(
            dto => CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto),
            errors => Problem(errors));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id, CancellationToken ct)
    {
        var query = new GetProductByIdQuery(id);
        var result = await sender.Send(query, ct);

        return result.Match<ActionResult<ProductDto>>(
            dto => Ok(dto),
            errors => Problem(errors));
    }
}