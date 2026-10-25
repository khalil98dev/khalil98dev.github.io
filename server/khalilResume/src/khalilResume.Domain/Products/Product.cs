using khalilResume.Domain.Common;
using khalilResume.Domain.Common.Results;
using khalilResume.Domain.Products.Events;

namespace khalilResume.Domain.Products;

public sealed class Product : AuditableEntity
{
    public string Name { get; private set; } = null!;
    public string Sku { get; private set; } = null!;
    public decimal Price { get; private set; }

    private Product() { }

    private Product(Guid id, string name, string sku, decimal price) : base(id)
    {
        Name = name;
        Sku = sku;
        Price = price;
    }

    public static Result<Product> Create(Guid id, string name, string sku, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
            return ProductErrors.NameRequired;

        if (string.IsNullOrWhiteSpace(sku))
            return ProductErrors.SkuRequired;

        if (price < 0)
            return ProductErrors.PriceInvalid;

        var product = new Product(id == Guid.Empty ? Guid.NewGuid() : id, name.Trim(), sku.Trim().ToUpperInvariant(), price);
        product.AddDomainEvent(new ProductCreatedEvent(product.Id, product.Name, product.Sku));

        return product;
    }

    public Result<Updated> Update(string name, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
            return ProductErrors.NameRequired;

        if (price < 0)
            return ProductErrors.PriceInvalid;

        Name = name.Trim();
        Price = price;

        return Result.Updated;
    }
}